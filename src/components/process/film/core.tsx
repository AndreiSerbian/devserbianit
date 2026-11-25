/* ==========================================================================
   Film core — timing helpers, palette, shared geometry.
   The whole film is a pure function of time `t` (seconds, 0…DUR).
   Every element computes its own state from `t`, so play / pause / replay /
   reduced-motion (t = DUR) are all the same code path.
   ========================================================================== */

export const DUR = 25;

export const F_DISPLAY = "Oswald, 'Golos Text', system-ui, sans-serif";
export const F_SANS = "'Golos Text', system-ui, sans-serif";

/* Site tokens — theme-aware via CSS variables from index.css */
export const C = {
  bg: "hsl(var(--background))",
  card: "hsl(var(--card))",
  raised: "hsl(var(--surface-raised))",
  surface: "hsl(var(--surface))",
  border: "hsl(var(--border))",
  wire: "hsl(var(--foreground) / .1)",
  fg: "hsl(var(--foreground))",
  fgSoft: "hsl(var(--foreground) / .62)",
  fgFaint: "hsl(var(--foreground) / .28)",
  muted: "hsl(var(--muted-foreground))",
  primary: "hsl(var(--primary))",
  primaryFg: "hsl(var(--primary-foreground))",
  primarySoft: "hsl(var(--primary) / .14)",
  primaryLine: "hsl(var(--primary) / .55)",
  tealDeep: "hsl(var(--teal-deep))",
  cream: "hsl(var(--cream))",
  creamSoft: "hsl(var(--cream) / .6)",
  lime: "hsl(var(--lime))",
  limeSoft: "hsl(var(--lime) / .18)",
  limeLine: "hsl(var(--lime) / .6)",
  danger: "hsl(var(--destructive))",
};

/* ---------- easing & interpolation ---------- */
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
/** ease-in-out cubic — object moves */
export const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
/** ease-out cubic — appearances */
export const eo = (x: number) => 1 - Math.pow(1 - x, 3);
export const lin = (x: number) => x;
/** eased progress of t inside [a, b] */
export const P = (t: number, a: number, b: number, e: (x: number) => number = eio) => e(clamp((t - a) / (b - a)));
export const L = (a: number, b: number, p: number) => a + (b - a) * p;
export const inRange = (t: number, a: number, b: number) => t >= a && t < b;
/** visible inside [a, b] with soft edges */
export const win = (t: number, a: number, b: number, f = 0.25) => P(t, a, a + f, eo) * (1 - P(t, b - f, b, eo));
/** progressively typed string */
export const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(s.length * clamp((t - a) / (b - a))));

export type Rect = { x: number; y: number; w: number; h: number };
export const lerpRect = (r1: Rect, r2: Rect, p: number): Rect => ({
  x: L(r1.x, r2.x, p),
  y: L(r1.y, r2.y, p),
  w: L(r1.w, r2.w, p),
  h: L(r1.h, r2.h, p),
});

/** keyframed 2D track, eased between keys: [{t, x, y}] sorted by t */
export type Key = { t: number; x: number; y: number };
export function track(keys: Key[], t: number) {
  if (t <= keys[0].t) return { x: keys[0].x, y: keys[0].y };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (t < b.t) {
      const p = eio((t - a.t) / Math.max(0.0001, b.t - a.t));
      return { x: L(a.x, b.x, p), y: L(a.y, b.y, p) };
    }
  }
  const z = keys[keys.length - 1];
  return { x: z.x, y: z.y };
}

/** approximate text width for Golos Text at a given size (Cyrillic avg) */
export const textW = (s: string, size = 9) => s.length * size * 0.54;

/** caret blink tied to the clock (only while a field is focused) */
export const caretOn = (t: number) => Math.floor(t * 2.6) % 2 === 0;

/* ---------- scene captions (screen-reader + visible) ---------- */
export function sceneCaption(t: number) {
  if (t < 4) return "Клиент описывает задачу своими словами.";
  if (t < 8.2) return "Выделяю требования и собираю схему: форма → проверка → Telegram.";
  if (t < 13) return "Из схемы собираю первую рабочую версию сайта.";
  if (t < 18) return "Клиент просит сократить форму — правлю прямо по комментарию.";
  if (t < 22) return "Проверяю отправку и ошибки, публикую сайт.";
  return "Сайт работает: заявка сразу у менеджера в Telegram.";
}

/* ---------- layout (desktop: side by side · mobile: stacked) ---------- */
export type Layout = {
  vbW: number;
  vbH: number;
  win: { x: number; y: number };
  phone: { x: number; y: number; h: number };
};
export const WIN_W = 460;
export const WIN_H = 400;
export const PHONE_W = 178;
export const LAYOUTS: Record<"wide" | "stack", Layout> = {
  wide: { vbW: 652, vbH: 436, win: { x: 1, y: 18 }, phone: { x: 473, y: 44, h: 360 } },
  stack: { vbW: 462, vbH: 672, win: { x: 1, y: 1 }, phone: { x: 142, y: 428, h: 240 } },
};

/* ---------- the client's first message (shared by Phone + fliers) ---------- */
export const MSG1 = [
  "Здравствуйте! Мы ставим окна.",
  "Заявки идут в звонки, почту,",
  "WhatsApp — и теряются.",
  "Нужен сайт с формой на замер,",
  "и чтобы заявки сразу шли",
  "менеджеру в Telegram.",
];
/** requirement extraction: which message line → which brief item */
export const REQS = [
  { line: 3, label: "Форма заявки на замер", hl: 2.3 },
  { line: 2, label: "Ни одна заявка не теряется", hl: 2.75 },
  { line: 5, label: "Сразу в Telegram менеджеру", hl: 3.2 },
];
export const FLY = { start: 4.0, stagger: 0.14, dur: 0.8 };
/** top of brief item i (window-local) */
export const BRIEF_Y = (i: number) => 70 + i * 30;
export const BRIEF_X = 20;
export const BRIEF_W = 186;
export const MSG1_H = 12 + MSG1.length * 12 + 10;
/** phone chat area bottom (local) */
export const chatBottom = (h: number) => h - 44;
/** baseline of MSG1 line i while it is the only message on screen */
export const msg1LineY = (h: number, i: number) => chatBottom(h) - MSG1_H + 20 + i * 12;
