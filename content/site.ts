// All site copy lives here. Editing this file is editing the site.
// Future essays / research notes: add a `content/notes/` folder and a route.
// The design system (serif prose, mono evidence) already accommodates them.

export const statement = {
  kicker: "SUMUKH ARADHYA · LOS ANGELES",
  headline: "I build systems that ship without me.",
  sub: "LEAD ENGINEER AT ONETERA, REPORTING TO THE CEO · PUBLISHED LLM RESEARCHER · LEADS TECHNICAL DISCUSSIONS WITH CLIENTS",
  hint: "THE EVIDENCE FOLLOWS",
};

export const stats = [
  {
    value: "min → 10 s → <1 s",
    caption: "FULL-TURN RESPONSE TIME · PROGRAM ORCHESTRATOR",
  },
  {
    value: "219 / 0",
    caption: "SCENARIOS VERIFIED / BAD MERGES · PROVING GROUND",
  },
  {
    value: "10+",
    caption: "CITIES IN PRODUCTION · TECHNICAL LEAD FOR MUNICIPAL AND STATE CLIENTS",
  },
  {
    value: "LENOVO",
    caption: "PARTNERSHIP DRIVEN END TO END, PRODUCTION INFERENCE ON PARTNER HARDWARE",
  },
];

export type Chapter = {
  index: string;
  org: string;
  title: string;
  lede: string;
  body: string;
  metric: string;
  note: string;
  links?: { label: string; href: string }[];
  diagram: "orchestrator" | "factory" | "provingGround" | "research";
};

export const chapters: Chapter[] = [
  {
    index: "01",
    org: "ONETERA · 2025",
    title: "Program Orchestrator",
    lede: "The runtime behind every resident interaction.",
    body: "A LangGraph engine: twenty-six nodes, eighty-four typed directives, Redis checkpointing. It runs every application experience across the product suite. The foundation came out of a month of brainstorming with the CEO and building alone; then the team came aboard, and together we drove full-turn responses from minutes to ten seconds, and to sub-second on deterministic actions.",
    metric: "MINUTES → SUB-SECOND",
    note: "One month alone, then a team sport. The sub-second part happened out of stubbornness.",
    diagram: "orchestrator",
  },
  {
    index: "02",
    org: "ONETERA · 2025",
    title: "Software Factory",
    lede: "An engineering platform that writes most of our software.",
    body: "An autonomous platform: a Python runtime the size of a small company, 118 agent skills, 34 parallel git worktrees. It moved us from hand-written features to machine-generated commits merged through compliance gates. A three-engineer team now sustains sprints of fifty-plus shipped work items.",
    metric: "3 ENGINEERS · 50+ ITEMS / SPRINT",
    note: "A massive number of commits merged. I have personally read a fraction of them. That is the point.",
    diagram: "factory",
  },
  {
    index: "03",
    org: "ONETERA · 2025",
    title: "Proving Ground",
    lede: "What makes autonomous merging safe.",
    body: "Every feature must clear real-browser scenario verification and produce a sealed, content-addressed evidence bundle before merge, with verdicts that keep infrastructure faults from being scored as product failures. Two hundred nineteen scenarios, proven live on a full sprint.",
    metric: "219 SCENARIOS · 0 BAD MERGES",
    note: "Its first live sprint caught five real faults. None of them were the failures I designed it for.",
    diagram: "provingGround",
  },
  {
    index: "04",
    org: "PUBLISHED RESEARCH · 2024–25",
    title: "QDyLoRA + Contrastive RAG",
    lede: "Making near-SOTA code review cheap to train.",
    body: "Fine-tuned Llama-3 3B with QDyLoRA to near state-of-the-art code-review performance at a fraction of full fine-tuning memory cost, then designed a contrastive RAG framework for context compression that improved inference quality on open-source code-review benchmarks.",
    metric: "NEAR-SOTA AT 3B PARAMETERS",
    note: "A 3B model on a grad-student GPU budget. The constraint turned out to be the feature.",
    links: [
      { label: "SPRINGER", href: "https://link.springer.com/chapter/10.1007/978-3-032-14107-1_31" },
      { label: "IEEE XPLORE", href: "https://ieeexplore.ieee.org/abstract/document/11676956" },
    ],
    diagram: "research",
  },
];

export const foundation = {
  kicker: "THE FOUNDATION",
  quote:
    "The majority of Onetera's product surface area runs on an architecture I drew. The part I'm proudest of is that the team now builds on it faster than I ever could alone.",
};

export type RecordRow = {
  years: string;
  title: string;
  note: string;
  href?: string;
};

