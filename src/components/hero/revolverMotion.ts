export const EASE_PREMIUM = [0.22, 0.61, 0.36, 1] as const;

/** initial assembly timeline (seconds) — matches the approved PRD sequence */
export const ASSEMBLY = {
  grid: { delay: 0, duration: 0.4 },
  hub: { delay: 0.2, duration: 0.6 },
  centerText: { delay: 0.6, duration: 0.6 },
  slots: { delay: 0.8, step: 0.09, duration: 0.5 },
  connectors: { delay: 1.2, step: 0.12, duration: 0.6 },
  signal: { delay: 1.8, duration: 1.0 },
};

/** one full revolver step: slide + fade + accent, all inside the 4s beat */
export const OUTER_SHIFT = { duration: 1.1, ease: EASE_PREMIUM };
export const CENTER_SWAP = { duration: 0.55, ease: EASE_PREMIUM };
