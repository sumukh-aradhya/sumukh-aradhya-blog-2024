"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLenis } from "lenis/react";

export type Chapter = {
  id: string;
  label: string;
  /** "play" fills the screen. "side" puts words beside the figure, "top" above it. */
  layout: "play" | "side" | "top" | "story";
  /** The question that leads into this screen. It's what the next button says. */
  ask?: string;
  /** What this screen taught, in one line. Shown once you're on it. */
  learned?: string;
  title?: string;
  lead?: React.ReactNode;
  figure: React.ReactNode;
  deeper?: { q: string; a: React.ReactNode }[];
  deeperLabel?: string;
};

const DeckContext = createContext<{ current: string; go: (id: string) => void }>({
  current: "",
  go: () => {},
});
export const useDeck = () => useContext(DeckContext);

// The study is a short sequence of screens, not one long page. Everything stays
// mounted, so what you did on one screen is still there when you come back.
export function Deck({ chapters }: { chapters: Chapter[] }) {
  const [index, setIndex] = useState(0);
  const [deeper, setDeeper] = useState(false);
  const lenis = useLenis();
  const titles = useRef<(HTMLElement | null)[]>([]);
  const chapter = chapters[index];
  const previous = chapters[index - 1];
  const next = chapters[index + 1];

  const goTo = useCallback(
    (i: number, fromUser = true) => {
      if (i < 0 || i >= chapters.length) return;
      setIndex(i);
      setDeeper(false);
      history.replaceState(null, "", `#${chapters[i].id}`);
      lenis?.scrollTo(0, { immediate: true, force: true });
      if (fromUser) {
        window.scrollTo(0, 0);
        requestAnimationFrame(() => titles.current[i]?.focus({ preventScroll: true }));
      }
    },
    [chapters, lenis],
  );

  const go = useCallback(
    (id: string) => goTo(chapters.findIndex((c) => c.id === id)),
    [chapters, goTo],
  );

  // A shared link opens on its screen.
  useEffect(() => {
    const found = chapters.findIndex((c) => `#${c.id}` === window.location.hash);
    if (found > 0) goTo(found, false);
  }, [chapters, goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDeeper(false);
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey || deeper) return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const target = e.target as HTMLElement;
      // Arrow keys belong to sliders, inputs and the game while they have focus.
      if (target.closest("input, [role='slider'], [role='application'], textarea")) return;
      setIndex((i) => {
        const to = i + (e.key === "ArrowRight" ? 1 : -1);
        if (to >= 0 && to < chapters.length) {
          queueMicrotask(() => goTo(to));
        }
        return i;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chapters, deeper, goTo]);

  return (
    <DeckContext.Provider value={{ current: chapter.id, go }}>
      <div className="gd-deck">
        <main className="gd-screens">
          {chapters.map((c, i) => (
            <section
              key={c.id}
              id={c.id}
              className={`gd-screen gd-screen-${c.layout}`}
              data-active={i === index}
              aria-label={c.label}
            >
              {c.layout !== "play" && (
                <div className="gd-words">
                  <h2
                    tabIndex={-1}
                    ref={(el) => {
                      titles.current[i] = el;
                    }}
                  >
                    {c.title}
                  </h2>
                  <div className="gd-lead-text">{c.lead}</div>
                  {c.learned && <p className="gd-learned-inline">{c.learned}</p>}
                  {c.deeper && (
                    <button type="button" className="gd-deeper-button" onClick={() => setDeeper(true)}>
                      {c.deeperLabel ?? "go deeper"} <span aria-hidden>+</span>
                    </button>
                  )}
                </div>
              )}
              <div className="gd-screen-figure">{c.figure}</div>

              {/* Without JavaScript there's no drawer, so the detail just sits under each screen. */}
              {c.deeper && (
                <aside
                  className="gd-drawer"
                  data-open={deeper && i === index}
                  aria-label={`go deeper on ${c.label}`}
                  data-lenis-prevent
                >
                  <div className="gd-drawer-head">
                    <p>{c.deeperLabel ?? "go deeper"}</p>
                    <button type="button" className="gd-chip" onClick={() => setDeeper(false)}>
                      close
                    </button>
                  </div>
                  {c.deeper.map((d) => (
                    <div key={d.q} className="gd-answer">
                      <h3>{d.q}</h3>
                      {/* Its own wrapper: a large page arrives in pieces, and this mustn't read as an unkeyed list. */}
                      <div>{d.a}</div>
                    </div>
                  ))}
                </aside>
              )}
            </section>
          ))}
        </main>

        {deeper && <button type="button" className="gd-veil" aria-label="close" onClick={() => setDeeper(false)} />}

        <nav className="gd-nav" aria-label="screens of this study">
          <button
            type="button"
            className="gd-nav-back"
            disabled={!previous}
            aria-label={previous ? `back to ${previous.label}` : "back"}
            onClick={() => goTo(index - 1)}
          >
            ←
          </button>
          <ol className="gd-dots">
            {chapters.map((c, i) => (
              <li key={c.id}>
                <button
                  type="button"
                  aria-label={`${i + 1}: ${c.label}`}
                  aria-current={i === index ? "step" : undefined}
                  data-done={i < index || undefined}
                  title={c.label}
                  onClick={() => goTo(i)}
                />
              </li>
            ))}
          </ol>
          <p className="gd-nav-place">
            {index + 1} of {chapters.length}
          </p>
          {chapter.learned && (
            <p className="gd-learned" aria-live="polite">
              <span>so far</span> {chapter.learned}
            </p>
          )}
          {next ? (
            <button type="button" className="gd-button gd-button-solid gd-nav-next" onClick={() => goTo(index + 1)}>
              {next.ask ?? next.label} <span aria-hidden>→</span>
            </button>
          ) : (
            <Link href="/lab" className="gd-button gd-button-solid gd-nav-next">
              back to the lab <span aria-hidden>→</span>
            </Link>
          )}
        </nav>
      </div>
    </DeckContext.Provider>
  );
}
