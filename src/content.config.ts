import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const post = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/post",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(600),
      description: z.string().min(10).max(160),
      publishDate: z.coerce.date(),
      draft: z.boolean().default(false),
      coverImage: z
        .object({
          src: image(),
          alt: z.string(),
        })
        .optional(),
      ogImage: z.string().optional(),
    }),
});

export const collections = { post };
