import {
  C, F_DISPLAY, F_SANS, P, L, eo, eio, lin, win, typed, clamp, lerpRect, track, caretOn,
  WIN_W, WIN_H, REQS, FLY, BRIEF_X, BRIEF_Y, BRIEF_W, type Rect,
} from "./core";

/* ==========================================================================
   Window — ONE persistent browser frame. Its content evolves:
   brief + workflow → wireframe → site → review → tested → published → live.
   All coordinates are window-local (460 × 400). Content area starts at y=30.
   ========================================================================== */

const W = WIN_W;
const H = WIN_H;

/* ---------- planning: workflow nodes and where they end up ---------- */
const NODES = [
  { label: "Форма на сайте", sub: "имя, телефон, адрес…", icon: "form" },
  { label: "Проверка", sub: "формат номера, спам, дубли", icon: "check" },
  { label: "Telegram", sub: "сообщение менеджеру", icon: "tg" },
] as const;
const nodeRect = (i: number): Rect => ({ x: 228, y: 70 + i * 74, w: 212, h: 38 });
const CHIP = [
  { x: 120, y: 378, w: 70, h: 16, label: "Форма" },
  { x: 214, y: 378, w: 78, h: 16, label: "Проверка" },
  { x: 316, y: 378, w: 78, h: 16, label: "Telegram" },
];
const chipC = (i: number) => ({ x: CHIP[i].x + CHIP[i].w / 2, y: CHIP[i].y + CHIP[i].h / 2 });

/* ---------- site: form card before / after revision ---------- */
const FIELDS = [
  { id: "name", ph: "Имя", keep: 0 },
  { id: "phone", ph: "Телефон", keep: 1 },
  { id: "email", ph: "Email", rm: 0 },
  { id: "addr", ph: "Адрес", rm: 1 },
  { id: "time", ph: "Удобное время", rm: 2 },
  { id: "note", ph: "Комментарий", rm: 3 },
] as const;
const CARD_X = 252;
const CARD_W = 188;
const CARD_Y = 64;
const RM_AT = (r: number) => 15.75 + r * 0.17; // each removal start
const REFLOW = [16.45, 17.15];
const fieldBefore = (i: number): Rect => ({ x: CARD_X + 12, y: 98 + i * 28, w: CARD_W - 24, h: 22 });
const fieldAfter = (k: number): Rect => ({ x: CARD_X + 12, y: 104 + k * 38, w: CARD_W - 24, h: 28 });
const BTN_BEFORE: Rect = { x: CARD_X + 12, y: 270, w: CARD_W - 24, h: 24 };
const BTN_AFTER: Rect = { x: CARD_X + 12, y: 190, w: CARD_W - 24, h: 30 };
const CARD_H_BEFORE = 244;
const CARD_H_AFTER = 172;

/* brief items morph into hero wire bars */
const HERO_BARS: Rect[] = [
  { x: 20, y: 96, w: 168, h: 22 },
  { x: 20, y: 124, w: 140, h: 22 },
  { x: 20, y: 158, w: 196, h: 8 },
];

/* ---------- field values (pure functions of t) ---------- */
const nameVal = (t: number) =>
  t >= 19.1 && t < 20.9 ? typed("Тест", t, 19.1, 19.4) : t >= 22.3 && t < 24 ? typed("Ирина", t, 22.3, 22.75) : "";
const phoneVal = (t: number) =>
  t >= 19.6 && t < 20.9
    ? typed("+373 69 000 000", t, 19.6, 20.05)
    : t >= 22.95 && t < 24
      ? typed("+373 69 555 210", t, 22.95, 23.5)
      : "";
const focusOf = (t: number) =>
  (t >= 19.05 && t < 19.55) || (t >= 22.2 && t < 22.85) ? "name" : (t >= 19.55 && t < 20.2) || (t >= 22.85 && t < 23.6) ? "phone" : null;
const nameErr = (t: number) => t >= 18.45 && t < 19.15;
const phoneErr = (t: number) => t >= 18.45 && t < 20.05;
const sending = (t: number) => (t >= 20.25 && t < 20.85) || (t >= 23.65 && t < 24.0);

