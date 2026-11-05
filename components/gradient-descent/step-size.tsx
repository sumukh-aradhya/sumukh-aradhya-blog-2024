"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { START, loss, run, stepLimit } from "@/lib/gradient-descent/regression";
import { LossChart } from "@/components/gradient-descent/loss-chart";
import { MapFrame, mapX, mapY } from "@/components/gradient-descent/map-frame";
import { useStudy } from "@/components/gradient-descent/study-state";

const MAX_STEPS = 60;
// Named by where they sit against this dataset's real limit, so they stay true if the data changes.
const PRESETS = [
  { id: "careful", label: "careful", share: 0.16 },
  { id: "fast", label: "fast", share: 0.5 },
  { id: "wobbly", label: "wobbly", share: 0.8 },
  { id: "edge", label: "on the edge", share: 1 },
  { id: "unstable", label: "too big", share: 1.16 },
];
const SLIDER = { min: Math.log(0.01), max: Math.log(1) };

export function StepSize() {
  const { points } = useStudy();
  const limit = stepLimit(points);
  const [eta, setEta] = useState(() => 0.16 * stepLimit(points));
  const [shown, setShown] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(0);

  const result = useMemo(() => run(points, START, eta, MAX_STEPS), [points, eta]);
  const path = result.path;
  const last = path.length - 1;
  const at = Math.min(shown, last);
  const here = path[at];
  const errors = useMemo(() => path.map((p) => loss(points, p)), [path, points]);

  useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(() => {
      setShown((s) => {
        if (s + 1 >= last) setPlaying(false);
        return Math.min(s + 1, last);
      });
    }, 220);
    return () => window.clearInterval(timer.current);
  }, [playing, last]);

  const restartAt = (value: number) => {
    setEta(value);
    setShown(0);
    setPlaying(false);
  };

  const onMap =
    here.m >= -1.6 && here.m <= 3.6 && here.b >= -2 && here.b <= 3.2;
  const finished = at === last;
  const ratio = eta / limit;

  const status = !finished
    ? ""
    : result.outcome === "settled"
      ? `settled in ${last} steps`
      : result.outcome === "blew up"
        ? `blew up after ${last} steps`
        : ratio > 1
          ? `still getting worse after ${last} steps`
          : Math.abs(ratio - 1) < 0.005
            ? "it will bounce like this forever"
            : `not done after ${last} steps`;

  return (
    <figure className="gd-figure">
      <div className="gd-linked">
        <div>
          <p className="gd-fig-label">every step, on the map</p>
          <MapFrame points={points} label="the path gradient descent actually took">
            <polyline
              className="gd-trail"
              points={path
                .slice(0, at + 1)
                .map((p) => `${mapX(p.m).toFixed(2)},${mapY(p.b).toFixed(2)}`)
                .join(" ")}
            />
            {path.slice(0, at).map((p, i) => (
              <circle key={i} cx={mapX(p.m)} cy={mapY(p.b)} r={2.4} className="gd-trail-dot" />
            ))}
            {onMap && <circle cx={mapX(here.m)} cy={mapY(here.b)} r={7} className="gd-orb" />}
          </MapFrame>
        </div>
        <div>
          <p className="gd-fig-label">the error at each step</p>
          <LossChart
            series={[{ id: "run", values: errors.slice(0, at + 1) }]}
            maxSteps={Math.max(last, 20)}
            log
            label={`error over ${at} steps, currently ${errors[at].toFixed(3)}`}
          />
          <dl className="gd-stats">
            <div>
              <dt>step</dt>
              <dd>{at}</dd>
            </div>
            <div>
              <dt>error</dt>
              <dd>{errors[at] > 9999 ? errors[at].toExponential(1) : errors[at].toFixed(3)}</dd>
            </div>
            <div>
              <dt>step size</dt>
              <dd>{eta.toFixed(3)}</dd>
            </div>
            <div>
              <dt>the limit here</dt>
              <dd>{limit.toFixed(3)}</dd>
            </div>
          </dl>
          <label className="gd-slider">
            <span>step size</span>
            <input
              type="range"
              min={0}
              max={1000}
              value={Math.round(((Math.log(eta) - SLIDER.min) / (SLIDER.max - SLIDER.min)) * 1000)}
              aria-valuetext={eta.toFixed(3)}
              onChange={(e) =>
                restartAt(Math.exp(SLIDER.min + (Number(e.target.value) / 1000) * (SLIDER.max - SLIDER.min)))
              }
            />
          </label>
          <div className="gd-chips">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className="gd-chip"
                aria-pressed={Math.abs(eta - p.share * limit) < 1e-9}
                onClick={() => restartAt(p.share * limit)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <figcaption>
        <div className="gd-readout">
          <button
            type="button"
            className="gd-button gd-button-solid"
            onClick={() => {
              if (finished) setShown(0);
              setPlaying((p) => !p);
            }}
          >
            {playing ? "pause" : finished ? "run it again" : "run it"}
          </button>
          <button
            type="button"
            className="gd-button"
            disabled={finished}
            onClick={() => {
              setPlaying(false);
              setShown((s) => Math.min(s + 1, last));
            }}
          >
            one step
          </button>
          <button
            type="button"
            className="gd-button"
            onClick={() => {
              setPlaying(false);
              setShown(0);
            }}
          >
            back to the start
          </button>
        </div>
        <p className="gd-note" role="status">
          {status ||
            (ratio < 0.3
              ? "small steps. safe, and slow"
              : ratio < 0.75
                ? "a good size"
                : ratio < 1
                  ? "it overshoots every time, but by less each time"
                  : ratio === 1 || Math.abs(ratio - 1) < 0.005
                    ? `exactly at the limit of ${limit.toFixed(3)}`
                    : "past the limit. each overshoot is bigger")}
          {!onMap && " · it has left the map"}
        </p>
      </figcaption>
    </figure>
  );
}
