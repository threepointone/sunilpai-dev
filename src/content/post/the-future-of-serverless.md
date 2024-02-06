---
title: "The next evolution of serverless is stateful"
description: "(A lot of words about where I think serverless computing is going.)"
publishDate: "2024-02-06"
ogImage: ../../assets/stateful-serverless-og.png
---

![serverless-but-spicy](../../assets/stateful-serverless-og.png)

_Hi, my name is [Sunil Pai](https://twitter.com/threepointone/), and for the last year or so I've been building a new kind of realtime platform called [PartyKit](https://www.partykit.io/). It's a new way to write serverless functions that are stateful. I realised I haven't ever written down why I think they're so novel and cool, so here's an attempt at doing so. Drop feedback to [@threepointone](https://twitter.com/threepointone) and I'd be happy to edit this and make it better._

### What do we know?

Here's some code. It's how you might write a server that has some state (say, a counter).

```ts
let counter = 0;

export default function onRequest(request: Request) {
  if (request.method === "GET") {
    return new Response(counter);
  } else if (request.method === "POST") {
    counter++;
    return new Response(counter);
  }
}
```

So if you `GET` this server, you'll get `0`, and if you `POST` to it, you'll get `1`, and so on.

Sounds straightforward. If you tried this out on your laptop, it would work just fine. But if you tried to deploy this to a serverless platform (aws lambda, cloudflare workers, whatever), it would fail. People who visit your server would see `0` no matter how many times they `POST` + `GET` to it. (Confusingly, with some platforms that DO reuse the same instance of the serverless function, it would work intermittently.)

Why?

Because serverless platforms are stateless. They don't have a concept of "state" that persists between requests. When you deploy a serverless function, it spins up, runs your code, and then is torn down. The next time a request comes in, a new instance of your function spins up, and the process repeats.

These functions aren't even going to run on the same machine. They might not even run in the same data center. They're ephemeral, and they're designed to be that way.

So the way we "solve" this right now is by using a database/key-value store to persist the state. You'd write the above code like this:

```ts
export default function onRequest(request: Request) {
  if (request.method === "GET") {
    let counter = await getCounterFromDatabase();
    return new Response(counter);
  } else if (request.method === "POST") {
    let counter = await incrementCounterInDatabase();
    return new Response(counter);
  }
}
```

You had a problem for scale, that you "solved" with serverless functions. Now you have 2 problems. You have to manage a database, which comes with its own set of problems and costs. Databases are great for a lot of things, but we end up using them for something that a could be a lot simpler.

What if we could have the best of both worlds? What if we could have stateful serverless functions?

What if we could write this, and it would just work?

```ts
class default class Counter {
  value = 0;
  onRequest(request: Request) {
    if(request.method === 'GET') {
      return new Response(this.value)
    }
    else if(request.method === 'POST') {
      this.value++;
      return new Response(this.value)
    }
  }
}
```

### What if?

PartyKit enables this model (powered by [Cloudflare's Durable Objects](https://developers.cloudflare.com/durable-objects/)). It's a new way to write serverless functions that are stateful. You can write your code as if it's running on a single machine. Each of these "machines" is addressed with an ID (which could correlate to a user id, a document, a game session, a workflow run, etc), and you can call methods on them, and they'll maintain their state between requests. You can spin up thousands (maybe millions?) of these "machines" across the planet, make calls to `https://yourapp.com/counter/:id`, and they'll just work as expected.

That's the kicker: the "next" evolution of serverless isn't really something "new", but rather a return to how we would write code if we were running on a single machine. A return to simplicity, if you will. And while traditional serverless (lol) is great for stateless workloads, stateful serverless unlocks using a similar programming model for a much broader set of usecases that we're already familiar with. So it's not a replacement, but rather a complement.

That's it. That's the big idea. You can call it the Actor model, or Durable Functions, or Stateful Serverless, or whatever. (I call it PartyKit.)

### What is it good for?

There are a TON of usecases for stateful compute; I'll get into them in a bit, but before we do, I'd like to talk about one specific usecase that really shines in this model: realtime computing. Probably familiar to you as stuff that involves websockets, event driven workflows, push based architectures, the whole lot. When we (humans? software engineers?) moved to serverless architectures years ago, these usecases suffered because they weren't compatible with the stateless model. You can't really hold a websocket "alive" inside a function that's meant to be ephemeral. Even when you had "normal" server clusters deployed across the planet, websockets would connect to different processes on different machines, and getting them to act in the context of a single document/room would be exceptionally hard. So if you wanted to build something like google docs, or a multiplayer game, you'd have to still provision servers across the world, and you'd use a something like a database or a key value store to maintain state, and then implement message passing on top of it, at which point it's a whole distributed systems problem. So it's hard, expensive, and super annoying to maintain. Folks like Figma took years to get it right; and when they did, [they deployed a stateful approach very similar to what PartyKit looks like](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/) (quote _"Our servers currently spin up a separate process for each multiplayer document which everyone editing that document connects to."_).

With a model like PartyKit, building a system that can synchronise state is straightforward: Hold that state in memory, let websockets (or http requests!) connect to the same process. When clients "send" changes to said state, broadcast those changes to all connected clients. Depending on the usecase, you can use fancier data structures to model the state (like CRDTs or OTs), setup state machines to model workflows, or use a pubsub model to broadcast events.

Once you start looking around with this hammer, you can't help but find nails that fit this new model _everywhere_.

- You might think that **"multiplayer"** is a niche usecase, but then you realise so many people around you is already multi-device: they have a phone and a laptop. And they expect those devices to be synchronised at all times: email, chat, social media, games, whatever. Using a Room per user, means you could dedicate compute and state for every user on the planet, and use that as center of synchronisation for all of this.

- **Pub-sub** systems are defined by events that are published on to "topics", and then consumed by "subscribers". Instead of using a database to store these events, you could use a Room to store the events, and then use the same Room to broadcast the events to all subscribers. By localising topics to the users that care about them, you can reduce the amount of data that needs to be sent across the network, and you can reduce the amount of data that needs to be stored.

- **Collaborative editing** systems (like google docs, tldraw, figma, etc) are a great fit for this model. You can use a Room to store the document, and then use the same Room to broadcast changes to all connected clients. You also use the Room as the only source of truth (that can synchronise with your database) which makes it simpler to fight inconsistency issues.

- **Workflows** are a great fit for this model. You can define a long running process (either explicitly with a state machine like xstate, or implicitly with code, similar to ingest/trigger functions). Every run of the workflow can happen in a Room instance; when there's nothing happening inside it you can "shut it down", until it wakes up in response to another event or a timer, and it picks up where it left off.

- **Games. GAMES.** Folks have been worried of building multiplayer systems for years and years, simply because the infrastructure was too hard to build and maintain. With a model like PartyKit, you can build a game that can scale to millions of players, and you can do it with a fraction of the effort. (People on the discord already do so!)

- **Chatbots!** There's honestly no better system for building chatbots than PartyKit. you write a Room that defines the behaviour and state of a Chat room, sending messages around whenever they come through, synchronising with clients like browsers and apps. Then you write a nother Room that defines the behaviour of a bot! Use a fancy LLM, give it a personality and a purpose, whatever, and then connect it to the Chat Room. Voila, you now have a chatbot system that can scale to millions of users without a sweat.

- **Local-first apps** fit SO WELL with a model like this; you can build an app that works offline, and then syncs with the "server" Room when it comes online. Every user gets a server. You get a server. And you get a server. Every-freakin'-body gets a server.

(I could go on. Forever.)

### How does it work?

I've decided to use Durable Objects to build PartyKit because I think it's the perfect set of tradeoffs for the broadest range of usecases. Zero startup time (I've never worried about "cold start" times ever with Cloudflare). These objects/Rooms spin up closest to the users who start them, and Cloudflare's absolutely insane network handles routing across the planet (last I checked, they were in 300+ cities, with 10k PoPs. There's nothing better.) For example, inside London, I get about <10ms latency on a good day. That's less time than it takes to render a frame on your monitor at 60fps. There are tradeoffs to this model: it's a standards based javascript runtime which can run _mooost_ code, but maybe not if you can't compile your code to javascript or WASM. Each room has about 128mb of RAM, which is again pretty great for a lot of usecases, but maybe not if you're doing something that needs a lot of memory.

But! There are other providers/companies/products out there who are building similar things, with different tradeoffs. [JamSocket](https://jamsocket.com/) by [Drifting in Space](https://driftingin.space/) is dope because it lets you write code in most languages (any?) and lets you deploy it on to your own infrastructure. Workflow engines like [Inngest](https://www.inngest.com/) and [Trigger](https://trigger.dev/) provide a similar environment tuned for building workflows. There are a ton more, but these come to mind now. (I'll probably keep updating this paragraph as I find more.)

### Get started

So, PartyKit. You can use this today. Run `npm create partykit@latest` in your terminal, and it'll make you a project that's ready to go. Here are a bunch of [docs](https://docs.partykit.io/) that go into a lot more detail, fleshing out all the other features and libraries that we've built to make it simpler to use. Need a [Yjs](https://yjs.dev/) backend for a collaborative text editor? [That's about 5 lines of code](https://docs.partykit.io/reference/y-partykit-api/). Need [a great WebSocket replacement](https://www.npmjs.com/package/partysocket) that handles reconnection / buffering / resilience? `npm install partysocket`. Maybe you'd like to build multiplayer chatrooms that also have helper bots? [We gotchu](https://docs.partykit.io/examples/app-examples/multiplayer-ai-chat-rooms/). Would you like a remix starter kit that's ready to go? Code's [here](https://github.com/partykit/remix-starter/), just run `npx create-remix@latest --template partykit/remix-starter` and you're good to go. In seconds, you can deploy your PartyKit project `npx partykit deploy`. You can even [deploy this on to your own Cloudflare account](https://docs.partykit.io/guides/deploy-to-cloudflare/)!

Tons more where all that came from, and tons more to come.

### What's next?

Some very exciting companies already use PartyKit in production, and they tell me that they love it. The next year of my life is about getting this into people's hands. We've been adding a bunch of features, and will now focus on onboarding / templates / documentation. While it's free for hobbyists/enthusiasts (within reason), I think I've finally figured out how to price this commercially so that it's accessible to most companies and products (and you should feel free to reach out to me to talk about it.)

I also expect to write some more on this topic, probably dive into specific usecases, or maybe share more specifics about how it all works. We have a ton of demos planned as well. As always, feel free to [reach out to me on twitter](https://twitter.com/threepointone/) and let me know what you think.
