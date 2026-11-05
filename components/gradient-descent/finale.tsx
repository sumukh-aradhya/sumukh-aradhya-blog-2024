"use client";

import { useEffect, useRef, useState } from "react";
import { POINTS, START, descend, loss } from "@/lib/gradient-descent/regression";
import { useDeck } from "@/components/gradient-descent/deck";
import { LinePlot } from "@/components/gradient-descent/line-plot";
import { useStudy } from "@/components/gradient-descent/study-state";

const ETA = 0.2;
const STEPS = 20;
const PATH = descend(POINTS, START, ETA, STEPS);

// Always the original 5 points, whatever was dragged earlier: never a silent comparison on changed data.
export function Finale() {
  const { manual } = useStudy();
  const { current } = useDeck();
  const played = useRef(false);
  const [shown, setShown] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (current !== "recap" || played.current) return;
    played.current = true;
    setPlaying(true);
  }, [current]);

  useEffect(() => {
    if (!playing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(STEPS);
      setPlaying(false);
      return;
    }
    const id = window.setInterval(() => {
      setShown((s) => {
        if (s + 1 >= STEPS) setPlaying(false);
        return Math.min(s + 1, STEPS);
      });
    }, 240);
    return () => window.clearInterval(id);
  }, [playing]);

  const error = loss(POINTS, PATH[shown]);
  const mine = manual ? loss(POINTS, manual) : null;

  return (
    <figure className="gd-figure">
      <LinePlot
        handles={false}
        fixed={{ points: POINTS, theta: PATH[shown] }}
        ghost={manual}
        label={`the model's line after ${shown} steps, with an error of ${error.toFixed(3)}`}
      />
      <figcaption>
        <div className="gd-readout">
          <p>
            <span>step</span>
            <strong>{shown}</strong>
          </p>
          <p>
            <span>error</span>
            <strong>{error.toFixed(3)}</strong>
          </p>
          <button
            type="button"
            className="gd-button gd-button-solid"
            disabled={playing}
            onClick={() => {
              setShown(0);
              setPlaying(true);
            }}
          >
            watch it learn again
          </button>
        </div>
        <p className="gd-note" role="status">
          {mine !== null
            ? `the same bad line you started with, learning by itself. the dashed line is yours, with an error of ${mine.toFixed(3)}. it gets to ${loss(POINTS, PATH[STEPS]).toFixed(3)}`
            : `the same bad line you started with, learning by itself. it gets to ${loss(POINTS, PATH[STEPS]).toFixed(3)}, the best any straight line can do`}
        </p>
      </figcaption>
    </figure>
  );
}
