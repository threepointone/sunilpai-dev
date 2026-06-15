import type { AstroIntegration } from "astro";
import { cleanOrphans, renderDiagrams } from "../scripts/render-mermaid";

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
 *   something is actually stale). On `build` it then prunes orphaned SVGs (from
 *   edited or removed diagrams) before `public/` is copied into `dist`.
 * - `astro:server:setup` watches content markdown in dev and re-renders on edit,
 *   then forces a reload so a freshly produced diagram shows up without a manual
 *   refresh.
 *
 * In dev, filenames are content-hashed and never auto-pruned, so an existing
 * diagram URL always resolves even if Astro serves a slightly stale render
 * cache. Pruning is confined to `build`, where there is no live cache to 404.
 */
export function mermaidTldraw(): AstroIntegration {
  return {
    name: "mermaid-tldraw",
    hooks: {
      "astro:config:setup": async ({ command, logger }) => {
        const { total, rendered } = await renderDiagrams();
        if (total) {
          logger.info(rendered ? `rendered ${rendered}/${total} diagram(s)` : `${total} diagram(s) cached`);
        }
        if (command === "build") {
          const pruned = await cleanOrphans();
          if (pruned) logger.info(`pruned ${pruned} orphaned diagram file(s)`);
        }
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
