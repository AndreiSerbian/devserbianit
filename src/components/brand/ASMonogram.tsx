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
            ? "M55 21c-2.8-3-8.5-3.6-11 -0.4-2.4 3.1.3 6.6 4.2 8 3.9 1.4 7.4 3.3 7.4 7.2 0 4.4-5.6 7.2-10.4 5"
            : "M55.5 20.5c-2.7-2.9-7.2-3.8-10.3-1.9-3.6 2.2-3.7 7 0 9.4 2.3 1.5 5.4 2.2 7.6 3.9 3.6 2.8 3.1 8.3-1.1 10.4-3.2 1.6-7.2.8-9.7-1.8"
        }
        stroke={p.cable}
        strokeWidth={cableWidth}
        strokeLinecap={micro ? "butt" : "round"}
        strokeLinejoin="round"
      />
      {/* simplified cable terminals — full variant only */}
      {variant === "full" && (
        <>
          <path d="M55.5 20.5h4.5" stroke={p.cable} strokeWidth="4" strokeLinecap="butt" />
          <path d="M41.5 44.5h-4.5" stroke={p.cable} strokeWidth="4" strokeLinecap="butt" />
        </>
      )}
    </svg>
  );
};

export default ASMonogram;