import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import smtPremiumBox from "@/assets/cases/smt-premium-box.png";
import vmesteSilnee from "@/assets/cases/vmeste-silnee.png";
import unitEcon from "@/assets/cases/unit-econ.png";

const caseImages: Record<string, string> = {
  "smt-premium-box": smtPremiumBox,
  "vmeste-silnee": vmesteSilnee,
  "unit-econ": unitEcon,
};

const caseIds: Record<string, string> = {
  "smt-premium-box": "smt-premium-box",
  "vmeste-silnee": "vmeste-silnee",
  "unit-econ": "unit-econ-strategist",
};

interface CaseStudy {
  readonly name: string;
  readonly desc: string;
  readonly features: readonly string[];
  readonly result: string;
  readonly link?: string;
  readonly image?: string;
}

interface CaseStudiesProps {
  title: string;
  items: readonly CaseStudy[];
  lang?: string;
}

export const CaseStudies = ({ title, items, lang = "ru" }: CaseStudiesProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }
    },
  };

  const getLocalizedText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      learnMore: { ru: "Подробнее", en: "Learn more", ro: "Află mai mult" },
      details: { ru: "Подробнее", en: "Details", ro: "Detalii" }
    };
    return texts[key]?.[lang] || texts[key]?.en || key;
  };

  return (
    <section className="py-16 md:py-24 border-b border-border bg-surface">
      <div className="container px-4 sm:px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-10 md:mb-14"
        >
          <span className="text-primary mr-3">02</span>
          {title}
        </motion.h2>
        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6"
        >
          {items.map((item, idx) => {
            const imageKey = item.image || "";
            const caseId = caseIds[imageKey];
            
            return (
              <motion.div key={idx} variants={itemVariants}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                    {item.image && caseImages[item.image] && (
                      <Link to={`/${lang}/cases/${caseId}`} className="block relative w-full h-40 sm:h-48 md:h-52 overflow-hidden">
                        <motion.img 
                          src={caseImages[item.image]} 
                          alt={item.name}
                          width={1200}
                          height={630}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover object-top"
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.4 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                          <motion.span 
                            initial={{ y: 10, opacity: 0 }}
                            whileHover={{ y: 0, opacity: 1 }}
                            className="text-sm font-medium flex items-center gap-1 bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-full"
                          >
                            {getLocalizedText("learnMore")}
                            <ArrowRight className="h-4 w-4" />
                          </motion.span>
                        </div>
                      </Link>
                    )}
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base md:text-lg lg:text-xl flex items-center justify-between">
                        <Link to={`/${lang}/cases/${caseId}`} className="hover:text-primary transition-colors">
                          {item.name}
                        </Link>
                        {item.link && (
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                              <a href={item.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </motion.div>
                        )}
                      </CardTitle>
                      <p className="text-xs md:text-sm text-muted-foreground pt-2 leading-relaxed">{item.desc}</p>
                    </CardHeader>
                    <CardContent className="space-y-3 md:space-y-4">
                      <div className="space-y-1.5 md:space-y-2">
                        {item.features.slice(0, 3).map((feature, fIdx) => (
                          <motion.div 
                            key={fIdx} 
                            className="flex items-start gap-2"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: fIdx * 0.1 }}
                            viewport={{ once: true }}
                          >
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span className="text-xs md:text-sm">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                      <div className="pt-2 md:pt-3 border-t border-border/50">
                        <p className="text-xs md:text-sm font-medium text-primary">{item.result}</p>
                      </div>
                      <div className="flex gap-2">
                        <motion.div 
                          className="flex-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button variant="outline" size="sm" asChild className="w-full text-xs md:text-sm">
                            <Link to={`/${lang}/cases/${caseId}`}>
                              {getLocalizedText("details")}
                              <ArrowRight className="ml-2 h-3 w-3" />
                            </Link>
                          </Button>
                        </motion.div>
                        {item.link && (
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={item.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
