import type { APIContext, GetStaticPaths } from "astro";
import { getCollection, getEntry } from "astro:content";
import { getFormattedDate, publishedPosts } from "@/utils";
import { pngResponse, renderSocialCard } from "../../utils/ogImage";

export async function GET({ params }: APIContext) {
  const slug = params?.slug;
  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  const post = await getEntry({ collection: "post", id: slug });
  if (!post) {
    return new Response("Post not found", { status: 404 });
  }
  const title = post.data.title;
  const postDate = getFormattedDate(post?.data.publishDate ?? Date.now(), {
    weekday: "long",
    month: "long",
  });
  return pngResponse(await renderSocialCard({ title, eyebrow: postDate }));
}

export const getStaticPaths = (async () => {
  const posts = publishedPosts(await getCollection("post"));
  return posts.filter(({ data }) => !data.ogImage).map(({ id }) => ({ params: { slug: id } }));
}) satisfies GetStaticPaths;
