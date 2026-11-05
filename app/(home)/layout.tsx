import { Nav } from "@/components/nav";

// The home page's scroll-to-section nav. Other routes bring their own header.
export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Nav />
      {children}
    </>
  );
}
