// Generic dashed-line schematics — the site's diagram language.
// Deliberately abstract: shapes of systems, not internals.

const fog = "#6d7b71";
const fogDeep = "#39443c";
const wax = "#c13e38";

const labelStyle = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: 9,
  letterSpacing: 1.5,
  fill: fog,
} as const;

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 480 340"
      className="h-auto w-full"
      role="img"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function OrchestratorDiagram() {
  const nodes: [number, number][] = [
    [140, 70], [140, 170], [140, 270],
    [250, 50], [250, 130], [250, 220], [250, 290],
    [350, 110], [350, 230],
  ];
  const edges: [number, number, number, number][] = [
    [50, 170, 140, 70], [50, 170, 140, 170], [50, 170, 140, 270],
    [140, 70, 250, 50], [140, 70, 250, 130], [140, 170, 250, 130],
    [140, 170, 250, 220], [140, 270, 250, 220], [140, 270, 250, 290],
    [250, 50, 350, 110], [250, 130, 350, 110], [250, 220, 350, 230],
    [250, 290, 350, 230], [350, 110, 430, 170], [350, 230, 430, 170],
  ];
  return (
    <Frame>
      {edges.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={fogDeep}
          strokeDasharray="4 5"
        />
      ))}
      {/* The deterministic path — the sub-second one. */}
      <path
        d="M50 170 L140 170 L250 130 L350 110 L430 170"
        fill="none"
        stroke={wax}
        strokeWidth={1.25}
      />
      {nodes.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={7} fill="#050807" stroke={fog} />
      ))}
      <circle cx={50} cy={170} r={7} fill="#050807" stroke={wax} />
      <circle cx={430} cy={170} r={7} fill="#050807" stroke={wax} />
      <text x={36} y={200} style={labelStyle}>ENTRY</text>
      <text x={398} y={200} style={labelStyle}>RESPONSE</text>
      <text x={150} y={320} style={{ ...labelStyle, fill: wax }}>
        DETERMINISTIC PATH · SUB-SECOND
      </text>
    </Frame>
  );
}

export function FactoryDiagram() {
  const lanes = [60, 120, 180, 240, 300];
  return (
    <Frame>
      <line x1={30} y1={180} x2={110} y2={180} stroke={fog} />
      {lanes.map((y, i) => (
        <g key={y}>
          <path
            d={`M110 180 C150 180 150 ${y} 190 ${y}`}
            fill="none"
            stroke={fogDeep}
            strokeDasharray="4 5"
          />
          <line x1={190} y1={y} x2={290} y2={y} stroke={fogDeep} strokeDasharray="4 5" />
          <path
            d={`M290 ${y} C330 ${y} 330 180 356 180`}
            fill="none"
            stroke={fogDeep}
            strokeDasharray="4 5"
          />
          <text x={198} y={y - 8} style={labelStyle}>
            {i === 2 ? "WT · ···" : `WT · ${String(i < 2 ? i + 1 : 31 + i).padStart(2, "0")}`}
          </text>
        </g>
      ))}
      <rect x={356} y={150} width={64} height={60} fill="none" stroke={wax} strokeWidth={1.25} />
      <text x={366} y={185} style={{ ...labelStyle, fill: wax }}>GATE</text>
      <line x1={420} y1={180} x2={456} y2={180} stroke={fog} />
      <text x={30} y={210} style={labelStyle}>SPEC</text>
      <text x={430} y={210} style={labelStyle}>MAIN</text>
      <text x={150} y={330} style={labelStyle}>34 PARALLEL WORKTREES · COMPLIANCE GATED</text>
    </Frame>
  );
}

export function ResearchDiagram() {
  return (
    <Frame>
      <rect x={30} y={140} width={80} height={56} fill="none" stroke={fog} />
      <text x={48} y={172} style={labelStyle}>QUERY</text>

      <line x1={110} y1={168} x2={158} y2={168} stroke={fogDeep} strokeDasharray="4 5" />

      <rect x={158} y={140} width={96} height={56} fill="none" stroke={fog} />
      <text x={170} y={172} style={labelStyle}>RETRIEVER</text>

      {/* Contrastive split: positives kept, negatives pushed away. */}
      <path d="M254 154 C286 154 286 96 316 96" fill="none" stroke={fogDeep} strokeDasharray="4 5" />
      <path d="M254 182 C286 182 286 240 316 240" fill="none" stroke={fogDeep} strokeDasharray="4 5" />
      <text x={316} y={84} style={labelStyle}>POSITIVE CTX</text>
      <text x={316} y={228} style={labelStyle}>NEGATIVE CTX</text>
      <line x1={316} y1={96} x2={376} y2={96} stroke={fogDeep} strokeDasharray="4 5" />
      <line x1={316} y1={240} x2={376} y2={240} stroke={fogDeep} strokeDasharray="2 6" />

      <rect x={376} y={68} width={80} height={56} fill="none" stroke={wax} strokeWidth={1.25} />
      <text x={386} y={92} style={{ ...labelStyle, fill: wax }}>COMPRESSED</text>
      <text x={386} y={106} style={{ ...labelStyle, fill: wax }}>CONTEXT</text>

      <path d="M416 124 L416 168 L456 168" fill="none" stroke={fog} />
      <text x={400} y={196} style={labelStyle}>LLAMA-3 · 3B</text>
      <text x={330} y={310} style={labelStyle}>QDYLORA · FRACTION OF FULL FT MEMORY</text>
    </Frame>
  );
}

export function ProvingGroundDiagram() {
  return (
    <Frame>
      <rect x={30} y={140} width={92} height={56} fill="none" stroke={fog} />
      <text x={44} y={172} style={labelStyle}>FEATURE</text>

      <line x1={122} y1={168} x2={180} y2={168} stroke={fogDeep} strokeDasharray="4 5" />

      <rect x={180} y={140} width={128} height={56} fill="none" stroke={fog} />
      <text x={192} y={164} style={labelStyle}>REAL-BROWSER</text>
      <text x={192} y={180} style={labelStyle}>SCENARIOS × 219</text>

      {/* Infra faults exit sideways — never scored as product failures. */}
      <path
        d="M244 196 L244 250 L300 250"
        fill="none"
        stroke={fogDeep}
        strokeDasharray="4 5"
      />
      <text x={308} y={254} style={labelStyle}>INFRA FAULT · QUARANTINED</text>

      <line x1={308} y1={168} x2={358} y2={168} stroke={fogDeep} strokeDasharray="4 5" />

      <circle cx={398} cy={168} r={34} fill="none" stroke={wax} strokeWidth={1.25} />
      <circle cx={398} cy={168} r={24} fill="none" stroke={wax} strokeDasharray="3 4" />
      <text x={378} y={172} style={{ ...labelStyle, fill: wax }}>SEALED</text>
      <text x={318} y={230} style={labelStyle}>CONTENT-ADDRESSED</text>
      <text x={318} y={244} style={labelStyle}>EVIDENCE BUNDLE</text>
    </Frame>
  );
}
