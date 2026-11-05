"use client";

import { useLenis } from "lenis/react";

// A real anchor, so it still works without JavaScript. With JavaScript it
// scrolls through Lenis, and jumps instantly under reduced motion.
export function ScrollLink({
  href,
  className,
  children,
  ariaCurrent,
  ariaLabel,
}: {
  href: `#${string}`;
  className?: string;
  children: React.ReactNode;
  ariaCurrent?: boolean;
  ariaLabel?: string;
}) {
  const lenis = useLenis();
  return (
    <a
      href={href}
      className={className}
      aria-current={ariaCurrent ? "true" : undefined}
      aria-label={ariaLabel}
      onClick={(e) => {
        if (!lenis) return;
        e.preventDefault();
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        lenis.scrollTo(href, { duration: 1.4, immediate: reduced });
        history.replaceState(null, "", href);
      }}
    >
      {children}
    </a>
  );
}
