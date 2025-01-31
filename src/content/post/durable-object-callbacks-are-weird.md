---
title: Durable Objects Callbacks are Weird
description: but it's also convenient to solve human-in-the-loop for ai agents
publishDate: "2025-01-31"
---

(video version at https://x.com/threepointone/status/1885119427223707872)

first, let's define a "sleep" function.

```ts
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
```

ok. now let's say you have an async function.

```ts
const fn1 = async () => {
  /* ... */
};
```

and you have another async function.

```ts
const fn2 = async () => {
  await sleep(1000);
  return "world";
};
```

Let's say you want to call `fn2` from `fn1`.

```ts
const fn1 = async () => {
  return "hello " + (await fn2());
};
```

Simple enough, it works!

```ts
const result = await fn1();
console.log(result); // after a second, "hello world"
```

Ok, now let's put each one into a Durable Object.

```ts
class World extends DurableObject {
  async fn2() {
    await sleep(1000);
    return "world";
  }
}

class Hello extends DurableObject {
  async fn1(request) {
    return "hello " + (await getServerByName(this.env.World, "default-world-instance").fn2());
  }
}
```

then when we call it somewhere:

```ts
// assume env.Hello and env.World are bound in wrangler.toml
const string = await getServerByName(env.Hello, "default-hello-instance").fn1();
// after a second, "hello world"
```

ok, that works too.

Now let's say we make `World::fn` wait for a long time. Like, a REALLY long time.

```ts
class World extends DurableObject {
  async fn2() {
    await sleep(1000 * 60 * 60 * 24 * 365); // 1 year
    return "world";
  }
}
```

This looks bad. It would attempt to keep both Durable Objects alive for a year. Cloudflare will probably evict the Durable Object after a few minutes of no i/o or cpu work.

Before you say "use durable object alarms!", let's try to generalise the problem. What iwe want it to wait till we recieve an email via an email worker? How about a webhook? Maybe we're routing _phone calls_ to these durable objects. What if it's a stream of data in the callback, each which maybe an email, a webhook, a phone call, or a stream of data?

(Note that these are all "human-in-the-loop" events)

We need something better than "just javascript" here. A pattern I've been exploring is what I'm calling "static callbacks". Instead of using async/await or a callback function, you simply define data that you pass on to the receiver durable object. That DO can then persist that data, and potentially "sleep" while it waits for one of the email/alarm/webhook/whatever events to come in, wake up, and trigger the callback. It could look like this.

```ts
type Callback = {
  type: "durable-object";
  namespace: string;
  id: string;
  function: string;
};

class World extends DurableObject {
  async fn2(callback: Callback) {
    this.ctx.storage.put("callback-data", callback);
    this.ctx.storage.setAlarm(1000 * 60 * 60 * 24 * 365); // 1 year
  }
  alarm() {
    // this will get called after 1 year
    const data = this.ctx.storage.get("callback-data");
    if (data.type === "durable-object") {
      getServerByName(this.env[data.namespace], data.id)[data.function]();
    }
  }
}
```

then, the call from the `Hello` DO would look like this:

```ts
class Hello extends DurableObject {
  async fn1() {
    const callback = {
      type: "durable-object",
      namespace: "Hello",
      id: "default-hello-instance",
      function: "fn1",
    };
    getServerByName(this.env.World, "default-world-instance").fn2(callback);
  }
}
```

do you see it? we can decouple the callback from the function that makes it. now the target (and origin!) durable objects can sleep while they wait for the callback. once the alarm triggers in the target World DO, it wakes up, and can call the callback function, which in turn can call the origin Hello DO, waking it up too.

this doesn't have to just be an alarm, of course. it could be a webhook, an email, a phone call, or a stream of data. any "human-in-the-loop" events that might happen any time in the future. with this pattern, the DOs don't have to stay "awake" while we're waiting, but can resume their work once the callback is triggered.

I'm exploring this pattern in [partywhen](https://github.com/threepointone/partyserver/blob/94254a60ea9f155baef4356dd987395763179623/packages/partywhen/src/index.ts#L374-L396) (link to a rats nest of bad typescript that surprisingly works) but I expect to use it as a general solution when exploring human-in-the-loop patterns. stay tuned.
