import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";

interface InteractiveButtonProps extends ButtonProps {
  children: ReactNode;
  ripple?: boolean;
}

export const InteractiveButton = ({ 
  children, 
  ripple = true,
  className = "",
  ...props 
}: InteractiveButtonProps) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      
      setRipples(prev => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 600);
    }
    
    props.onClick?.(e);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <Button 
        {...props} 
        onClick={handleClick}
        className={`relative overflow-hidden ${className}`}
      >
        {children}
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
            initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 1 }}
            animate={{ 
              width: 200, 
              height: 200, 
              x: -100, 
              y: -100, 
              opacity: 0 
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </Button>
    </motion.div>
  );
};
