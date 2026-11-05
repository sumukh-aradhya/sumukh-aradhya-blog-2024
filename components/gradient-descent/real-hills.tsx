"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { POINTS, START, loss, noisyDescent } from "@/lib/gradient-descent/regression";
import { LossChart } from "@/components/gradient-descent/loss-chart";
import { MapFrame, mapX, mapY } from "@/components/gradient-descent/map-frame";

/* ─── Saddle: a different function, f(a, b) = (a² - 1)² + 0.4 b² ─── */

const W = 480;
const H = 320;
const A = { min: -2, max: 2 };
const B = { min: -1.333, max: 1.333 };
const sa = (a: number) => ((a - A.min) / (A.max - A.min)) * W;
const sb = (b: number) => H - ((b - B.min) / (B.max - B.min)) * H;
const f = (a: number, b: number) => (a * a - 1) ** 2 + 0.4 * b * b;
const LEVELS = [0.04, 0.12, 0.25, 0.45, 0.7, 1, 1.4, 2, 3, 4.5, 6.5];
const ETA = 0.05;

// Each contour is solved exactly: b = ±sqrt((level - (a² - 1)²) / 0.4). No sampling of the height.
function contourPaths(level: number) {
  const pieces: string[] = [];
  let upper: string[] = [];
  let lower: string[] = [];
  const flush = () => {
    if (upper.length) pieces.push(`M${[...upper, ...lower.reverse(), upper[0]].join("L")}`);
    upper = [];
    lower = [];
  };
  for (let i = 0; i <= 800; i++) {
    const a = A.min + (i / 800) * (A.max - A.min);
    const rest = level - (a * a - 1) ** 2;
    if (rest < 0) {
      flush();
      continue;
    }
    const b = Math.sqrt(rest / 0.4);
    upper.push(`${sa(a).toFixed(1)} ${sb(b).toFixed(1)}`);
    lower.push(`${sa(a).toFixed(1)} ${sb(-b).toFixed(1)}`);
  }
  flush();
  return pieces.join("");
}
const CONTOURS = LEVELS.map(contourPaths);

function descendSaddle(a0: number, b0: number) {
  const path = [{ a: a0, b: b0 }];
  for (let i = 0; i < 400; i++) {
    const { a, b } = path[i];
    const ga = 4 * a * (a * a - 1);
    const gb = 0.8 * b;
    if (Math.hypot(ga, gb) < 1e-4) break;
    path.push({ a: a - ETA * ga, b: b - ETA * gb });
  }
  return path;
}

export function SaddleHill() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [start, setStart] = useState({ a: 0, b: 1.1 });
  const [shown, setShown] = useState(0);
  const [nudges, setNudges] = useState(0);
  const path = useMemo(() => descendSaddle(start.a, start.b), [start]);
  const last = path.length - 1;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(last);
      return;
    }
    setShown(0);
    let i = 0;
    // However long the real path is, it plays in about 2.5 seconds.
    const stride = Math.max(1, Math.ceil(last / 90));
    const id = window.setInterval(() => {
      i += stride;
      setShown(Math.min(i, last));
      if (i >= last) window.clearInterval(id);
    }, 28);
    return () => window.clearInterval(id);
  }, [path, last]);

  const at = Math.min(shown, last);
  const here = path[at];
  const end = path[last];
  const stuck = Math.abs(end.a) < 1e-6;
  const done = at === last;

  return (
    <figure className="gd-figure">
      <svg
        ref={svgRef}
        className="gd-plot gd-map gd-saddle"
        data-clickable
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="a different hill, with two valleys and a saddle between them. tap to drop a ball."
        onPointerDown={(e) => {
          const rect = svgRef.current!.getBoundingClientRect();
          setStart({
            a: A.min + ((e.clientX - rect.left) / rect.width) * (A.max - A.min),
            b: B.max - ((e.clientY - rect.top) / rect.height) * (B.max - B.min),
          });
          setNudges(0);
        }}
      >
        <g className="gd-contours">
          {CONTOURS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <polyline
          className="gd-trail"
          points={path
            .slice(0, at + 1)
            .map((p) => `${sa(p.a).toFixed(1)},${sb(p.b).toFixed(1)}`)
            .join(" ")}
        />
        <circle cx={sa(0)} cy={sb(0)} r={3} className="gd-saddle-mark" />
        <text x={sa(0)} y={sb(0) + 18} textAnchor="middle" className="gd-map-text">
          saddle
        </text>
        <text x={sa(-1)} y={sb(0) + 4} textAnchor="middle" className="gd-map-text">
          valley
        </text>
        <text x={sa(1)} y={sb(0) + 4} textAnchor="middle" className="gd-map-text">
          valley
        </text>
        <circle cx={sa(here.a)} cy={sb(here.b)} r={7} className="gd-orb" />
      </svg>
      <figcaption>
        <div className="gd-readout">
          <button
            type="button"
            className="gd-button gd-button-solid"
            disabled={!stuck || !done}
            onClick={() => {
              setStart({ a: end.a + 0.001, b: end.b });
              setNudges((n) => n + 1);
            }}
          >
            nudge it by 0.001
          </button>
          <button
            type="button"
            className="gd-button"
            onClick={() => {
              setStart({ a: 0, b: 1.1 });
              setNudges(0);
            }}
          >
            drop it on the ridge
          </button>
        </div>
        <p className="gd-note" role="status">
          {!done
            ? `height ${f(here.a, here.b).toFixed(3)}`
            : stuck
              ? "stuck. the ground is flat, so it thinks it's done. but both valleys are lower"
              : nudges
                ? "a push of 0.001 was all it took"
                : "tap to drop a ball. the side it starts on decides everything"}
        </p>
      </figcaption>
    </figure>
  );
}

