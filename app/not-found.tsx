import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-start justify-center px-6 md:px-[12vw]">
      <p className="label text-wax">NO EVIDENCE BUNDLE</p>
      <h1 className="mt-6 max-w-[20ch] text-[clamp(2rem,5vw,4rem)] leading-tight">
        This page produced no evidence.
      </h1>
      <Link
        href="/"
        className="label mt-10 transition-colors duration-200 hover:text-wax"
      >
        RETURN TO THE RECORD →
      </Link>
    </main>
  );
}
