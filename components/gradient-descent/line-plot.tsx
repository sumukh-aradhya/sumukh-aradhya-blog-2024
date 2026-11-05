"use client";

import { useId, useRef, useState } from "react";
import { predict, type Params, type Point } from "@/lib/gradient-descent/regression";
import { useStudy } from "@/components/gradient-descent/study-state";

// Same scale on both axes, or the squares wouldn't be squares.
const UNIT = 90;
const X = { min: -3.2, max: 3.2 };
const Y = { min: -2.6, max: 3.6 };
const WIDTH = (X.max - X.min) * UNIT;
const HEIGHT = (Y.max - Y.min) * UNIT;
const sx = (x: number) => (x - X.min) * UNIT;
const sy = (y: number) => (Y.max - y) * UNIT;
const SLOPE_HANDLE_X = 2.75;

const XTICKS = [-3, -2, -1, 1, 2, 3];
const YTICKS = [-2, -1, 1, 2, 3];

export function LinePlot({
  squares = false,
  handles = true,
  editablePoints = false,
  selected = null,
  onSelect,
  highlight,
  fixed,
  ghost,
  label,
}: {
  squares?: boolean;
  handles?: boolean;
  editablePoints?: boolean;
  selected?: number | null;
  onSelect?: (index: number) => void;
  /** Lights up one part of the figure when its term in the equation is touched. */
  highlight?: string | null;
  /** Draw these instead of the shared state, for a figure that must not change. */
  fixed?: { points: Point[]; theta: Params };
  ghost?: Params | null;
  label: string;
}) {
  const study = useStudy();
  const points = fixed?.points ?? study.points;
  const theta = fixed?.theta ?? study.theta;
  const { setTheta, setPointY, saveManual } = study;
  const svgRef = useRef<SVGSVGElement>(null);
  const [grabbed, setGrabbed] = useState<string | null>(null);
  const clip = `gd-clip-${useId().replace(/[^a-z0-9]/gi, "")}`;

  const yFromPointer = (clientY: number) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return Y.max - ((clientY - rect.top) / rect.height) * (Y.max - Y.min);
  };

  const dragHandlers = (kind: "slope" | "height") => ({
    onPointerDown: (e: React.PointerEvent) => {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
      setGrabbed(kind);
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (!(e.currentTarget as Element).hasPointerCapture(e.pointerId)) return;
      const y = yFromPointer(e.clientY);
      if (kind === "height") setTheta({ m: theta.m, b: y });
      else setTheta({ m: (y - theta.b) / SLOPE_HANDLE_X, b: theta.b });
    },
    onPointerUp: () => {
      setGrabbed(null);
      saveManual();
    },
    onPointerCancel: () => setGrabbed(null),
    onKeyDown: (e: React.KeyboardEvent) => {
      const delta = e.key === "ArrowUp" ? 0.05 : e.key === "ArrowDown" ? -0.05 : 0;
      if (!delta) return;
      e.preventDefault();
      if (kind === "height") setTheta({ m: theta.m, b: theta.b + delta });
      else setTheta({ m: theta.m + delta, b: theta.b });
    },
  });

  return (
    <svg
      ref={svgRef}
      className="gd-plot"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="group"
      aria-label={label}
      data-grabbed={grabbed ?? undefined}
      data-highlight={highlight ?? undefined}
    >
      <defs>
        <clipPath id={clip}>
          <rect width={WIDTH} height={HEIGHT} />
        </clipPath>
      </defs>

      <g className="gd-axes" aria-hidden>
        <line x1={0} y1={sy(0)} x2={WIDTH} y2={sy(0)} />
        <line x1={sx(0)} y1={0} x2={sx(0)} y2={HEIGHT} />
        {XTICKS.map((t) => (
          <g key={t}>
            <line x1={sx(t)} y1={sy(0) - 4} x2={sx(t)} y2={sy(0) + 4} />
            <text x={sx(t)} y={sy(0) + 20} textAnchor="middle">
              {t}
            </text>
          </g>
        ))}
        {YTICKS.map((t) => (
          <g key={t}>
            <line x1={sx(0) - 4} y1={sy(t)} x2={sx(0) + 4} y2={sy(t)} />
            <text x={sx(0) - 10} y={sy(t) + 4} textAnchor="end">
              {t}
            </text>
          </g>
        ))}
      </g>

      <g clipPath={`url(#${clip})`} aria-hidden>
        {points.map((p, i) => {
          const predicted = predict(theta, p.x);
          const side = Math.abs(predicted - p.y) * UNIT;
          const towardCenter = p.x > 0 ? -side : 0;
          const dim = selected !== null && selected !== i;
          return (
            <g key={i} className={dim ? "gd-dim" : undefined}>
              {squares && (
                <rect
                  className="gd-square"
                  x={sx(p.x) + towardCenter}
                  y={Math.min(sy(p.y), sy(predicted))}
                  width={side}
                  height={side}
                />
              )}
              <line className="gd-miss" x1={sx(p.x)} y1={sy(p.y)} x2={sx(p.x)} y2={sy(predicted)} />
            </g>
          );
        })}
        {ghost && (
          <line
            className="gd-line-ghost"
            x1={sx(X.min)}
            y1={sy(predict(ghost, X.min))}
            x2={sx(X.max)}
            y2={sy(predict(ghost, X.max))}
          />
        )}
        <line
          className="gd-line"
          x1={sx(X.min)}
          y1={sy(predict(theta, X.min))}
          x2={sx(X.max)}
          y2={sy(predict(theta, X.max))}
        />
      </g>

      {points.map((p, i) => {
        const dim = selected !== null && selected !== i;
        const className = `gd-point${selected === i ? " gd-point-on" : ""}${dim ? " gd-dim" : ""}`;
        if (!editablePoints) {
          return <circle key={i} className={className} cx={sx(p.x)} cy={sy(p.y)} r={6} aria-hidden />;
        }
        return (
          <g
            key={i}
            className="gd-handle gd-point-handle"
            role="slider"
            tabIndex={0}
            aria-label={`point ${i + 1}, at x = ${p.x}. up and down arrows move it.`}
            aria-valuemin={Y.min}
            aria-valuemax={Y.max}
            aria-valuenow={Number(p.y.toFixed(2))}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              onSelect?.(i);
            }}
            onPointerMove={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId)) setPointY(i, yFromPointer(e.clientY));
            }}
            onFocus={() => onSelect?.(i)}
            onKeyDown={(e) => {
              const delta = e.key === "ArrowUp" ? 0.05 : e.key === "ArrowDown" ? -0.05 : 0;
              if (!delta) return;
              e.preventDefault();
              setPointY(i, p.y + delta);
            }}
          >
            <circle cx={sx(p.x)} cy={sy(p.y)} r={24} className="gd-hit" />
            <circle className={className} cx={sx(p.x)} cy={sy(p.y)} r={selected === i ? 8 : 6} />
            <text className="gd-point-label" x={sx(p.x) + 12} y={sy(p.y) - 10}>
              {i + 1}
            </text>
          </g>
        );
      })}

      {handles && (
        <>
          <g
            className="gd-handle"
            role="slider"
            tabIndex={0}
            aria-label="where the line crosses the middle. up and down arrows move it."
            aria-valuemin={-2}
            aria-valuemax={3.2}
            aria-valuenow={Number(theta.b.toFixed(2))}
            {...dragHandlers("height")}
          >
            <circle cx={sx(0)} cy={sy(theta.b)} r={26} className="gd-hit" />
            <circle cx={sx(0)} cy={sy(theta.b)} r={9} className="gd-handle-dot" />
          </g>
          <g
            className="gd-handle"
            role="slider"
            tabIndex={0}
            aria-label="the tilt of the line. up and down arrows move it."
            aria-valuemin={-1.6}
            aria-valuemax={3.6}
            aria-valuenow={Number(theta.m.toFixed(2))}
            {...dragHandlers("slope")}
          >
            <circle cx={sx(SLOPE_HANDLE_X)} cy={sy(predict(theta, SLOPE_HANDLE_X))} r={26} className="gd-hit" />
            <circle
              cx={sx(SLOPE_HANDLE_X)}
              cy={sy(predict(theta, SLOPE_HANDLE_X))}
              r={9}
              className="gd-handle-dot"
            />
          </g>
        </>
      )}
    </svg>
  );
}
