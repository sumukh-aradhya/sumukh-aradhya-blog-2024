"use client";

const W = 600;
const H = 150;
const PAD = 8;

// Error over steps. Only real, finished steps are ever plotted.
export function LossChart({
  series,
  maxSteps,
  log = false,
  label,
}: {
  series: { id: string; values: number[]; className?: string; endLabel?: string }[];
  maxSteps: number;
  log?: boolean;
  label: string;
}) {
  const shape = (v: number) => (log ? Math.log10(Math.max(v, 1e-6)) : v);
  const all = series.flatMap((s) => s.values).filter(Number.isFinite).map(shape);
  const top = Math.max(...all, 0.001);
  const bottom = Math.min(...all, top - 0.001);
  const x = (i: number) => PAD + (i / Math.max(maxSteps, 1)) * (W - PAD * 2);
  const y = (v: number) => {
    const clipped = Math.min(top, Math.max(bottom, shape(v)));
    return H - PAD - ((clipped - bottom) / (top - bottom || 1)) * (H - PAD * 2);
  };

  return (
    <svg className="gd-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} className="gd-chart-axis" />
      {series.map((s) => {
        const finite = s.values.filter(Number.isFinite);
        const last = finite.length - 1;
        return (
          <g key={s.id} className={s.className}>
            <polyline
              className="gd-chart-line"
              points={finite.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ")}
            />
            {last >= 0 && <circle cx={x(last)} cy={y(finite[last])} r={3} className="gd-chart-end" />}
          </g>
        );
      })}
    </svg>
  );
}