/* pipeline signal: returns position + state of the travelling dot */
function signal(t: number) {
  const runs = [
    { a: 18.28, b: 18.45, to: 1, fail: true },
    { a: 20.3, b: 20.85, to: 2 },
    { a: 23.68, b: 24.12, to: 2 },
  ];
  for (const r of runs) {
    if (t >= r.a && t < r.b) {
      const p = eio((t - r.a) / (r.b - r.a)) * r.to;
      const i = Math.min(Math.floor(p), r.to - 1);
      const f = p - i;
      const A = chipC(i);
      const B = chipC(i + 1);
      return { x: L(A.x, B.x, f), y: A.y, at: p, fail: !!r.fail };
    }
  }
  return null;
}
function chipState(i: number, t: number) {
  if (i === 1 && t >= 18.45 && t < 19.05) return "fail";
  const lit = (a: number, b: number, at: number) => t >= a + at * (b - a) / 2 && t < b + 0.5;
  if (lit(20.3, 20.85, i) || lit(23.68, 24.12, i)) return "ok";
  return "idle";
}

/* ---------- cursors ---------- */
const DEV_KEYS = [
  { t: 8.3, x: 470, y: 300 }, { t: 8.9, x: 120, y: 112 }, { t: 9.5, x: 70, y: 50 }, { t: 10.0, x: 110, y: 132 },
  { t: 10.7, x: 330, y: 84 }, { t: 11.3, x: 360, y: 186 }, { t: 11.9, x: 360, y: 280 }, { t: 12.4, x: 480, y: 330 },
  { t: 15.2, x: 480, y: 250 }, { t: 15.65, x: 400, y: 167 }, { t: 15.82, x: 400, y: 195 }, { t: 15.99, x: 400, y: 223 },
  { t: 16.16, x: 400, y: 251 }, { t: 16.6, x: 400, y: 251 }, { t: 17.2, x: 430, y: 300 }, { t: 17.9, x: 430, y: 300 },
  { t: 18.2, x: 350, y: 206 }, { t: 18.9, x: 350, y: 206 }, { t: 19.05, x: 320, y: 118 }, { t: 19.5, x: 320, y: 118 },
  { t: 19.6, x: 320, y: 156 }, { t: 20.1, x: 320, y: 156 }, { t: 20.25, x: 350, y: 206 }, { t: 20.9, x: 352, y: 210 },
  { t: 21.6, x: 480, y: 120 },
];
const DEV_CLICKS = [9.0, 10.75, 11.95, 15.7, 15.87, 16.04, 16.21, 18.25, 19.07, 19.58, 20.24];
const DEV_SHOW = (t: number) => win(t, 8.3, 12.5, 0.3) + win(t, 15.2, 21.6, 0.3);

const CLIENT_KEYS = [
  { t: 13.1, x: 480, y: 360 }, { t: 13.9, x: 350, y: 186 }, { t: 14.6, x: 350, y: 186 }, { t: 15.4, x: 480, y: 330 },
];
const CLIENT_CLICKS = [14.0];

const VISITOR_KEYS = [
  { t: 21.9, x: 480, y: 330 }, { t: 22.2, x: 330, y: 118 }, { t: 22.8, x: 330, y: 118 }, { t: 22.88, x: 330, y: 156 },
  { t: 23.55, x: 330, y: 156 }, { t: 23.66, x: 352, y: 206 }, { t: 24.5, x: 356, y: 214 },
];
const VISITOR_CLICKS = [22.2, 22.87, 23.64];

function Cursor({ t, keys, clicks, show, tag, color }: {
  t: number; keys: { t: number; x: number; y: number }[]; clicks: number[]; show: number; tag?: string; color: string;
}) {
  if (show <= 0.001) return null;
  const p = track(keys, t);
  const last = clicks.filter((c) => c <= t).pop();
  const rip = last !== undefined ? clamp((t - last) / 0.45) : 1;
  const down = last !== undefined && t - last < 0.12;
  return (
    <g transform={`translate(${p.x}, ${p.y})`} opacity={show} aria-hidden="true">
      {rip < 1 && <circle r={4 + rip * 12} fill="none" stroke={color} strokeWidth="1.2" opacity={1 - rip} />}
      <g transform={`scale(${down ? 0.86 : 1})`}>
        <path d="M0 0 L0 15 L4.2 11.2 L7 17.6 L9.4 16.6 L6.6 10.4 L12 10.4 Z" fill={color} stroke={C.bg} strokeWidth="1" strokeLinejoin="round" />
      </g>
      {tag && (
        <g transform="translate(12, 16)">
          <rect width={tag.length * 5.2 + 10} height={13} fill={color} />
          <text x={5} y={9.2} fontSize="7.4" fontWeight="500" fontFamily={F_SANS} fill={C.bg}>
            {tag}
          </text>
        </g>
      )}
    </g>
  );
}

