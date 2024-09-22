---
title: Partial Prerendering for Everyone with Cloudflare Workers
description: Implementing Next.js-style PPR in a normal React SSR app
publishDate: "2024-08-22"
---

tl;dr -

- In a prerender step with React's upcoming new `prerender()` api, whenever you detect dynamic i/o, call React's upcoming new `postpone()` api that "freezes" rendering at the closest `<Suspense>` boundary and save the results for later.
- In production, create a stream that sends this result to the client from a Cloudflare Worker close to a user's location, and continues the stream with the result from the origin server.
- In your origin server, render your React app close to your data sources with `resumeToPipeableStream()`.

Next.js has a great feature called "Partial Prerendering" (which vercel refers to as "PPR". This is not how acronyms work at all, but vercel sure love their [TLAs](https://en.wikipedia.org/wiki/Three-letter_acronym)) that allows you to prerender the external "shell" of your app, and defer rendering other parts until they are requested by the client. This article shows you how you can achieve this for any existing Server Rendered React App, and serve it with a Cloudflare Worker for great performance.

(TODO: user vercel's own diagram for PPR here)

The example app is based on this fantastic example by Guillermo Rauch called ["How is this not illegal?"](https://github.com/rauchg/how-is-this-not-illegal/) (which itself is based on a tweet by Dan Abramov, lost to the sands of time). It's a simple app that fetches a random list of pokemon from a database and displays them. With PPR, we first return a skeleton frame, and then _IN THE SAME REQUEST_, we continue streaming in the rest of the app. The effect is that we get an incredibly fast initial load that something like an edge network provides you, but without sacrificing the performance benefits of rendering your actual app near your data sources.

(TODO: a little diagram showing the transition between the prerender and resume steps)

Alright, enough talk. Let's build something!

For our example, we're going to rewrite this app with [Remix](https://remix.run/) and run it on a Cloudflare Worker, but you could be using any React Framework, and running it on any stack/provider. As long as you were already using React's streaming rendering API [`renderToReadableStream`](https://react.dev/reference/react-dom/server/renderToReadableStream) / [`renderToPipeableStream`](https://react.dev/reference/react-dom/server/renderToPipeableStream) to actually render your app, you should be able to rewrite it to take advantage of PPR. We're going to use Cloudflare's D1 database for our database, but you could use any database/service here. Despite the original example using React Server Components, you'll see that PPR doesn't require you to use RSCs, and you can use PPR with any React framework. I'm picking Remix for this example here because their `loader` abstraction is great for doing "isomorphic" rendering, and I don't have to write different code paths for the server and client. Of note, we're using Cloudflare's ["smart placement"](https://developers.cloudflare.com/workers/configuration/smart-placement/) on the application to automatically place it near the database. And while this stack has 2 Workers (one for serving the shell near the user, and one for serving the app near the data source), in the future Cloudflare will let you write the app as a single Worker, and automatically place the "shell" part near the user, and the "app" part near the data source (I think so! I'm speculating here).

Here are pointers to some key bits of code:

- (TODO: link) We patch the database client call to use `postpone()` when it's called during prerendering. Ideally, you'd want to do this patching for all i/o that your app does, without any user intervention. (TODO: figure out how Next.js implements "dynamicIO" to make that happen).
- (TODO: link) The `prerender()` step that runs on the Remix app to generate the html that we're going to use as the "frame", and some metadata/state for the app to use later when "resuming" the rendering. When using `prerender()`, `postpone()` signals to React that we've reached the boundary of IO that we're not able to do during the initial render, and that we'd like to "freeze" the rendering step at the closest `<Suspense>` boundary, and continue later with a "resume" step. We save those bits to disk for later.
- (TODO: link) The stream that we create in the Cloudflare Worker that flushes out the prerendered html, as well as piping the rest of the app from the "origin" server. This Worker runs incredibly close to the user, so the initial load performance is great, comparable to speeds that a CDN would give you. (We also use the Cloudflare CDN for serving actual static assets like the front end js and css bundles)
- (TODO: link) The `resumeToPipeableStream()` call that we use in the origin server/worker to "resume" the rendering of the app, starting from the metadata/state we saved in the prerender step.

That's pretty much it. I like this strategy because you don't need to rewrite you application in major ways, and could implement this on top of any existing React framework or stack. Importantly, it lets you leverage the so called "edge" or "CDN" to provide a great user experience, without sacrificing the performance benefits of having your data sources close to your app. Finally, it's kinda crazy that 11 years after React launched, we're still getting this kind of innovation in how we can make the web faster, that you can incrementally adopt to your existing app. Thanks React Team!
