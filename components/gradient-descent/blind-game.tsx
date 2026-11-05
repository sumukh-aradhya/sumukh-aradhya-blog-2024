"use client";

import { useEffect, useRef, useState } from "react";
import { useDeck } from "@/components/gradient-descent/deck";
import { useStudy } from "@/components/gradient-descent/study-state";
import {
  POINTS,
  START,
  bestFit,
  contour,
  descend,
  gradient,
  loss,
  type Params,
} from "@/lib/gradient-descent/regression";

const ALLOWED_STEPS = 6;
// The drift is drawn at exactly one descent step, so where it fades is the algorithm's next move.
const ETA = 0.2;
const best = bestFit(POINTS)!;
const bottomError = loss(POINTS, best);
const RINGS = [0.15, 0.5, 1, 1.75, 2.75, 4, 5.5, 7.5, 10, 13, 17, 22, 28, 35, 44, 55, 70, 90].map(
  (above) => contour(POINTS, above, 240),
);
const ringPath = (ring: Params[]) => ring.map((p) => `${p.m},${-p.b}`).join(" ");

type View = { x: number; y: number; w: number; h: number; px: number };

// Same scale on both axes, always: otherwise "downhill" would point the wrong way on screen.
function fit(width: number, height: number): View {
  const aspect = width / height;
  let h = 6;
  let w = h * aspect;
  if (w < 5.6) {
    w = 5.6;
    h = w / aspect;
  }
  const centerM = aspect > 1.2 ? -0.9 : 0.2;
  return { x: centerM - w / 2, y: -(0.45 + h * 0.6), w, h, px: width / w };
}