/* ---------- small custom flat glyphs ---------- */
function Glyph({ kind, x, y, color, s = 1 }: { kind: string; x: number; y: number; color: string; s?: number }) {
  const tf = `translate(${x}, ${y}) scale(${s})`;
  if (kind === "form")
    return (
      <g transform={tf} fill="none" stroke={color} strokeWidth="1.3">
        <rect x={0} y={0} width={14} height={16} />
        <path d="M3 5 H11 M3 8.5 H11 M3 12 H7" />
      </g>
    );
  if (kind === "check")
    return (
      <g transform={tf} fill="none" stroke={color} strokeWidth="1.3" strokeLinejoin="round">
        <path d="M7 0 L14 3 V8 C14 12 11 15 7 16.5 C3 15 0 12 0 8 V3 Z" />
        <path d="M4 8.2 L6.3 10.5 L10.3 5.8" strokeLinecap="round" />
      </g>
    );
  return (
    <g transform={tf}>
      <path d="M0 7.6 L15 1.5 L11.6 15 L8.4 10.6 Z" fill={color} />
      <path d="M8.4 10.6 L15 1.5" stroke={C.bg} strokeWidth=".9" />
    </g>
  );
}

/* ---------- the field (morphs between before/after layout) ---------- */
function Field({ t, i }: { t: number; i: number }) {
  const f = FIELDS[i];
  const real = P(t, 10.85 + i * 0.13, 11.25 + i * 0.13, eo);
  const wire = 1 - real;
  const built = P(t, 7.4 + i * 0.07, 7.9 + i * 0.07, eo);
  let r = fieldBefore(i);
  let op = built;
  let strike = 0;
  let dx = 0;
  if ("keep" in f) {
    r = lerpRect(fieldBefore(i), fieldAfter(f.keep), P(t, REFLOW[0], REFLOW[1]));
  } else {
    const a = RM_AT(f.rm);
    strike = P(t, a, a + 0.18, eo);
    const gone = P(t, a + 0.16, a + 0.42, eo);
    op *= 1 - gone;
    dx = -8 * gone;
  }
  if (op <= 0.001) return null;
  const val = f.id === "name" ? nameVal(t) : f.id === "phone" ? phoneVal(t) : "";
  const focus = focusOf(t) === f.id;
  const err = (f.id === "name" && nameErr(t)) || (f.id === "phone" && phoneErr(t));
  const okPhone = f.id === "phone" && val.length >= 15;
  const stroke = err ? C.danger : focus ? C.primary : okPhone ? C.primaryLine : C.border;
  const success = P(t, 23.95, 24.25, eo);
  return (
    <g id={`pf-field-${f.id}`} transform={`translate(${dx}, 0)`} opacity={op * (1 - success)}>
      {/* wireframe */}
      <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={C.wire} opacity={wire} />
      {/* real */}
      <g opacity={real}>
        <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={C.bg} stroke={stroke} strokeWidth={focus || err ? 1.2 : 0.8} />
        <text x={r.x + 8} y={r.y + r.h / 2 + 3.2} fontSize="8.4" fontFamily={F_SANS} fill={val ? C.fg : C.muted}>
          {val || f.ph}
        </text>
        {focus && caretOn(t) && (
          <rect x={r.x + 8 + (val ? val.length * 4.75 : 0) + 1} y={r.y + r.h / 2 - 5} width={0.9} height={10} fill={C.primary} />
        )}
        {okPhone && !focus && (
          <path d={`M${r.x + r.w - 16} ${r.y + r.h / 2} l3 3 l6 -6`} fill="none" stroke={C.primary} strokeWidth="1.3" strokeLinecap="round" />
        )}
        {strike > 0 && (
          <path d={`M${r.x + 4} ${r.y + r.h / 2} H${r.x + 4 + (r.w - 8) * strike}`} stroke={C.danger} strokeWidth="1.2" />
        )}
      </g>
      {f.id === "phone" && phoneErr(t) && (
        <text x={r.x} y={r.y + r.h + 9} fontSize="7" fontFamily={F_SANS} fill={C.danger}>
          {nameErr(t) ? "Укажите имя и телефон" : "Номер неполный"}
        </text>
      )}
    </g>
  );
}

