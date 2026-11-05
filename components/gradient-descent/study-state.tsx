"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  POINTS,
  START,
  bestFit,
  loss,
  type Params,
  type Point,
} from "@/lib/gradient-descent/regression";

export const LIMITS = { m: { min: -1.6, max: 3.6 }, b: { min: -2, max: 3.2 } };
export const Y_LIMITS = { min: -2.5, max: 3.5 };
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
export const OUTLIER: Point = { x: 1.5, y: -2.2 };

type Study = {
  points: Point[];
  edited: boolean;
  /** Points only move up and down, so a bowl with one bottom always exists. */
  setPointY: (index: number, y: number) => void;
  restorePoints: () => void;
  addOutlier: () => void;
  hasOutlier: boolean;
  theta: Params;
  /** Direct manipulation: follows the hand with no lag and cancels any animation. */
  setTheta: (t: Params) => void;
  /** A clearly labelled move to a known line. Never counted as a descent step. */
  glideTo: (t: Params, ms?: number) => void;
  error: number;
  moved: boolean;
  best: Params;
  bestError: number;
  atBest: boolean;
  /** The best line the reader made by hand on the original points, for the ending. */
  manual: Params | null;
  saveManual: () => void;
  /** How the reader did in the game, told back to them at the end. */
  game: GameResult | null;
  saveGame: (result: GameResult) => void;
};

export type GameResult = { steps: number; height: number; algorithm: number };

const StudyContext = createContext<Study | null>(null);

// One dataset and one line, shared by every figure, so they can never disagree.
export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [theta, setRaw] = useState<Params>(START);
  const [points, setPoints] = useState<Point[]>(POINTS);
  const [manual, setManual] = useState<Params | null>(null);
  const [game, saveGame] = useState<GameResult | null>(null);
  const frame = useRef(0);
  const current = useRef<Params>(START);

  const setTheta = useCallback((t: Params) => {
    cancelAnimationFrame(frame.current);
    setRaw({
      m: clamp(t.m, LIMITS.m.min, LIMITS.m.max),
      b: clamp(t.b, LIMITS.b.min, LIMITS.b.max),
    });
  }, []);

  const glideTo = useCallback((to: Params, ms = 650) => {
    cancelAnimationFrame(frame.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRaw(to);
      return;
    }
    const from = current.current;
    const began = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - began) / ms);
      // Land exactly on the target: the numbers on screen must be the real ones.
      const e = p === 1 ? 1 : 1 - (1 - p) ** 3;
      setRaw({ m: from.m + (to.m - from.m) * e, b: from.b + (to.b - from.b) * e });
      if (p < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    current.current = theta;
  }, [theta]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const setPointY = useCallback((index: number, y: number) => {
    setPoints((list) =>
      list.map((p, i) => (i === index ? { ...p, y: clamp(y, Y_LIMITS.min, Y_LIMITS.max) } : p)),
    );
  }, []);
  const restorePoints = useCallback(() => setPoints(POINTS), []);
  const addOutlier = useCallback(() => setPoints([...POINTS, OUTLIER]), []);

  const value = useMemo<Study>(() => {
    const best = bestFit(points)!;
    const edited = points !== POINTS;
    return {
      points,
      edited,
      setPointY,
      restorePoints,
      addOutlier,
      hasOutlier: points.length > POINTS.length,
      theta,
      setTheta,
      glideTo,
      error: loss(points, theta),
      moved: theta.m !== START.m || theta.b !== START.b,
      best,
      bestError: loss(points, best),
      atBest: Math.hypot(theta.m - best.m, theta.b - best.b) < 1e-3,
      manual,
      saveManual: () => {
        if (!edited && (theta.m !== START.m || theta.b !== START.b)) setManual(theta);
      },
      game,
      saveGame,
    };
  }, [points, theta, manual, game, setPointY, restorePoints, addOutlier, setTheta, glideTo]);

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy() {
  const study = useContext(StudyContext);
  if (!study) throw new Error("useStudy must be used inside StudyProvider");
  return study;
}
