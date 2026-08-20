import { useCallback, useEffect, useState } from "react";
import { onPreferencesChange, readPreference, writePreference } from "@/lib/preferences";

export type Theme = "dark" | "light";

/**
 * Theme always works. Persisting it across sessions is consent-gated:
 * writePreference keeps the value in memory only until "preferences" is granted.
 */
export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(
    () => (readPreference("theme") === "light" ? "light" : "dark"),
  );

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    writePreference("theme", theme);
  }, [theme]);

  // Re-apply the stored value when consent for preferences changes.
  useEffect(() => onPreferencesChange(() => writePreference("theme", theme)), [theme]);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);
  const toggleTheme = useCallback(
    () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
    [],
  );

  return { theme, setTheme, toggleTheme };
};
