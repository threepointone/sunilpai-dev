import { pngResponse, renderSocialCard } from "../utils/ogImage";

export async function GET() {
  const image = await renderSocialCard({
    title: "I make tools for people who make things.",
    eyebrow: "Sunil Pai",
    footer: "Software, systems, and the craft of making things",
  });

  return pngResponse(image);
}
