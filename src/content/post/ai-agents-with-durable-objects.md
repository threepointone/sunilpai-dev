---
title: AI Agents with Durable Objects
description: A proposal on how to build AI agents with Cloudflare Workers and Durable Objects.
publishDate: "2024-10-13"
---

This is a proposal for how to build AI agents with Cloudflare Workers and Durable Objects. it steals ideas liberally from crewai. openai's swarm, and many more.

```tsx
import { Agent } from "shawarma";

const client = swarm();

function transferToAgentB() {
  return B;
}

const A = new Agent({
  name: "Agent A",
  instructions: "You are a helpful agent.",
  functions: [transferToAgentB],
});

const B = new Agent({
  name: "Agent B",
  instructions: "Only speak in Haikus",
});

const response = await client.run({
  agent: A,
  messages: [
    {
      role: "user",
      content: "I want to talk to agent B.",
    },
  ],
});

console.log(response.messages.at(-1).content);

/*
Hope glimmers brightly,
New paths converge gracefully,
What can I assist?
*/
```

Why AI agents on Durable Objects?

---

- They're actually "long running" processes
  - Can run for days / months / whatever
  - But efficiently! They sleep/wakeup, and don't consume cpu/memory needlessly
- Access to all Cloudflare resources:
  - Memory: D1, DO/SQL, KV, R2, Vectorize, caches, etc
  - Browser rendering
  - AI models
- Protect with WAF / rate limits / etc
- Integrate deeply with existing apps
- DOs are a great representation of an agent

```tsx
export class Agent {
  initialize;
}
```
