"use client";

import { motion } from "motion/react";
import { statement } from "@/content/site";

const ease = [0.22, 1, 0.36, 1] as const;

export function Statement() {
  return (
    <section className="relative flex min-h-svh flex-col justify-center px-6 md:px-[12vw]">
      <motion.p
        className="label"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease }}
      >
        {statement.kicker}
      </motion.p>

      <motion.h1
        className="mt-8 max-w-[16ch] text-[clamp(2.75rem,8.5vw,8rem)] leading-[1.02] tracking-[-0.02em]"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease }}
      >
        {statement.headline}
      </motion.h1>

      <motion.p
        className="label label-dim mt-10"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease }}
      >
        {statement.sub}
      </motion.p>

      <motion.div
        className="absolute bottom-10 left-6 flex items-center gap-3 md:left-[12vw]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9, ease }}
      >
        <span className="wax-dot" />
        <span className="label label-dim">{statement.hint}</span>
      </motion.div>
    </section>
  );
}
