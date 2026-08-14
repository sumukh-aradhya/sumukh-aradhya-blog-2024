import { record } from "@/content/site";
import { Reveal } from "@/components/reveal";

export function Record() {
  return (
    <section id="record" className="px-6 py-[18vh] md:px-[12vw]">
      <Reveal>
        <p className="label">THE RECORD</p>
      </Reveal>

      <div className="mt-[8vh]">
        {record.map((row) => {
          const inner = (
            <div className="grid grid-cols-1 gap-2 border-t border-hairline py-6 transition-colors duration-200 md:grid-cols-12 md:gap-8 md:py-7">
              <p className="font-mono text-xs tracking-[0.15em] text-fog-dim md:col-span-2 md:pt-1">
                {row.years}
              </p>
              <h3 className="text-xl leading-snug md:col-span-5 md:text-2xl">
                {row.title}
              </h3>
              <p className="label label-dim normal-case tracking-normal md:col-span-5 md:pt-1">
                {row.note}
                {row.href && <span className="text-wax"> ↗</span>}
              </p>
            </div>
          );

          return (
            <Reveal key={row.title}>
              {row.href ? (
                <a
                  href={row.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block hover:bg-pine-soft"
                >
                  {inner}
                </a>
              ) : (
                inner
              )}
            </Reveal>
          );
        })}
        <div className="border-t border-hairline" />
      </div>
    </section>
  );
}
