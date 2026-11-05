import Image from "next/image";
import { now, gallery, closing, colophon } from "@/content/site";
import { Reveal } from "@/components/reveal";

export function Person() {
  return (
    <section id="now" className="px-6 pt-[18vh] md:px-[12vw]">
      {/* NOW — the page's living element. */}
      <Reveal>
        <div className="flex items-baseline justify-between border-t border-hairline pt-6">
          <p className="label">
            NOW · {now.date}
          </p>
          <p className="label label-dim flex items-center gap-2">
            <span className="wax-dot" /> {now.cadence}
          </p>
        </div>
        <div className="mt-10 flex flex-col gap-4">
          {now.rows.map((row) => (
            <div key={row.label} className="grid grid-cols-12 gap-4">
              <p className="label col-span-4 md:col-span-2">{row.label}</p>
              <p className="col-span-8 font-mono text-sm text-fog-light md:col-span-10">
                {row.value}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* SNAPSHOTS OF SERENITY */}
      <div className="mt-[18vh]">
        <Reveal>
          <p className="label">SNAPSHOTS OF SERENITY</p>
        </Reveal>
        <div
          data-lenis-prevent
          className="-mx-6 mt-10 flex snap-x gap-4 overflow-x-auto overscroll-x-contain px-6 pb-6 md:-mx-[12vw] md:px-[12vw]"
        >
          {gallery.map((photo, i) => (
            <figure key={`${photo.src}-${i}`} className="shrink-0 snap-start">
              <div className="relative aspect-[4/3] h-[24vh] md:h-[28vh]">
                <Image
                  src={photo.src}
                  alt={photo.label}
                  fill
                  sizes="(min-width: 768px) 26vw, 40vw"
                  className="object-cover brightness-[0.85] saturate-[0.9]"
                />
              </div>
              <figcaption className="label label-dim mt-3 text-[0.5625rem]">
                {photo.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* The person, once, small. */}
      <div className="mt-[18vh] grid grid-cols-1 gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-3">
          <div className="relative aspect-[3/4] w-40 md:w-full md:max-w-[220px]">
            <Image
              src="/images/portrait.jpg"
              alt="Sumukh Aradhya"
              fill
              sizes="220px"
              className="object-cover brightness-[0.9] saturate-[0.85]"
            />
          </div>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-8 md:col-start-5">
          <p className="max-w-[24ch] text-[clamp(1.6rem,3.2vw,2.75rem)] leading-[1.2]">
            {closing.line}
          </p>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            {closing.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="label transition-colors duration-200 hover:text-wax"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Colophon */}
      <footer className="mt-[14vh] border-t border-hairline py-10">
        {colophon.map((line) => (
          <p key={line} className="label label-dim mt-1 first:mt-0">
            {line}
          </p>
        ))}
      </footer>
    </section>
  );
}
