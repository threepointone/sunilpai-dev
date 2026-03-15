import { defineConfig, sharpImageService } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypeUnwrapImages from "rehype-unwrap-images";

// https://astro.build/config
export default defineConfig({
  // ! Please remember to replace the following site property with your own domain
  site: "https://sunilpai.dev/",
  markdown: {
    rehypePlugins: [rehypeUnwrapImages],
    shikiConfig: {
      theme: "dracula",
      wrap: true,
    },
  },
  image: {
    // https://docs.astro.build/en/guides/assets/#using-sharp
    service: sharpImageService(),
  },
  integrations: [

    sitemap(),

  ],
  compressHTML: true,
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
});
