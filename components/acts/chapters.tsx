import { chapters, foundation } from "@/content/site";
import { Reveal } from "@/components/reveal";
import {
  OrchestratorDiagram,
  FactoryDiagram,
  ProvingGroundDiagram,
  ResearchDiagram,
} from "@/components/diagrams";

const diagrams = {
  orchestrator: OrchestratorDiagram,
  factory: FactoryDiagram,
  provingGround: ProvingGroundDiagram,
  research: ResearchDiagram,
};

export function Chapters() {
  return (
    <section id="work" className="px-6 py-[18vh] md:px-[12vw]">
      <Reveal>
        <p className="label">SELECTED WORK</p>
      </Reveal>

      <div className="mt-[10vh] flex flex-col gap-[22vh]">
        {chapters.map((chapter) => {
          const Diagram = diagrams[chapter.diagram];
          return (
            <article
              key={chapter.index}
              className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-8"
            >
              <div className="md:col-span-5">
                <Reveal>
                  <p className="label label-dim">
                    {chapter.index} · {chapter.org}
                  </p>
                  <h2 className="mt-4 text-[clamp(1.9rem,3.4vw,3rem)] leading-tight tracking-[-0.01em]">
                    {chapter.title}
                  </h2>
                  <p className="mt-2 text-lg italic text-fog-light">
                    {chapter.lede}
                  </p>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="mt-8 max-w-[52ch] text-[1.0625rem] leading-relaxed text-fog-light">
                    {chapter.body}
                  </p>
                  <p className="label mt-8 text-wax">{chapter.metric}</p>
                </Reveal>
              </div>

              <div className="md:col-span-6 md:col-start-7">
                <Reveal delay={0.15}>
                  <div className="border border-hairline p-6 md:p-10">
                    <Diagram />
                  </div>
                  {/* Field note — the margin voice. */}
                  <p className="label label-dim mt-5 max-w-[60ch] normal-case tracking-normal">
                    <span className="text-wax">※ </span>
                    {chapter.note}
                  </p>
                </Reveal>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function Foundation() {
  return (
    <section className="flex min-h-[70svh] items-center px-6 py-[12vh] md:px-[12vw]">
      <Reveal>
        <p className="label">{foundation.kicker}</p>
        <blockquote className="mt-8 max-w-[28ch] text-[clamp(1.75rem,4vw,3.5rem)] leading-[1.15] tracking-[-0.01em]">
          {foundation.quote}
        </blockquote>
      </Reveal>
    </section>
  );
}
