import katex from "katex";

// Rendered on the server from fixed strings in this codebase, so equations
// arrive as real typesetting with no JavaScript. `trust` only allows the
// \htmlClass hooks used for touchable terms. Never pass user input here.
export function Formula({ tex, block = false }: { tex: string; block?: boolean }) {
  const html = katex.renderToString(tex, {
    displayMode: block,
    throwOnError: true,
    trust: (context) => context.command === "\\htmlClass",
    strict: false,
  });
  const Tag = block ? "div" : "span";
  return <Tag className="gd-formula" dangerouslySetInnerHTML={{ __html: html }} />;
}
