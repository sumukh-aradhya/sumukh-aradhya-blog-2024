import Link from "next/link";
import { ScrollLink } from "@/components/lab/scroll-link";

// A path, not a logo: the Lab is a part of the site, and "sumukh" goes home.
export function Brand({ study }: { study?: string }) {
  return (
    <p className="lab-brand">
      <Link href="/">sumukh</Link>
      <span aria-hidden>/</span>
      {study ? (
        <>
          <Link href="/lab">lab</Link>
          <span aria-hidden>/</span>
          <span className="lab-brand-page">{study}</span>
        </>
      ) : (
        <ScrollLink href="#start">lab</ScrollLink>
      )}
    </p>
  );
}
