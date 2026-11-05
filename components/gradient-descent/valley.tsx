"use client";

import { useMemo, useState } from "react";
import {
  POINTS,
  bestFit,
  contour,
  hessian,
  loss,
  run,
  stepLimit,
  type Params,
} from "@/lib/gradient-descent/regression";

const SIZE = 420;
const WINDOW = 3.6; // width of the map in parameter units, equal on both axes
const LEVELS = [0.05, 0.2, 0.5, 1, 1.75, 2.75, 4, 5.5, 7.5, 10, 14, 20, 28, 40, 60, 90];
const SHARE_OF_LIMIT = 0.8;
const MAX_STEPS = 3000;

export function Valley() {
  const [stretch, setStretch] = useState(5);

  const data = useMemo(() => {
    const points = POINTS.map((p) => ({ x: p.x * stretch, y: p.y }));
    const best = bestFit(points)!;
    const limit = stepLimit(points);
    const eta = SHARE_OF_LIMIT * limit;
    // The same offset from the bottom every time, so only the shape of the valley changes.
    const start: Params = { m: best.m - 1.2, b: best.b + 1.3 };
    const { path } = run(points, start, eta, MAX_STEPS);
    const bottom = loss(points, best);
    const startGap = loss(points, start) - bottom;
    const close = path.findIndex((p) => loss(points, p) - bottom < startGap * 0.001);
    const h = hessian(points);
    return {
      points,
      best,
      eta,
      path,
      close,
      ratio: h.mm / h.bb,
      rings: LEVELS.map((above) => contour(points, above)),
    };
  }, [stretch]);

  const sx = (m: number) => SIZE / 2 + ((m - data.best.m) / WINDOW) * SIZE;
  const sy = (b: number) => SIZE / 2 - ((b - data.best.b) / WINDOW) * SIZE;
  const toLine = (list: Params[]) => list.map((p) => `${sx(p.m).toFixed(2)},${sy(p.b).toFixed(2)}`).join(" ");

  return (
    <figure className="gd-figure">
      <svg
        className="gd-plot gd-map"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={`gradient descent in a valley ${data.ratio.toFixed(0)} times steeper one way than the other, taking ${data.close} steps`}
      >
        <g className="gd-contours">
          {data.rings.map((ring, i) => (
            <polyline key={i} points={toLine(ring)} />
          ))}
        </g>
        <polyline className="gd-trail" points={toLine(data.path.slice(0, 400))} />
        <circle cx={sx(data.best.m)} cy={sy(data.best.b)} r={3} className="gd-point" />
      </svg>
      <figcaption>
        <label className="gd-slider">
          <span>stretch the data</span>
          <input
            type="range"
            min={1}
            max={8}
            step={0.5}
            value={stretch}
            onChange={(e) => setStretch(Number(e.target.value))}
          />
        </label>
        <div className="gd-readout">
          <p>
            <span>steeper one way by</span>
            <strong>{data.ratio.toFixed(0)}×</strong>
          </p>
          <p>
            <span>steps to reach the bottom</span>
            <strong>{data.close < 0 ? `${MAX_STEPS}+` : data.close}</strong>
          </p>
          <button
            type="button"
            className="gd-button gd-button-solid"
            disabled={stretch === 1}
            onClick={() => setStretch(1)}
          >
            rescale the data
          </button>
        </div>
        <p className="gd-note" role="status">
          {stretch === 1
            ? `same data, a rounder bowl, only ${data.close} steps. this is why people normalise their inputs`
            : "the steep walls force tiny steps, so it bounces across and crawls forward"}
        </p>
      </figcaption>
    </figure>
  );
}
