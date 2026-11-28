import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useConsent } from "@/context/ConsentContext";
import { designCopy } from "@/data/designCopy";

export const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const { lang } = useLanguage();
  const { bannerOpen } = useConsent();
  const reduce = useReducedMotion();
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {visible && !bannerOpen && <motion.div className="fixed bottom-4 right-4 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Button variant="outline" size="icon" className="h-11 w-11 bg-background" aria-label={designCopy[lang].top} title={designCopy[lang].top}
          onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" })}><ArrowUp className="h-4 w-4" /></Button>
      </motion.div>}
    </AnimatePresence>
  );
};
