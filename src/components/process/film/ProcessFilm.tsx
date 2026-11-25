import { tr } from "./i18n";
import { C, F_SANS, P, L, eio, eo, clamp, LAYOUTS, MSG1, REQS, FLY, BRIEF_X, BRIEF_Y, BRIEF_W, PHONE_W } from "./core";
import Window, { TG_CHIP } from "./Window";
import Phone, { msg1LinePos } from "./Phone";

/* ==========================================================================
   ProcessFilm — the single SVG stage. Pure render of time `t`.
   Layers: grid → window → phone → cross-object motion (fliers, hand-offs).
   ========================================================================== */

type Props = { t: number; layout: "wide" | "stack" };

export default function ProcessFilm({ t, layout }: Props) {
  const Lo = LAYOUTS[layout];
  const wx = Lo.win.x;
  const wy = Lo.win.y;
  const ph = Lo.phone;

  return (
    <svg
      id="pf-stage"
      viewBox={`0 0 ${Lo.vbW} ${Lo.vbH}`}
      className="block h-auto w-full select-none"
      role="img"
      aria-labelledby="pf-title pf-desc"
    >
      <title id="pf-title">{tr("Как задача клиента превращается в работающий сайт")}</title>
      <desc id="pf-desc">{tr("DESC") === "DESC" ? DESC_RU : tr("DESC")}</desc>
      <defs>
        <pattern id="pf-grid" width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M26 0H0V26" fill="none" stroke={C.border} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width={Lo.vbW} height={Lo.vbH} fill="url(#pf-grid)" opacity={0.35} />

      <Window t={t} x={wx} y={wy} />
      <Phone t={t} x={ph.x} y={ph.y} h={ph.h} />

      {/* ---- requirement fliers: phrase in the message → item in the brief ---- */}
      <g id="pf-fliers">
        {REQS.map((r, i) => {
          const a = FLY.start + i * FLY.stagger;
          const p = P(t, a, a + FLY.dur);
          if (t < a || t >= a + FLY.dur) return null;
          const from = msg1LinePos(ph.x, ph.y, ph.h, r.line);
          const to = { x: wx + BRIEF_X, y: wy + BRIEF_Y(i) };
          const arc = Math.sin(p * Math.PI);
          const lift = layout === "wide" ? arc * -40 : 0;
          const x = L(from.x, to.x, p) + (layout === "wide" ? 0 : arc * -60);
          const y = L(from.y, to.y, p) + lift;
          const w = L(134, BRIEF_W, p);
          const h = L(12, 24, p);
          const label = p < 0.45 ? tr(MSG1[r.line]) : tr(r.label);
          return (
            <g key={i} transform={`translate(${x}, ${y})`}>
              <rect width={w} height={h} fill={C.limeSoft} stroke={C.limeLine} strokeWidth=".7" />
              <text x={L(1, 10, p)} y={L(9, 15.5, p)} fontSize={L(8.6, 9, p)} fontFamily={F_SANS} fill={C.fg} opacity={Math.abs(p - 0.45) < 0.08 ? 0.3 : 1}>
                {label}
              </text>
            </g>
          );
        })}
      </g>

      {/* ---- hand-off: Telegram step of the pipeline → the phone ---- */}
      {[{ a: 20.55, b: 20.95 }, { a: 23.9, b: 24.25 }].map(({ a, b }, k) => {
        if (t < a || t > b + 0.3) return null;
        const p = P(t, a, b);
        const fade = 1 - P(t, b, b + 0.3, eo);
        const sx = wx + TG_CHIP.x;
        const sy = wy + TG_CHIP.y;
        const ex = ph.x + PHONE_W / 2;
        const ey = ph.y + (layout === "wide" ? 24 : 6);
        const cx = layout === "wide" ? sx + 30 : sx;
        const cy = layout === "wide" ? sy : ey - 6;
        const d = `M${sx} ${sy} Q ${cx + (ex - cx) * 0.6} ${layout === "wide" ? sy : sy + 30}, ${ex} ${ey}`;
        const q = (u: number) => {
          const qx = (1 - u) * (1 - u) * sx + 2 * (1 - u) * u * (cx + (ex - cx) * 0.6) + u * u * ex;
          const qy = (1 - u) * (1 - u) * sy + 2 * (1 - u) * u * (layout === "wide" ? sy : sy + 30) + u * u * ey;
          return { qx, qy };
        };
        const dot = q(clamp(p));
        return (
          <g key={k} opacity={fade}>
            <path d={d} pathLength={1} fill="none" stroke={C.primaryLine} strokeWidth="1" strokeDasharray="1" strokeDashoffset={1 - p} />
            <circle cx={dot.qx} cy={dot.qy} r={3.2} fill={C.primary} />
          </g>
        );
      })}
    </svg>
  );
}

const DESC_RU = ("Владелец оконной компании пишет разработчику, что заявки теряются. Ключевые фразы превращаются в требования и схему: форма, проверка, Telegram. Схема становится сайтом. Клиент просит сократить форму — лишние поля исчезают, кнопка поднимается. Разработчик проверяет ошибки и тестовую отправку, публикует сайт. Посетитель оставляет заявку, и она сразу приходит менеджеру в Telegram.");
