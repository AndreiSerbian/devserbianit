import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { setAnalyticsConsent } from "@/lib/analytics";
import { setPreferencesPersistence } from "@/lib/preferences";

const LOCAL_KEY = "consent_state_v1";

export interface ConsentChoices {
  analytics: boolean;
  preferences: boolean;
}

interface LocalConsentState extends ConsentChoices {
  consentId: string | null;
  policyVersion: string | null;
  /** A withdrawal applied locally that still has to reach the server. */
  pendingWithdrawal: boolean;
}

interface ConsentContextValue extends ConsentChoices {
  /** True once the server status (or its absence) has been resolved. */
  ready: boolean;
  /** Banner is shown when there is no decision, or the material version changed. */
  bannerOpen: boolean;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  /** Grant is pessimistic: it only applies after the server confirms the receipt. */
  save: (choices: ConsentChoices) => Promise<boolean>;
  acceptAll: () => Promise<boolean>;
  rejectAll: () => Promise<boolean>;
}

const EMPTY: LocalConsentState = {
  consentId: null,
  policyVersion: null,
  analytics: false,
  preferences: false,
  pendingWithdrawal: false,
};

const readLocal = (): LocalConsentState => {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<LocalConsentState>;
    return {
      consentId: typeof parsed.consentId === "string" ? parsed.consentId : null,
      policyVersion: typeof parsed.policyVersion === "string" ? parsed.policyVersion : null,
      analytics: parsed.analytics === true,
      preferences: parsed.preferences === true,
      pendingWithdrawal: parsed.pendingWithdrawal === true,
    };
  } catch {
    return EMPTY;
  }
};

const writeLocal = (state: LocalConsentState) => {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  } catch {
    /* consent evidence lives on the server; local copy is only a cache */
  }
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

interface DecisionPayload {
  decision_id: string;
  policy_version: string;
  analytics_allowed: boolean;
  preferences_allowed: boolean;
  decided_at: string;
}

const callConsent = async (body: Record<string, unknown>) => {
  const { data, error } = await supabase.functions.invoke("consent-receipt", { body });
  if (error) throw error;
  return data as {
    ok: boolean;
    consent_id?: string;
    current_policy_version: string;
    decision: DecisionPayload | null;
  };
};

export const ConsentProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<LocalConsentState>(EMPTY);
  const [ready, setReady] = useState(false);
  const [needsDecision, setNeedsDecision] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const initialised = useRef(false);

  const apply = useCallback((next: LocalConsentState) => {
    setState(next);
    writeLocal(next);
    setAnalyticsConsent(next.analytics && next.consentId ? next.consentId : null);
    setPreferencesPersistence(next.preferences);
  }, []);

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;

    const local = readLocal();
    // Local cache is applied first so a previous withdrawal is never "re-granted"
    // while the server round-trip is in flight.
    apply(local);

    (async () => {
      // A withdrawal that failed to reach the server is retried before anything else.
      if (local.pendingWithdrawal && local.consentId) {
        try {
          await callConsent({
            op: "decision",
            consent_id: local.consentId,
            analytics: false,
            preferences: false,
          });
          apply({ ...local, analytics: false, preferences: false, pendingWithdrawal: false });
        } catch {
          /* stays pending, retried on next load */
        }
      }

      if (!local.consentId) {
        setNeedsDecision(true);
        setReady(true);
        return;
      }

      try {
        const res = await callConsent({ op: "status", consent_id: local.consentId });
        const decision = res.decision;
        if (!decision || decision.policy_version !== res.current_policy_version) {
          // No server-side decision, or a material policy version change: re-consent.
          apply({ ...EMPTY, consentId: local.consentId });
          setNeedsDecision(true);
        } else {
          apply({
            consentId: local.consentId,
            policyVersion: decision.policy_version,
            analytics: decision.analytics_allowed,
            preferences: decision.preferences_allowed,
            pendingWithdrawal: false,
          });
        }
      } catch {
        // Server unreachable: stay on the local cache, do not silently grant.
      } finally {
        setReady(true);
      }
    })();
  }, [apply]);

  const save = useCallback(
    async (choices: ConsentChoices) => {
      const isWithdrawal =
        (state.analytics && !choices.analytics) || (state.preferences && !choices.preferences);

      try {
        const res = await callConsent({
          op: "decision",
          consent_id: state.consentId ?? undefined,
          analytics: choices.analytics,
          preferences: choices.preferences,
        });
        const decision = res.decision;
        const consentId = res.consent_id ?? state.consentId;
        if (!decision || !consentId) throw new Error("no_decision");

        apply({
          consentId,
          policyVersion: decision.policy_version,
          analytics: decision.analytics_allowed,
          preferences: decision.preferences_allowed,
          pendingWithdrawal: false,
        });
        setNeedsDecision(false);
        setSettingsOpen(false);
        return true;
      } catch {
        if (isWithdrawal) {
          // Withdrawal is optimistic: it takes effect locally right away and the
          // server record is reconciled on the next load.
          apply({
            ...state,
            analytics: choices.analytics && state.analytics,
            preferences: choices.preferences && state.preferences,
            pendingWithdrawal: true,
          });
          setSettingsOpen(false);
          return true;
        }
        return false;
      }
    },
    [apply, state],
  );

  const value = useMemo<ConsentContextValue>(
    () => ({
      analytics: state.analytics,
      preferences: state.preferences,
      ready,
      bannerOpen: ready && needsDecision && !settingsOpen,
      settingsOpen,
      openSettings: () => setSettingsOpen(true),
      closeSettings: () => setSettingsOpen(false),
      save,
      acceptAll: () => save({ analytics: true, preferences: true }),
      rejectAll: () => save({ analytics: false, preferences: false }),
    }),
    [needsDecision, ready, save, settingsOpen, state.analytics, state.preferences],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
};

export const useConsent = () => {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within ConsentProvider");
  return ctx;
};
