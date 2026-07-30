import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  A11Y,
  CENTER_INTERVAL_MS,
  CENTER_PHRASES,
  OUTER_INTERVAL_MS,
  OUTER_WORDS,
  type RevolverLocale,
} from "./revolverData";
import { buildGeometry, slotForWord, SLOTS } from "./revolverHelpers";
import { ASSEMBLY, CENTER_SWAP, EASE_PREMIUM, OUTER_SHIFT } from "./revolverMotion";

interface RevolverHeroDiagramProps {
  locale: RevolverLocale;
  className?: string;
  reduced?: boolean;
  compact?: boolean;
}

const OSWALD = "Oswald, 'Golos Text', system-ui, sans-serif";

export const RevolverHeroDiagram = ({
  locale,
  className,
  reduced,
  compact = false,
}: RevolverHeroDiagramProps) => {
  const prefersReduced = useReducedMotion();
  const still = reduced ?? Boolean(prefersReduced);

  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.3 });
  const play = inView && !still;

  const [step, setStep] = useState(0);
  const [phrase, setPhrase] = useState(0);

  useEffect(() => {
    if (!play) return;
    const outer = window.setInterval(() => setStep((s) => s + 1), OUTER_INTERVAL_MS);
    const center = window.setInterval(
      () => setPhrase((p) => (p + 1) % CENTER_PHRASES[locale].length),
      CENTER_INTERVAL_MS,
    );
    return () => {
      window.clearInterval(outer);
      window.clearInterval(center);
    };
  }, [play, locale]);

  const g = buildGeometry(compact);
  const words = OUTER_WORDS[locale];
  const phrases = CENTER_PHRASES[locale];
  const a11y = A11Y[locale];
  const activeSlot = step % SLOTS;
  const gridId = `rev-grid-${uid}`;

  const show = (delay: number, duration: number) =>
    still || !play
      ? { initial: undefined as never, animate: undefined as never }
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay, duration, ease: EASE_PREMIUM },
        };

  return (
    <div ref={wrapRef} className={className}>
      <svg
        viewBox={`0 0 ${g.size} ${g.size}`}
        className="w-full h-auto max-w-[560px] mx-auto overflow-visible"
        role="img"
        aria-labelledby={`${uid}-t ${uid}-d`}
      >
        <title id={`${uid}-t`}>{a11y.title}</title>
        <desc id={`${uid}-d`}>{a11y.desc}</desc>

        <defs>
          <pattern id={gridId} width="26" height="26" patternUnits="userSpaceOnUse">
            <path d="M26 0H0V26" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* 1. background grid */}
        <motion.rect
          aria-hidden
          width={g.size}
          height={g.size}
          fill={`url(#${gridId})`}
          opacity={0.45}
          {...show(ASSEMBLY.grid.delay, ASSEMBLY.grid.duration)}
        />

        {/* 2. circular rails */}
        <g aria-hidden fill="none" stroke="hsl(var(--border))">
          <motion.circle
            cx={g.center}
            cy={g.center}
            r={g.radius}
            strokeDasharray="3 7"
            {...show(ASSEMBLY.slots.delay, ASSEMBLY.slots.duration)}
          />
          <motion.circle
            cx={g.center}
            cy={g.center}
            r={(g.radius + g.hubOuter) / 2}
            stroke="hsl(var(--teal-bright))"
            opacity={0.22}
            {...show(ASSEMBLY.slots.delay + 0.1, ASSEMBLY.slots.duration)}
          />
        </g>

        {/* 3. connectors */}
        <g aria-hidden>
          {g.slots.map((s, i) => {
            const isActive = s.index === activeSlot;
            return (
              <motion.line
                key={s.index}
                x1={s.hx}
                y1={s.hy}
                x2={s.cx}
                y2={s.cy}
                stroke={isActive ? "hsl(var(--lime))" : "hsl(var(--teal-bright))"}
                strokeWidth={isActive ? 1.8 : 1}
                initial={still || !play ? undefined : { pathLength: 0, opacity: 0 }}
                animate={
                  still || !play
                    ? { opacity: isActive ? 0.9 : 0.45 }
                    : { pathLength: 1, opacity: isActive ? 0.9 : 0.45 }
                }
                transition={{
                  delay: play ? ASSEMBLY.connectors.delay + i * ASSEMBLY.connectors.step : 0,
                  duration: ASSEMBLY.connectors.duration,
                  ease: EASE_PREMIUM,
                }}
              />
            );
          })}
        </g>

        {/* 4. stable module slots */}
        <g aria-hidden>
          {g.slots.map((s, i) => (
            <motion.rect
              key={s.index}
              x={s.cx - g.cardW / 2}
              y={s.cy - g.cardH / 2}
              width={g.cardW}
              height={g.cardH}
              fill="hsl(var(--surface-raised))"
              stroke={s.index === activeSlot ? "hsl(var(--lime))" : "hsl(var(--border))"}
              strokeWidth="1"
              initial={still || !play ? undefined : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ transformOrigin: `${s.cx}px ${s.cy}px` }}
              transition={{
                delay: play ? ASSEMBLY.slots.delay + i * ASSEMBLY.slots.step : 0,
                duration: ASSEMBLY.slots.duration,
                ease: EASE_PREMIUM,
              }}
            />
          ))}
        </g>

        {/* 5. revolving labels */}
        <g>
          {words.map((word, wi) => {
            const slot = g.slots[slotForWord(wi, step)];
            const isActive = slot.index === activeSlot;
            return (
              <motion.text
                key={word}
                x={0}
                y={0}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isActive ? "hsl(var(--lime))" : "hsl(var(--foreground))"}
                fontFamily={OSWALD}
                fontSize={g.fontSize}
                fontWeight={500}
                letterSpacing="1.4"
                initial={
                  still || !play
                    ? { x: slot.cx, y: slot.cy, opacity: 1 }
                    : { x: slot.cx, y: slot.cy, opacity: 0 }
                }
                animate={{
                  x: slot.cx,
                  y: slot.cy,
                  opacity: still || !play ? 1 : [0.25, 1],
                }}
                transition={{
                  ...OUTER_SHIFT,
                  delay: play && step === 0 ? ASSEMBLY.slots.delay + wi * ASSEMBLY.slots.step : 0,
                }}
              >
                {word}
              </motion.text>
            );
          })}
        </g>

        {/* 6. center hub */}
        <motion.g
          aria-hidden
          initial={still || !play ? undefined : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ transformOrigin: `${g.center}px ${g.center}px` }}
          transition={{
            delay: play ? ASSEMBLY.hub.delay : 0,
            duration: ASSEMBLY.hub.duration,
            ease: EASE_PREMIUM,
          }}
        >
          <circle cx={g.center} cy={g.center} r={g.hubOuter} fill="hsl(var(--teal-deep))" />
          <circle
            cx={g.center}
            cy={g.center}
            r={g.hubOuter}
            fill="none"
            stroke="hsl(var(--teal-bright))"
            strokeWidth="1.5"
          />
          <circle
            cx={g.center}
            cy={g.center}
            r={g.hubOuter - 12}
            fill="none"
            stroke="hsl(var(--teal-bright))"
            strokeWidth="0.75"
            opacity={0.5}
          />
          <circle
            cx={g.center}
            cy={g.center}
            r={g.hubOuter - 26}
            fill="none"
            stroke="hsl(var(--cream))"
            strokeWidth="0.5"
            opacity={0.18}
          />
          {g.slots.map((s) => (
            <line
              key={s.index}
              x1={g.center}
              y1={g.center}
              x2={s.hx}
              y2={s.hy}
              stroke="hsl(var(--teal-bright))"
              strokeWidth="0.5"
              opacity={0.28}
            />
          ))}
        </motion.g>

        {/* 7. center trigger phrase */}
        <motion.g {...show(ASSEMBLY.centerText.delay, ASSEMBLY.centerText.duration)}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.g
              key={phrases[phrase]}
              initial={still ? undefined : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={still ? undefined : { opacity: 0, y: -8 }}
              transition={CENTER_SWAP}
            >
              <text
                x={g.center}
                y={g.center}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="hsl(var(--cream))"
                fontFamily={OSWALD}
                fontSize={g.centerFontSize}
                fontWeight={600}
                letterSpacing="0.5"
              >
                {phrases[phrase].split(" ").map((part, i, arr) => (
                  <tspan
                    key={part + i}
                    x={g.center}
                    dy={
                      i === 0
                        ? arr.length > 1
                          ? -g.centerFontSize * 0.45
                          : 0
                        : g.centerFontSize * 0.95
                    }
                  >
                    {part}
                  </tspan>
                ))}
              </text>
            </motion.g>
          </AnimatePresence>
        </motion.g>

        {/* 8. inbound signal on the active connector */}
        {play && (
          <motion.circle
            aria-hidden
            key={`signal-${step}`}
            r={3.5}
            fill="hsl(var(--lime))"
            initial={{
              cx: g.slots[activeSlot].cx,
              cy: g.slots[activeSlot].cy,
              opacity: 0,
            }}
            animate={{
              cx: [g.slots[activeSlot].cx, g.slots[activeSlot].hx],
              cy: [g.slots[activeSlot].cy, g.slots[activeSlot].hy],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: ASSEMBLY.signal.duration,
              delay: step === 0 ? ASSEMBLY.signal.delay : 0.2,
              ease: EASE_PREMIUM,
            }}
          />
        )}
      </svg>
    </div>
  );
};

export default RevolverHeroDiagram;
