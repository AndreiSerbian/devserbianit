import { useId } from "react";

export type MonogramVariant = "full" | "compact" | "micro";
export type MonogramTone = "brand" | "light" | "dark" | "mono";
/** PRD-facing alias of tone */
export type MonogramTheme = "auto" | "light" | "dark" | "monochrome";

export interface ASMonogramProps {
  /** full = layered ribbon S, compact = single ribbon, micro = 16-32px / favicon */
  variant?: MonogramVariant;
  /** rendered box size; number = px */
  size?: number | string;
  tone?: MonogramTone;
  /** alias for tone: auto -> brand, monochrome -> mono */
  theme?: MonogramTheme;
  className?: string;
  /** accessible name — used only when decorative is false */
  title?: string;
  /** true = aria-hidden, for use next to visible brand text */
  decorative?: boolean;
}

const themeToTone: Record<MonogramTheme, MonogramTone> = {
  auto: "brand",
  light: "light",
  dark: "dark",
  monochrome: "mono",
};

interface Palette {
  /** gradient stops for the filled A arch */
  archFrom: string;
  archTo: string;
  /** crossbar cutting through the A slot */
  bar: string;
  /** S ribbon */
  wire: string;
}

const palettes: Record<MonogramTone, Palette> = {
  brand: {
    archFrom: "hsl(var(--teal-bright))",
    archTo: "hsl(var(--primary))",
    bar: "hsl(var(--cream))",
    wire: "hsl(var(--cream))",
  },
  light: {
    archFrom: "hsl(var(--cream))",
    archTo: "hsl(var(--cream))",
    bar: "hsl(var(--graphite))",
    wire: "hsl(var(--cream))",
  },
  dark: {
    archFrom: "hsl(var(--graphite))",
    archTo: "hsl(var(--graphite))",
    bar: "hsl(var(--cream))",
    wire: "hsl(var(--graphite))",
  },
  mono: {
    archFrom: "currentColor",
    archTo: "currentColor",
    bar: "currentColor",
    wire: "currentColor",
  },
};

/**
 * A — one solid arch (business structure): filled inverted-U with an open slot
 * carved from the baseline and a crossbar locking the slot.
 * Outer contour + slot subpath, cut with fill-rule="evenodd".
 */
export const ARCH_PATH =
  "M3 58V21C3 12.2 9.3 5 17 5s14 7.2 14 16v37H3z" +
  "M13 32a4 4 0 0 1 8 0v26h-8V32z";

/** A — crossbar; it bridges the slot and reads as an active contact. */
export const BAR_PATH = "M9.5 40h15v5.5h-15z";

/** S — one rounded ribbon routed with square shoulders (IT / data path). */
export const WIRE_PATH = "M59 14H46a10 10 0 0 0 0 20h6a10 10 0 0 1 0 20H38";

export const A_PATH = "M26.301136363636363 73.5 30.84090909090909 26.5H46.783522727272725L51.24318181818182 73.5H42.350568181818176L41.68295454545455 65.9159090909091H36.02159090909091L35.43409090909091 73.5ZM36.689204545454544 58.41193181818182H40.96193181818182L38.90568181818182 34.51136363636364H38.47840909090909Z";
export const S_PATH = "M62.28863636363636 73.92727272727272Q55.85284090909091 73.92727272727272 53.00880681818182 70.72272727272727Q50.16477272727273 67.51818181818182 50.16477272727273 60.52159090909091V55.92840909090909H59.45795454545454V61.80340909090909Q59.45795454545454 63.43238636363637 59.95198863636363 64.35369318181819Q60.44602272727272 65.275 61.674431818181816 65.275Q62.95625 65.275 63.450284090909086 64.52727272727273Q63.944318181818176 63.779545454545456 63.944318181818176 62.070454545454545Q63.944318181818176 59.90738636363636 63.51704545454545 58.45198863636364Q63.089772727272724 56.99659090909091 62.03494318181818 55.674715909090914Q60.98011363636363 54.352840909090915 59.11079545454545 52.59034090909091L54.89147727272727 48.58465909090909Q50.16477272727273 44.125 50.16477272727273 38.38352272727273Q50.16477272727273 32.375 52.955397727272725 29.22386363636364Q55.746022727272724 26.072727272727278 61.033522727272725 26.072727272727278Q67.49602272727273 26.072727272727278 70.20653409090909 29.51761363636364Q72.91704545454544 32.962500000000006 72.91704545454544 39.98579545454545H63.35681818181818V36.75454545454546Q63.35681818181818 35.79318181818182 62.809374999999996 35.259090909090915Q62.261931818181814 34.725 61.32727272727272 34.725Q60.205681818181816 34.725 59.68494318181818 35.352556818181824Q59.16420454545454 35.98011363636364 59.16420454545454 36.96818181818182Q59.16420454545454 37.956250000000004 59.698295454545445 39.10454545454546Q60.23238636363636 40.252840909090914 61.80795454545454 41.748295454545456L67.22897727272726 46.955681818181816Q68.85795454545453 48.50454545454546 70.21988636363636 50.22698863636364Q71.58181818181818 51.94943181818182 72.40965909090909 54.232670454545456Q73.2375 56.51590909090909 73.2375 59.80056818181818Q73.2375 66.42329545454545 70.7940340909091 70.17528409090909Q68.35056818181818 73.92727272727272 62.28863636363636 73.92727272727272Z";

const kit: Record<MonogramTone, { bg: string; ink: string; dot?: string; outline?: boolean }> = {
  brand: { bg: "#5FD0C4", ink: "#0E353A", dot: "#121417" },
  light: { bg: "#F8F6F2", ink: "#121417" },
  dark: { bg: "#121417", ink: "#F8F6F2" },
  mono: { bg: "none", ink: "currentColor", dot: "currentColor", outline: true },
};

/** AS monogram — from the approved as-logo-kit (square tile, A + S, accent dot). */
export const ASMonogram = ({
  variant = "full",
  size,
  tone,
  theme,
  className,
  title,
  decorative = false,
}: ASMonogramProps) => {
  useId();
  const resolvedTone: MonogramTone = tone ?? (theme ? themeToTone[theme] : "brand");
  const k = kit[resolvedTone];
  const showDot = variant !== "micro" && k.dot;
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={size !== undefined ? { width: size, height: size } : undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
    >
      {k.outline ? (
        <rect x="2" y="2" width="96" height="96" rx="4" fill="none" stroke={k.ink} strokeWidth="4" />
      ) : (
        <rect width="100" height="100" rx="4" fill={k.bg} />
      )}
      <path d={A_PATH} fill={k.ink} />
      <path d={S_PATH} fill={k.ink} />
      {showDot && <rect x="78.5" y="78.5" width="9" height="9" fill={k.dot} />}
    </svg>
  );
};

export default ASMonogram;
