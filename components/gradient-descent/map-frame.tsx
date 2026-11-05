"use client";

import { forwardRef, useMemo } from "react";
import { contour, type Params, type Point } from "@/lib/gradient-descent/regression";
import { LIMITS } from "@/components/gradient-descent/study-state";

export const SIZE = 420;
const SCALE = SIZE / (LIMITS.m.max - LIMITS.m.min);
export const mapX = (m: number) => (m - LIMITS.m.min) * SCALE;
export const mapY = (b: number) => SIZE - (b - LIMITS.b.min) * SCALE;
const M_TICKS = [-1, 0, 1, 2, 3];
const B_TICKS = [-1, 0, 1, 2, 3];
const LEVELS = [0.15, 0.5, 1, 1.75, 2.75, 4, 5.5, 7.5, 10, 13, 17];

export function fromMap(svg: SVGSVGElement, clientX: number, clientY: number): Params {
  const rect = svg.getBoundingClientRect();
  return {
    m: LIMITS.m.min + (((clientX - rect.left) / rect.width) * SIZE) / SCALE,
    b: LIMITS.b.min + ((1 - (clientY - rect.top) / rect.height) * SIZE) / SCALE,
  };
}

/** An arrow head at (x2, y2), for any arrow drawn in screen units. */
export function arrowHead(x1: number, y1: number, x2: number, y2: number, size = 8) {
  const d = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / d;
  const uy = (y2 - y1) / d;
  return [
    `${x2 - ux * size - uy * size * 0.55},${y2 - uy * size + ux * size * 0.55}`,
    `${x2},${y2}`,
    `${x2 - ux * size + uy * size * 0.55},${y2 - uy * size - ux * size * 0.55}`,
  ].join(" ");
}

export function Arrow({
  from,
  to,
  className,
}: {
  from: [number, number];
  to: [number, number];
  className?: string;
}) {
  return (
    <g className={className}>
      <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} />
      <polyline points={arrowHead(from[0], from[1], to[0], to[1])} />
    </g>
  );
}

// The contour map of the current data, on equal axes so directions are true on screen.
export const MapFrame = forwardRef<
  SVGSVGElement,
  {
    points: Point[];
    label: string;
    children?: React.ReactNode;
    onPointerDown?: React.PointerEventHandler<SVGSVGElement>;
    clickable?: boolean;
  }
>(function MapFrame({ points, label, children, onPointerDown, clickable }, ref) {
  const rings = useMemo(
    () =>
      LEVELS.map((above) =>
        contour(points, above)
          .map((p) => `${mapX(p.m).toFixed(2)},${mapY(p.b).toFixed(2)}`)
          .join(" "),
      ),
    [points],
  );
  return (
    <svg
      ref={ref}
      className="gd-plot gd-map"
      data-clickable={clickable || undefined}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="group"
      aria-label={label}
      onPointerDown={onPointerDown}
    >
      <g className="gd-contours">
        {rings.map((ring, i) => (
          <polyline key={i} points={ring} />
        ))}
      </g>
      <g className="gd-axes" aria-hidden>
        {M_TICKS.map((t) => (
          <g key={t}>
            <line x1={mapX(t)} y1={SIZE - 6} x2={mapX(t)} y2={SIZE} />
            <text x={mapX(t)} y={SIZE - 11} textAnchor="middle">
              {t}
            </text>
          </g>
        ))}
        {B_TICKS.map((t) => (
          <g key={t}>
            <line x1={0} y1={mapY(t)} x2={6} y2={mapY(t)} />
            <text x={11} y={mapY(t) + 3}>
              {t}
            </text>
          </g>
        ))}
        <text x={SIZE - 8} y={SIZE - 24} textAnchor="end">
          m, the tilt →
        </text>
        <text x={11} y={14}>
          ↑ b, the height
        </text>
      </g>
      {children}
    </svg>
  );
});
