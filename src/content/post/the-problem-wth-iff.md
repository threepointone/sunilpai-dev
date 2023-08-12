---
title: The problem with iff's design
description: How node's shared memory model ruins a perfectly good api design
publishDate: "2021-01-28"
---

## why iff/requireCond can't work on node

This might be hard to explain, but I'm going to try. Let's start with some code for a button.

```js
// my-button.js
import iff from "iff";
import { Button } from "my-design-system";

const color = iff("isBlueButton") ? "blue" : "green";

export default function MyButton(props) {
  return <Button color={color}>{props.children}</Button>;
}
```

Let's say you've setup the flag value of `isBlueButton` to be `true` for 50% of users.

In a browser, you're not sharing memory (or any runtime) with any other user. `color` is read once and stays that way for the lifetime of the open tab[^1]. This makes `iff` usable across your codebase; inside regular functions, as top-level variables inside modules, inside components, wherever. Nice. So when people visit your website, 50% of them will see a blue button, and 50% will see a green one.

This situation is not guaranteed on the server side if you're using node.js.

On node, a single runtime memory space is shared across many requests. These requests are braided across time and space, which is great for cpu and memory utilisation... but terrible for our programming model for feature flags. Specifically, look at that code sample again. Without a request to associate itself with, how would `color` be the right value based on the user associated with the request? It... cannot.

This means that on the server, iff can only be used when it can associate itself with a request. So, inside your serving framework's "middleware" or request handlers, inside components and hooks, that's about it. So it would look something like this.

```js
// App.js

// you'll need to wrap your entire app with a Provider

export const FlagsContext = React.createContext();

export default function App() {
  return (
    <FlagsContext.Provider
      value={
        {
          /* all your flags */
        }
      }
    >
      {/* ... the rest of your app ...*/}
    </FlagsContext.Provider>
  );
}

// my-button.js

// ... and then read it off context

import { FlagsContext } from "./App";

export default function MyButton(props) {
  const { isBlueButton } = useContext(FlagsContext);
  const color = isBlueButton ? "blue" : "green";
  return <Button color={color}>{props.children}</Button>;
}

// you'd probably come up with a nicer abstraction, but that's the basic idea.
```

You'd do something similar for middleware on the server (left as an exercise to the reader.)

This is incredibly annoying, and a major kink in my plans. Because you'd MAYBE use your code in node.js, the entire programming model has to accomodate it. Bah. This could be solved with a runtime that spins up a whole new memory space for every request, but nothing like that exists in the mainstream just yet. I thought cloudflare workers did, but it turns out that they _don't_ (which makes sense, there's been no super compelling reason to do so, and it lets folks create lightweight caches in the same process, etc).

You know what runtime does such a thing? Php. (Maybe Java too?) Things you've turned your nose up at because they weren't cool. It's also why [the previous employer](https://www.facebook.com/) doesn't use node; they use a custom js runtime for running their code, that does spin up a new instance for every request (much like php). Bah. I investigated using [node's `vm` module](https://nodejs.org/api/vm.html), but the perf isn't good enough that people would take on the pain for this one benefit. Maybe I'll do it just for myself. Humbug. Grumble.

(I've also looked into node's [async_hooks](https://nodejs.org/api/async_hooks.html)/[AsyncLocalStorage](https://nodejs.org/api/async_hooks.html#async_hooks_class_asynclocalstorage) api to associate flags with a request and be able to read them without having to thread the request through every function stack that uses the api. It looks promising, but [there are caveats](https://github.com/nodejs/node/issues/34401) that may lead to hard to discover bugs. Further, I can imagine a scenario where someone uses this api inside a browser (which _doesn't_ have this api, and would be hard to polyfill/simulate), and then this code doesn't work when used inside a server. I'll investigate it further, but the lack of correctness is enough to scare me off, tbh).

Anyway, this probably means `iff` will just be a hook and/or middleware for now. It's fine. We're used to disappointments as an ecosystem, maybe someone smarter than me will figure it out.

[^1] Potentially, for the lifetime of a session in that browser, if you use cookies or localStorage to persist flag values. Or even, for that user for the forseeable future, if flags are setup to be sticky and persist across sessions.
