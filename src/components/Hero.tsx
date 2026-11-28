import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { RevolverHeroDiagram } from "@/components/hero/RevolverHeroDiagram";
import { useIsMobile } from "@/hooks/use-mobile";
import { SectionMarker } from "./SectionMarker";
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
    <div className="container px-4 sm:px-6 section-standard">
      <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-center">
        <div className="min-w-0">
          <SectionMarker>{specializations}</SectionMarker>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display font-semibold uppercase heading-system text-[32px] sm:text-[40px] lg:text-[52px] xl:text-[64px] whitespace-pre-line text-balance"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-6 max-w-xl text-base lg:text-lg text-muted-foreground leading-relaxed"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 flex flex-col sm:flex-row md:flex-col xl:flex-row gap-3"
          >
            <Button size="lg" onClick={onCtaClick} className="rounded-none font-sans tracking-normal normal-case">
              {cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onSecondaryClick}
              className="rounded-none font-sans tracking-normal normal-case"
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
          <RevolverHeroDiagram locale={locale} compact={isMobile} className="w-full max-w-[400px] md:max-w-[340px] lg:max-w-[480px]" />
        </motion.div>
      </div>
    </div>
    </section>
  );
};