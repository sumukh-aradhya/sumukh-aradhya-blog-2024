"use client";

import { useMemo, useRef, useState } from "react";
import { START, contour, predict, type Params, type Point } from "@/lib/gradient-descent/regression";
import { LinePlot } from "@/components/gradient-descent/line-plot";
import { LIMITS, useStudy } from "@/components/gradient-descent/study-state";

const SIZE = 420;
const SCALE = SIZE / (LIMITS.m.max - LIMITS.m.min);
const CENTER = { m: (LIMITS.m.max + LIMITS.m.min) / 2, b: (LIMITS.b.max + LIMITS.b.min) / 2 };
const LEVELS = [0.15, 0.5, 1, 1.75, 2.75, 4, 5.5, 7.5, 10];
const SPOKES = Array.from({ length: 24 }, (_, i) => i);
const M_TICKS = [-1, 0, 1, 2, 3];
const B_TICKS = [-1, 0, 1, 2, 3];
const HEIGHT_SCALE = 15; // pixels of height per unit of error, in the side view

const smooth = (t: number) => t * t * (3 - 2 * t);

// Says something true about the line you have right now, computed from it.
function worstPoint(points: Point[], t: Params) {
  const misses = points.map((p, i) => ({ i, miss: Math.abs(predict(t, p.x) - p.y) }));
  const worst = misses.reduce((a, c) => (c.miss > a.miss ? c : a));
  const total = misses.reduce((sum, c) => sum + c.miss ** 2, 0);
  return `the worst point is off by ${worst.miss.toFixed(1)}, and its square is ${Math.round((worst.miss ** 2 / total) * 100)}% of the error`;
}

// One projection for every view. At tilt 1 it is exactly the flat contour map,
// so the bowl and the map are provably the same object.
function projector(tilt: number, bottomError: number, center: Params) {
  const t = smooth(tilt);
  const yaw = 0.62 * (1 - t);
  const pitch = 0.5 + (Math.PI / 2 - 0.5) * t;
  const lift = 100 * (1 - t);
  // Pulled back a little from the side, so the whole bowl fits in the frame.
  const zoom = 0.94 + 0.06 * t;
  const rounded = (v: number) => Math.round(v * 100) / 100;
  const pivot = { m: CENTER.m + (center.m - CENTER.m) * (1 - t), b: CENTER.b + (center.b - CENTER.b) * (1 - t) };
  return (p: Params, error: number) => {
    const u = (p.m - pivot.m) * SCALE;
    const v = (p.b - pivot.b) * SCALE;
    const ru = u * Math.cos(yaw) - v * Math.sin(yaw);
    const rv = u * Math.sin(yaw) + v * Math.cos(yaw);
    return {
      x: rounded(SIZE / 2 + ru * zoom),
      y: rounded(
        SIZE / 2 +
          lift +
          zoom * (-rv * Math.sin(pitch) - (error - bottomError) * HEIGHT_SCALE * Math.cos(pitch)),
      ),
    };
  };
}

