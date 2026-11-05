"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { comingSoon, finder, statusLabel, studies, type Study } from "@/content/lab";
import { Brand } from "@/components/lab/brand";

const byRating = [...studies].sort((a, b) => b.rating - a.rating);
const topStudies = byRating.slice(0, finder.topCount);
const topComingSoon = comingSoon.covers.slice(0, finder.topCount - topStudies.length);

const toWords = (text: string) => text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

// Every word typed has to start a word in the study, so "ai" can't match "failure".
function search(query: string) {
  const typed = toWords(query);
  return byRating.filter((study) => {
    const words = toWords(
      [study.title.join(" "), study.description, study.concept, study.topic, ...study.keywords].join(
        " ",
      ),
    );
    return typed.every((part) => words.some((word) => word.startsWith(part)));
  });
}

function isLive(study: Study) {
  return Boolean(study.href);
}

function StudyCard({ study }: { study: Study }) {
  const inner = (
    <>
      <div className="lab-card-art">
        {study.cover && (
          <Image
            src={study.cover}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 768px) 30vw, 100vw"
            style={{ objectPosition: study.focus }}
          />
        )}
        <div className="lab-card-head">
          <p className="lab-card-topic">{study.topic}</p>
          <h3 className="lab-card-title">
            {study.title[0]}
            <br />
            {study.title[1]}
          </h3>
        </div>
        <p className="lab-pill">{study.concept}</p>
      </div>
      <div className="lab-card-caption">
        <p>{study.description}</p>
        <p className="label label-dim">{statusLabel[study.status]}</p>
      </div>
    </>
  );

  return isLive(study) ? (
    <Link href={study.href!} className="lab-card lab-card-live">
      {inner}
    </Link>
  ) : (
    <article className="lab-card">{inner}</article>
  );
}

function ComingSoonCard({ cover, focus }: { cover: string; focus: string }) {
  return (
    <article className="lab-card lab-card-soon">
      <div className="lab-card-art">
        <Image
          src={cover}
          alt=""
          fill
          unoptimized
          sizes="(min-width: 768px) 30vw, 100vw"
          style={{ objectPosition: focus }}
        />
      </div>
      <div className="lab-card-caption">
        <p className="label label-dim">{comingSoon.label}</p>
      </div>
    </article>
  );
}

function StudyRow({ study }: { study: Study }) {
  const inner = (
    <>
      <span className="lab-row-title">{study.title.join(" ")}</span>
      <span className="lab-row-description">{study.description}</span>
      <span className="lab-row-meta">
        <span className="lab-pill">{study.concept}</span>
      </span>
      <span className="label label-dim lab-row-meta">{statusLabel[study.status]}</span>
    </>
  );

  return (
    <li>
      {isLive(study) ? (
        <Link href={study.href!} className="lab-row lab-row-live">
          {inner}
        </Link>
      ) : (
        <div className="lab-row">{inner}</div>
      )}
    </li>
  );
}

export function StudyFinder() {
  const lenis = useLenis();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [stuck, setStuck] = useState(false);

  const searching = query.trim().length > 0;
  const results = searching ? search(query) : [];

  // The brand joins the bar once the bar has pinned to the top of the screen.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => {
      setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // "/" jumps to the search from anywhere on the page.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, [contenteditable='true']")) return;
      e.preventDefault();
      const input = inputRef.current;
      if (!input) return;
      input.focus({ preventScroll: true });
      const top = input.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight - 80) {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const section = input.closest("section");
        if (lenis && section) lenis.scrollTo(section, { duration: 1, immediate: reduced });
        else input.scrollIntoView({ block: "center" });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lenis]);

  return (
    <div className="lab-finder" data-searching={searching}>
      <div ref={sentinelRef} className="lab-sentinel" aria-hidden />
      <div className="lab-bar" data-stuck={stuck}>
        <div className="lab-bar-home">
          <Brand />
        </div>
        <form
          role="search"
          className="lab-search"
          onSubmit={(e) => {
            e.preventDefault();
            inputRef.current?.blur();
          }}
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
            <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" />
            <path d="M10.5 10.5 14 14" fill="none" stroke="currentColor" />
          </svg>
          <label htmlFor="lab-search" className="sr-only">
            {finder.searchLabel}
          </label>
          <input
            ref={inputRef}
            id="lab-search"
            type="search"
            autoComplete="off"
            spellCheck={false}
            placeholder={finder.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setQuery("");
                e.currentTarget.blur();
              }
            }}
          />
          <kbd aria-hidden>/</kbd>
        </form>
      </div>

      {searching ? (
        <div className="lab-results">
          <p className="label label-dim" role="status">
            {results.length === 0
              ? finder.empty
              : `${results.length} ${results.length === 1 ? "STUDY" : "STUDIES"}`}
          </p>
          {results.length > 0 && (
            <ul>
              {results.map((study) => (
                <StudyRow key={study.id} study={study} />
              ))}
            </ul>
          )}
        </div>
      ) : (
        <>
          <h2 className="lab-finder-heading">{finder.heading}</h2>
          <div className="lab-grid">
            {topStudies.map((study) => (
              <StudyCard key={study.id} study={study} />
            ))}
            {topComingSoon.map((item) => (
              <ComingSoonCard key={item.id} cover={item.cover} focus={item.focus} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