export const record: RecordRow[] = [
  {
    years: "SINCE 2025",
    title: "Onetera Technologies · Lead Engineer",
    note: "Third engineering hire. Every major surface, production in 10+ cities.",
  },
  {
    years: "2025",
    title: "Lenovo partnership",
    note: "Production inference on partner hardware. Featured in Lenovo's AI case study",
    href: "https://www.lenovo.com/us/en/case-studies-customer-success-stories/onetera",
  },
  {
    years: "2024–25",
    title: "Research · QDyLoRA fine-tuning + contrastive RAG",
    note: "Near-SOTA code review at a fraction of the fine-tuning memory cost.",
  },
  {
    years: "2023–25",
    title: "San Jose State University",
    note: "M.S. Computer Science.",
  },
  {
    years: "2024",
    title: "CalHacks 11.0",
    note: "First place, Hume AI track.",
  },
  {
    years: "2024",
    title: "Inhabitr · Machine Learning Intern",
    note: "YOLO matching, inpainting pipelines, a Llama-3 market-insights agent.",
  },
  {
    years: "2021–23",
    title: "Zebra Technologies · Software Engineer, Component Lead",
    note: "Selective testing that cut ~6 hours from every regression cycle.",
  },
  {
    years: "2017–21",
    title: "Ramaiah Institute of Technology",
    note: "B.E. Computer Science. One patent filed, one paper published.",
  },
];

export const now = {
  date: "AUG 2026",
  cadence: "UPDATED MONTHLY",
  rows: [
    { label: "BUILDING", value: "the lab, one hard idea at a time", href: "/lab" },
    { label: "LISTENING", value: "R&B, on repeat" },
    { label: "READING", value: "simulation theory, with appropriate suspicion" },
    { label: "COOKING", value: "thai curry pasta, accidental but repeatable" },
    { label: "DRIVING", value: "PCH to Santa Monica, again" },
  ],
};

export const gallery = [
  { src: "/images/gallery/grandcanyon.jpg", label: "GRAND CANYON · ARIZONA" },
  { src: "/images/gallery/la.jpg", label: "GRIFFITH OBSERVATORY · LOS ANGELES" },
  { src: "/images/gallery/lv.jpg", label: "LAS VEGAS · NEVADA" },
  { src: "/images/gallery/cresent.jpg", label: "SEQUOIA NATIONAL PARK · CALIFORNIA" },
  { src: "/images/gallery/dv1.jpg", label: "DEATH VALLEY · CALIFORNIA" },
  { src: "/images/gallery/dv2.jpg", label: "DEATH VALLEY · CALIFORNIA" },
  { src: "/images/gallery/dv3.jpg", label: "BADWATER BASIN · CALIFORNIA" },
  { src: "/images/gallery/ari.jpg", label: "TEMPE · ARIZONA" },
  { src: "/images/gallery/sf.jpg", label: "GOLDEN GATE BRIDGE · CALIFORNIA" },
  { src: "/images/gallery/sj.jpg", label: "SAN JOSE · CALIFORNIA" },
  { src: "/images/gallery/17mile.jpg", label: "17 MILE DRIVE · CALIFORNIA" },
  { src: "/images/gallery/ptreyes.jpg", label: "POINT REYES · CALIFORNIA" },
  { src: "/images/gallery/malay.jpg", label: "KILIM GEOFOREST PARK · MALAYSIA" },
  { src: "/images/gallery/oregon.jpg", label: "MANZANITA LAKE · OREGON" },
  { src: "/images/gallery/sandiego.jpg", label: "TORREY PINES RESERVE · SAN DIEGO" },
  { src: "/images/gallery/mcway.jpg", label: "MCWAY FALLS · CALIFORNIA" },
  { src: "/images/gallery/bixby.jpg", label: "BIXBY BRIDGE · CALIFORNIA" },
  { src: "/images/gallery/tiburon.jpg", label: "BELVEDERE TIBURON · CALIFORNIA" },
  { src: "/images/gallery/inverness.jpg", label: "INVERNESS · CALIFORNIA" },
  { src: "/images/gallery/lavabeds.jpg", label: "LAVA BEDS NATIONAL MONUMENT · CALIFORNIA" },
];

export const closing = {
  line: "Los Angeles. Usually building. Occasionally somewhere on Highway 1.",
  links: [
    { label: "EMAIL", href: "mailto:sumukhnaveenaradhya@gmail.com" },
    { label: "GITHUB", href: "https://github.com/sumukh-aradhya" },
    { label: "LINKEDIN", href: "https://www.linkedin.com/in/sumukh-n-aradhya" },
    { label: "GOOGLE SCHOLAR", href: "https://scholar.google.com/citations?user=Lrl2DLwAAAAJ&hl=en" },
  ],
};

export const colophon = ["© 2026 SUMUKH ARADHYA"];
