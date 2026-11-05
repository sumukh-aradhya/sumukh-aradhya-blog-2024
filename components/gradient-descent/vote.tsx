"use client";

import { useEffect, useRef, useState } from "react";
import { START, contributions, predict, step } from "@/lib/gradient-descent/regression";
import { LinePlot } from "@/components/gradient-descent/line-plot";
import { Arrow, MapFrame, mapX, mapY } from "@/components/gradient-descent/map-frame";
import { useStudy } from "@/components/gradient-descent/study-state";

const SIZE = 420;
const ETA = 0.2;
const SCALES = [2, 4, 8, 16, 32, 64];

// What each term in the equation means, shown when you touch it.
const TERMS: Record<string, string> = {
  share: "2 / n: every point gets an equal share. more points, less say each",
  miss: "r: how far the line misses this point. no miss, no pull",
  lever: "[x, 1]: a point far from the middle pulls harder on the tilt, like a long lever",
};

export function Vote({ formula }: { formula: React.ReactNode }) {
  const { points, theta, glideTo, setTheta, error, edited, hasOutlier, addOutlier, restorePoints, moved } =
    useStudy();
  const [selected, setSelected] = useState<number | null>(null);
  const [term, setTerm] = useState<string | null>(null);
  const [combined, setCombined] = useState(0);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  // Drawn as pulls: the negative of each gradient share, because that's the way each point wants to go.
  const pulls = contributions(points, theta).map((c) => ({ m: -c.m, b: -c.b }));
  const total = pulls.reduce((s, p) => ({ m: s.m + p.m, b: s.b + p.b }), { m: 0, b: 0 });
  const next = step(points, theta, ETA);

  // One stable scale: arrows change length as points move, and the frame doesn't jump.
  let chainM = 0;
  let chainB = 0;
  let reach = 0.5;
  for (const p of pulls) {
    reach = Math.max(reach, Math.abs(p.m), Math.abs(p.b));
    chainM += p.m;
    chainB += p.b;
    reach = Math.max(reach, Math.abs(chainM), Math.abs(chainB));
  }
  const range = SCALES.find((s) => reach <= s * 0.95) ?? SCALES[SCALES.length - 1];
  const vx = (v: number) => SIZE / 2 + (v / range) * (SIZE / 2 - 14);
  const vy = (v: number) => SIZE / 2 - (v / range) * (SIZE / 2 - 14);

  // Each arrow slides from the origin to its place in the chain. The end point is the exact sum.
  let tailM = 0;
  let tailB = 0;
  const arrows = pulls.map((p, i) => {
    const fromM = tailM * combined;
    const fromB = tailB * combined;
    tailM += p.m;
    tailB += p.b;
    return { i, from: [vx(fromM), vy(fromB)] as [number, number], to: [vx(fromM + p.m), vy(fromB + p.b)] as [number, number] };
  });

  const animate = (to: number) => {
    cancelAnimationFrame(frame.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCombined(to);
      return;
    }
    const from = combined;
    const began = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - began) / 600);
      const e = p === 1 ? 1 : 1 - (1 - p) ** 3;
      setCombined(from + (to - from) * e);
      if (p < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  };

  const lengths = pulls.map((p) => Math.hypot(p.m, p.b));
  const sum = lengths.reduce((a, b) => a + b, 0) || 1;
  const loudest = lengths.indexOf(Math.max(...lengths));
  const active = selected !== null && selected < points.length ? selected : null;
  const a = active === null ? null : points[active];
  const predicted = a ? predict(theta, a.x) : 0;

  const note = term
    ? TERMS[term]
    : a
      ? `point ${active! + 1} misses by ${Math.abs(predicted - a.y).toFixed(2)} and does ${Math.round((lengths[active!] / sum) * 100)}% of the pulling`
      : `point ${loudest + 1} is pulling hardest, with ${Math.round((lengths[loudest] / sum) * 100)}% of the pulling. touch the equation to see why`;

  return (
    <figure className="gd-figure" data-combined={combined > 0.99 || undefined}>
      <div
        className="gd-terms"
        onPointerOver={(e) => {
          const hit = (e.target as Element).closest("[class*='term-']");
          const name = hit?.getAttribute("class")?.match(/term-(\w+)/)?.[1] ?? null;
          setTerm(name);
        }}
        onPointerLeave={() => setTerm(null)}
        data-term={term ?? undefined}
      >
        <p className="gd-fig-label">touch a part of the equation to see what it does</p>
        {formula}
      </div>

      <div className="gd-triple">
        <div>
          <p className="gd-fig-label">drag the points</p>
          <LinePlot
            handles={false}
            editablePoints
            selected={active}
            onSelect={setSelected}
            highlight={term}
            label="the data. each point can be dragged up and down, and everything else recalculates."
          />
        </div>

        <div>
          <p className="gd-fig-label">what each point wants</p>
          <svg
            className="gd-plot gd-votes"
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="img"
            aria-label={`${points.length} arrows, one per point, adding up to a total of ${total.m.toFixed(2)} on the tilt and ${total.b.toFixed(2)} on the height`}
          >
            <g className="gd-axes">
              <line x1={0} y1={SIZE / 2} x2={SIZE} y2={SIZE / 2} />
              <line x1={SIZE / 2} y1={0} x2={SIZE / 2} y2={SIZE} />
              <text x={SIZE - 6} y={SIZE / 2 - 8} textAnchor="end">
                pull on tilt →
              </text>
              <text x={SIZE / 2 + 8} y={14}>
                ↑ pull on height
              </text>
              <text x={vx(range * 0.5)} y={SIZE / 2 + 16} textAnchor="middle">
                {range * 0.5}
              </text>
              <text x={SIZE / 2 + 6} y={vy(range * 0.5) + 3}>
                {range * 0.5}
              </text>
            </g>
            {combined > 0 && (
              <Arrow
                from={[vx(0), vy(0)]}
                to={[vx(total.m * combined), vy(total.b * combined)]}
                className="gd-arrow-total"
              />
            )}
            {arrows.map(({ i, from, to }) => (
              <g
                key={i}
                className={`gd-vote${active === i ? " gd-vote-on" : ""}${active !== null && active !== i ? " gd-dim" : ""}`}
                onPointerDown={() => setSelected(active === i ? null : i)}
              >
                <line className="gd-hit-line" x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} />
                <Arrow from={from} to={to} />
                <text x={to[0] + 6} y={to[1] - 6}>
                  {i + 1}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div>
          <p className="gd-fig-label">where that sends the line</p>
          <MapFrame points={points} label="the map of the current data, with the next step on it">
            <Arrow
              from={[mapX(theta.m), mapY(theta.b)]}
              to={[mapX(next.m), mapY(next.b)]}
              className="gd-arrow-down"
            />
            <circle cx={mapX(next.m)} cy={mapY(next.b)} r={6} className="gd-next-marker" />
            <circle cx={mapX(theta.m)} cy={mapY(theta.b)} r={7} className="gd-orb" />
          </MapFrame>
        </div>
      </div>

      <figcaption>
        <div className="gd-readout">
          <p>
            <span>total</span>
            <strong className="gd-wide-number">
              {total.m.toFixed(2)}, {total.b.toFixed(2)}
            </strong>
          </p>
          <p>
            <span>error</span>
            <strong>{error.toFixed(2)}</strong>
          </p>
          <button type="button" className="gd-button gd-button-solid" onClick={() => animate(combined > 0.5 ? 0 : 1)}>
            {combined > 0.5 ? "pull them apart" : "add the arrows up"}
          </button>
          <button type="button" className="gd-button" onClick={() => glideTo(next, 360)}>
            take the step
          </button>
          <button
            type="button"
            className="gd-button"
            onClick={() => {
              if (hasOutlier) restorePoints();
              else addOutlier();
              setSelected(null);
            }}
          >
            {hasOutlier ? "remove the outlier" : "add an outlier"}
          </button>
          <button
            type="button"
            className="gd-button"
            disabled={!edited && !moved}
            onClick={() => {
              restorePoints();
              setTheta(START);
              setSelected(null);
            }}
          >
            start over
          </button>
        </div>
        <p className="gd-note" role="status">
          {note}
        </p>
      </figcaption>
    </figure>
  );
}
