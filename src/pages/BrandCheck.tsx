import { ASMonogram, type MonogramTone, type MonogramVariant } from "@/components/brand";

const SIZES = [16, 32, 48, 96];
const VARIANTS: MonogramVariant[] = ["full", "compact", "micro"];
const TONES: MonogramTone[] = ["brand", "light", "dark", "mono"];

/**
 * Dev-only QA surface for the AS monogram.
 * Route: /__brand-check (not registered in production builds).
 * Every cell is a tight box so any SVG clipping or overflow is measurable.
 */
const BrandCheck = () => (
  <main className="min-h-screen bg-background p-6 text-foreground">
    <h1 className="font-display text-xl uppercase tracking-wide">ASMonogram QA</h1>
    {TONES.map((tone) => (
      <section key={tone} className="mt-6">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{tone}</h2>
        <div
          className={
            tone === "dark"
              ? "mt-3 flex flex-wrap gap-4 bg-cream p-4 text-graphite"
              : "mt-3 flex flex-wrap gap-4 bg-graphite p-4 text-cream"
          }
        >
          {VARIANTS.map((variant) =>
            SIZES.map((size) => (
              <div
                key={`${variant}-${size}`}
                data-monogram-cell={`${tone}-${variant}-${size}`}
                className="inline-flex shrink-0 items-center justify-center outline outline-1 outline-lime/40"
                style={{ width: size, height: size }}
              >
                <ASMonogram variant={variant} size={size} tone={tone} decorative />
              </div>
            ))
          )}
        </div>
      </section>
    ))}
  </main>
);

export default BrandCheck;