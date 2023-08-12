---
title: The problem with importing css
description: On implementing a client for feature flags in your UI codebase
publishDate: "2021-02-13"
---

Here are 3 familiar lines of code that you would see in almost every js project.

```jsx
import App from "./app"; // this is javascript
import logo from "./logo.svg"; // this is an image
import "./styles.css"; // this is a stylesheet
```

It doesn't matter what framework, or what bundler, or even what compile-to-js language you're using; the ecosystem appears to have settled on some conventions for treating "static assets" like they do javascript, and while some of it is good, some of it is... less so. Let's dive into it.

1. The boring one, javascript.

```jsx
import App from "./app";
```

This is boring. Which is good. Old hands\* will remember the anguish and hackz that the lack of an official/standard module system created. Those days are almost over, and almost everyone now uses the import/export syntax.

_\* (wherein the timespan for "old" is less than lots of college relationships.)_

2. Images. Pretty cool.

```jsx
import logo from "./logo.svg";

// and used later somewhere

<img src={logo} />;
```

This is a neat trick. We'd like a development model where we refer to images by their existing names/paths, but in production we'd like to optimise the image and swap that out with a url that's hashed by it's 'contents' (so when we change the image, we can generate a different hash and avoid caching problems), possibly have it point to a CDN's domain, whatever. So, in practice, this line:

```jsx
import logo from "./logo.svg";
```

gets compiled to this line in development

```jsx
const logo = "/public/logo.svg";
```

but gets compiled to this line in production

```jsx
const logo = "https://cdn.some-ugly-amazon-url/public/logo-17abe3f.svg";
```

And as a bonus trick, some compilers make it so that if your image is smaller than some chosen size (say, 3 kb), then it can encode and _inline_ the image directly in to your source code, making for one less http request when your application loads.

```jsx
const logo =
  "data:image/svg+xml;base64,CjxzdmcgaWQ9ImVtb2ppIiB2aWV3Qm (... and a lot of gibberish like this) NTguNDU5NywzMC42OTQyLDU5LjUsMjcuOTY5OSw1OS41LDI1eiIvPgogIDwvZz4KPC9zdmc+Cg==";
```

Good hack. Solves a problem pretty neatly, I approve.

3. Stylesheets. I dunno man.

```jsx
import "./styles.css";
```

This one's a bit... weird. As a matter of convenience, compilers straight up add the css file to their dependency graph, and take responsibility for loading the file alongside the bundle. The manner in which they do isn't uniform; parcel tries to load it in parallel with the javascript, webpack could inline the stylesheet as a string your javscript and inject it into the page during runtime, etc. These are cool from afar, and the convenience is very real, but none of these are particularly satsifying to me; it's not always ideal that you load the stylesheet as soon as the javascript loads. It could be for a component that hasn't rendered yet, for example. It's also weird that you would block javascript execution until the stylesheet loads, which has a knock on effect of preventing more components from making data/asset fetches. And finally, there's no real way to _remove_ the stylesheet when the component that depends on it is unmounted/not in use. Maybe I'm overthinking this, but it just leaves me feeling a _bit_ icky.

We can do better. Here are some ideas.

1. Let's treat the stylesheet like we do images, i.e. like a static asset, and let the import generate a url that we can use to manually load the sheet. This gives us control over the "when" of loading.
2. You could create a `loadCSS(url)` utility that can load (and remove) a stylesheet from a page (probably by injecting a <link/> or something). This sounds super low-tech, but that's how simple it should be!
3. In framework land, it can be simpler (or more 'idiomatic', as the cool kids would say). With React, you could render a `<link/>` that suspends with a fallback till it finishes loading (and conveniently removes the stylesheet when it's unmounted.) This lets you control the "how", prevents FOUC, all good stuff.
4. In case you do want to keep the older behaviour, you could use an upcoming feature called "top-level `await`" in combination with `loadCSS(...)`.
5. These suggestions _may_ not be all great, and you'll have to do some smart prefetching of stylesheets for routes so it doesn't unnecessarily make some interactions slower. It's not trivial, but feels like it can be done well!

There's a bunch of work to do here so this becomes mainstream, but I do think this is the way to go. I've never been a fan of writing code that's dependent on the bundlers behaviour, and the way we all import css feels like one of those. That said, they improved the situation that existed before them, and are informing standards proposals to get something like it into the platform ([1](https://github.com/tc39/proposal-asset-references), [2](https://github.com/tc39/proposal-import-assertions)). While writing this article, I discoverd this isn't even the first time I've ranted about this ([thread](https://twitter.com/threepointone/status/860389036870868992)). But with primitives like React's Suspense, the new breed of bundlers like [esbuild](https://esbuild.github.io/) and [swc](https://swc.rs/), this feels like the right time to hack on this problem.

Aight, I'm going to grab a drink and dinner, see you folks for the next one.
