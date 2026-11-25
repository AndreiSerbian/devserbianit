import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play, RotateCcw } from "lucide-react";
import ProcessFilm from "./film/ProcessFilm";
import { DUR } from "./film/core";
import { setFilmLang, type FilmLang } from "./film/i18n";

export interface ProcessFilmCopy {
  eyebrow: string; line1: string; line2: string; lead: string; primary: string; secondary: string;
  replay: string; pause: string; resume: string; restart: string; captions: readonly string[];
}
const capIdx = (t: number) => (t < 4 ? 0 : t < 8.2 ? 1 : t < 13 ? 2 : t < 18 ? 3 : t < 22 ? 4 : 5);

/* ==========================================================================
   ProcessSection — «От задачи — к решению.»
   A 25-second animated short: task → plan → first version → client review →
   test + publish → a real request reaches the manager in Telegram.

   · One requestAnimationFrame clock drives everything (the film is a pure
     function of `t`), so pause, replay and reduced motion share one code path.
   · Autoplays once when ≥35% visible, ends on the finished product, never loops.
   · Pauses automatically while the tab is hidden or the section is off screen.
   · prefers-reduced-motion → static final frame, no controls.
   ========================================================================== */

const TELEGRAM_URL = "https://t.me/public_serb";

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(
    () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const m = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!m) return;
    const h = () => setReduce(m.matches);
    m.addEventListener?.("change", h);
    return () => m.removeEventListener?.("change", h);
  }, []);
  return reduce;
}

/** stacked layout below 640px container width */
function useStacked(ref: React.RefObject<HTMLElement>) {
  const [stacked, setStacked] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setStacked(e.contentRect.width < 560));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return stacked;
}

function useFilmClock(enabled: boolean) {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const tRef = useRef(0);
  const last = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    last.current = null;
    const tick = (now: number) => {
      if (last.current !== null) {
        tRef.current = Math.min(DUR, tRef.current + (now - last.current) / 1000);
        setT(tRef.current);
        if (tRef.current >= DUR) {
          setPlaying(false);
          return;
        }
      }
      last.current = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const seek = useCallback((v: number) => {
    tRef.current = v;
    setT(v);
  }, []);
  const play = useCallback(() => {
    if (!enabled) return;
    if (tRef.current >= DUR) seek(0);
    setPlaying(true);
  }, [enabled, seek]);
  const pause = useCallback(() => setPlaying(false), []);
  const replay = useCallback(() => {
    seek(0);
    setPlaying(true);
  }, [seek]);
  return { t, playing, play, pause, replay, seek };
}

export default function ProcessSection({
  telegramUrl = TELEGRAM_URL,
  onTelegramClick,
  onSecondaryClick,
  copy,
  lang = "ru",
}: {
  copy: ProcessFilmCopy;
  lang?: FilmLang;
  telegramUrl?: string;
  onTelegramClick?: () => void;
  onSecondaryClick?: () => void;
}) {
  setFilmLang(lang);
  const reduce = usePrefersReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const stacked = useStacked(stageRef);
  const clock = useFilmClock(!reduce);
  const started = useRef(false);
  const autoPaused = useRef(false);

  const t = reduce ? DUR : clock.t;
  const ended = t >= DUR;

  /* autoplay once on first view; pause when off-screen, resume when back */
  useEffect(() => {
    if (reduce) return;
    const el = stageRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      started.current = true;
      clock.play();
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio >= 0.35) {
          if (!started.current) {
            started.current = true;
            clock.play();
          } else if (autoPaused.current) {
            autoPaused.current = false;
            clock.play();
          }
        } else if (!e.isIntersecting && clock.playing) {
          autoPaused.current = true;
          clock.pause();
        }
      },
      { threshold: [0, 0.35] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce, clock.playing, clock.play, clock.pause]);

  useEffect(() => {
    const h = () => {
      if (document.hidden && clock.playing) {
        autoPaused.current = true;
        clock.pause();
      }
    };
    document.addEventListener("visibilitychange", h);
    return () => document.removeEventListener("visibilitychange", h);
  }, [clock.playing, clock.pause]);

  const toggle = () => {
    autoPaused.current = false;
    if (ended) clock.replay();
    else if (clock.playing) clock.pause();
    else clock.play();
  };

  const handleSecondary = () => {
    if (onSecondaryClick) return onSecondaryClick();
    const el = document.getElementById("cases");
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: "smooth" });
  };

  return (
    <section id="process" aria-labelledby="process-title" className="relative overflow-hidden border-b border-border bg-surface py-20 md:py-28">
      <div className="container px-4 sm:px-6">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
          {/* ---------- Copy ---------- */}
          <div className="lg:col-span-4 lg:pt-10">
            <p className="mb-6 font-sans text-[10px] uppercase tracking-[0.24em] text-primary sm:text-xs">{copy.eyebrow}</p>
            <h2
              id="process-title"
              className="font-display text-[clamp(2.75rem,5vw,5rem)] font-semibold uppercase leading-[0.92] tracking-tight"
            >
              <span className="whitespace-nowrap">
                {copy.line1}&nbsp;<span className="text-primary">—</span>
              </span>
              <br />{copy.line2}
            </h2>
            <p className="mt-8 max-w-sm text-base leading-relaxed text-muted-foreground md:text-lg">
              {copy.lead}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onTelegramClick}
                className="inline-flex h-12 items-center whitespace-nowrap bg-primary px-6 font-display text-sm uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {copy.primary}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={handleSecondary}
                className="whitespace-nowrap py-2 text-xs uppercase tracking-[0.14em] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {copy.secondary}
              </button>
            </div>
          </div>

          {/* ---------- Film ---------- */}
          <figure className="m-0 lg:col-span-8">
            <div
              ref={stageRef}
              onClick={reduce ? undefined : toggle}
              className={`${reduce ? "" : "cursor-pointer"} ${stacked ? "-mx-3" : ""}`}
            >
              <ProcessFilm t={t} layout={stacked ? "stack" : "wide"} />
            </div>

            <figcaption className="mt-5 flex items-center gap-4">
              {!reduce && (
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={toggle}
                    aria-controls="pf-stage"
                    aria-label={ended ? copy.replay : clock.playing ? copy.pause : copy.resume}
                    className="inline-flex h-9 w-9 items-center justify-center border border-border text-foreground transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {ended ? <RotateCcw className="h-4 w-4" /> : clock.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  {!ended && (
                    <button
                      type="button"
                      onClick={() => {
                        autoPaused.current = false;
                        clock.replay();
                      }}
                      aria-controls="pf-stage"
                      aria-label={copy.restart}
                      className="inline-flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
              <p aria-live="polite" className="min-w-0 flex-1 text-sm leading-snug text-muted-foreground">
                {copy.captions[capIdx(t)]}
              </p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
