import { Statement } from "@/components/acts/statement";
import { Fog } from "@/components/acts/fog";
import { Chapters, Foundation } from "@/components/acts/chapters";
import { Record } from "@/components/acts/record";
import { Person } from "@/components/acts/person";

export default function Home() {
  return (
    <main>
      <Statement />
      <Fog />
      <Chapters />
      <Foundation />
      <Record />
      <Person />
    </main>
  );
}
