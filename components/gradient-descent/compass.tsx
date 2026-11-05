"use client";

import { useRef, useState } from "react";
import { gradient, START, step, type Params } from "@/lib/gradient-descent/regression";
import { Arrow, MapFrame, fromMap, mapX, mapY } from "@/components/gradient-descent/map-frame";
import { useStudy } from "@/components/gradient-descent/study-state";

const ETA = 0.2;
const NUDGE = 0.01;
const GUESS_LENGTH = 90;

export function Compass() {
  const { points, theta, glideTo, error, moved, atBest } = useStudy();
  const svgRef = useRef<SVGSVGElement>(null);
  const [guess, setGuess] = useState<Params | null>(null);
  const [revealed, setRevealed] = useState(false);

  const g = gradient(points, theta);
  const size = Math.hypot(g.m, g.b);
  const next = step(points, theta, ETA);
  const here: [number, number] = [mapX(theta.m), mapY(theta.b)];
  const downhill: [number, number] = [mapX(next.m), mapY(next.b)];
  const uphill: [number, number] = [2 * here[0] - downhill[0], 2 * here[1] - downhill[1]];

  const guessDir = guess && { x: mapX(guess.m) - here[0], y: mapY(guess.b) - here[1] };
  const guessLength = guessDir ? Math.hypot(guessDir.x, guessDir.y) || 1 : 1;
  const guessTip: [number, number] | null = guessDir && [
    here[0] + (guessDir.x / guessLength) * GUESS_LENGTH,
    here[1] + (guessDir.y / guessLength) * GUESS_LENGTH,
  ];

  // The angle is measured in (m, b), the true space. This map uses equal axes, so it looks right too.
  let offBy: number | null = null;
  if (guess && size > 1e-9) {
    const a = Math.atan2(guess.b - theta.b, guess.m - theta.m);
    const d = Math.atan2(-g.b, -g.m);
    offBy = Math.abs(((a - d + 3 * Math.PI) % (2 * Math.PI)) - Math.PI) * (180 / Math.PI);
  }

  const verdict =
    offBy === null
      ? ""
      : offBy < 15
        ? `off by ${Math.round(offBy)}°. good feet`
        : offBy < 45
          ? `off by ${Math.round(offBy)}°. downhill, but not the steepest way`
          : offBy < 90
            ? `off by ${Math.round(offBy)}°. barely downhill`
            : `off by ${Math.round(offBy)}°. that's uphill`;

  return (
    <figure className="gd-figure">
      <MapFrame
        ref={svgRef}
        points={points}
        clickable={!revealed}
        label="the map, with your line as a dot. tap around the dot to guess which way is downhill."
        onPointerDown={(e) => {
          if (revealed || !svgRef.current) return;
          setGuess(fromMap(svgRef.current, e.clientX, e.clientY));
        }}
      >
        {guessTip && <Arrow from={here} to={guessTip} className="gd-arrow-guess" />}
        {revealed && (
          <>
            <Arrow from={here} to={uphill} className="gd-arrow-up" />
            <Arrow from={here} to={downhill} className="gd-arrow-down" />
            <circle cx={downhill[0]} cy={downhill[1]} r={6} className="gd-next-marker" />
          </>
        )}
        <circle cx={here[0]} cy={here[1]} r={7} className="gd-orb" />
      </MapFrame>

      <figcaption>
        <div className="gd-nudges">
          <p>
            <span>nudge the tilt: error changes by</span>
            <strong>{(g.m * NUDGE).toFixed(3)}</strong>
          </p>
          <p>
            <span>nudge the height: error changes by</span>
            <strong>{(g.b * NUDGE).toFixed(3)}</strong>
          </p>
        </div>
        <div className="gd-readout">
          <p>
            <span>error</span>
            <strong>{error.toFixed(2)}</strong>
          </p>
          {revealed ? (
            <button
              type="button"
              className="gd-button gd-button-solid"
              disabled={atBest}
              onClick={() => {
                glideTo(next, 360);
                setGuess(null);
                setRevealed(false);
              }}
            >
              take the step
            </button>
          ) : (
            <button
              type="button"
              className="gd-button gd-button-solid"
              disabled={!guess}
              onClick={() => setRevealed(true)}
            >
              show the real direction
            </button>
          )}
          <button
            type="button"
            className="gd-button"
            disabled={!moved}
            onClick={() => {
              glideTo(START);
              setGuess(null);
              setRevealed(false);
            }}
          >
            start over
          </button>
        </div>
        <p className="gd-note" role="status">
          {revealed
            ? `${verdict ? `${verdict}. ` : ""}the gradient points uphill, so you walk the opposite way`
            : guess
              ? "happy with that? see how close you got"
              : "tap around the dot: which way do you think is downhill?"}
        </p>
      </figcaption>
    </figure>
  );
}
