import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, LayoutGrid, Send, LucideIcon } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TiltCard } from "@/components/TiltCard";

interface Service {
  title: string;
  desc: string;
}

interface ServicesProps {
  title: string;
  items: Service[];
}

const icons: LucideIcon[] = [ShoppingBag, LayoutGrid, Send];

// Vibrant gradient treatments per card for a lively, non-generic look
const accents: { gradient: string; glow: string }[] = [
  { gradient: "from-[hsl(197_92%_50%)] to-[hsl(220_85%_58%)]", glow: "group-hover:shadow-[0_12px_40px_-8px_hsl(197_92%_50%/0.55)]" },
  { gradient: "from-[hsl(265_85%_60%)] to-[hsl(320_80%_58%)]", glow: "group-hover:shadow-[0_12px_40px_-8px_hsl(290_82%_58%/0.55)]" },
  { gradient: "from-[hsl(160_84%_45%)] to-[hsl(190_90%_50%)]", glow: "group-hover:shadow-[0_12px_40px_-8px_hsl(170_85%_47%/0.55)]" },
];

export const Services = ({ title, items }: ServicesProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
    },
  };

  return (
    <section className="py-16 md:py-24 bg-secondary/20">
      <div className="container px-4 sm:px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 md:mb-14"
        >
          {title}
        </motion.h2>
        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {items.map((item, idx) => {
            const Icon = icons[idx];
            const accent = accents[idx % accents.length];
            return (
              <motion.div key={idx} variants={itemVariants}>
                <TiltCard className="h-full" tiltStrength={5}>
                  <motion.div
                    whileHover={{ 
                      y: -8,
                      transition: { duration: 0.2 }
                    }}
                    className="h-full"
                  >
                    <Card className="h-full border-border/50 bg-card/60 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group overflow-hidden relative">
                      <CardHeader className="pb-3">
                        <motion.div 
                          whileHover={{ scale: 1.12, rotate: -6 }}
                          transition={{ type: "spring", stiffness: 320, damping: 14 }}
                          className={`w-16 h-16 md:w-[72px] md:h-[72px] rounded-2xl bg-gradient-to-br ${accent.gradient} flex items-center justify-center mb-5 shadow-lg shadow-primary/20 ${accent.glow} transition-shadow duration-300`}
                        >
                          <Icon className="h-7 w-7 md:h-8 md:w-8 text-white" strokeWidth={2.25} />
                        </motion.div>
                        <CardTitle className="text-lg md:text-xl lg:text-2xl">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm md:text-base leading-relaxed">{item.desc}</CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
