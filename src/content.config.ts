import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

function removeDupsAndLowerCase(array: string[]) {
  if (!array.length) return array;
  const lowercaseItems = array.map((str) => str.toLowerCase());
  const distinctItems = new Set(lowercaseItems);
  return Array.from(distinctItems);
}

const post = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/post",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(600),
      description: z.string().min(10).max(160),
      // TODO: pass a date here
      publishDate: z.coerce.date(),
      coverImage: z
        .object({
          src: image(),
          alt: z.string(),
        })
        .optional(),
      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      ogImage: z.string().optional(),
    }),
});

export const collections = { post };
