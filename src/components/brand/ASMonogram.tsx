export type MonogramVariant = "full" | "compact" | "micro";
export type MonogramTone = "brand" | "light" | "dark" | "mono";

export interface ASMonogramProps {
  /** full = most detail, compact = header sizes, micro = 16-32px / favicon */
  variant?: MonogramVariant;
  /** rendered box size; number = px */
  size?: number | string;
  tone?: MonogramTone;
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

/**
 * AS monogram.
 * A — an inverted U arch with a centre bar: a field that holds things together.
 * S — a dense routed cable line: connection between systems.
 * Both letters carry a comparable visual weight on the same 64x64 grid.
 */
export const ASMonogram = ({
  variant = "full",
  size,
  tone = "brand",
  className,
  title,
  decorative = false,
}: ASMonogramProps) => {
  const p = palettes[tone];
  const micro = variant === "micro";
  const archWidth = micro ? 9 : variant === "compact" ? 7.5 : 6.5;
  const cableWidth = micro ? 9 : variant === "compact" ? 7.5 : 6.5;
  const barWidth = micro ? 9 : variant === "compact" ? 7.5 : 7;

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
      {/* A — arch (left leg, crown, right leg) */}
      <path
        d="M11 55V25c0-7.7 5.6-13 12.5-13S36 17.3 36 25v30"
        stroke={p.arch}
        strokeWidth={archWidth}
        strokeLinecap={micro ? "butt" : "square"}
        strokeLinejoin="miter"
      />
      {/* A — centre bar, part of the letter */}
      <path
        d="M11 38.5h25"
        stroke={variant === "full" ? p.bar : p.archShade}
        strokeWidth={barWidth}
        strokeLinecap="butt"
      />
      {/* S — cable */}
      <path
        d={
          micro
            ? "M55 20.5c-3.2-3.6-9-4.4-12.3-1.6-3.9 3.3-2.9 8.6 1.3 11 2.9 1.7 7 2.5 9.4 4.9 3.7 3.7 2.4 10-2.6 12.2-3.6 1.6-8 .6-10.8-2.5"
            : "M55 19c-3.1-3.4-8.7-4.3-12-1.8-4.1 3.1-3.6 8.9.6 11.5 2.8 1.7 6.7 2.5 9.1 4.7 3.8 3.5 2.7 9.9-2.2 12.2-3.6 1.7-8.2.8-11.1-2.3"
        }
        stroke={p.cable}
        strokeWidth={cableWidth}
        strokeLinecap={micro ? "butt" : "round"}
        strokeLinejoin="round"
      />
      {/* simplified cable terminals — full variant only */}
      {variant === "full" && (
        <>
          <path d="M55 19l3.5-3.5" stroke={p.cable} strokeWidth="4" strokeLinecap="round" />
          <path d="M39.4 43.3l-3.6 3.6" stroke={p.cable} strokeWidth="4" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
};

export default ASMonogram;