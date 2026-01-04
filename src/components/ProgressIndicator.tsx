import { motion, useScroll, useSpring } from "framer-motion";

export const ProgressIndicator = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[100]"
      style={{ scaleX }}
    />
  );
};

export const SectionProgress = ({ sections }: { sections: string[] }) => {
  const { scrollYProgress } = useScroll();

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-2">
      {sections.map((section, index) => (
        <motion.button
          key={section}
          onClick={() => {
            document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-2 h-2 rounded-full bg-muted-foreground/30 hover:bg-primary transition-colors"
          whileHover={{ scale: 1.5 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            backgroundColor: 
              scrollYProgress.get() > index / sections.length && 
              scrollYProgress.get() < (index + 1) / sections.length 
                ? "hsl(var(--primary))" 
                : "hsl(var(--muted-foreground) / 0.3)"
          }}
        />
      ))}
    </div>
  );
};
