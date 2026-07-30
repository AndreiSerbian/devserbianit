interface MonogramProps {
  className?: string;
  /** simplified = fewer details, for favicon / small sizes */
  variant?: "full" | "simple";
  title?: string;
}

/**
 * AS monogram.
 * A = inverted U with a crossbar (a controlled field / bracket).
 * S = a routed signal line threading through it.
 */
export const Monogram = ({ className = "h-8 w-8", variant = "full", title }: MonogramProps) => (
  <svg
    viewBox="0 0 64 64"
    className={className}
    fill="none"
    role={title ? "img" : "presentation"}
    aria-label={title}
    aria-hidden={title ? undefined : true}
  >
    {/* A — inverted U frame */}
    <path
      d="M14 54V22c0-8 5.5-13 13-13s13 5 13 13v32"
      stroke="hsl(var(--teal-bright))"
      strokeWidth={variant === "simple" ? 7 : 6}
      strokeLinecap="square"
    />
    {/* crossbar */}
    <path
      d="M14 38h26"
      stroke="hsl(var(--teal-bright))"
      strokeWidth={variant === "simple" ? 7 : 6}
      strokeLinecap="square"
    />
    {/* S — signal path */}
    <path
      d="M56 20c-2.6-2.6-6.4-3.6-9.6-2.2-4.6 2-5.4 8-1.2 11 2.4 1.7 6.4 2.2 8.6 4.2 3.8 3.4 2.4 9.6-2.6 11.3-3.4 1.2-7.2 0-9.6-2.6"
      stroke="hsl(var(--lime))"
      strokeWidth={variant === "simple" ? 7 : 5.5}
      strokeLinecap="square"
    />
    {variant === "full" && (
      <>
        <circle cx="27" cy="9.5" r="2.6" fill="hsl(var(--lime))" />
        <circle cx="56" cy="20" r="2.4" fill="hsl(var(--teal-bright))" />
      </>
    )}
  </svg>
);

export const Wordmark = ({ descriptor = "IT SOLUTIONS" }: { descriptor?: string }) => (
  <span className="flex items-center gap-2.5 min-w-0">
    <Monogram className="h-7 w-7 shrink-0" title="Andrei Serbian" />
    <span className="flex flex-col leading-none min-w-0">
      <span className="font-display text-[15px] sm:text-base font-semibold tracking-[0.14em] uppercase truncate">
        Andrei Serbian
      </span>
      <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.28em] uppercase text-muted-foreground truncate">
        {descriptor}
      </span>
    </span>
  </span>
);