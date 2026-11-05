// The hero curve is a sixth-degree polynomial fitted to the bright line painted
// into public/images/lab/hero.webp (within ~1px of it). Everything the orb does
// is real gradient descent on this function, computed analytically.

const COEFFICIENTS = [
  113.85355766695709, 95.3257766346672, -85.54479081917874, -248.6984195197561,
  -144.50309538000792, 207.42707517523965, 454.0591083733085,
];

export const ART = { width: 1672, height: 941 };
export const DOMAIN = { min: 490, max: 1360 };
export const REST_X = 712;

const toU = (x: number) => (x - 950) / 520;
const toX = (u: number) => 950 + 520 * u;

const height = (u: number) => COEFFICIENTS.reduce((acc, c) => acc * u + c, 0);
const slope = (u: number) => {
  const n = COEFFICIENTS.length - 1;
  return COEFFICIENTS.slice(0, n).reduce((acc, c, i) => acc * u + c * (n - i), 0);
};

// Image y grows downward, so the bottom of the basin is where height peaks.
const BASIN_U = (() => {
  let lo = 0.2;
  let hi = 0.5;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (slope(mid) > 0) lo = mid;
    else hi = mid;
  }
  return lo;
})();
const BASIN_Y = height(BASIN_U);

const LOSS_SCALE = 100;
const SETTLED_GRADIENT = 2e-3;

export const curveY = (x: number) => height(toU(x));
export const loss = (x: number) => (BASIN_Y - curveY(x)) / LOSS_SCALE;
const gradient = (u: number) => -slope(u) / LOSS_SCALE;

/** Where the orb's centre sits: on the curve, lifted along its normal. */
export function orbPosition(x: number, radius: number) {
  const m = slope(toU(x)) / 520;
  const len = Math.hypot(m, 1);
  return { x: x + (radius * m) / len, y: curveY(x) - radius / len };
}

export type Outcome = "settled" | "bouncing" | "escaped";
export type Run = { iterates: number[]; outcome: Outcome };

/** Every iterate of x_next = x - eta * dL/dx. Nothing here is clamped. */
export function descend(startX: number, eta: number, maxSteps = 60): Run {
  const iterates = [startX];
  let u = toU(startX);
  for (let i = 0; i < maxSteps; i++) {
    const g = gradient(u);
    if (Math.abs(g) < SETTLED_GRADIENT) return { iterates, outcome: "settled" };
    u -= eta * g;
    const x = toX(u);
    if (x < DOMAIN.min - 30 || x > DOMAIN.max + 30) {
      return { iterates, outcome: "escaped" };
    }
    iterates.push(x);
  }
  return { iterates, outcome: "bouncing" };
}

/** The curve as an SVG path in image coordinates. */
export const CURVE_PATH = (() => {
  const parts: string[] = [];
  for (let x = DOMAIN.min; x <= DOMAIN.max; x += 8) {
    parts.push(`${parts.length ? "L" : "M"}${x} ${curveY(x).toFixed(1)}`);
  }
  return parts.join(" ");
})();
