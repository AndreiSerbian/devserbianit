import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useConsent } from "@/context/ConsentContext";
import { useLanguage } from "@/context/LanguageContext";
import { consentCopy } from "@/data/consentCopy";
import { legalPath } from "@/lib/legalRoutes";
import type { Locale } from "@/lib/siteConfig";

/**
 * Consent banner + settings dialog.
 * No dark patterns: accept and reject share the same variant, size and position;
 * every category defaults to off until an explicit choice is made.
 */
export const ConsentManager = () => {
  const { lang } = useLanguage();
  const copy = consentCopy[lang as Locale];
  const {
    analytics,
    preferences,
    consentId,
    bannerOpen,
    settingsOpen,
    openSettings,
    closeSettings,
    save,
    acceptAll,
    rejectAll,
  } = useConsent();

  const [draftAnalytics, setDraftAnalytics] = useState(analytics);
  const [draftPreferences, setDraftPreferences] = useState(preferences);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (settingsOpen) {
      setDraftAnalytics(analytics);
      setDraftPreferences(preferences);
      setFailed(false);
    }
  }, [analytics, preferences, settingsOpen]);

  const run = async (fn: () => Promise<boolean>) => {
    setBusy(true);
    setFailed(!(await fn()));
    setBusy(false);
  };

  return (
    <>
      <AnimatePresence>
        {bannerOpen && (
          <motion.div
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 32, opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-label={copy.bannerTitle}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card"
          >
            <div className="container px-4 sm:px-6 py-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="font-display text-sm uppercase tracking-[0.14em]">
                  {copy.bannerTitle}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {copy.bannerBody}{" "}
                  <Link to={legalPath(lang as Locale, "cookies")} className="underline">
                    {copy.more}
                  </Link>
                </p>
                {failed && <p className="mt-2 text-sm text-destructive">{copy.error}</p>}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() => void run(rejectAll)}
                  className="sm:min-w-[150px]"
                >
                  {copy.rejectAll}
                </Button>
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() => void run(acceptAll)}
                  className="sm:min-w-[150px]"
                >
                  {copy.acceptAll}
                </Button>
                <Button variant="ghost" disabled={busy} onClick={openSettings}>
                  {copy.settings}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={settingsOpen} onOpenChange={(open) => !open && closeSettings()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display uppercase tracking-[0.12em] text-base">
              {copy.settingsTitle}
            </DialogTitle>
            <DialogDescription>{copy.settingsBody}</DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{copy.essentialTitle}</p>
                <p className="text-sm text-muted-foreground">{copy.essentialBody}</p>
              </div>
              <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground shrink-0 pt-1">
                {copy.essentialAlways}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{copy.analyticsTitle}</p>
                <p className="text-sm text-muted-foreground">{copy.analyticsBody}</p>
              </div>
              <Switch
                checked={draftAnalytics}
                onCheckedChange={setDraftAnalytics}
                aria-label={copy.analyticsTitle}
              />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{copy.preferencesTitle}</p>
                <p className="text-sm text-muted-foreground">{copy.preferencesBody}</p>
              </div>
              <Switch
                checked={draftPreferences}
                onCheckedChange={setDraftPreferences}
                aria-label={copy.preferencesTitle}
              />
            </div>

            {failed && <p className="text-sm text-destructive">{copy.error}</p>}

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                variant="outline"
                disabled={busy}
                onClick={() =>
                  void run(() => save({ analytics: draftAnalytics, preferences: draftPreferences }))
                }
                className="sm:min-w-[150px]"
              >
                {copy.save}
              </Button>
              {/* Withdrawal must be as easy as giving consent. */}
              {consentId && (analytics || preferences) && (
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() => void run(rejectAll)}
                  className="sm:min-w-[150px]"
                >
                  {copy.withdraw}
                </Button>
              )}
              <Button variant="ghost" disabled={busy} onClick={closeSettings}>
                {copy.cancel}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
