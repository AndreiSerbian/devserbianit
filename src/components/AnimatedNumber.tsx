import { useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  highlightOnChange?: boolean;
}

export const AnimatedNumber = ({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 0.6,
  className = "",
  highlightOnChange = false,
}: AnimatedNumberProps) => {
  const springValue = useSpring(value, {
    stiffness: 100,
    damping: 30,
    duration,
  });

  const displayValue = useTransform(springValue, (latest) =>
    latest.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );

  const prevValue = useRef(value);
  const isIncreasing = value > prevValue.current;

  useEffect(() => {
    springValue.set(value);
    prevValue.current = value;
  }, [value, springValue]);

  return (
    <motion.span
      className={className}
      animate={
        highlightOnChange
          ? {
              scale: [1, 1.05, 1],
              color: isIncreasing
                ? ["hsl(var(--foreground))", "hsl(142, 76%, 46%)", "hsl(var(--foreground))"]
                : ["hsl(var(--foreground))", "hsl(var(--foreground))", "hsl(var(--foreground))"],
            }
          : {}
      }
      transition={{ duration: 0.4 }}
    >
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </motion.span>
  );
};
