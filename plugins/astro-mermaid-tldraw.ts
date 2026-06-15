import type { AstroIntegration } from "astro";
import { renderDiagrams } from "../scripts/render-mermaid";

function isContentMarkdown(file: string): boolean {
  const normalized = file.replace(/\\/g, "/");
  return /\.mdx?$/.test(normalized) && normalized.includes("/src/content/");
}

/**
 * Renders the mermaid diagrams found in content into `public/diagrams/` and
 * keeps them in sync with the source:
 *
 * - `astro:config:setup` renders once before every dev start and build, so the
 *   SVGs the remark plugin points at always exist (the browser only launches if
 *   something is actually stale).
 * - `astro:server:setup` watches content markdown in dev and re-renders on edit,
 *   then forces a reload so a freshly produced diagram shows up without a manual
 *   refresh.
 *
 * Filenames are content-hashed and never auto-pruned, so an existing diagram URL
 * always resolves even if Astro serves a slightly stale render cache.
 */
export function mermaidTldraw(): AstroIntegration {
  return {
    name: "mermaid-tldraw",
    hooks: {
      "astro:config:setup": async ({ logger }) => {
        const { total, rendered } = await renderDiagrams();
        if (!total) return;
        logger.info(rendered ? `rendered ${rendered}/${total} diagram(s)` : `${total} diagram(s) cached`);
      },
      "astro:server:setup": ({ server, logger }) => {
        let running = Promise.resolve();
        const onChange = (file: string) => {
          if (!isContentMarkdown(file)) return;
          // Serialise renders so overlapping edits don't launch two browsers.
          running = running
            .then(() => renderDiagrams())
            .then(({ rendered }) => {
              if (rendered) {
                logger.info(`re-rendered ${rendered} diagram(s), reloading`);
                server.ws.send({ type: "full-reload" });
              }
            })
            .catch((err) => logger.error(`render failed: ${(err as Error).message}`));
        };
        server.watcher.on("change", onChange);
        server.watcher.on("add", onChange);
      },
    },
  };
}

export default mermaidTldraw;
