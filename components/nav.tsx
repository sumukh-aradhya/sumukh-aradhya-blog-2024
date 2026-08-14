"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";

const items = [
  { label: "WORK", target: "#work" },
  { label: "RECORD", target: "#record" },
  { label: "NOW", target: "#now" },
];

// Absent on arrival — the opening statement gets the whole frame.
// Appears once the reader commits to scrolling.
export function Nav() {
  const [shown, setShown] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (target: string) => {
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-pine/70 backdrop-blur-md"
      initial={{ y: "-100%" }}
      animate={{ y: shown ? "0%" : "-100%" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between px-6 py-3 md:px-12">
        <button
          onClick={() => lenis?.scrollTo(0, { duration: 1.4 })}
          className="label transition-colors duration-200 hover:text-bone"
        >
          SUMUKH
        </button>
        <nav className="flex gap-6 md:gap-10">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => go(item.target)}
              className="label transition-colors duration-200 hover:text-bone"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
