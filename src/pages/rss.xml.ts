import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { siteConfig } from "@/site-config";
import { publishedPosts, sortMDByDate } from "@/utils";

export const GET = async () => {
  const posts = sortMDByDate(publishedPosts(await getCollection("post")));

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: import.meta.env.SITE,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/posts/${post.id}/`,
    })),
  });
};
