import { ASMonogram, type MonogramTone } from "./ASMonogram";

export interface BrandLockupProps {
  orientation?: "horizontal" | "stacked";
  showDescriptor?: boolean;
  /** smaller mark and type — header / mobile nav */
  compact?: boolean;
  tone?: MonogramTone;
  name?: string;
  descriptor?: string;
  className?: string;
}

export const BrandLockup = ({
  orientation = "horizontal",
  showDescriptor = true,
  compact = false,
  tone = "brand",
  name = "ANDREI SERBIAN",
  descriptor = "IT SOLUTIONS",
  className = "",
}: BrandLockupProps) => {
  const stacked = orientation === "stacked";

  return (
    <span
      className={`flex min-w-0 ${
        stacked ? "flex-col items-center gap-3 text-center" : "items-center gap-2.5"
      } ${className}`}
    >
      <ASMonogram
        variant={compact ? "compact" : "full"}
        tone={tone}
        decorative
        className={compact ? "h-7 w-7 shrink-0" : stacked ? "h-14 w-14" : "h-9 w-9 shrink-0"}
      />

      {!stacked && !compact && (
        <span
          aria-hidden="true"
          className="h-7 w-px shrink-0 bg-border opacity-70"
        />
      )}

      <span className={`flex flex-col leading-none min-w-0 ${stacked ? "items-center" : ""}`}>
        <span
          className={`font-display font-semibold uppercase truncate tracking-[0.14em] ${
            compact ? "text-[15px] sm:text-base" : "text-base sm:text-lg"
          }`}
        >
          {name}
        </span>
        {showDescriptor && (
          <span
            className={`font-sans uppercase text-muted-foreground truncate tracking-[0.28em] ${
              compact ? "text-[9px] sm:text-[10px] mt-0.5" : "text-[10px] mt-1"
            }`}
          >
            {descriptor}
          </span>
        )}
      </span>
    </span>
  );
};

export default BrandLockup;