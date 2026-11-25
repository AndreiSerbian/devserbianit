import { tr } from "./i18n";
import { C, F_DISPLAY, F_SANS, P, L, eo, win, typed, clamp, PHONE_W, MSG1, MSG1_H, REQS, chatBottom, msg1LineY } from "./core";

/* ==========================================================================
   Phone — the business owner's Telegram. Persistent through the film:
   · 0–1.2   owner types and sends the task to the developer
   · 2.3–3.5 key phrases are marked (they then fly into the plan)
   · 12.3    developer sends the first version for review
   · 17.3    owner approves the revision
   · 20.8    test notification banner from the new bot
   · 21.9    switches to the bot chat; 24.15 the real request arrives
   ========================================================================== */

type Msg = { at: number; h: number; out: boolean; render: (w: number) => JSX.Element };

const BUBBLE_W = 150;

function DevChat({ t, h }: { t: number; h: number }) {
  const bottom = chatBottom(h);
  const msgs: Msg[] = [
    {
      at: 1.2,
      h: MSG1_H,
      out: true,
      render: () => (
        <>
          {MSG1.map((line, i) => {
            const req = REQS.find((r) => r.line === i);
            const mark = req ? P(t, req.hl, req.hl + 0.35, eo) * (1 - P(t, 7.6, 8.2)) : 0;
            return (
              <g key={i}>
                {req && <rect x={8} y={9 + i * 12} width={(BUBBLE_W - 16) * mark} height={11} fill={C.limeSoft} />}
                {req && <rect x={8} y={19 + i * 12} width={(BUBBLE_W - 16) * mark} height={1.2} fill={C.lime} />}
                <text x={9} y={18 + i * 12} fontSize="8.6" fontFamily={F_SANS} fill={C.cream}>
                  {tr(line)}
                </text>
              </g>
            );
          })}
          <text x={BUBBLE_W - 8} y={MSG1_H - 5} textAnchor="end" fontSize="6.5" fontFamily={F_SANS} fill={C.creamSoft}>
            09:12
          </text>
        </>
      ),
    },
    {
      at: 12.3,
      h: 58,
      out: false,
      render: () => (
        <>
          <text x={9} y={17} fontSize="8.6" fontFamily={F_SANS} fill={C.fg}>
            {tr("Первая версия готова,")}
          </text>
          <text x={9} y={29} fontSize="8.6" fontFamily={F_SANS} fill={C.fg}>
            {tr("посмотрите и прокомментируйте")}
          </text>
          <rect x={8} y={36} width={BUBBLE_W - 16} height={15} fill={C.primarySoft} stroke={C.primaryLine} strokeWidth=".6" />
          <text x={14} y={46.5} fontSize="7.4" fontFamily={F_SANS} fill={C.primary}>
            {tr("Открыть превью →")}
          </text>
        </>
      ),
    },
    {
      at: 17.3,
      h: 26,
      out: true,
      render: () => (
        <text x={9} y={16.5} fontSize="8.6" fontFamily={F_SANS} fill={C.cream}>
          {tr("Так гораздо лучше!")}
        </text>
      ),
    },
  ];
  return <Stack t={t} msgs={msgs} bottom={bottom} />;
}

function BotChat({ t, h }: { t: number; h: number }) {
  const bottom = chatBottom(h);
  const row = (y: number, k: string, v: string, accent = false) => (
    <>
      <text x={9} y={y} fontSize="7.2" fontFamily={F_SANS} fill={C.muted}>
        {k}
      </text>
      <text x={52} y={y} fontSize="8.2" fontWeight="500" fontFamily={F_SANS} fill={accent ? C.primary : C.fg}>
        {v}
      </text>
    </>
  );
  const msgs: Msg[] = [
    {
      at: 20.8,
      h: 40,
      out: false,
      render: () => (
        <>
          <text x={9} y={15} fontSize="7" fontFamily={F_DISPLAY} letterSpacing=".8" fill={C.muted}>
            {tr("ТЕСТОВАЯ ЗАЯВКА")}
          </text>
          {row(30, tr("Имя"), tr("Тест"))}
        </>
      ),
    },
    {
      at: 24.15,
      h: 96,
      out: false,
      render: (w) => (
        <>
          <rect width={3} height={96} fill={C.primary} />
          <text x={9} y={16} fontSize="8" fontFamily={F_DISPLAY} letterSpacing="1" fill={C.primary}>
            {tr("НОВАЯ ЗАЯВКА · ЗАМЕР")}
          </text>
          {row(32, tr("Имя"), tr("Ирина"))}
          {row(46, tr("Телефон"), "+373 69 555 210", true)}
          {row(60, tr("Сайт"), "okna-plus.md")}
          <rect x={8} y={68} width={w - 16} height={20} fill={C.primary} />
          <text x={w / 2} y={81.5} textAnchor="middle" fontSize="7.6" fontFamily={F_DISPLAY} letterSpacing="1" fill={C.primaryFg}>
            {tr("ПОЗВОНИТЬ")}
          </text>
        </>
      ),
    },
  ];
  return <Stack t={t} msgs={msgs} bottom={bottom} />;
}

