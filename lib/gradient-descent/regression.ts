// The maths behind Study 001: a straight line fitted by mean squared error.
// Pure functions only. Nothing in here knows about React, pixels or animation,
// and every number the study displays comes from here.

export type Point = { x: number; y: number };
export type Params = { m: number; b: number };
export type Vec = [number, number];

export const POINTS: Point[] = [
  { x: -2, y: -1.5 },
  { x: -1, y: -0.25 },
  { x: 0, y: 0.7 },
  { x: 1, y: 1.1 },
  { x: 2, y: 2.9 },
];
export const START: Params = { m: -0.6, b: 0.3 };

export const predict = (t: Params, x: number) => t.m * x + t.b;

/** Mean squared error: the height of the ground at this line. */
export function loss(points: Point[], t: Params) {
  return points.reduce((sum, p) => sum + (predict(t, p.x) - p.y) ** 2, 0) / points.length;
}

/** How the error changes with m and b. Always analytic, never estimated. */
export function gradient(points: Point[], t: Params): Params {
  const n = points.length;
  return points.reduce(
    (g, p) => {
      const r = predict(t, p.x) - p.y;
      return { m: g.m + (2 / n) * r * p.x, b: g.b + (2 / n) * r };
    },
    { m: 0, b: 0 },
  );
}

/** Each point's own share of the gradient. They sum to exactly gradient(). */
export function contributions(points: Point[], t: Params): Params[] {
  const n = points.length;
  return points.map((p) => {
    const r = predict(t, p.x) - p.y;
    return { m: (2 / n) * r * p.x, b: (2 / n) * r };
  });
}

/** The largest step size that doesn't blow up: 2 over the steepest curvature. */
export function stepLimit(points: Point[]) {
  const h = hessian(points);
  const mean = (h.mm + h.bb) / 2;
  const spread = Math.hypot((h.mm - h.bb) / 2, h.mb);
  return 2 / (mean + spread);
}

/** The gradient on a sample of the points, which is what training really uses. */
export function batchGradient(points: Point[], t: Params, batch: number[]): Params {
  const sample = batch.map((i) => points[i]);
  return gradient(sample, t);
}

/** Deterministic random numbers: the same seed always gives the same run. */
export function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Full-batch or mini-batch descent from a seed. Samples without replacement. */
export function noisyDescent(
  points: Point[],
  from: Params,
  eta: number,
  steps: number,
  batchSize: number,
  seed: number,
): Params[] {
  const random = seededRandom(seed);
  const path = [from];
  for (let i = 0; i < steps; i++) {
    const pool = points.map((_, index) => index);
    for (let j = pool.length - 1; j > 0; j--) {
      const k = Math.floor(random() * (j + 1));
      [pool[j], pool[k]] = [pool[k], pool[j]];
    }
    const g = batchGradient(points, path[i], pool.slice(0, batchSize));
    path.push({ m: path[i].m - eta * g.m, b: path[i].b - eta * g.b });
  }
  return path;
}

export type Outcome = "settled" | "running" | "bouncing" | "blew up";

/** A descent that stops honestly: when it settles, or when the numbers blow up. */
export function run(points: Point[], from: Params, eta: number, maxSteps: number) {
  const path = [from];
  let outcome: Outcome = "running";
  for (let i = 0; i < maxSteps; i++) {
    const here = path[path.length - 1];
    const g = gradient(points, here);
    if (Math.hypot(g.m, g.b) < 1e-3) {
      outcome = "settled";
      break;
    }
    const next = { m: here.m - eta * g.m, b: here.b - eta * g.b };
    path.push(next);
    if (!Number.isFinite(next.m) || Math.hypot(next.m, next.b) > 1e4) {
      outcome = "blew up";
      break;
    }
  }
  return { path, outcome };
}

/** One gradient descent update. */
export function step(points: Point[], t: Params, eta: number): Params {
  const g = gradient(points, t);
  return { m: t.m - eta * g.m, b: t.b - eta * g.b };
}

export function descend(points: Point[], from: Params, eta: number, steps: number): Params[] {
  const path = [from];
  for (let i = 0; i < steps; i++) path.push(step(points, path[i], eta));
  return path;
}

/** The exact bottom of the bowl, or null when every x is the same and no unique bottom exists. */
export function bestFit(points: Point[]): Params | null {
  const n = points.length;
  const sx = points.reduce((s, p) => s + p.x, 0);
  const sy = points.reduce((s, p) => s + p.y, 0);
  const sxx = points.reduce((s, p) => s + p.x * p.x, 0);
  const sxy = points.reduce((s, p) => s + p.x * p.y, 0);
  const d = n * sxx - sx * sx;
  if (Math.abs(d) < 1e-12) return null;
  const m = (n * sxy - sx * sy) / d;
  return { m, b: (sy - m * sx) / n };
}

/** The curvature of the bowl: [[mm, mb], [mb, bb]]. */
export function hessian(points: Point[]) {
  const n = points.length;
  const sx = points.reduce((s, p) => s + p.x, 0);
  const sxx = points.reduce((s, p) => s + p.x * p.x, 0);
  return { mm: (2 / n) * sxx, mb: (2 / n) * sx, bb: 2 };
}

/**
 * The exact contour of the bowl at `above` over its minimum, as points in (m, b).
 * The error is a quadratic, so each contour is a true ellipse: no sampling involved.
 */
export function contour(points: Point[], above: number, segments = 72): Params[] {
  const c = bestFit(points);
  if (!c) return [];
  const h = hessian(points);
  const angle = 0.5 * Math.atan2(2 * h.mb, h.mm - h.bb);
  const mean = (h.mm + h.bb) / 2;
  const spread = Math.hypot((h.mm - h.bb) / 2, h.mb);
  const r1 = Math.sqrt((2 * above) / (mean + spread));
  const r2 = Math.sqrt((2 * above) / (mean - spread));
  const ring: Params[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const u = r1 * Math.cos(a);
    const v = r2 * Math.sin(a);
    // Rounded for drawing: trig can differ in the last digit between server and
    // browser, which would break hydration. Far below anything visible.
    ring.push({
      m: Math.round((c.m + u * Math.cos(angle) - v * Math.sin(angle)) * 1e4) / 1e4,
      b: Math.round((c.b + u * Math.sin(angle) + v * Math.cos(angle)) * 1e4) / 1e4,
    });
  }
  return ring;
}
