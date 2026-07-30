import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { RevolverHeroDiagram } from "@/components/hero/RevolverHeroDiagram";
import { useIsMobile } from "@/hooks/use-mobile";
import type { RevolverLocale } from "@/components/hero/revolverData";

interface HeroProps {
  title: string;
  subtitle: string;
  cta: string;
  ctaSecondary: string;
  specializations: string;
  locale: RevolverLocale;
  onCtaClick: () => void;
  onSecondaryClick: () => void;
}

export const Hero = ({
  title,
  subtitle,
  cta,
  ctaSecondary,
  specializations,
  locale,
  onCtaClick,
  onSecondaryClick,
}: HeroProps) => {
  const isMobile = useIsMobile();
  return (
  <section className="relative border-b border-border bg-background overflow-hidden">
    <div className="container px-4 sm:px-6 py-14 md:py-24">
      <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-12 items-center">
        <div className="min-w-0">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="font-sans text-[10px] sm:text-xs tracking-[0.24em] uppercase text-primary mb-5"
          >
            {specializations}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display font-semibold uppercase leading-[0.98] tracking-tight text-[clamp(2rem,7vw,4.25rem)] whitespace-pre-line text-balance"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-6 max-w-xl text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <Button size="lg" onClick={onCtaClick} className="rounded-none font-display tracking-[0.08em] uppercase">
              {cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onSecondaryClick}
              className="rounded-none font-display tracking-[0.08em] uppercase"
            >
              {ctaSecondary}
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center lg:justify-end min-w-0 w-full"
        >
          <RevolverHeroDiagram locale={locale} compact={isMobile} className="w-full" />
        </motion.div>
      </div>
    </div>
    </section>
  );
};