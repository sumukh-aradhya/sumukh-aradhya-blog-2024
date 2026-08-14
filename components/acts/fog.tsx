"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import { stats } from "@/content/site";

// Act 2 — the fog bank. A real dusk in Inverness, CA, graded dark.
// The photograph sharpens into view, then blurs as the numbers settle over it.
export function Fog() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageOpacity = useTransform(scrollYProgress, [0, 0.14], [0, 1]);
  const blur = useTransform(scrollYProgress, [0.2, 0.85], [0, 14]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1.06, 1]);
  const filter = useMotionTemplate`brightness(0.5) saturate(0.75) blur(${blur}px)`;

  return (
    <div ref={ref} className="relative h-[340vh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ opacity: imageOpacity, scale }}
        >
          <motion.div className="absolute inset-0" style={{ filter }}>
            <Image
              src="/images/fog-inverness.jpg"
              alt="Fog over Tomales Bay at dusk, Inverness, California"
              fill
              sizes="100vw"
              quality={90}
              className="object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Fog belongs to the dark — blend the frame into pine at both edges. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[22vh] bg-gradient-to-b from-pine to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[22vh] bg-gradient-to-t from-pine to-transparent" />

        <div className="relative flex h-full flex-col justify-center gap-14 px-6 md:px-[12vw]">
          {stats.map((stat, i) => (
            <Stat
              key={stat.caption}
              value={stat.value}
              caption={stat.caption}
              progress={scrollYProgress}
              start={0.22 + i * 0.15}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({
  value,
  caption,
  progress,
  start,
}: {
  value: string;
  caption: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
}) {
  const opacity = useTransform(progress, [start, start + 0.07], [0, 1]);
  const y = useTransform(progress, [start, start + 0.07], [12, 0]);

  return (
    <motion.div style={{ opacity, y }}>
      <p className="font-mono text-[clamp(1.75rem,4.5vw,3.75rem)] tracking-tight text-bone">
        {value}
      </p>
      <p className="label label-dim mt-2">{caption}</p>
    </motion.div>
  );
}
