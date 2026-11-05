"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  DEEP,
  DEFAULTS,
  DOMAIN,
  OPTIMIZERS,
  PRESETS,
  SHALLOW,
  START,
  height,
  rateAt,
  simulate,
  type Optimizer,
  type Run,
  type Schedule,
  type Settings,
} from "@/lib/gradient-descent/control-room";
import { useDeck } from "@/components/gradient-descent/deck";
import { LossChart } from "@/components/gradient-descent/loss-chart";

const W = 1000;
const MAX_H = height(4);
const MIN_H = height(DEEP);
const RATE = { min: Math.log(0.001), max: Math.log(3) };
const MS_TOTAL = 3200;
const BATCHES: (number | null)[] = [1, 4, 16, 64, null];
const SCHEDULES: { id: Schedule; label: string }[] = [
  { id: "constant", label: "constant" },
  { id: "step", label: "halve it" },
  { id: "exponential", label: "decay" },
  { id: "cosine", label: "cosine" },
];
const OPTIMIZER_NOTES: Record<Optimizer, string> = {
  descent: "plain: walk straight downhill, nothing else",
  momentum: "momentum: keep some of your speed from the last step",
  nesterov: "nesterov: momentum, but feel the slope where you're about to land",
  rmsprop: "rmsprop: shrink each step if recent slopes have been big",
  adam: "adam: momentum and rmsprop together. the usual default",
};
const SCHEDULE_NOTE = "schedule: big steps early to cover ground, small steps late to settle";

function verdict(run: Run, s: Settings) {
  const last = run.xs[run.xs.length - 1];
  const steps = run.xs.length - 1;
  switch (run.ending) {
    case "flew off":
      return `gone in ${steps} ${steps === 1 ? "step" : "steps"}`;
    case "barely moved":
      return `${steps} steps and it has barely moved`;
    case "still moving":
      return `still moving after ${steps} steps`;
    case "deep valley":
      return `reached the deep valley, height ${height(last).toFixed(2)}`;
    case "shallow valley":
      return s.weightDecay > 0
        ? `settled at ${last.toFixed(2)}, short of the valley's bottom at ${SHALLOW.toFixed(2)}`
        : `settled in the shallow valley, ${(height(last) - height(DEEP)).toFixed(2)} above the deep one`;
  }
}

function Slider({
  label,
  note,
  value,
  shown,
  disabled,
  onInfo,
  ...input
}: {
  label: string;
  note: string;
  value: number;
  shown: string;
  disabled?: boolean;
  onInfo: (note: string) => void;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label
      className="gd-dial"
      data-off={disabled || undefined}
      onPointerEnter={() => onInfo(note)}
      onFocus={() => onInfo(note)}
    >
      <span className="gd-dial-head">
        <span>{label}</span>
        <output>{shown}</output>
      </span>
      <input
        type="range"
        disabled={disabled}
        min={input.min}
        max={input.max}
        step={input.step}
        value={value}
        aria-valuetext={shown}
        onChange={(e) => {
          onInfo(note);
          input.onChange(Number(e.target.value));
        }}
      />
    </label>
  );
}

