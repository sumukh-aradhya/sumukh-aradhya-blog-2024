"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { orb as orbCopy } from "@/content/lab";
import { ART, CURVE_PATH, DOMAIN, REST_X, descend, orbPosition } from "@/lib/lab/curve";

const ORB_LIFT = 21;
const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const REST = orbPosition(REST_X, ORB_LIFT);

const easeOut = (t: number) => 1 - (1 - t) * (1 - t);

export function Descent() {
  const stageRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const startX = useRef(REST_X);
  const dragged = useRef(false);
  const [touched, setTouched] = useState(false);

  const place = useCallback((x: number) => {
    const orb = orbRef.current;
    if (!orb) return;
    const p = orbPosition(x, ORB_LIFT);
    orb.style.left = pct(p.x, ART.width);
    orb.style.top = pct(p.y, ART.height);
    orb.setAttribute("aria-valuenow", String(Math.round(x)));
  }, []);

  const stop = useCallback(() => cancelAnimationFrame(frame.current), []);

  const run = useCallback(
    (from: number) => {
      stop();
      startX.current = from;
      const { iterates } = descend(from, orbCopy.eta, orbCopy.maxSteps);
      const last = iterates.length - 1;
      // A long way down plays faster, so the orb always reaches the bottom.
      const msPerStep = Math.min(orbCopy.msPerStep, orbCopy.maxRollMs / Math.max(last, 1));

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || last === 0) {
        place(iterates[last]);
        return;
      }

      const began = performance.now();
      const tick = (now: number) => {
        const progress = (now - began) / msPerStep;
        const step = Math.floor(progress);
        if (step >= last) {
          place(iterates[last]);
          return;
        }
        place(iterates[step] + (iterates[step + 1] - iterates[step]) * easeOut(progress - step));
        frame.current = requestAnimationFrame(tick);
      };
      frame.current = requestAnimationFrame(tick);
    },
    [place, stop],
  );

  // One descent on arrival, then it is yours. Reduced motion stays at rest.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => {
      if (!dragged.current) run(REST_X);
    }, 900);
    return () => {
      window.clearTimeout(id);
      stop();
    };
  }, [run, stop]);

  const xFromPointer = (clientX: number) => {
    const rect = stageRef.current!.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * ART.width;
    return Math.min(DOMAIN.max, Math.max(DOMAIN.min, x));
  };

  const moveTo = (x: number) => {
    stop();
    dragged.current = true;
    startX.current = x;
    place(x);
    setTouched(true);
  };

  return (
    <>
      <div className="lab-art">
        {/* A native image drag would cancel the pointer and strand the orb. */}
        <div className="lab-stage" ref={stageRef} onDragStart={(e) => e.preventDefault()}>
          <Image
            src="/images/lab/hero.webp"
            alt=""
            fill
            priority
            unoptimized
            draggable={false}
            className="lab-art-image"
          />
          <svg
            className="lab-curve"
            viewBox={`0 0 ${ART.width} ${ART.height}`}
            aria-hidden
          >
            <path d={CURVE_PATH} />
          </svg>
          <div
            ref={orbRef}
            className="lab-orb"
            data-cursor
            role="slider"
            tabIndex={0}
            aria-label="An orb on a curve. Arrow keys move it, Enter lets it roll back down."
            aria-valuemin={DOMAIN.min}
            aria-valuemax={DOMAIN.max}
            aria-valuenow={REST_X}
            style={{ left: pct(REST.x, ART.width), top: pct(REST.y, ART.height) }}
            data-lenis-prevent
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              moveTo(xFromPointer(e.clientX));
            }}
            onPointerMove={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                moveTo(xFromPointer(e.clientX));
              }
            }}
            onPointerUp={(e) => {
              e.currentTarget.releasePointerCapture(e.pointerId);
              run(startX.current);
            }}
            onPointerCancel={() => run(startX.current)}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                e.preventDefault();
                const delta = e.key === "ArrowLeft" ? -20 : 20;
                moveTo(Math.min(DOMAIN.max, Math.max(DOMAIN.min, startX.current + delta)));
              } else if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setTouched(true);
                run(startX.current);
              }
            }}
          />
        </div>
      </div>

      <p className="lab-hint" data-touched={touched} aria-hidden>
        {orbCopy.hint}
      </p>
    </>
  );
}