export function BlindGame() {
  const { go } = useDeck();
  const { saveGame } = useStudy();
  const fieldRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>(() => fit(1440, 900));
  const [path, setPath] = useState<Params[]>([START]);
  const [aim, setAim] = useState<Params | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [shown, setShown] = useState(0);

  const here = path[path.length - 1];
  const stepsTaken = path.length - 1;
  const height = loss(POINTS, here);
  const g = gradient(POINTS, here);
  const tip = { m: here.m - ETA * g.m, b: here.b - ETA * g.b };

  const comparedSteps = stepsTaken || ALLOWED_STEPS;
  const algorithm = descend(POINTS, START, ETA, comparedSteps);
  const algorithmHeight = loss(POINTS, algorithm[comparedSteps]);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height: h } = entry.contentRect;
      if (width && h) setView(fit(width, h));
    });
    observer.observe(field);
    return () => observer.disconnect();
  }, []);

  // The steps run out, or you find the bottom: either way, the lights come on.
  useEffect(() => {
    if (revealed) return;
    const done = stepsTaken >= ALLOWED_STEPS || height - bottomError < 0.02;
    if (stepsTaken === 0 || !done) return;
    const id = window.setTimeout(() => setRevealed(true), 700);
    return () => window.clearTimeout(id);
  }, [stepsTaken, height, revealed]);

  // Remembered for the ending, which tells this back to the reader.
  useEffect(() => {
    if (revealed && stepsTaken > 0) saveGame({ steps: stepsTaken, height, algorithm: algorithmHeight });
  }, [revealed, stepsTaken, height, algorithmHeight, saveGame]);

  // Plays the algorithm's real steps, one at a time.
  useEffect(() => {
    if (!revealed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(comparedSteps);
      return;
    }
    let count = 0;
    const id = window.setInterval(() => {
      count += 1;
      setShown(count);
      if (count >= comparedSteps) window.clearInterval(id);
    }, 320);
    return () => window.clearInterval(id);
  }, [revealed, comparedSteps]);

  const fromPointer = (clientX: number, clientY: number): Params => {
    const rect = fieldRef.current!.getBoundingClientRect();
    return {
      m: view.x + ((clientX - rect.left) / rect.width) * view.w,
      b: -(view.y + ((clientY - rect.top) / rect.height) * view.h),
    };
  };

  const stepTo = (t: Params) => {
    if (revealed || stepsTaken >= ALLOWED_STEPS) return;
    setPath((p) => [...p, t]);
    setAim(null);
  };

  const restart = () => {
    setPath([START]);
    setShown(0);
    setRevealed(false);
    setAim(null);
  };

  const u = (px: number) => px / view.px;
  const arrowLength = Math.hypot(tip.m - here.m, tip.b - here.b);
  const dir = arrowLength ? { m: (tip.m - here.m) / arrowLength, b: (tip.b - here.b) / arrowLength } : { m: 1, b: 0 };
  // The drift of sand: a stream that runs downhill and fades out exactly at the tip.
  const stream = { x: tip.m - here.m, y: -(tip.b - here.b) };
  const rotate = (a: number, scale: number) => ({
    x: Math.round((stream.x * Math.cos(a) - stream.y * Math.sin(a)) * scale * 1e4) / 1e4,
    y: Math.round((stream.x * Math.sin(a) + stream.y * Math.cos(a)) * scale * 1e4) / 1e4,
  });
  const sideA = rotate(0.16, 0.72);
  const sideB = rotate(-0.16, 0.72);

  return (
    <section className="gd-game" aria-label="the blindfold game">
      <div
        ref={fieldRef}
        className="gd-field"
        data-revealed={revealed}
        tabIndex={revealed ? -1 : 0}
        role="application"
        aria-label="a hidden hill. arrow keys aim your next step, enter takes it."
        onClick={(e) => {
          if (!(e.target as Element).closest("a, button")) stepTo(fromPointer(e.clientX, e.clientY));
        }}
        onPointerMove={(e) => {
          if (e.pointerType === "mouse" && !revealed) setAim(fromPointer(e.clientX, e.clientY));
        }}
        onPointerLeave={() => setAim(null)}
        onKeyDown={(e) => {
          if (revealed) return;
          const moves: Record<string, Params> = {
            ArrowLeft: { m: -0.1, b: 0 },
            ArrowRight: { m: 0.1, b: 0 },
            ArrowUp: { m: 0, b: 0.1 },
            ArrowDown: { m: 0, b: -0.1 },
          };
          if (moves[e.key]) {
            e.preventDefault();
            const from = aim ?? here;
            setAim({ m: from.m + moves[e.key].m, b: from.b + moves[e.key].b });
          } else if ((e.key === "Enter" || e.key === " ") && aim) {
            e.preventDefault();
            stepTo(aim);
          }
        }}
      >
        <svg viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`} preserveAspectRatio="none" aria-hidden>
          <defs>
            <radialGradient id="gd-light">
              <stop offset="0%" stopColor="#f0be87" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f0be87" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g className="gd-rings">
            {RINGS.map((ring, i) => (
              <polyline key={i} points={ringPath(ring)} />
            ))}
            <circle cx={best.m} cy={-best.b} r={u(3)} className="gd-bottom" />
          </g>

          {revealed && (
            <g className="gd-algorithm">
              <polyline points={algorithm.slice(0, shown + 1).map((p) => `${p.m},${-p.b}`).join(" ")} />
              {algorithm.slice(0, shown + 1).map((p, i) => (
                <circle key={i} cx={p.m} cy={-p.b} r={u(3)} />
              ))}
            </g>
          )}

          <g className="gd-yours">
            <polyline points={path.map((p) => `${p.m},${-p.b}`).join(" ")} />
            {path.slice(0, -1).map((p, i) => (
              <circle key={i} cx={p.m} cy={-p.b} r={u(3)} />
            ))}
          </g>

          {aim && !revealed && (
            <g className="gd-aim">
              <line x1={here.m} y1={-here.b} x2={aim.m} y2={-aim.b} />
              <circle cx={aim.m} cy={-aim.b} r={u(9)} />
            </g>
          )}

          <g className="gd-you" style={{ transform: `translate(${here.m}px, ${-here.b}px)` }}>
            {!revealed && (
              <circle cx={dir.m * u(34)} cy={-dir.b * u(34)} r={u(260)} fill="url(#gd-light)" />
            )}
            {!revealed && (
              <g className="gd-tilt" stroke="url(#gd-stream)">
                <linearGradient
                  id="gd-stream"
                  gradientUnits="userSpaceOnUse"
                  x1={0}
                  y1={0}
                  x2={stream.x}
                  y2={stream.y}
                >
                  <stop offset="0%" stopColor="#ffe6c8" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#ffe6c8" stopOpacity="0" />
                </linearGradient>
                <line x1={0} y1={0} x2={stream.x} y2={stream.y} />
                <line className="gd-tilt-side" x1={0} y1={0} x2={sideA.x} y2={sideA.y} />
                <line className="gd-tilt-side" x1={0} y1={0} x2={sideB.x} y2={sideB.y} />
              </g>
            )}
            <circle r={u(9)} className="gd-orb" />
          </g>
        </svg>

        <div className="gd-game-copy">
          <p className="lab-pill">gradient descent</p>
          {revealed ? (
            <>
              <h1>
                <span>here&apos;s the hill</span>
                <span>you couldn&apos;t see</span>
              </h1>
              <p className="gd-lead">
                that trickle of sand was the whole trick. it runs downhill, and where it fades is
                exactly where the algorithm steps. feel the tilt, step, repeat. that&apos;s gradient
                descent
              </p>
            </>
          ) : (
            <>
              <h1>
                <span>you&apos;re blindfolded on a hill.</span>
                <span>find the lowest point</span>
              </h1>
              <p className="gd-lead">
                you can&apos;t see a thing. all you can feel is the ground sliding away under your
                feet. tap where to step. you get {ALLOWED_STEPS} steps
              </p>
            </>
          )}
        </div>

        <div className="gd-hud">
          {revealed ? (
            <>
              <dl className="gd-score">
                {stepsTaken > 0 && (
                  <div>
                    <dt>you, {stepsTaken} {stepsTaken === 1 ? "step" : "steps"}</dt>
                    <dd>{height.toFixed(2)}</dd>
                  </div>
                )}
                <div>
                  <dt>the algorithm, {comparedSteps} steps</dt>
                  <dd>{algorithmHeight.toFixed(2)}</dd>
                </div>
                <div>
                  <dt>the very bottom</dt>
                  <dd>{bottomError.toFixed(2)}</dd>
                </div>
              </dl>
              <div className="gd-hud-actions">
                <button type="button" className="gd-button gd-button-solid" onClick={() => go("the-line")}>
                  so what was this hill?
                </button>
                <button type="button" className="gd-button" onClick={restart}>
                  try again
                </button>
              </div>
            </>
          ) : (
            <>
              <dl className="gd-score">
                <div>
                  <dt>height</dt>
                  <dd>{height.toFixed(2)}</dd>
                </div>
                <div>
                  <dt>steps left</dt>
                  <dd>{ALLOWED_STEPS - stepsTaken}</dd>
                </div>
              </dl>
              <button type="button" className="gd-button" onClick={() => setRevealed(true)}>
                turn the lights on
              </button>
            </>
          )}
        </div>

        <p className="sr-only" role="status">
          {revealed
            ? `the map is showing. you reached ${height.toFixed(2)}. the algorithm reached ${algorithmHeight.toFixed(2)}.`
            : `height ${height.toFixed(2)}, ${ALLOWED_STEPS - stepsTaken} steps left. downhill is ${
                g.m < 0 ? "right" : "left"
              } and ${g.b < 0 ? "up" : "down"}.`}
        </p>
      </div>
    </section>
  );
}
