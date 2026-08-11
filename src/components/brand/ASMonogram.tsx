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

/**
 * AS monogram — rebuilt from the brand sketch.
 * A = filled magnet arch, S = layered rounded ribbon, no divider rule.
 */
export const ASMonogram = ({
  variant = "full",
  size,
  tone,
  theme,
  className,
  title,
  decorative = false,
}: ASMonogramProps) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const gradientId = `as-arch-${uid}`;
  const resolvedTone: MonogramTone = tone ?? (theme ? themeToTone[theme] : "brand");
  const p = palettes[resolvedTone];

  const micro = variant === "micro";
  const full = variant === "full";
  const wireWidth = micro ? 8.5 : variant === "compact" ? 7 : 5.5;

  return (
    <svg
      viewBox="0 0 64 64"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={size !== undefined ? { width: size, height: size } : undefined}
      fill="none"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.archFrom} />
          <stop offset="100%" stopColor={p.archTo} />
        </linearGradient>
      </defs>

      {/* A — filled arch with open slot */}
      <path d={ARCH_PATH} fill={`url(#${gradientId})`} fillRule="evenodd" clipRule="evenodd" />
      {/* A — crossbar */}
      <path d={BAR_PATH} fill={p.bar} />

      {/* S — layered ribbon (full) / single ribbon (compact, micro) */}
      {full && (
        <g stroke={p.wire} strokeWidth={wireWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d={WIRE_PATH} transform="translate(-4.5 -4.5)" opacity="0.3" />
          <path d={WIRE_PATH} transform="translate(-2.25 -2.25)" opacity="0.55" />
        </g>
      )}
      <path
        d={WIRE_PATH}
        stroke={p.wire}
        strokeWidth={wireWidth}
        strokeLinecap={micro ? "butt" : "round"}
        strokeLinejoin="round"
      />

      {/* terminals — full and compact only */}
      {!micro && (
        <>
          <rect x="55.5" y="8" width="7" height="8" rx="2" fill={p.wire} />
          <rect x="34.5" y="48" width="7" height="8" rx="2" fill={p.wire} />
        </>
      )}
    </svg>
  );
};

export default ASMonogram;
