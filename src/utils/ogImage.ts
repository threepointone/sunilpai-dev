import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { ReactNode } from "react";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";
import { siteConfig } from "@/site-config";

const assetDir = resolve("src", "assets");
const logo = readFileSync(join(assetDir, "logo.png")).toString("base64");
const regularFont = readFileSync(join(assetDir, "roboto-mono-regular.ttf"));
const boldFont = readFileSync(join(assetDir, "roboto-mono-700.ttf"));

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  fonts: [
    { name: "Roboto Mono", data: regularFont, weight: 400, style: "normal" },
    { name: "Roboto Mono", data: boldFont, weight: 700, style: "normal" },
  ],
};

interface SocialCardOptions {
  title: string;
  eyebrow: string;
  footer?: string;
}

export async function renderSocialCard({ title, eyebrow, footer = siteConfig.author }: SocialCardOptions) {
  const titleSize = title.length > 100 ? 36 : title.length > 70 ? 44 : title.length > 35 ? 56 : 64;
  const markup = html`<div
    tw="flex flex-col w-full h-full p-14"
    style="background:#f8f6f0;color:#292824;border:18px solid #315f78"
  >
    <div tw="flex flex-shrink-0 items-center text-2xl font-bold" style="color:#42678f">
      <img src="data:image/png;base64,${logo}" alt="" style="width:58px;height:58px" />
      <span tw="ml-5">${siteConfig.title}</span>
    </div>
    <div tw="flex min-h-0 flex-1 flex-col justify-center">
      <p tw="mb-7 text-2xl font-bold uppercase tracking-wider" style="color:#42678f">
        ${eyebrow}
      </p>
      <h1 tw="m-0 font-bold" style="font-size:${titleSize}px;line-height:1.18;letter-spacing:-0.03em">
        ${title}
      </h1>
    </div>
    <div tw="flex flex-shrink-0 items-center justify-between border-t border-dashed pt-6 text-xl" style="border-color:#c9c4b8">
      <span>${footer}</span>
      <span style="color:#706d65">sunilpai.dev</span>
    </div>
  </div>`;

  const svg = await satori(markup as unknown as ReactNode, options);
  return new Uint8Array(new Resvg(svg).render().asPng());
}

export function pngResponse(body: Uint8Array) {
  const arrayBuffer = body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength) as ArrayBuffer;
  return new Response(arrayBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600, immutable",
    },
  });
}
