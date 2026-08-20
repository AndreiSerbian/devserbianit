/**
 * Preference storage gate.
 *
 * Theme and language ALWAYS work. What requires consent is only persisting the
 * choice across sessions: without a granted "preferences" consent the value is
 * kept in memory for the current page session and never written to
 * localStorage, and any previously written value is removed on withdrawal.
 */
export const PREFERENCE_KEYS = ["theme", "lang"] as const;
export type PreferenceKey = (typeof PREFERENCE_KEYS)[number];

let persistAllowed = false;
const memory = new Map<PreferenceKey, string>();
const listeners = new Set<() => void>();

const safeGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

/** Seeds in-memory values from any values already stored by an earlier session. */
export const hydratePreferences = () => {
  for (const key of PREFERENCE_KEYS) {
    const existing = safeGet(key);
    if (existing !== null && !memory.has(key)) memory.set(key, existing);
  }
};

hydratePreferences();

export const setPreferencesPersistence = (allowed: boolean) => {
  persistAllowed = allowed;
  try {
    for (const key of PREFERENCE_KEYS) {
      if (allowed) {
        const value = memory.get(key);
        if (value !== undefined) localStorage.setItem(key, value);
      } else {
        localStorage.removeItem(key);
      }
    }
  } catch {
    /* storage may be unavailable; in-memory values still apply */
  }
  listeners.forEach((fn) => fn());
};

export const readPreference = (key: PreferenceKey): string | null =>
  memory.get(key) ?? (persistAllowed ? safeGet(key) : null);

export const writePreference = (key: PreferenceKey, value: string) => {
  memory.set(key, value);
  if (persistAllowed) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  }
};

export const onPreferencesChange = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
