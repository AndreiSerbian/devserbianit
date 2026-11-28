import { useId, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { designCopy, nodeDestinations } from "@/data/designCopy";
import { A11Y, CENTER_PHRASES, type RevolverLocale } from "./revolverData";
import { buildGeometry } from "./revolverHelpers";

interface RevolverHeroDiagramProps {
  locale: RevolverLocale;
  className?: string;
  reduced?: boolean;
  compact?: boolean;
}

export const RevolverHeroDiagram = ({ locale, className, reduced, compact = false }: RevolverHeroDiagramProps) => {
  const prefersReduced = useReducedMotion();
  const still = reduced ?? Boolean(prefersReduced);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const [selected, setSelected] = useState(3);
  const g = buildGeometry(compact);
  const copy = designCopy[locale];
  const a11y = A11Y[locale];

  return (
    <div ref={ref} className={className}>
      <svg viewBox={`0 0 ${g.size} ${g.size}`} className="w-full h-auto overflow-visible" role="group" aria-labelledby={`${uid}-title`}>
        <title id={`${uid}-title`}>{a11y.title}</title>
        <desc>{a11y.desc}</desc>
        <defs>
          <pattern id={`${uid}-grid`} width="26" height="26" patternUnits="userSpaceOnUse">
            <path d="M26 0H0V26" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
          </pattern>
        </defs>
        <g aria-hidden="true">
          <rect width={g.size} height={g.size} fill={`url(#${uid}-grid)`} opacity="0.4" />
          <circle cx={g.center} cy={g.center} r={g.radius} fill="none" stroke="hsl(var(--border))" strokeDasharray="3 7" />
          <circle cx={g.center} cy={g.center} r={(g.radius + g.hubOuter) / 2} fill="none" stroke="hsl(var(--primary))" opacity="0.3" />
          {g.slots.map((s) => (
            <g key={s.index}>
              <line x1={s.hx} y1={s.hy} x2={s.cx} y2={s.cy} stroke="hsl(var(--primary))" strokeWidth={selected === s.index ? 2 : 1} opacity={selected === s.index ? 1 : 0.4} />
              {!still && inView && (
                <motion.circle r="3" fill="hsl(var(--primary))"
                  animate={{ cx: [s.cx, s.hx], cy: [s.cy, s.hy], opacity: [0, 1, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2, delay: s.index * 0.6, ease: "linear" }} />
              )}
            </g>
          ))}
          <circle cx={g.center} cy={g.center} r={g.hubOuter} fill="hsl(var(--teal-deep))" stroke="hsl(var(--teal-bright))" strokeWidth="1.5" />
          <circle cx={g.center} cy={g.center} r={g.hubOuter - 12} fill="none" stroke="hsl(var(--teal-bright))" opacity="0.4" />
          <text x={g.center} y={g.center} textAnchor="middle" fill="hsl(var(--cream))" fontFamily="Oswald, sans-serif" fontSize={g.centerFontSize} fontWeight="600">
            {CENTER_PHRASES[locale][0].split(" ").map((word, i) => <tspan key={word} x={g.center} dy={i === 0 ? -4 : g.centerFontSize * 1.12}>{word}</tspan>)}
          </text>
        </g>
        {g.slots.map((s) => (
          <foreignObject key={s.index} x={s.cx - g.cardW / 2} y={s.cy - g.cardH / 2} width={g.cardW} height={g.cardH}>
            <Button variant="outline" className={`system-node w-full h-full px-1 bg-surface-raised ${selected === s.index ? "border-primary text-primary" : "text-foreground"}`}
              aria-pressed={selected === s.index} aria-controls={`${uid}-detail`}
              onClick={() => setSelected(s.index)} onMouseEnter={() => setSelected(s.index)} onFocus={() => setSelected(s.index)}>
              {copy.nodes[s.index]}
            </Button>
          </foreignObject>
        ))}
      </svg>
      <div className="grid grid-cols-3 gap-2 lg:hidden mb-4" role="group" aria-label={a11y.title}>
        {copy.nodes.map((node, index) => (
          <Button key={node} variant="outline" className={`min-h-11 h-auto px-1 text-xs whitespace-normal ${selected === index ? "border-primary text-primary" : ""}`}
            aria-pressed={selected === index} aria-controls={`${uid}-detail`} onClick={() => setSelected(index)}>
            {node}
          </Button>
        ))}
      </div>
      <div id={`${uid}-detail`} className="border-t border-border pt-4 min-h-[116px] sm:min-h-[104px] flex items-start gap-4">
        <span className="block w-1 self-stretch bg-primary shrink-0" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{copy.nodes[selected]}</p>
          <p aria-live="polite" className="mt-1 text-sm leading-relaxed text-muted-foreground">{copy.descriptions[selected]}</p>
          <Button asChild variant="link" className="h-auto p-0 mt-2 text-xs">
            <a href={`#${nodeDestinations[selected]}`}>{selected === 5 ? copy.exploreCases : copy.explore}<ArrowRight className="h-3 w-3" /></a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RevolverHeroDiagram;