export default function Window({ t, x, y }: { t: number; x: number; y: number }) {
  /* frame */
  const draw = P(t, 0.15, 1.15, eo);
  const fill = P(t, 0.6, 1.2, eo);

  /* planning */
  const briefHead = win(t, 3.3, 8.7, 0.4);
  const flowIn = (i: number) => P(t, 5.0 + i * 0.22, 5.5 + i * 0.22, eo);
  const morph = P(t, 7.15, 8.15); // nodes → card / chips
  const briefMorph = P(t, 8.2, 8.95); // brief items → hero wire bars

  /* site build */
  const wireCommon = P(t, 8.5, 9.0, eo);
  const real = (a: number) => P(t, a, a + 0.4, eo);
  const navR = real(9.3);
  const eyeR = real(9.55);
  const headR = real(9.8);
  const subR = real(10.15);
  const pillsR = real(10.45);
  const cardR = real(10.6);
  const btnR = real(11.75);

  /* review */
  const reflow = P(t, REFLOW[0], REFLOW[1]);
  const cardH = L(CARD_H_BEFORE, CARD_H_AFTER, reflow);
  const btn = lerpRect(BTN_BEFORE, BTN_AFTER, reflow);
  const selDraw = P(t, 14.1, 14.45, eo);
  const selShow = selDraw * (1 - P(t, 17.6, 17.95));
  const selRect = lerpRect({ x: CARD_X + 6, y: 92, w: CARD_W - 12, h: 172 }, { x: CARD_X + 6, y: 98, w: CARD_W - 12, h: 76 }, reflow);
  const note = win(t, 14.4, 17.95, 0.35);
  const noteText = typed("Давайте сделаем форму короче", t, 14.5, 15.25);
  const resolved = P(t, 17.25, 17.5, eo);
  const reviewMode = win(t, 12.9, 17.95, 0.35);

  /* deploy */
  const deploy = P(t, 21.0, 21.75, lin);
  const live = P(t, 21.7, 21.95, eo);
  const success = P(t, 23.95, 24.3, eo);
  const btnPress = (t >= 18.25 && t < 18.37) || (t >= 20.24 && t < 20.36) || (t >= 23.64 && t < 23.76);
  const btnLabel = sending(t) ? "ОТПРАВКА…" : "ЗАПИСАТЬСЯ НА ЗАМЕР";
  const pipeIn = P(t, 7.6, 8.15, eo);
  const sig = signal(t);

  const url = t < 8.2 ? "Бриф · Окна Плюс" : live > 0.5 ? "okna-plus.md" : "preview.okna-plus.md";

  return (
    <g id="pf-window" transform={`translate(${x}, ${y})`}>
      <defs>
        <clipPath id="pf-win-clip">
          <rect x={0} y={30} width={W} height={H - 30} />
        </clipPath>
      </defs>

      {/* ===== frame ===== */}
      <rect width={W} height={H} fill={C.card} opacity={fill} />
      <path d={`M0 0 H${W} V${H} H0 Z`} pathLength={1} fill="none" stroke={C.fgFaint} strokeWidth="1" strokeDasharray="1" strokeDashoffset={1 - draw} />
      <path d={`M0 30 H${W}`} pathLength={1} stroke={C.border} strokeDasharray="1" strokeDashoffset={1 - P(t, 0.6, 1.3, eo)} />
      <g opacity={fill}>
        {[12, 22, 32].map((cx) => (
          <circle key={cx} cx={cx} cy={15} r={3} fill={C.fgFaint} />
        ))}
        <rect x={70} y={7} width={320} height={16} rx={3} fill={C.bg} stroke={C.border} strokeWidth=".6" />
        {/* lock (published) / preview pill */}
        <g opacity={live}>
          <rect x={79} y={11.5} width={7} height={6} fill="none" stroke={C.lime} strokeWidth="1" />
          <path d="M80.5 11.5 V10 a2 2 0 0 1 4 0 V11.5" fill="none" stroke={C.lime} strokeWidth="1" />
        </g>
        <g opacity={t >= 8.2 ? 1 - live : 0}>
          <rect x={76} y={10} width={34} height={10} fill={C.primarySoft} />
          <text x={93} y={17.4} textAnchor="middle" fontSize="6.4" fontFamily={F_SANS} fill={C.primary}>
            превью
          </text>
        </g>
        <text x={t >= 8.2 ? (live > 0.5 ? 92 : 116) : 80} y={18.2} fontSize="8" fontFamily={F_SANS} fill={C.fgSoft}>
          {url}
        </text>
        {/* load bar (deploy) */}
        {deploy > 0 && deploy < 1 && <rect x={0} y={29} width={W * deploy} height={2} fill={C.primary} />}
        <g opacity={live}>
          <circle cx={404} cy={15} r={2.6} fill={C.lime} />
          <text x={410} y={18} fontSize="7" fontFamily={F_SANS} fill={C.fgSoft}>
            в сети
          </text>
        </g>
        <g opacity={reviewMode}>
          <rect x={398} y={8} width={54} height={14} fill={C.limeSoft} stroke={C.limeLine} strokeWidth=".6" />
          <text x={425} y={17.6} textAnchor="middle" fontSize="6.6" fontFamily={F_SANS} fill={C.fg}>
            комментарии
          </text>
        </g>
      </g>

      <g clipPath="url(#pf-win-clip)">
        {/* ===== scene A: empty project, waiting for the task ===== */}
        <g id="pf-empty" opacity={win(t, 1.0, 3.7, 0.4)}>
          <rect x={W / 2 - 60} y={176} width={120} height={1} fill={C.border} />
          <text x={W / 2} y={168} textAnchor="middle" fontSize="9" fontFamily={F_DISPLAY} fontWeight="500" letterSpacing="1.6" fill={C.muted}>
            НОВЫЙ ПРОЕКТ
          </text>
          <text x={W / 2} y={192} textAnchor="middle" fontSize="8.4" fontFamily={F_SANS} fill={C.fgFaint}>
            {t < 1.6 ? "ждёт описания задачи" : "задача получена · читаю"}
          </text>
        </g>
        {/* ===== scene B: brief ===== */}
        <g id="pf-brief" opacity={briefHead}>
          <text x={BRIEF_X} y={56} fontSize="9" fontFamily={F_DISPLAY} fontWeight="500" letterSpacing="1.6" fill={C.muted}>
            ЗАДАЧА
          </text>
          <text x={228} y={56} fontSize="9" fontFamily={F_DISPLAY} fontWeight="500" letterSpacing="1.6" fill={C.muted} opacity={flowIn(0) * (1 - morph)}>
            КАК ДОЛЖНО РАБОТАТЬ
          </text>
        </g>
        {REQS.map((r, i) => {
          const landed = t >= FLY.start + i * FLY.stagger + FLY.dur;
          if (!landed) return null;
          const rect = lerpRect({ x: BRIEF_X, y: BRIEF_Y(i), w: BRIEF_W, h: 24 }, HERO_BARS[i], briefMorph);
          const linked = P(t, 6.55 + i * 0.18, 6.9 + i * 0.18, eo);
          const labelOp = 1 - P(t, 8.2, 8.5);
          const fade = 1 - headR; // wire bar disappears when real headline arrives
          return (
            <g key={i} id={`pf-req-${i}`} opacity={fade}>
              <rect
                x={rect.x}
                y={rect.y}
                width={rect.w}
                height={rect.h}
                fill={briefMorph > 0 ? C.wire : C.limeSoft}
                stroke={briefMorph > 0.5 ? "none" : linked > 0.5 ? C.primaryLine : C.limeLine}
                strokeWidth=".7"
              />
              <g opacity={labelOp}>
                <rect x={rect.x} y={rect.y} width={2.5} height={rect.h} fill={linked > 0.5 ? C.primary : C.lime} />
                <text x={rect.x + 10} y={rect.y + 15.5} fontSize="9" fontFamily={F_SANS} fill={C.fg}>
                  {r.label}
                </text>
              </g>
            </g>
          );
        })}

        {/* workflow connectors */}
        <g opacity={1 - morph}>
          {[0, 1].map((i) => {
            const a = nodeRect(i);
            const p = P(t, 5.5 + i * 0.3, 5.95 + i * 0.3, eo);
            return (
              <g key={i}>
                <path
                  d={`M${a.x + 30} ${a.y + a.h} V${a.y + 74}`}
                  pathLength={1}
                  stroke={C.primary}
                  strokeWidth="1.3"
                  strokeDasharray="1"
                  strokeDashoffset={1 - p}
                />
                <path d={`M${a.x + 26} ${a.y + 68} L${a.x + 30} ${a.y + 73} L${a.x + 34} ${a.y + 68}`} fill="none" stroke={C.primary} strokeWidth="1.3" opacity={p > 0.95 ? 1 : 0} />
              </g>
            );
          })}
          {REQS.map((_, i) => {
            const p = P(t, 6.55 + i * 0.18, 6.9 + i * 0.18, eo);
            const y1 = BRIEF_Y(i) + 12;
            const y2 = nodeRect(i).y + 19;
            return (
              <path
                key={i}
                d={`M${BRIEF_X + BRIEF_W} ${y1} C ${BRIEF_X + BRIEF_W + 14} ${y1}, 214 ${y2}, 228 ${y2}`}
                pathLength={1}
                fill="none"
                stroke={C.primaryLine}
                strokeWidth="1"
                strokeDasharray="1"
                strokeDashoffset={1 - p}
              />
            );
          })}
        </g>

        {/* workflow nodes → (form card wire) / (pipeline chips) */}
        {NODES.map((n, i) => {
          const a = flowIn(i);
          if (a <= 0) return null;
          const target: Rect = i === 0 ? { x: CARD_X, y: CARD_Y, w: CARD_W, h: CARD_H_BEFORE } : CHIP[i];
          const r = lerpRect(nodeRect(i), target, morph);
          const labelOp = 1 - P(t, 7.15, 7.5);
          if (i === 0 && cardR >= 1) return null;
          return (
            <g key={i} id={`pf-node-${i}`} opacity={i === 0 ? a * (1 - cardR) : a * (1 - pipeIn)} transform={`translate(0, ${(1 - a) * 6})`}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={i === 0 && morph > 0 ? "none" : C.raised} stroke={i === 0 && morph > 0.3 ? C.fgFaint : C.border} strokeWidth=".8" strokeDasharray={i === 0 && morph > 0.3 ? "3 3" : undefined} />
              <g opacity={labelOp}>
                <Glyph kind={n.icon} x={r.x + 12} y={r.y + 11} color={C.primary} />
                <text x={r.x + 36} y={r.y + 17} fontSize="9.2" fontWeight="500" fontFamily={F_SANS} fill={C.fg}>
                  {n.label}
                </text>
                <text x={r.x + 36} y={r.y + 29} fontSize="7.6" fontFamily={F_SANS} fill={C.muted}>
                  {n.sub}
                </text>
              </g>
            </g>
          );
        })}

        {/* ===== scene C: site ===== */}
        {/* nav */}
        <g id="pf-site-nav">
          <g opacity={wireCommon * (1 - navR)}>
            <rect x={20} y={42} width={64} height={10} fill={C.wire} />
            {[290, 330, 372].map((x) => (
              <rect key={x} x={x} y={44} width={30} height={6} fill={C.wire} />
            ))}
          </g>
          <g opacity={navR}>
            <rect x={20} y={41} width={12} height={12} fill={C.primary} />
            <path d="M23 50 L26 44 L29 50" fill="none" stroke={C.primaryFg} strokeWidth="1.3" />
            <text x={37} y={50.5} fontSize="10.5" fontFamily={F_DISPLAY} fontWeight="600" letterSpacing="1.2" fill={C.fg}>
              ОКНА ПЛЮС
            </text>
            {["Окна", "Балконы", "Контакты"].map((l, i) => (
              <text key={l} x={[292, 326, 374][i]} y={50} fontSize="8" fontFamily={F_SANS} fill={C.muted}>
                {l}
              </text>
            ))}
          </g>
          <path d={`M0 62 H${W}`} stroke={C.border} strokeWidth=".6" opacity={navR} />
        </g>
        {/* hero copy */}
        <g id="pf-site-hero">
          <g opacity={wireCommon * (1 - eyeR)}>
            <rect x={20} y={78} width={92} height={6} fill={C.wire} />
          </g>
          <text x={20} y={84} fontSize="7.4" fontFamily={F_SANS} letterSpacing="1.4" fill={C.primary} opacity={eyeR}>
            КИШИНЁВ · ОКНА И БАЛКОНЫ
          </text>
          <g opacity={headR} transform={`translate(0, ${(1 - headR) * 4})`}>
            <text x={20} y={116} fontSize="25" fontFamily={F_DISPLAY} fontWeight="600" fill={C.fg}>
              ЗАМЕР ОКОН
            </text>
            <text x={20} y={145} fontSize="25" fontFamily={F_DISPLAY} fontWeight="600" fill={C.fg}>
              БЕСПЛАТНО
            </text>
          </g>
          <g opacity={wireCommon * (1 - subR)}>
            <rect x={20} y={172} width={160} height={8} fill={C.wire} />
          </g>
          <g opacity={subR}>
            <text x={20} y={164} fontSize="8.8" fontFamily={F_SANS} fill={C.fgSoft}>
              Оставьте телефон — менеджер перезвонит
            </text>
            <text x={20} y={177} fontSize="8.8" fontFamily={F_SANS} fill={C.fgSoft}>
              и согласует удобное время замера.
            </text>
          </g>
          <g opacity={wireCommon * (1 - pillsR)}>
            {[0, 1, 2].map((i) => (
              <rect key={i} x={20 + i * 64} y={196} width={56} height={16} fill={C.wire} />
            ))}
          </g>
          <g opacity={pillsR}>
            {["Пластиковые", "Балконы", "Двери"].map((l, i) => (
              <g key={l} transform={`translate(${20 + [0, 68, 124][i]}, 196)`}>
                <rect width={[62, 50, 40][i]} height={16} fill="none" stroke={C.border} strokeWidth=".8" />
                <text x={[31, 25, 20][i]} y={10.8} textAnchor="middle" fontSize="7.4" fontFamily={F_SANS} fill={C.fgSoft}>
                  {l}
                </text>
              </g>
            ))}
          </g>
        </g>

        {/* form card */}
        <g id="pf-site-form">
          <rect x={CARD_X} y={CARD_Y} width={CARD_W} height={cardH} fill={C.raised} stroke={C.border} strokeWidth=".8" opacity={cardR} />
          <g opacity={wireCommon * (1 - cardR)}>
            <rect x={CARD_X + 12} y={76} width={90} height={8} fill={C.wire} />
          </g>
          <text x={CARD_X + 12} y={84} fontSize="10" fontFamily={F_DISPLAY} fontWeight="500" letterSpacing="1" fill={C.fg} opacity={cardR * (1 - success)}>
            ЗАЯВКА НА ЗАМЕР
          </text>
          {FIELDS.map((_, i) => (
            <Field key={i} t={t} i={i} />
          ))}
          {/* button */}
          <g id="pf-submit" opacity={P(t, 7.9, 8.2, eo) * (1 - success)}>
            <rect x={btn.x} y={btn.y} width={btn.w} height={btn.h} fill={C.wire} opacity={1 - btnR} />
            <g opacity={btnR} transform={btnPress ? `translate(${btn.x + btn.w / 2}, ${btn.y + btn.h / 2}) scale(.96) translate(${-(btn.x + btn.w / 2)}, ${-(btn.y + btn.h / 2)})` : undefined}>
              <rect x={btn.x} y={btn.y} width={btn.w} height={btn.h} fill={sending(t) ? C.tealDeep : C.primary} />
              <text
                x={btn.x + btn.w / 2}
                y={btn.y + btn.h / 2 + 3.4}
                textAnchor="middle"
                fontSize="8.6"
                fontFamily={F_DISPLAY}
                fontWeight="500"
                letterSpacing="1.2"
                fill={sending(t) ? C.cream : C.primaryFg}
              >
                {btnLabel}
              </text>
            </g>
          </g>
          {/* success state (final) */}
          <g opacity={success} transform={`translate(0, ${(1 - success) * 6})`}>
            <circle cx={CARD_X + 30} cy={100} r={12} fill={C.primary} />
            <path d={`M${CARD_X + 24} 100 l4 4 l8 -8`} fill="none" stroke={C.primaryFg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <text x={CARD_X + 12} y={136} fontSize="15" fontFamily={F_DISPLAY} fontWeight="600" fill={C.fg}>
              СПАСИБО, ИРИНА!
            </text>
            <text x={CARD_X + 12} y={154} fontSize="8.4" fontFamily={F_SANS} fill={C.fgSoft}>
              Заявка у менеджера. Он перезвонит,
            </text>
            <text x={CARD_X + 12} y={166} fontSize="8.4" fontFamily={F_SANS} fill={C.fgSoft}>
              чтобы согласовать время замера.
            </text>
          </g>
        </g>

        {/* ===== scene D: review overlay ===== */}
        <g id="pf-review">
          {selShow > 0 && (
            <g opacity={selShow}>
              <rect
                x={selRect.x}
                y={selRect.y}
                width={selRect.w}
                height={selRect.h}
                fill="none"
                stroke={C.lime}
                strokeWidth="1.2"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={1 - selDraw}
              />
              {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([a, b], k) => (
                <rect key={k} x={selRect.x + a * selRect.w - 2.5} y={selRect.y + b * selRect.h - 2.5} width={5} height={5} fill={C.lime} opacity={selDraw} />
              ))}
            </g>
          )}
          {note > 0 && (
            <g id="pf-comment" opacity={note} transform={`translate(${L(0, 0, note)}, ${(1 - note) * 6})`}>
              <path d={`M226 ${246} H${selRect.x}`} stroke={C.lime} strokeWidth="1" strokeDasharray="2 2" opacity={selShow} />
              <rect x={20} y={226} width={206} height={44} fill={C.raised} stroke={C.limeLine} strokeWidth=".8" />
              <rect x={28} y={234} width={16} height={16} rx={8} fill={C.lime} />
              <text x={36} y={245} textAnchor="middle" fontSize="8" fontFamily={F_DISPLAY} fontWeight="600" fill={C.bg}>
                О
              </text>
              <text x={50} y={241} fontSize="7.4" fontWeight="500" fontFamily={F_SANS} fill={C.fg}>
                Олег · Окна Плюс
              </text>
              <text x={50} y={256} fontSize="8.8" fontFamily={F_SANS} fill={C.fg}>
                {noteText}
              </text>
              <g opacity={resolved}>
                <rect x={150} y={232} width={70} height={13} fill={C.limeSoft} />
                <path d="M156 238.5 l2.5 2.5 l5 -5" fill="none" stroke={C.lime} strokeWidth="1.3" strokeLinecap="round" />
                <text x={168} y={241.5} fontSize="7" fontFamily={F_SANS} fill={C.fg}>
                  исправлено
                </text>
              </g>
            </g>
          )}
        </g>

        {/* ===== pipeline strip (born from the workflow, used in test + live) ===== */}
        <g id="pf-pipeline" opacity={pipeIn}>
          <rect x={0} y={370} width={W} height={30} fill={C.bg} />
          <path d={`M0 370 H${W}`} stroke={C.border} strokeWidth=".6" />
          <text x={20} y={389} fontSize="7.4" fontFamily={F_DISPLAY} fontWeight="500" letterSpacing="1.2" fill={C.muted}>
            ПУТЬ ЗАЯВКИ
          </text>
          <path d={`M${CHIP[0].x + CHIP[0].w} 386 H${CHIP[1].x} M${CHIP[1].x + CHIP[1].w} 386 H${CHIP[2].x}`} stroke={C.border} strokeWidth="1" />
          {CHIP.map((c, i) => {
            const st = chipState(i, t);
            const col = st === "fail" ? C.danger : st === "ok" ? C.primary : C.border;
            return (
              <g key={i} id={`pf-chip-${i}`}>
                <rect x={c.x} y={c.y} width={c.w} height={c.h} fill={st === "ok" ? C.primarySoft : C.raised} stroke={col} strokeWidth=".8" />
                <Glyph kind={NODES[i].icon} x={c.x + 5} y={c.y + 3.2} s={0.6} color={st === "fail" ? C.danger : C.primary} />
                <text x={c.x + 19} y={c.y + 11} fontSize="7.4" fontFamily={F_SANS} fill={C.fg}>
                  {c.label}
                </text>
              </g>
            );
          })}
          {sig && <circle cx={sig.x} cy={sig.y} r={3.2} fill={sig.fail ? C.danger : C.primary} />}
        </g>

        {/* ===== cursors ===== */}
        <Cursor t={t} keys={DEV_KEYS} clicks={DEV_CLICKS} show={DEV_SHOW(t)} color={C.fg} />
        <Cursor t={t} keys={CLIENT_KEYS} clicks={CLIENT_CLICKS} show={win(t, 13.1, 15.4, 0.3)} tag="Олег" color={C.lime} />
        <Cursor t={t} keys={VISITOR_KEYS} clicks={VISITOR_CLICKS} show={win(t, 21.9, 24.6, 0.3)} tag="Посетитель" color={C.primary} />
      </g>
    </g>
  );
}

/** window-local center of the Telegram chip (for the hand-off line to the phone) */
export const TG_CHIP = chipC(2);
