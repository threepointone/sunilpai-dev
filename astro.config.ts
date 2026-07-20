import { defineConfig, sharpImageService } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypeUnwrapImages from "rehype-unwrap-images";
import { remarkMermaidTldraw } from "./plugins/remark-mermaid-tldraw";
import { mermaidTldraw } from "./plugins/astro-mermaid-tldraw";

export default defineConfig({
  site: "https://sunilpai.dev/",
  markdown: {
    remarkPlugins: [remarkMermaidTldraw],
    rehypePlugins: [rehypeUnwrapImages],
    shikiConfig: {
      theme: "dracula",
      wrap: true,
    },
  },
  image: {
    service: sharpImageService(),
  },
  integrations: [mermaidTldraw(), sitemap()],
  compressHTML: true,
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
});
