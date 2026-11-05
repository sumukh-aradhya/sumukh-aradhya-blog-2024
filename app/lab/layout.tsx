import type { Metadata } from "next";
import { Instrument_Serif, Geist } from "next/font/google";
import { meta } from "@/content/lab";
import "./lab.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-lab-display",
});

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-lab-sans",
});

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/lab" },
  // Stays out of search until Study 001 is live. Remove this at launch.
  robots: { index: false, follow: true },
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: "/lab",
    siteName: "Sumukh Aradhya",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: meta.title,
    description: meta.description,
  },
};

export default function LabLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={`lab ${display.variable} ${sans.variable}`}>{children}</div>;
}