export function ControlRoom() {
  const { current } = useDeck();
  const active = current === "your-turn";
  const stageRef = useRef<SVGSVGElement>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [start, setStart] = useState(START);
  const [preset, setPreset] = useState<string | null>("right");
  const [race, setRace] = useState(false);
  const [progress, setProgress] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [touched, setTouched] = useState(false);
  const [more, setMore] = useState(false);
  const [info, setInfo] = useState("hover or turn a dial to see what it does");
  // The drawing always fills the frame. On a phone the ball and labels stay grabbable and readable.
  const [view, setView] = useState({ h: 400, k: 1 });
  const frame = useRef(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height: h } = entry.contentRect;
      if (width && h) setView({ h: (W * h) / width, k: Math.min(2.6, Math.max(1, W / width)) });
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const k = view.k;
  // Rounded for drawing, so trig differences between server and browser can't break hydration.
  const sx = (x: number) => Math.round(((x - DOMAIN.min) / (DOMAIN.max - DOMAIN.min)) * W * 10) / 10;
  const top = 34 * k;
  const bottom = view.h - 44 * k;
  const sy = (h: number) => Math.round((bottom - ((h - MIN_H) / (MAX_H - MIN_H)) * (bottom - top)) * 10) / 10;
  const curve = useMemo(
    () =>
      Array.from({ length: 321 }, (_, i) => {
        const x = DOMAIN.min + (i / 320) * (DOMAIN.max - DOMAIN.min);
        const px = ((x - DOMAIN.min) / (DOMAIN.max - DOMAIN.min)) * W;
        const y = bottom - ((height(x) - MIN_H) / (MAX_H - MIN_H)) * (bottom - top);
        return `${px.toFixed(1)},${y.toFixed(1)}`;
      }).join(" "),
    [bottom, top],
  );

  const main = useMemo(() => simulate(start, settings), [start, settings]);
  const racers = useMemo(
    () => OPTIMIZERS.map((o) => ({ ...o, run: simulate(start, { ...settings, optimizer: o.id }) })),
    [start, settings],
  );

  // Every change replays the run, which was already computed in full. It waits until you can see it.
  useEffect(() => {
    if (dragging || !active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    cancelAnimationFrame(frame.current);
    setProgress(0);
    const began = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - began) / MS_TOTAL);
      setProgress(p);
      if (p < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [main, race, dragging, active]);

  const update = (change: Partial<Settings>) => {
    setPreset(null);
    setSettings((s) => ({ ...s, ...change }));
  };

  const slowest = race ? Math.max(...racers.map((r) => r.run.xs.length)) : main.xs.length;
  const stepNow = Math.round(progress * (slowest - 1));
  const at = (run: Run) => run.xs[Math.min(stepNow, run.xs.length - 1)];
  const visible = (x: number) => x >= DOMAIN.min && x <= DOMAIN.max;

  const xFromPointer = (clientX: number) => {
    const rect = stageRef.current!.getBoundingClientRect();
    const x = DOMAIN.min + ((clientX - rect.left) / rect.width) * (DOMAIN.max - DOMAIN.min);
    return Math.min(DOMAIN.max, Math.max(DOMAIN.min, x));
  };

  const usesMomentum = settings.optimizer !== "descent" && settings.optimizer !== "rmsprop";
  const usesMemory = settings.optimizer === "rmsprop" || settings.optimizer === "adam";
  const currentPreset = PRESETS.find((p) => p.id === preset);
  const rateNow = rateAt(settings, Math.min(stepNow, settings.steps));
  const trail = main.xs.slice(0, stepNow + 1).filter(visible);

  return (
    <div className="gd-room">
      <div className="gd-room-main">
        <div className="gd-stage">
          <Image
            src="/images/lab/study-001-topography.webp"
            alt=""
            fill
            unoptimized
            sizes="60vw"
            className="gd-stage-art"
          />
          <div className="gd-stage-scrim" aria-hidden />
          <svg
            ref={stageRef}
            className="gd-stage-svg"
            viewBox={`0 0 ${W} ${view.h}`}
            preserveAspectRatio="none"
            role="group"
            aria-label="a hill with a shallow valley on the right and a deep valley on the left. drag the ring to choose where the ball starts."
          >
            <polyline className="gd-hill" points={curve} />
            <text x={sx(DEEP)} y={sy(height(DEEP)) + 26 * k} textAnchor="middle" className="gd-map-text" style={{ fontSize: 13 * k }}>
              deep valley
            </text>
            <text x={sx(SHALLOW)} y={sy(height(SHALLOW)) + 26 * k} textAnchor="middle" className="gd-map-text" style={{ fontSize: 13 * k }}>
              shallow valley
            </text>

            {!race &&
              trail.map((x, i) => (
                <circle key={i} cx={sx(x)} cy={sy(height(x)) - 2} r={2 * k} className="gd-room-tick" />
              ))}

            {race
              ? racers.map((r, i) => {
                  const x = at(r.run);
                  if (!visible(x)) return null;
                  return (
                    <g key={r.id} className="gd-racer" data-racer={r.id}>
                      <circle cx={sx(x)} cy={sy(height(x)) - 10 * k} r={8 * k} />
                      <text
                        x={sx(x)}
                        y={sy(height(x)) - 10 * k - 14 * k - i * 14 * k}
                        textAnchor="middle"
                        style={{ fontSize: 12 * k }}
                      >
                        {r.label}
                      </text>
                    </g>
                  );
                })
              : visible(at(main)) && (
                  <circle cx={sx(at(main))} cy={sy(height(at(main))) - 11 * k} r={11 * k} className="gd-orb gd-room-orb" />
                )}

            <g
              className="gd-marker"
              role="slider"
              tabIndex={0}
              aria-label="where the ball starts. left and right arrows move it."
              aria-valuemin={DOMAIN.min}
              aria-valuemax={DOMAIN.max}
              aria-valuenow={Number(start.toFixed(2))}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                setDragging(true);
                setTouched(true);
                setStart(xFromPointer(e.clientX));
                setPreset(null);
              }}
              onPointerMove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) setStart(xFromPointer(e.clientX));
              }}
              onPointerUp={() => setDragging(false)}
              onPointerCancel={() => setDragging(false)}
              onKeyDown={(e) => {
                const delta = e.key === "ArrowLeft" ? -0.05 : e.key === "ArrowRight" ? 0.05 : 0;
                if (!delta) return;
                e.preventDefault();
                setPreset(null);
                setTouched(true);
                setStart((v) => Math.min(DOMAIN.max, Math.max(DOMAIN.min, v + delta)));
              }}
            >
              <circle cx={sx(start)} cy={sy(height(start)) - 11 * k} r={Math.max(30, 26 * k)} className="gd-hit" />
              <circle cx={sx(start)} cy={sy(height(start)) - 11 * k} r={11 * k} className="gd-start-ring" />
            </g>
            {(dragging || !touched) && (
              <text
                x={sx(start) - 22 * k}
                y={sy(height(start)) - 7 * k}
                textAnchor="end"
                className="gd-map-text gd-map-hint"
                style={{ fontSize: 13 * k }}
              >
                {dragging ? "start here" : "drag this"}
              </text>
            )}
          </svg>
        </div>

        <div className="gd-room-status">
          <div className="gd-chips" role="group" aria-label="presets">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className="gd-chip"
                aria-pressed={preset === p.id}
                onClick={() => {
                  setRace(false);
                  setPreset(p.id);
                  setStart(START);
                  setSettings({ ...DEFAULTS, ...p.settings });
                }}
              >
                {p.label}
              </button>
            ))}
            <button type="button" className="gd-chip gd-chip-race" aria-pressed={race} onClick={() => setRace((r) => !r)}>
              race all 5
            </button>
          </div>
          <p className="gd-note" role="status">
            {race
              ? racers.map((r) => `${r.label}: ${r.run.ending}`).join(" · ")
              : progress < 1
                ? `step ${stepNow} · height ${visible(at(main)) ? height(at(main)).toFixed(2) : "gone"} · step size ${rateNow.toFixed(4)}`
                : `${currentPreset ? `${currentPreset.claim}. ` : ""}${verdict(main, settings)}`}
          </p>
        </div>
      </div>

      <div className="gd-room-side">
        <div className="gd-dials" data-lenis-prevent>
          <div className="gd-dial">
            <div className="gd-chips" role="group" aria-label="optimiser">
              {OPTIMIZERS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className="gd-chip"
                  aria-pressed={settings.optimizer === o.id}
                  onPointerEnter={() => setInfo(OPTIMIZER_NOTES[o.id])}
                  onClick={() => {
                    setInfo(OPTIMIZER_NOTES[o.id]);
                    update({ optimizer: o.id });
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <Slider
            label="learning rate"
            note="learning rate: how far each step goes. the one that matters most"
            onInfo={setInfo}
            value={Math.round(((Math.log(settings.learningRate) - RATE.min) / (RATE.max - RATE.min)) * 1000)}
            shown={settings.learningRate.toFixed(settings.learningRate < 0.1 ? 4 : 2)}
            min={0}
            max={1000}
            step={1}
            onChange={(v) => update({ learningRate: Math.exp(RATE.min + (v / 1000) * (RATE.max - RATE.min)) })}
          />
          <Slider
            label="momentum"
            note={usesMomentum ? "momentum: how much speed survives each step" : "this optimiser doesn't use momentum"}
            onInfo={setInfo}
            value={settings.momentum}
            shown={settings.momentum.toFixed(2)}
            disabled={!usesMomentum}
            min={0}
            max={0.99}
            step={0.01}
            onChange={(v) => update({ momentum: v })}
          />
          <Slider
            label="batch size"
            note="batch size: how much data each step looks at. less data, noisier slope"
            onInfo={setInfo}
            value={BATCHES.indexOf(settings.batchSize)}
            shown={settings.batchSize === null ? "all data" : String(settings.batchSize)}
            min={0}
            max={BATCHES.length - 1}
            step={1}
            onChange={(v) => update({ batchSize: BATCHES[v] })}
          />

          {more && (
            <>
              <Slider
                label="memory"
                note={usesMemory ? "memory (beta 2): how long past slopes affect step sizes" : "only rmsprop and adam use this"}
                onInfo={setInfo}
                value={settings.memory}
                shown={settings.memory.toFixed(3)}
                disabled={!usesMemory}
                min={0.5}
                max={0.999}
                step={0.001}
                onChange={(v) => update({ memory: v })}
              />
              <Slider
                label="weight decay"
                note="weight decay: a constant pull toward zero. it moves the bottom"
                onInfo={setInfo}
                value={settings.weightDecay}
                shown={settings.weightDecay.toFixed(2)}
                min={0}
                max={1.2}
                step={0.01}
                onChange={(v) => update({ weightDecay: v })}
              />
              <Slider
                label="gradient clipping"
                note="clipping: no slope counts as steeper than this, so no step is enormous"
                onInfo={setInfo}
                value={settings.clip === null ? 3 : settings.clip}
                shown={settings.clip === null ? "off" : settings.clip.toFixed(2)}
                min={0.1}
                max={3}
                step={0.05}
                onChange={(v) => update({ clip: v >= 3 ? null : v })}
              />
              <Slider
                label="steps"
                note="steps: how long it gets. real training runs for millions"
                onInfo={setInfo}
                value={settings.steps}
                shown={String(settings.steps)}
                min={20}
                max={600}
                step={10}
                onChange={(v) => update({ steps: v })}
              />
              <div className="gd-dial" onPointerEnter={() => setInfo(SCHEDULE_NOTE)}>
                <span className="gd-dial-head">
                  <span>schedule</span>
                </span>
                <div className="gd-chips" role="group" aria-label="learning rate schedule">
                  {SCHEDULES.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      className="gd-chip"
                      aria-pressed={settings.schedule === o.id}
                      onClick={() => {
                        setInfo(SCHEDULE_NOTE);
                        update({ schedule: o.id });
                      }}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              <div
                className="gd-dial"
                data-off={settings.batchSize === null || undefined}
                onPointerEnter={() => setInfo("seed: same seed, same run. luck is a real part of training")}
              >
                <span className="gd-dial-head">
                  <span>random seed</span>
                  <output>{settings.seed}</output>
                </span>
                <button
                  type="button"
                  className="gd-chip gd-chip-self"
                  disabled={settings.batchSize === null}
                  onClick={() => update({ seed: settings.seed + 1 })}
                >
                  reroll the noise
                </button>
              </div>
            </>
          )}

          <div className="gd-dial-row">
            <button type="button" className="gd-chip" aria-expanded={more} onClick={() => setMore((m) => !m)}>
              {more ? "fewer dials" : "6 more dials"}
            </button>
            <button
              type="button"
              className="gd-chip"
              onClick={() => {
                setRace(false);
                setPreset("right");
                setStart(START);
                setSettings(DEFAULTS);
              }}
            >
              reset
            </button>
          </div>
        </div>

        <p className="gd-dial-info">{info}</p>

        <div className="gd-room-chart">
          <p className="gd-fig-label">height over time</p>
          <LossChart
            series={
              race
                ? racers.map((r) => ({
                    id: r.id,
                    values: r.run.heights.slice(0, stepNow + 1),
                    className: `gd-chart-${r.id}`,
                  }))
                : [{ id: "run", values: main.heights.slice(0, stepNow + 1) }]
            }
            maxSteps={slowest - 1}
            label="height of the ball at each step"
          />
        </div>
      </div>
    </div>
  );
}