/** messages pinned to the bottom; each arrival pushes older ones up */
function Stack({ t, msgs, bottom }: { t: number; msgs: Msg[]; bottom: number }) {
  const GAP = 6;
  return (
    <g>
      {msgs.map((m, i) => {
        const a = P(t, m.at, m.at + 0.45, eo);
        if (a <= 0) return null;
        let y = bottom - m.h;
        for (let j = i + 1; j < msgs.length; j++) y -= (msgs[j].h + GAP) * P(t, msgs[j].at, msgs[j].at + 0.45);
        const w = m.out ? BUBBLE_W : PHONE_W - 30;
        const x = m.out ? PHONE_W - 10 - w : 10;
        return (
          <g
            key={i}
            transform={`translate(${x}, ${y + (1 - a) * 10})`}
            opacity={a}
          >
            <rect width={w} height={m.h} fill={m.out ? C.tealDeep : C.raised} stroke={m.out ? "none" : C.border} strokeWidth=".6" />
            {m.render(w)}
          </g>
        );
      })}
    </g>
  );
}

export default function Phone({ t, x, y, h }: { t: number; x: number; y: number; h: number }) {
  const W = PHONE_W;
  const appear = P(t, 0, 0.6, eo);
  const sw = P(t, 21.9, 22.5); // dev chat → bot chat
  const composing = t >= 0.35 && t < 1.2;
  const draft = typed(tr(MSG1[0]) + " " + tr(MSG1[1]), t, 0.35, 1.1);
  const banner = win(t, 20.85, 21.75, 0.3);
  const header = (name: string, sub: string, initial: string, bot = false) => (
    <>
      <rect x={12} y={12} width={22} height={22} rx={11} fill={bot ? C.primary : C.tealDeep} />
      <text x={23} y={26.5} textAnchor="middle" fontSize="9.5" fontFamily={F_DISPLAY} fontWeight="600" fill={bot ? C.primaryFg : C.cream}>
        {initial}
      </text>
      <text x={42} y={21} fontSize="8.8" fontWeight="500" fontFamily={F_SANS} fill={C.fg}>
        {name}
      </text>
      <text x={42} y={32} fontSize="7" fontFamily={F_SANS} fill={C.muted}>
        {sub}
      </text>
    </>
  );
  return (
    <g id="pf-phone" transform={`translate(${x}, ${y + (1 - appear) * 12})`} opacity={appear}>
      <defs>
        <clipPath id="pf-phone-screen">
          <rect x={4} y={4} width={W - 8} height={h - 8} rx={16} />
        </clipPath>
      </defs>
      <rect width={W} height={h} rx={20} fill={C.card} stroke={C.fgFaint} strokeWidth="1" />
      <g clipPath="url(#pf-phone-screen)">
        <rect x={4} y={4} width={W - 8} height={h - 8} fill={C.bg} />
        {/* chats slide horizontally */}
        <g id="pf-chat-dev" transform={`translate(${-W * sw}, 0)`} opacity={1 - sw * 0.6}>
          {header(tr("Андрей"), sub(t), tr("А"))}
          <DevChat t={t} h={h} />
        </g>
        <g id="pf-chat-bot" transform={`translate(${W * (1 - sw)}, 0)`}>
          {header(tr("Заявки · Окна Плюс"), tr("бот"), tr("З"), true)}
          <BotChat t={t} h={h} />
        </g>
        <path d={`M4 40 H${W - 4}`} stroke={C.border} strokeWidth=".6" />
        {/* compose bar */}
        <rect x={10} y={h - 36} width={W - 44} height={24} rx={12} fill={C.raised} stroke={composing ? C.primaryLine : C.border} strokeWidth=".6" />
        <text x={20} y={h - 21} fontSize="7.6" fontFamily={F_SANS} fill={composing ? C.fg : C.muted}>
          {composing ? (draft.length > 26 ? "…" + draft.slice(-25) : draft) : tr("Сообщение")}
        </text>
        <circle cx={W - 22} cy={h - 24} r={11} fill={composing ? C.primary : C.raised} stroke={C.border} strokeWidth=".6" />
        <path
          d={`M${W - 27} ${h - 24.5} L${W - 16} ${h - 29} L${W - 19.5} ${h - 18.5} L${W - 21.5} ${h - 22.5} Z`}
          fill={composing ? C.primaryFg : C.muted}
        />
        {/* test notification banner */}
        <g id="pf-banner" transform={`translate(8, ${L(-46, 8, banner)})`} opacity={clamp(banner * 1.4)}>
          <rect width={W - 16} height={38} rx={8} fill={C.raised} stroke={C.border} strokeWidth=".6" />
          <rect x={8} y={9} width={20} height={20} rx={5} fill={C.primary} />
          <path d="M12.5 19 L23.5 14.5 L20.5 24.5 L18.5 20.5 Z" fill={C.primaryFg} />
          <text x={34} y={17} fontSize="7.6" fontWeight="500" fontFamily={F_SANS} fill={C.fg}>
            {tr("Заявки · Окна Плюс")}
          </text>
          <text x={34} y={28} fontSize="7" fontFamily={F_SANS} fill={C.muted}>
            {tr("Тестовая заявка с сайта")}
          </text>
        </g>
      </g>
    </g>
  );
}

function sub(t: number) {
  if ((t > 11.6 && t < 12.3) || (t > 0.2 && t < 0.35)) return tr("печатает…");
  return tr("разработчик");
}

/** layout-space position of MSG1 line i (used by the requirement fliers) */
export function msg1LinePos(px: number, py: number, h: number, i: number) {
  return { x: px + PHONE_W - 10 - BUBBLE_W + 8, y: py + chatBottom(h) - MSG1_H + 9 + i * 12 };
}
