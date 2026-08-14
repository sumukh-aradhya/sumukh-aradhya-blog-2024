"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

// One signature interaction: a wax dot that trails the pointer and
// widens over anything interactive. Fine pointers only.
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 45, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 500, damping: 45, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as Element | null;
      setActive(!!target?.closest("a, button, [data-cursor]"));
    };
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full bg-wax"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{
        opacity: visible ? 1 : 0,
        width: active ? 28 : 6,
        height: active ? 28 : 6,
        backgroundColor: active ? "rgba(193, 62, 56, 0.25)" : "#c13e38",
      }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
