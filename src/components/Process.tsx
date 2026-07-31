import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProcessProps {
  title: string;
  intro?: string;
  cta?: {
    readonly title: string;
    readonly text: string;
    readonly primary: string;
    readonly secondary: string;
  };
  telegramUrl?: string;
  onTelegramClick?: () => void;
  onSecondaryClick?: () => void;
  steps: readonly { readonly title: string; readonly desc: string }[];
}

export const Process = ({
  title,
  intro,
  cta,
  telegramUrl,
  onTelegramClick,
  onSecondaryClick,
  steps,
}: ProcessProps) => (
  <section id="process" className="py-16 md:py-24 border-b border-border bg-surface">
    <div className="container px-4 sm:px-6">
      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
        <span className="text-primary mr-3">03</span>
        {title}
      </h2>
      {intro && (
        <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-muted-foreground">
          {intro}
        </p>
      )}

      <ol className="mt-10 md:mt-14 grid md:grid-cols-2 gap-8 md:gap-10">
        {steps.map((step, idx) => (
          <motion.li
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: idx * 0.08 }}
            className="relative pt-6 border-t-2 border-primary/60"
          >
            <span className="font-display text-4xl md:text-5xl font-semibold text-primary/25 leading-none block mb-4">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-base md:text-lg font-medium tracking-wide mb-3">
              {step.title}
            </h3>
            <p className="text-sm md:text-base text-foreground/75 leading-relaxed">{step.desc}</p>
          </motion.li>
        ))}
      </ol>

      {cta && (
        <div className="mt-12 md:mt-16 border border-border bg-card p-6 md:p-8">
          <h3 className="font-display text-xl md:text-2xl font-semibold tracking-tight">
            {cta.title}
          </h3>
          <p className="mt-3 max-w-2xl text-sm md:text-base leading-relaxed text-foreground/75">
            {cta.text}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <Button
              asChild
              className="rounded-none font-display uppercase tracking-[0.08em] h-12 px-6 w-full sm:w-auto"
            >
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onTelegramClick}
              >
                {cta.primary}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <button
              type="button"
              onClick={onSecondaryClick}
              className="self-start text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 py-2"
            >
              {cta.secondary}
            </button>
          </div>
        </div>
      )}
    </div>
  </section>
);