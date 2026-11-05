"use client";

import { useDeck } from "@/components/gradient-descent/deck";
import { useStudy } from "@/components/gradient-descent/study-state";

// The ending: everything the reader just did, told back to them in order.
// The first line uses what they actually scored in the game.
export function Story() {
  const { go } = useDeck();
  const { game } = useStudy();

  const opening = !game
    ? "all you could feel was the tilt under your feet, and that's enough to get down"
    : game.height <= game.algorithm + 0.05
      ? `all you could feel was the tilt under your feet, and it got you down to ${game.height.toFixed(2)} in ${game.steps} ${game.steps === 1 ? "step" : "steps"}`
      : `you ended at ${game.height.toFixed(2)}. the algorithm felt the same tilt and just followed it, down to ${game.algorithm.toFixed(2)}`;

  const beats = [
    { id: "play", opens: "you were blindfolded on a hill.", text: opening },
    {
      id: "the-line",
      opens: "then the twist: it was never a hill.",
      text: "every spot was a possible line, and height was how wrong that line is. learning just means finding the lowest spot",
    },
    {
      id: "downhill",
      opens: "a model can't see that map either.",
      text: "so it nudges each number and feels which way the error falls. that feeling is the gradient",
    },
    {
      id: "the-points",
      opens: "the direction comes from the data.",
      text: "every point pulls on the line, the worst misses pull hardest, and the total says where to go",
    },
    {
      id: "step-size",
      opens: "but direction isn't enough.",
      text: "the step size decides if it works at all. too small takes forever, too big blows up",
    },
    {
      id: "goes-wrong",
      opens: "and real hills fight back.",
      text: "steep walls slow it down, flat spots fool it, and small batches make every step a rough guess",
    },
    {
      id: "your-turn",
      opens: "so people built better ways to step,",
      text: "like momentum and adam. they all follow the idea you started with",
    },
  ];

  return (
    <div className="gd-story">
      <p className="gd-definition">it&apos;s how a machine gets less wrong, one small step at a time</p>
      <ol>
        {beats.map((beat) => (
          <li key={beat.id}>
            <button type="button" onClick={() => go(beat.id)} title="go back to this screen">
              <strong>{beat.opens}</strong> {beat.text}
            </button>
          </li>
        ))}
      </ol>
      <p className="gd-story-end">
        measure how wrong you are. find which way is less wrong. take a small step. repeat. that&apos;s
        how nearly every neural network on earth learns
      </p>
    </div>
  );
}