export function Landscape() {
  const { points, theta, setTheta, glideTo, error, moved, best, bestError, atBest } = useStudy();
  const svgRef = useRef<SVGSVGElement>(null);
  const [tilt, setTilt] = useState(0);
  const [touched, setTouched] = useState(false);
  const frame = useRef(0);

  const rings = useMemo(() => LEVELS.map((above) => contour(points, above)), [points]);

  const flat = tilt >= 0.995;
  const project = projector(tilt, bestError, best);
  const marker = project(theta, error);
  const bottom = project(best, bestError);
  const trace = (ring: Params[], above: number) =>
    ring
      .map((p) => {
        const q = project(p, bestError + above);
        return `${q.x},${q.y}`;
      })
      .join(" ");

  const flatten = (then?: () => void) => {
    cancelAnimationFrame(frame.current);
    if (flat || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTilt(1);
      then?.();
      return;
    }
    const from = tilt;
    const began = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - began) / 900);
      setTilt(from + (1 - from) * p);
      if (p < 1) frame.current = requestAnimationFrame(tick);
      else then?.();
    };
    frame.current = requestAnimationFrame(tick);
  };

  const fromPointer = (clientX: number, clientY: number): Params => {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      m: CENTER.m + (((clientX - rect.left) / rect.width) * SIZE - SIZE / 2) / SCALE,
      b: CENTER.b - (((clientY - rect.top) / rect.height) * SIZE - SIZE / 2) / SCALE,
    };
  };

  return (
    <figure className="gd-figure gd-figure-wide">
      <div className="gd-linked">
        <div>
          <p className="gd-fig-label">the line. drag its 2 handles</p>
          <LinePlot squares label="the data, the current line, and a square for how far each point is from it. it moves when you move the dot on the hill." />
        </div>
        <div>
          <p className="gd-fig-label">the same line, as a spot on the hill. drag the dot</p>
          <svg
            ref={svgRef}
            className="gd-plot gd-map"
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            data-flat={flat}
            role="group"
            aria-label="the error of every possible line, as a landscape"
          >
            <g className="gd-spokes" style={{ opacity: 0.5 * (1 - smooth(tilt)) }}>
              {SPOKES.map((i) => (
                <polyline
                  key={i}
                  points={LEVELS.map((above, l) => {
                    const q = project(rings[l][i * 3], bestError + above);
                    return `${q.x},${q.y}`;
                  }).join(" ")}
                />
              ))}
            </g>
            <g className="gd-contours">
              {rings.map((ring, i) => (
                <polyline key={i} points={trace(ring, LEVELS[i])} />
              ))}
            </g>

            <g className="gd-axes" style={{ opacity: smooth(tilt) }} aria-hidden>
              {M_TICKS.map((t) => {
                const x = SIZE / 2 + (t - CENTER.m) * SCALE;
                return (
                  <g key={t}>
                    <line x1={x} y1={SIZE - 6} x2={x} y2={SIZE} />
                    <text x={x} y={SIZE - 11} textAnchor="middle">
                      {t}
                    </text>
                  </g>
                );
              })}
              {B_TICKS.map((t) => {
                const y = SIZE / 2 - (t - CENTER.b) * SCALE;
                return (
                  <g key={t}>
                    <line x1={0} y1={y} x2={6} y2={y} />
                    <text x={11} y={y + 3}>
                      {t}
                    </text>
                  </g>
                );
              })}
              <text x={SIZE - 8} y={SIZE - 24} textAnchor="end">
                m, the tilt →
              </text>
              <text x={11} y={14}>
                ↑ b, the height
              </text>
            </g>

            {atBest && <circle cx={bottom.x} cy={bottom.y} r={14} className="gd-best-ring" />}

            <g
              className="gd-marker"
              role="slider"
              tabIndex={0}
              aria-label="your line on the map. left and right change its tilt, up and down change its height."
              aria-valuemin={LIMITS.m.min}
              aria-valuemax={LIMITS.m.max}
              aria-valuenow={Number(theta.m.toFixed(2))}
              aria-valuetext={`tilt ${theta.m.toFixed(2)}, height ${theta.b.toFixed(2)}, error ${error.toFixed(2)}`}
              onPointerDown={(e) => {
                setTouched(true);
                e.currentTarget.setPointerCapture(e.pointerId);
                if (!flat) flatten();
              }}
              onPointerMove={(e) => {
                if (flat && e.currentTarget.hasPointerCapture(e.pointerId)) {
                  setTheta(fromPointer(e.clientX, e.clientY));
                }
              }}
              onKeyDown={(e) => {
                const moves: Record<string, Params> = {
                  ArrowLeft: { m: -0.05, b: 0 },
                  ArrowRight: { m: 0.05, b: 0 },
                  ArrowUp: { m: 0, b: 0.05 },
                  ArrowDown: { m: 0, b: -0.05 },
                };
                if (!moves[e.key]) return;
                e.preventDefault();
                setTouched(true);
                setTheta({ m: theta.m + moves[e.key].m, b: theta.b + moves[e.key].b });
              }}
            >
              <circle cx={marker.x} cy={marker.y} r={26} className="gd-hit" />
              <circle cx={marker.x} cy={marker.y} r={8} className="gd-orb" />
            </g>
          </svg>

          <label className="gd-tilt-control">
            <span>from the side</span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(tilt * 100)}
              aria-label="tilt your view of the hill"
              onChange={(e) => {
                cancelAnimationFrame(frame.current);
                setTilt(Number(e.target.value) / 100);
              }}
            />
            <span>from above</span>
          </label>
        </div>
      </div>

      <figcaption>
        <div className="gd-readout">
          <p>
            <span>tilt</span>
            <strong>{theta.m.toFixed(2)}</strong>
          </p>
          <p>
            <span>height</span>
            <strong>{theta.b.toFixed(2)}</strong>
          </p>
          <p>
            <span>error</span>
            <strong>{error.toFixed(2)}</strong>
          </p>
          <button
            type="button"
            className="gd-button"
            disabled={atBest}
            onClick={() => flatten(() => glideTo(best))}
          >
            show me the bottom
          </button>
          <button type="button" className="gd-button" disabled={!moved} onClick={() => glideTo(START)}>
            start over
          </button>
        </div>
        <p className="gd-note" role="status">
          {atBest
            ? `the bottom: error ${bestError.toFixed(3)}. the best line there is, and it still misses, because these points don't sit on a line`
            : error - bestError < 0.03
              ? "that's about as good as a straight line gets here"
              : flat && !moved && !touched
                ? "each ring is a set of lines that are all equally wrong. now drag the dot"
                : moved
                  ? worstPoint(points, theta)
                  : "this is the hill you were standing on. slide to look down from above"}
        </p>
      </figcaption>
    </figure>
  );
}
