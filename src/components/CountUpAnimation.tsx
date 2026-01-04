import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export const CountUpAnimation = ({ 
  value, 
  prefix = "", 
  suffix = "", 
  duration = 2,
  className = ""
}: CountUpProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);
  
  const spring = useSpring(0, { 
    duration: duration * 1000,
    bounce: 0
  });
  
  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [spring]);

  return (
    <motion.span 
      ref={ref} 
      className={className}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </motion.span>
  );
};
