export interface Slot {
  index: number;
  angle: number;
  cx: number;
  cy: number;
  /** point on the hub ring facing this slot */
  hx: number;
  hy: number;
}

export interface RevolverGeometry {
  size: number;
  center: number;
  radius: number;
  hubOuter: number;
  cardW: number;
  cardH: number;
  fontSize: number;
  centerFontSize: number;
  slots: Slot[];
}

const SLOT_COUNT = 6;

export const buildGeometry = (compact: boolean): RevolverGeometry => {
  const size = 520;
  const center = size / 2;
  const radius = compact ? 168 : 178;
  const hubOuter = compact ? 84 : 92;
  const cardW = compact ? 128 : 136;
  const cardH = compact ? 36 : 40;

  const slots: Slot[] = Array.from({ length: SLOT_COUNT }, (_, index) => {
    const angle = -90 + index * (360 / SLOT_COUNT);
    const rad = (angle * Math.PI) / 180;
    return {
      index,
      angle,
      cx: center + radius * Math.cos(rad),
      cy: center + radius * Math.sin(rad),
      hx: center + hubOuter * Math.cos(rad),
      hy: center + hubOuter * Math.sin(rad),
    };
  });

  return {
    size,
    center,
    radius,
    hubOuter,
    cardW,
    cardH,
    fontSize: compact ? 14 : 15,
    centerFontSize: compact ? 30 : 34,
    slots,
  };
};

/** slot index a given word occupies after `step` clockwise advances */
export const slotForWord = (wordIndex: number, step: number) =>
  (wordIndex + step) % SLOT_COUNT;

export const SLOTS = SLOT_COUNT;
