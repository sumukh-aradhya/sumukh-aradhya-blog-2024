"use client";

import { useState } from "react";
import { BatchNoise, SaddleHill } from "@/components/gradient-descent/real-hills";
import { Valley } from "@/components/gradient-descent/valley";

const TABS = [
  { id: "slow", label: "it's slow", line: "when one direction is much steeper, you bounce between the walls instead of moving forward" },
  { id: "stuck", label: "it gets stuck", line: "flat ground looks like the bottom. this is a new hill with 2 valleys and a flat saddle between them" },
  { id: "noisy", label: "it's noisy", line: "real training only checks a few points per step. it's far cheaper, but every step is a rough guess" },
] as const;

export function WhatGoesWrong() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("slow");
  const current = TABS.find((t) => t.id === tab)!;
  return (
    <div className="gd-wrong">
      <div className="gd-chips" role="group" aria-label="what goes wrong">
        {TABS.map((t) => (
          <button key={t.id} type="button" className="gd-chip" aria-pressed={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <p className="gd-wrong-line">{current.line}</p>
      {tab === "slow" && <Valley />}
      {tab === "stuck" && <SaddleHill />}
      {tab === "noisy" && <BatchNoise />}
    </div>
  );
}
