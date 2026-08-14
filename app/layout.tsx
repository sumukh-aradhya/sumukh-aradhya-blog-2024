import type { Metadata } from "next";
import { Newsreader, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Cursor } from "@/components/cursor";
import { Nav } from "@/components/nav";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sumukharadhya.in"),
  title: "Sumukh Aradhya",
  description:
    "Lead engineer at Onetera. I build systems that ship without me.",
  openGraph: {
    title: "Sumukh Aradhya",
    description:
      "Lead engineer at Onetera. I build systems that ship without me.",
    url: "https://www.sumukharadhya.in",
    siteName: "Sumukh Aradhya",
    images: ["/images/fog-inverness.jpg"],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${geistMono.variable}`}>
      <body>
        <Providers>
          <Cursor />
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
