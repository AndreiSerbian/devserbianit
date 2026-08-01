export type MonogramVariant = "full" | "compact" | "micro";
export type MonogramTone = "brand" | "light" | "dark" | "mono";
/** PRD-facing alias of tone */
export type MonogramTheme = "auto" | "light" | "dark" | "monochrome";

export interface ASMonogramProps {
  /** full = most detail, compact = header sizes, micro = 16-32px / favicon */
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

interface Palette {
  arch: string;
  archShade: string;
  bar: string;
  cable: string;
}

const themeToTone: Record<MonogramTheme, MonogramTone> = {
  auto: "brand",
  light: "light",
  dark: "dark",
  monochrome: "mono",
};

const palettes: Record<MonogramTone, Palette> = {
  brand: {
    arch: "hsl(var(--teal-bright))",
    archShade: "hsl(var(--primary))",
    bar: "hsl(var(--lime))",
    cable: "hsl(var(--cream))",
  },
  light: {
    arch: "hsl(var(--cream))",
    archShade: "hsl(var(--cream))",
    bar: "hsl(var(--lime))",
    cable: "hsl(var(--teal-bright))",
  },
  dark: {
    arch: "hsl(var(--graphite))",
    archShade: "hsl(var(--graphite))",
    bar: "hsl(var(--primary))",
    cable: "hsl(var(--graphite))",
  },
  mono: {
    arch: "currentColor",
    archShade: "currentColor",
    bar: "currentColor",
    cable: "currentColor",
  },
};

/** A — inverted-U magnet arch: two separated poles, open negative space inside. */
export const ARCH_PATH = "M9 56V27c0-6.6 5.4-12 12-12s12 5.4 12 12v29";
/** A — restrained centre bar; it reaches past the right pole to meet the wire. */
export const BAR_PATH = "M11.5 39H39.5";
export const BAR_PATH_MICRO = "M11 39H34";
/** S — one continuous wire: exits top right, folds through the mark, meets the bar. */
export const WIRE_PATH =
  "M55 27c0-6-7.6-8.7-12.3-4.9-4.4 3.6-3.5 10 1.6 13 5.6 3.3 6.5 10.2 1.2 12.9-3.5 1.8-6.5.6-6.5-3.4";
export const WIRE_PATH_MICRO =
  "M55 27.5c0-5.6-7.4-8.2-11.9-4.6-4.2 3.4-3.3 9.6 1.6 12.6 5.4 3.2 6.3 9.8 1.2 12.4-3.3 1.7-6.2.6-6.2-3.2";

/**
 * AS monogram.
 * A — an inverted-U magnet arch with a restrained centre bar: business structure.
 * S — one continuous wire routed through that structure: integration and data flow.
 * Both letters carry a comparable visual weight on the same 64x64 grid.
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
  const resolvedTone: MonogramTone = tone ?? (theme ? themeToTone[theme] : "brand");
  const p = palettes[resolvedTone];
  const micro = variant === "micro";
  const full = variant === "full";
  const archWidth = micro ? 8.5 : variant === "compact" ? 7 : 6.5;
  const wireWidth = micro ? 8.5 : variant === "compact" ? 7 : 6.5;
  const barWidth = micro ? 8.5 : variant === "compact" ? 5.5 : 5;

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
      {/* A — magnet arch */}
      <path
        d={ARCH_PATH}
        stroke={p.arch}
        strokeWidth={archWidth}
        strokeLinecap="butt"
        strokeLinejoin="round"
      />
      {/* A — centre bar / active connection node */}
      <path
        d={micro ? BAR_PATH_MICRO : BAR_PATH}
        stroke={micro ? p.archShade : p.bar}
        strokeWidth={barWidth}
        strokeLinecap="butt"
      />
      {/* S — wire */}
      <path
        d={micro ? WIRE_PATH_MICRO : WIRE_PATH}
        stroke={p.cable}
        strokeWidth={wireWidth}
        strokeLinecap={micro ? "butt" : "round"}
        strokeLinejoin="round"
      />
      {/* minimal geometric connectors — full variant only */}
      {full && (
        <>
          <circle cx="55" cy="27" r="3.3" fill={p.cable} />
          <circle cx="39" cy="44.6" r="3.3" fill={p.cable} />
        </>
      )}
    </svg>
  );
};

export default ASMonogram;