/* ─── Noise: back to the line, but each step only looks at some of the points ─── */

const NOISE_STEPS = 40;
const NOISE_ETA = 0.1;

export function BatchNoise() {
  const [batch, setBatch] = useState(1);
  const [seed, setSeed] = useState(1);
  const full = useMemo(() => noisyDescent(POINTS, START, NOISE_ETA, NOISE_STEPS, POINTS.length, seed), [seed]);
  const noisy = useMemo(() => noisyDescent(POINTS, START, NOISE_ETA, NOISE_STEPS, batch, seed), [batch, seed]);
  const line = (list: typeof full) => list.map((p) => `${mapX(p.m).toFixed(2)},${mapY(p.b).toFixed(2)}`).join(" ");
  const errors = noisy.map((p) => loss(POINTS, p));
  const worse = errors.filter((e, i) => i > 0 && e > errors[i - 1]).length;

  return (
    <figure className="gd-figure">
      <div className="gd-linked">
        <div>
          <p className="gd-fig-label">
            the path: <span className="gd-key-ivory">all 5 points</span> vs{" "}
            <span className="gd-key-amber">{batch} at a time</span>
          </p>
          <MapFrame points={POINTS} label="two descent paths on the same map, one smooth and one noisy">
            <polyline className="gd-trail gd-trail-ivory" points={line(full)} />
            {batch < POINTS.length && <polyline className="gd-trail" points={line(noisy)} />}
          </MapFrame>
        </div>
        <div>
          <p className="gd-fig-label">the true error at each step</p>
          <LossChart
            series={[
              { id: "full", values: full.map((p) => loss(POINTS, p)), className: "gd-chart-ivory" },
              { id: "noisy", values: errors },
            ]}
            maxSteps={NOISE_STEPS}
            log
            label={`with ${batch} points per step, the true error went up on ${worse} of ${NOISE_STEPS} steps`}
          />
          <div className="gd-chips" role="group" aria-label="points per step">
            {[1, 2, 3, 5].map((b) => (
              <button key={b} type="button" className="gd-chip" aria-pressed={batch === b} onClick={() => setBatch(b)}>
                {b} {b === 1 ? "point" : "points"} a step
              </button>
            ))}
          </div>
          <div className="gd-readout gd-readout-tight">
            <p>
              <span>seed</span>
              <strong>{seed}</strong>
            </p>
            <button type="button" className="gd-button" onClick={() => setSeed((s) => s + 1)}>
              new random run
            </button>
          </div>
          <p className="gd-note" role="status">
            {batch === POINTS.length
              ? "every step sees everything, so the error falls every time. on real data, that's far too slow"
              : `the error went up on ${worse} of ${NOISE_STEPS} steps, but each step is far cheaper. that's the deal all of deep learning takes`}
          </p>
        </div>
      </div>
    </figure>
  );
}
