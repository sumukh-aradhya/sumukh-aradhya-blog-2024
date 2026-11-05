import Link from "next/link";
import { footer, hero } from "@/content/lab";
import { Brand } from "@/components/lab/brand";
import { Descent } from "@/components/lab/descent";
import { ScrollLink } from "@/components/lab/scroll-link";
import { StudyFinder } from "@/components/lab/study-finder";

export default function LabPage() {
  return (
    <>
      <header className="lab-header">
        <Brand />
      </header>

      <main>
        <section id="start" className="lab-hero">
          <Descent />
          <div className="lab-hero-copy">
            <h1 className="lab-rise">
              {hero.titleLines.slice(0, 2).map((line) => (
                <span key={line} className="lab-line">
                  {line}{" "}
                </span>
              ))}
              <span className="lab-line">
                {hero.titleLines[2]} <em>{hero.titleItalic}</em>
              </span>
            </h1>
            <p className="lab-hero-body lab-rise lab-rise-2">{hero.body}</p>
            <ScrollLink href="#studies" className="lab-action lab-rise lab-rise-3">
              <span className="lab-action-circle" aria-hidden>
                <svg viewBox="0 0 16 16" width="16" height="16">
                  <path d="M8 2v11M4 9l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
              </span>
              {hero.action}
            </ScrollLink>
          </div>
        </section>

        <section id="studies" className="lab-studies">
          <StudyFinder />
        </section>
      </main>

      <footer className="lab-footer">
        <Link href="/" className="lab-home-link">
          {footer.homeLink}
          <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden>
            <path d="M1.5 8.5 8.5 1.5M3 1.5h5.5V7" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </Link>
        <p className="label label-dim">{footer.copyright}</p>
      </footer>
    </>
  );
}
