import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import {
  corsFor,
  ipHmac,
  jsonResponse,
  readJsonBody,
  requestId,
  trustedClientIp,
} from "../_shared/http.ts";

const MAX_BODY_BYTES = 1024;
const RATE_LIMIT_SCOPE = "consent";
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_WINDOW_SECONDS = 3600;

const ALLOWED_FIELDS = new Set(["op", "consent_id", "analytics", "preferences"]);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface StatusRow {
  current_policy_version: string;
  decision_id: string;
  decision_seq: number;
  policy_version: string;
  analytics_allowed: boolean;
  preferences_allowed: boolean;
  decided_at: string;
}

Deno.serve(async (req) => {
  const cors = corsFor(req);
  const rid = requestId(req);

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405, cors);

  try {
    let body: Record<string, unknown>;
    try {
      body = (await readJsonBody(req, MAX_BODY_BYTES)) as Record<string, unknown>;
    } catch {
      return jsonResponse({ error: "invalid_request" }, 400, cors);
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonResponse({ error: "invalid_request" }, 400, cors);
    }
    // Strict schema: unknown fields are rejected, never merged.
    if (Object.keys(body).some((k) => !ALLOWED_FIELDS.has(k))) {
      return jsonResponse({ error: "invalid_request" }, 400, cors);
    }

    const op = body.op;
    if (op !== "status" && op !== "decision") {
      return jsonResponse({ error: "invalid_request" }, 400, cors);
    }

    const consentId = typeof body.consent_id === "string" && UUID_RE.test(body.consent_id)
      ? body.consent_id
      : null;
    if (body.consent_id !== undefined && consentId === null) {
      return jsonResponse({ error: "invalid_request" }, 400, cors);
    }
    if (op === "status" && !consentId) {
      return jsonResponse({ error: "invalid_request" }, 400, cors);
    }
    if (op === "decision" && (typeof body.analytics !== "boolean" || typeof body.preferences !== "boolean")) {
      return jsonResponse({ error: "invalid_request" }, 400, cors);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Abuse limit on the provider-controlled client IP (keyed HMAC only).
    const ip = trustedClientIp(req);
    const secret = Deno.env.get("RATE_LIMIT_SECRET");
    if (ip && secret) {
      const { data: rl, error: rlError } = await supabase.rpc("check_rate_limit", {
        p_ip_hmac: await ipHmac(ip, secret),
        p_scope: RATE_LIMIT_SCOPE,
        p_max_hits: RATE_LIMIT_MAX,
        p_window_seconds: RATE_LIMIT_WINDOW_SECONDS,
      });
      if (rlError) {
        console.error(JSON.stringify({ rid, event: "rate_limit_error" }));
        return jsonResponse({ error: "unexpected" }, 500, cors);
      }
      const verdict = Array.isArray(rl) ? rl[0] : rl;
      if (!verdict?.allowed) {
        console.warn(JSON.stringify({ rid, event: "rate_limited", scope: RATE_LIMIT_SCOPE }));
        return jsonResponse({ error: "rate_limited" }, 429, cors);
      }
    }

    if (op === "status") {
      const { data, error } = await supabase
        .rpc("consent_status", { p_consent_id: consentId })
        .maybeSingle<StatusRow>();
      if (error) {
        console.error(JSON.stringify({ rid, event: "consent_status_failed" }));
        return jsonResponse({ error: "unexpected" }, 500, cors);
      }
      const { data: ver, error: verError } = await supabase.rpc("consent_policy_version");
      if (verError) {
        console.error(JSON.stringify({ rid, event: "consent_version_failed" }));
        return jsonResponse({ error: "unexpected" }, 500, cors);
      }
      return jsonResponse({
        ok: true,
        current_policy_version: data?.current_policy_version ?? ver,
        decision: data
          ? {
            decision_id: data.decision_id,
            policy_version: data.policy_version,
            analytics_allowed: data.analytics_allowed,
            preferences_allowed: data.preferences_allowed,
            decided_at: data.decided_at,
          }
          : null,
      }, 200, cors);
    }

    // op === "decision": server owns uuid, sequence, timestamp and policy version.
    const { data, error } = await supabase
      .rpc("record_consent_decision", {
        p_consent_id: consentId,
        p_analytics_allowed: body.analytics as boolean,
        p_preferences_allowed: body.preferences as boolean,
      })
      .maybeSingle<{
        consent_id: string;
        decision_id: string;
        policy_version: string;
        analytics_allowed: boolean;
        preferences_allowed: boolean;
        decided_at: string;
      }>();

    if (error || !data) {
      console.error(JSON.stringify({ rid, event: "consent_decision_failed" }));
      return jsonResponse({ error: "unexpected" }, 500, cors);
    }

    console.info(JSON.stringify({ rid, event: "consent_decision_recorded" }));
    return jsonResponse({
      ok: true,
      consent_id: data.consent_id,
      current_policy_version: data.policy_version,
      decision: {
        decision_id: data.decision_id,
        policy_version: data.policy_version,
        analytics_allowed: data.analytics_allowed,
        preferences_allowed: data.preferences_allowed,
        decided_at: data.decided_at,
      },
    }, 200, cors);
  } catch (_e) {
    console.error(JSON.stringify({ rid, event: "unexpected" }));
    return jsonResponse({ error: "unexpected" }, 500, cors);
  }
});
