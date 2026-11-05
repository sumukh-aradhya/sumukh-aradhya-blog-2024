// All Lab copy lives here. Editing this file is editing the Lab.
// Everything is written in lowercase, on purpose. Keep it that way.

export const hero = {
  titleLines: ["a space where", "i turn hard ideas", "into"],
  titleItalic: "intuition",
  body: "trying to make computer science simple enough to play with",
  action: "see the studies",
};

export const orb = {
  hint: "go on, drag it",
  // Deliberately stable: on this page the orb always finds the bottom.
  eta: 0.05,
  msPerStep: 110,
  maxSteps: 2000,
  maxRollMs: 3200,
};

export const finder = {
  heading: "start here",
  searchLabel: "search the studies",
  placeholder: "what never quite clicked?",
  empty: "nothing on that yet, give it time",
  // How many cards show before anyone searches.
  topCount: 6,
};

export type StudyStatus = "published" | "in_progress";

export type Study = {
  id: string;
  title: [string, string];
  description: string;
  status: StudyStatus;
  /** Set by hand. Higher shows first, ties keep their order in this file. Never shown. */
  rating: number;
  /** The one thing this study explains. Shown as the pill on the study. */
  concept: string;
  /** Shown on the study, and the hook for grouping studies later. */
  topic: string;
  /** Extra search terms that the rest of the entry doesn't already cover. */
  keywords: string[];
  /** Set this once the page exists: the study becomes a link, whatever its status. */
  href?: string;
  /** Only the top rated studies show art. A study can ship without one. */
  cover?: string;
  focus?: string;
};

export const statusLabel: Record<StudyStatus, string> = {
  published: "read it",
  in_progress: "in progress",
};

export const studies: Study[] = [
  {
    id: "001",
    title: ["the geometry", "of learning"],
    description: "move one data point and watch the model change its mind",
    status: "published",
    href: "/lab/gradient-descent",
    rating: 5,
    concept: "gradient descent",
    topic: "machine learning",
    keywords: ["optimization", "loss", "training", "neural networks", "ai"],
    cover: "/images/lab/study-001-square.webp",
    focus: "50% 50%",
  },
];

// Art and a label, nothing else: unannounced studies say nothing about
// themselves and can't be found by search. When one is ready, delete it here
// and add it to `studies`. Working titles stay in this comment so they never
// reach the browser: 002 The Agent Doom Loop ("Why smart agents get stuck
// repeating the same mistake"), 003 The One-Line Outage ("How one changed line
// takes down everything downstream").
export const comingSoon = {
  label: "coming soon",
  covers: [
    { id: "002", cover: "/images/lab/study-002-square.webp", focus: "50% 50%" },
    { id: "003", cover: "/images/lab/study-003-square.webp", focus: "50% 50%" },
  ],
};

export const footer = {
  // The way back to the home page.
  homeLink: "exit through the gift shop",
  copyright: "© 2026 sumukh aradhya",
};

export const meta = {
  title: "lab · sumukh aradhya",
  description:
    "a space where i turn hard ideas into intuition. trying to make computer science simple enough to play with",
};
