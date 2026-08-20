// Strict CORS allowlist. Exact origins only — no wildcards, no *.lovable.app pattern.
const ALLOWED_ORIGINS = new Set([
  "https://devserbianit.lovable.app",
  "https://id-preview--8e3282d4-76d3-4937-8308-2505a3f2f2c3.lovable.app",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
]);

const BASE_HEADERS = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "600",
  Vary: "Origin",
};

/** Returns CORS headers echoing the exact requested Origin when allowed. */
export function corsFor(req: Request): Record<string, string> {
  const origin = req.headers.get("origin");
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    return { ...BASE_HEADERS, "Access-Control-Allow-Origin": origin };
  }
  return { ...BASE_HEADERS };
}

export const jsonResponse = (
  body: unknown,
  status: number,
  cors: Record<string, string>,
  extra: Record<string, string> = {},
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, ...extra, "Content-Type": "application/json" },
  });

/** Reads a JSON body with a hard byte limit. */
export async function readJsonBody(req: Request, maxBytes: number): Promise<unknown> {
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (declared > maxBytes) throw new Error("payload_too_large");
  const raw = await req.text();
  if (new TextEncoder().encode(raw).length > maxBytes) throw new Error("payload_too_large");
  return JSON.parse(raw);
}

/**
 * Provider-controlled trusted client IP.
 * Verified in this hosted environment: `cf-connecting-ip` is injected by the
 * edge provider and carries exactly one address, while `x-forwarded-for` can be
 * extended by the caller and is therefore NOT trusted. Returns null when the
 * trusted header is absent — there is no shared fallback bucket by design.
 */
export function trustedClientIp(req: Request): string | null {
  const raw = req.headers.get("cf-connecting-ip");
  if (!raw) return null;
  const candidate = raw.trim().toLowerCase();
  if (candidate.length === 0 || candidate.length > 45 || candidate.includes(",")) return null;
  const isIpv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(candidate) &&
    candidate.split(".").every((o) => Number(o) <= 255);
  const isIpv6 = /^[0-9a-f:]+$/.test(candidate) && candidate.includes(":");
  return isIpv4 || isIpv6 ? candidate : null;
}

/** Keyed HMAC of the client IP. The raw IP never leaves this function scope. */
export async function ipHmac(ip: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(ip));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const requestId = (req: Request) =>
  req.headers.get("sb-request-id") ?? crypto.randomUUID();
