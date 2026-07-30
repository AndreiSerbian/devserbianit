import { motion, useReducedMotion } from "framer-motion";
import { ASMonogram } from "@/components/brand";

interface HeroDiagramProps {
  labels: {
    marketing: string;
    sales: string;
    site: string;
    crm: string;
    automation: string;
    analytics: string;
  };
}

/**
 * System map: six business areas wired into one core.
 * Deliberately technical / schematic — no blobs, no glow, no glassmorphism.
 */
export const HeroDiagram = ({ labels }: HeroDiagramProps) => {
  const reduce = useReducedMotion();

  const nodes = [
    { key: "marketing", label: labels.marketing, x: 20, y: 24 },
    { key: "sales", label: labels.sales, x: 320, y: 24 },
    { key: "site", label: labels.site, x: 20, y: 148 },
    { key: "crm", label: labels.crm, x: 320, y: 148 },
    { key: "automation", label: labels.automation, x: 20, y: 272 },
    { key: "analytics", label: labels.analytics, x: 320, y: 272 },
  ];

  const NODE_W = 160;
  const NODE_H = 48;
  const CORE = { x: 200, y: 148, w: 120, h: 48 };

  const coreCx = CORE.x + CORE.w / 2;
  const coreCy = CORE.y + CORE.h / 2;

  return (
    <svg
      viewBox="0 0 500 344"
      className="w-full h-auto max-w-[520px]"
      role="img"
      aria-label={Object.values(labels).join(", ")}
    >
      {/* grid backdrop */}
      <defs>
        <pattern id="hero-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="500" height="344" fill="url(#hero-grid)" opacity="0.5" />

      {/* connectors */}
      {nodes.map((n, i) => {
        const nodeCx = n.x < 200 ? n.x + NODE_W : n.x;
        const nodeCy = n.y + NODE_H / 2;
        const d = `M${nodeCx} ${nodeCy} H${(nodeCx + coreCx) / 2} V${coreCy} H${
          n.x < 200 ? CORE.x : CORE.x + CORE.w
        }`;
        return (
          <motion.path
            key={n.key}
            d={d}
            fill="none"
            stroke="hsl(var(--teal-bright))"
            strokeWidth="1.5"
            opacity="0.7"
            initial={reduce ? undefined : { pathLength: 0 }}
            animate={reduce ? undefined : { pathLength: 1 }}
            transition={{ duration: 0.7, delay: 0.25 + i * 0.09, ease: "easeOut" }}
          />
        );
      })}

      {/* area nodes */}
      {nodes.map((n, i) => (
        <motion.g
          key={n.key}
          initial={reduce ? undefined : { opacity: 0, y: 8 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
        >
          <rect
            x={n.x}
            y={n.y}
            width={NODE_W}
            height={NODE_H}
            fill="hsl(var(--surface-raised))"
            stroke="hsl(var(--border))"
            strokeWidth="1"
          />
          <rect
            x={n.x}
            y={n.y}
            width="3"
            height={NODE_H}
            fill={i % 2 === 0 ? "hsl(var(--teal-bright))" : "hsl(var(--lime))"}
          />
          <text
            x={n.x + 16}
            y={n.y + NODE_H / 2 + 4}
            fill="hsl(var(--foreground))"
            fontSize="13"
            fontFamily="'Golos Text', system-ui, sans-serif"
            letterSpacing="0.5"
          >
            {n.label}
          </text>
        </motion.g>
      ))}

      {/* core */}
      <motion.g
        initial={reduce ? undefined : { opacity: 0, scale: 0.94 }}
        animate={reduce ? undefined : { opacity: 1, scale: 1 }}
        style={{ transformOrigin: `${coreCx}px ${coreCy}px` }}
        transition={{ duration: 0.5 }}
      >
        <rect
          x={CORE.x}
          y={CORE.y}
          width={CORE.w}
          height={CORE.h}
          fill="hsl(var(--teal-deep))"
          stroke="hsl(var(--teal-bright))"
          strokeWidth="1.5"
        />
        <g transform={`translate(${coreCx - 17}, ${coreCy - 17})`}>
          <ASMonogram variant="micro" tone="light" size={34} decorative />
        </g>
      </motion.g>
    </svg>
  );
};