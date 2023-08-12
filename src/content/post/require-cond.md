---
title: requireCond()
description: Shipping different versions of modules with requireCond()
publishDate: "2021-01-26"

draft: true
---

([previously](/posts/feature-flags/), [previously](/posts/iff/))

Inside [my last employer's](https://www.facebook.com/) javascript codebase, modules are shared and reused with `require` syntax, which was pretty mainstream until ES imports came along.

```js
const { useEffect } = require("react");
// compared to newer syntax
import { useEffect } from "react";
```

That's not special in itself, but it also has a special function called `requireCond`, that lets you selectively choose a module based on a feature flag. It looked something like this

```js
const SomeComponent = requireCond("some-flag?C1:C2");
```

You might be wondering, how is this different from a regular ternary? WHy not do something like this?

```js
const SomeComponent = iff("some-flag") ? require("C1") : require("C2");
```

Well, in the former, it's possible to statically analyse the code. Since the server that serves the javascript to the user is also aware of a user's feature flags, they can use that information to send only the javscript that is relevant. So, if for you, the value of `iff('some-flag')` was `true`, then you would never have the code for module `C2` loaded in your browser. That's really neat!

Developers use this technique for testing and shipping new features and components without worrying about bundle sizes and unexpected side effects of shipping multiple branches of a feature to the browser. At any time, there are hundreds (maybe thousands?) of feature flags that are live on the website, and every use is only being served the code that matches their flags. Developers can roll out a featyre to a percentage of users, make sure that no serious metrics have degraded on that cohort, and then roll it out completely when they're satisfied with it (or roll it back if they're not.)

You may be wondering; with so many flags at a given time, does that mean that multiple bundles of code are generated, matching each combination of flags? That doesn't sound great; for 3 boolean flags, you'd have to generate 8 bundles. For 10 boolean flags, yo'ud have to generate over 1000 bundles!

Well, facebook, unlike most of the javscript ecosystem, doesn't use ahead-of-time bundlers like webpack or parcel; instead, they do on-demand bundling. Without going into too much detail, they're able to generate chunks and modules based on a given request and feature flags; by smartly chunking and reusing the bits that can be combined, they avoid the combinatorial explosion of "bundles" that a naive ahead-of-time approach would generate.

We'll go into this approach more in the future (and maybe try building it ourselves!) We'll also discuss the implications of such an approach for server side rendering of javascript applications.
