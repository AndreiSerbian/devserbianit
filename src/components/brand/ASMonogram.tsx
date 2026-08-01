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
export const ARCH_PATH = "M11 56V27c0-7.2 5.8-13 13-13s13 5.8 13 13v29";
/** A — restrained centre bar; it reaches past the right pole to meet the wire. */
export const BAR_PATH = "M13.5 38H40";
export const BAR_PATH_MICRO = "M13 38H37";
/** S — one continuous wire that enters low, crosses the bar and exits top right. */
export const WIRE_PATH =
  "M54.5 25.5c0-7-9.5-10-15-5.5-5 4.1-4 11.5 2 15 6.5 3.8 7.5 11.8 1.5 14.8-5.5 2.7-11 0-12-5";
export const WIRE_PATH_MICRO =
  "M54 26c0-6.6-9-9.4-14.2-5.2-4.7 3.9-3.7 10.9 1.9 14.2 6.1 3.6 7.1 11.2 1.4 14-5.2 2.6-10.4 0-11.3-4.7";

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
          <circle cx="54.5" cy="25.5" r="3.4" fill={p.cable} />
          <circle cx="31" cy="45.7" r="3.4" fill={p.cable} />
        </>
      )}
    </svg>
  );
};

export default ASMonogram;