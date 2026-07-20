import { visit } from "unist-util-visit";
import { DIAGRAM_PUBLIC_PREFIX, hashMermaid } from "../scripts/mermaid/shared";

interface CodeNode {
  type: "code";
  lang?: string | null;
  meta?: string | null;
  value: string;
}

interface HtmlNode {
  type: "html";
  value: string;
}

interface Parent {
  children: Array<{ type: string }>;
}

/**
 * Parse `key=value` options from a code fence's meta string, e.g.
 * ```` ```mermaid width=380 ```` -> `{ width: "380" }`.
 */
function parseMeta(meta: string | null | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  for (const match of (meta ?? "").matchAll(/(\w+)=("[^"]*"|'[^']*'|\S+)/g)) {
    const [, key, rawValue] = match;
    if (key && rawValue) out[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }
  return out;
}

/** Turn a width option into a CSS length (bare numbers become px). */
function toCssLength(value: string | undefined): string | null {
  if (!value) return null;
  return /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
}

/**
 * Replaces ```mermaid fenced code blocks with light/dark <img>s pointing at the
 * SVGs that `scripts/render-mermaid.ts` produces in `public/diagrams/`. Both
 * sides derive the filename from `hashMermaid(node.value)`, so they always line
 * up without a shared manifest.
 *
 * Per-diagram sizing is configurable from the post via the fence meta, e.g.
 * ```` ```mermaid width=380 ```` caps the rendered width (handy for tall
 * top-down flowcharts).
 */
export function remarkMermaidTldraw() {
  return (tree: unknown) => {
    visit(tree as never, "code", (node: CodeNode, index: number | undefined, parent: Parent | undefined) => {
      if (node.lang !== "mermaid" || parent === undefined || index === undefined) return;

      const hash = hashMermaid(node.value);
      const opts = parseMeta(node.meta);
      const maxWidth = toCssLength(opts["width"]);
      const style = maxWidth ? ` style="max-width:${maxWidth}"` : "";

      const img = (variant: "light" | "dark", suffix: string) =>
        `<img class="mermaid-${variant}" src="${DIAGRAM_PUBLIC_PREFIX}/${hash}${suffix}.svg"` +
        ` alt="Diagram" loading="lazy" decoding="async" />`;

      const html: HtmlNode = {
        type: "html",
        value:
          `<figure class="mermaid-diagram not-prose"${style}>` +
          img("light", "") +
          img("dark", ".dark") +
          `</figure>`,
      };

      parent.children[index] = html;
    });
  };
}

export default remarkMermaidTldraw;
