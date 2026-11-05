// The maths behind the control room: one made-up hill, real optimisers.
// The hill has a deep valley on the left and a shallow one on the right.

import { seededRandom } from "@/lib/gradient-descent/regression";

export const DOMAIN = { min: -4, max: 4 };
const ESCAPE = 7;

export const height = (x: number) =>
  0.035 * (x * x - 6) ** 2 + 0.25 * x + 0.06 * Math.sin(3.2 * x) + 1;
export const slope = (x: number) => 0.14 * x * (x * x - 6) + 0.25 + 0.192 * Math.cos(3.2 * x);

function lowest(from: number, to: number) {
  let best = from;
  for (let x = from; x <= to; x += 0.001) if (height(x) < height(best)) best = x;
  return best;
}
export const DEEP = lowest(-4, 0);
export const SHALLOW = lowest(0, 4);

export type Optimizer = "descent" | "momentum" | "nesterov" | "rmsprop" | "adam";
export type Schedule = "constant" | "step" | "exponential" | "cosine";

export type Settings = {
  optimizer: Optimizer;
  learningRate: number;
  /** Momentum for momentum and nesterov, beta1 for adam. */
  momentum: number;
  /** How long rmsprop and adam remember past gradient sizes (beta2). */
  memory: number;
  /** null means the full dataset, so no noise at all. */
  batchSize: number | null;
  schedule: Schedule;
  weightDecay: number;
  /** null means no clipping. */
  clip: number | null;
  steps: number;
  seed: number;
};

export const DEFAULTS: Settings = {
  optimizer: "descent",
  learningRate: 0.05,
  momentum: 0.9,
  memory: 0.999,
  batchSize: null,
  schedule: "constant",
  weightDecay: 0,
  clip: null,
  steps: 160,
  seed: 7,
};

// A small batch estimates the true slope with error that shrinks like 1 / sqrt(batch).
const NOISE_AT_BATCH_1 = 2.4;
const EPSILON = 1e-8;

export function rateAt(s: Settings, t: number) {
  switch (s.schedule) {
    case "constant":
      return s.learningRate;
    case "step":
      return s.learningRate * 0.5 ** Math.floor(t / 40);
    case "exponential":
      return s.learningRate * 0.98 ** t;
    case "cosine":
      return s.learningRate * 0.5 * (1 + Math.cos((Math.PI * t) / s.steps));
  }
}

export type Ending = "deep valley" | "shallow valley" | "still moving" | "flew off" | "barely moved";

export type Run = {
  xs: number[];
  heights: number[];
  ending: Ending;
  /** The step from which it stayed put, or null if it never did. */
  settledAt: number | null;
};

export function simulate(start: number, s: Settings): Run {
  const random = seededRandom(s.seed);
  const gaussian = () => {
    const u = Math.max(random(), 1e-12);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
  };
  const noise = s.batchSize === null ? 0 : NOISE_AT_BATCH_1 / Math.sqrt(s.batchSize);

  const xs = [start];
  let x = start;
  let velocity = 0;
  let squares = 0;
  let escaped = false;

  for (let t = 0; t < s.steps; t++) {
    const rate = rateAt(s, t);
    const lookahead = s.optimizer === "nesterov" ? x - rate * s.momentum * velocity : x;
    let g = slope(lookahead) + noise * gaussian() + s.weightDecay * lookahead;
    if (s.clip !== null) g = Math.max(-s.clip, Math.min(s.clip, g));

    switch (s.optimizer) {
      case "descent":
        x -= rate * g;
        break;
      case "momentum":
      case "nesterov":
        velocity = s.momentum * velocity + g;
        x -= rate * velocity;
        break;
      case "rmsprop":
        squares = s.memory * squares + (1 - s.memory) * g * g;
        x -= (rate * g) / (Math.sqrt(squares) + EPSILON);
        break;
      case "adam": {
        velocity = s.momentum * velocity + (1 - s.momentum) * g;
        squares = s.memory * squares + (1 - s.memory) * g * g;
        const v = velocity / (1 - s.momentum ** (t + 1));
        const q = squares / (1 - s.memory ** (t + 1));
        x -= (rate * v) / (Math.sqrt(q) + EPSILON);
        break;
      }
    }
    xs.push(x);
    if (!Number.isFinite(x) || Math.abs(x) > ESCAPE) {
      escaped = true;
      break;
    }
  }

  const heights = xs.map((v) => height(v));
  const last = xs[xs.length - 1];
  let settledAt: number | null = null;
  if (!escaped) {
    let i = xs.length - 1;
    while (i > 0 && Math.abs(xs[i - 1] - last) < 0.03) i--;
    // Standing still only counts if the ground is flat there too. Otherwise it's just slow.
    const flat = Math.abs(slope(last) + s.weightDecay * last) < 0.05 || s.batchSize !== null;
    if (i < xs.length - 8 && flat) settledAt = i;
  }

  let ending: Ending;
  if (escaped) ending = "flew off";
  else if (settledAt === null && Math.abs(last - start) < 1) ending = "barely moved";
  else if (settledAt === null) ending = "still moving";
  else ending = last < 0 ? "deep valley" : "shallow valley";

  return { xs, heights, ending, settledAt };
}

export const OPTIMIZERS: { id: Optimizer; label: string }[] = [
  { id: "descent", label: "plain" },
  { id: "momentum", label: "momentum" },
  { id: "nesterov", label: "nesterov" },
  { id: "rmsprop", label: "rmsprop" },
  { id: "adam", label: "adam" },
];

export const START = 3.8;

// Every claim here was simulated from START before it was written down.
export const PRESETS: { id: string; label: string; claim: string; settings: Partial<Settings> }[] = [
  {
    id: "right",
    label: "steady",
    claim: "calm and reliable, and it stops at the first bottom it meets",
    settings: { learningRate: 0.05 },
  },
  {
    id: "timid",
    label: "too timid",
    claim: "every step is correct and almost nothing happens",
    settings: { learningRate: 0.001 },
  },
  {
    id: "big",
    label: "too big",
    claim: "each overshoot lands on a steeper slope, which makes the next step bigger",
    settings: { learningRate: 1.6 },
  },
  {
    id: "rolls",
    label: "momentum",
    claim: "same step size as steady, but speed carries it over the hump",
    settings: { optimizer: "momentum", learningRate: 0.05, momentum: 0.9, steps: 300 },
  },
  {
    id: "noise",
    label: "small batch",
    claim: "noise shakes it out of the shallow valley. other seeds stay behind",
    settings: { learningRate: 0.3, batchSize: 1, schedule: "cosine", steps: 400, seed: 11 },
  },
  {
    id: "adam",
    label: "adam",
    claim: "steps grow and shrink to suit the slope, but it still takes the nearest valley",
    settings: { optimizer: "adam", learningRate: 0.1, momentum: 0.9, memory: 0.999, steps: 300 },
  },
  {
    id: "clip",
    label: "clipping",
    claim: "the same huge rate that flew off now survives",
    settings: { learningRate: 1.6, clip: 0.5, schedule: "cosine" },
  },
  {
    id: "decay",
    label: "weight decay",
    claim: "the pull toward zero balances the slope, so the bottom has moved",
    settings: { learningRate: 0.05, weightDecay: 0.6, steps: 200 },
  },
];
