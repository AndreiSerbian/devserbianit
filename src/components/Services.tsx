import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Boxes, LayoutDashboard, MessageSquare, Database, FileSearch, LucideIcon } from "lucide-react";
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

const icons: LucideIcon[] = [ShoppingCart, Boxes, LayoutDashboard, MessageSquare, Database, FileSearch];

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
                    <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
                      <CardHeader className="pb-3">
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
                        >
                          <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                        </motion.div>
                        <CardTitle className="text-base md:text-lg lg:text-xl">{item.title}</CardTitle>
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
