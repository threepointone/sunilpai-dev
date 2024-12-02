---
title: Durable Objects are Computers / Containers / Servers
description: (everything old is new again)
publishDate: "2024-12-02"
---

(Day 1 of DecemberDumps '24: an exercise in loose unedited writing)

If you're an Erlang person, then this is GenServer. You can leave now. For the rest of you...

For a second, forget everything you've heard about Durable Objects, or even serverless infrastructure.

What is a computer?

You might imagine a box with a screen and a keyboard. A beige box with cables coming out of it. A tiny mac mini on your desk. Tht thing inside your apple watch. The thing inside your google home/alexa. Something inside your "smart" tv that you conrtol with voice or a remote, whatever. A thing in a rack with blinking lights in a data center that powers the internet.

We can generalise this. A _general_ computing device that takes input, does stuff, and returns output. It has some state (some of it is in-memory and some of it is persistent). We can represent this with code.

```ts
class Computer {
  constructor(configuration: ComputerConfiguration) {
    /* ... */
  }

  async thing1(input: Input) {
    // ...
    // read from storage
    const data = await this.storage.get(input);
    // do some stuff
    const result = await doStuff(data);
    // maybe write to storage
    await this.storage.put(result);
    // return result
    return result;
  }
  async thing2(input: Input) {
    // ...
  }
  async thing3(input: Input) {
    // ...
  }
  // ... and so on
}
```

We can represent startup / input / output like so:

```ts
const computer = new Computer({
  /* ... */
}); // startup

//   output   for   input
const result1 = await computer.thing(input1);

const result2 = await computer.thing2(input2);
```

In the real world, input can be voice, button presses, mouse clicks, keyboard presses, a file on a disk, a network request, a sensor reading, etc. Output can be a network response, a file written to disk, a sensor reading, a screen refresh, etc. And the "stuff" the computer does can be anything from a simple calculation to a complex computation.

Now, imagine that these computers are not physical devices, but virtual devices in the cloud. Such that you can have many of them, and they can be distributed across many machines. So we can instantiate many such computers, and make them "do" things for us. Of course, they can communicate with each other as well.

A simple usecase:

Let's say we wanted to have one computer per "user", to store information about the user, and to do some computation on that data. We could do that. Let's use a serverless http function as an input layer to talk to our computers.

```ts
function handler(request: Request): Response {
  // ...

  const url = new URL(request.url);

  if (url.pathname === "/address") {
    const user = await getUser(request); // we'd read cookies or something

    const computer = new UserComputer({ user: user }); // if there's already a computer for this user, we'd re-use it.

    const address = await computer.getAddress();
    return new Response(address);
  }

  // ... and so on
}
```

This model would be useful for storing "session" data for a user, like a shopping cart, or a user's preferences, or a user's profile information.

Another usecase:

Let's say we wanted to implement "multiplayer" for a document editor. We could do that. Let's use a computer to represent a document, and let browsers connect to it with a websocket. We'd model the document with a computer like so:

```ts
class Document {
  document: DocumentData; // the actual document data
  connections: Set<WebSocket> = new Set(); // all the connections to the document

  constructor(configuration: { id: string }) {
    // populate this.document from storage
  }

  updateDocument(document: DocumentData, message: string) {
    // ... some logic to update the document
    return document;
  }

  onConnect(ws: WebSocket) {
    this.connections.add(ws); // add the connection to the set
    ws.send(JSON.stringify(this.document)); // send the current document to the new connection
  }

  onMessage(connection: WebSocket, message: string) {
    this.document = this.updateDocument(this.document, message); // update the document

    // send the updated document to all connections
    this.connections.forEach((connection) => {
      if (connection === ws) return; // don't send to ourselves
      connection.send(JSON.stringify(this.document));
    });
  }

  onClose(ws: WebSocket) {
    this.connections.delete(ws); // remove the connection from the set
  }
}
```

(Coincidentally, this is how multiplayer works in apps like [tldraw](https://tldraw.com).)

The nice thing about this model compared to serverless functions:

- The computers actually stick around, even after it responds to a function call. Unlike a stateless serverless function, which gets garbage collected after the function call.
- A good example is things which are "long lived processes" (like a long ass query which might take take seconds, or even minutes to complete.) Concrete usecases are AI model inference, or possible something that waits for human input.
- Of course it would be expensive if they stayed alive ALL the time, so durable objects do actually go to sleep, and wake up on the next request. Judicious use of storage can help with making sure it doesn't lose any important in-memory state in between requests.
- You can have many of them, and they can be distributed across many machines.
- You can communicate between computers, e.g. if you wanted to coordinate actions between different users in a document, you could do that.

Ok, so that's durable objects. The API is a bit different, there's some nuance around sleeping/waking up, the storage options are varied, whatever. Importantly, I think Cloudflare has the first implementation of the actor model _in infrastructure_ that I know of. It leads to _novel_ architectures, so it's hard to talk about it by comparing it to existing infrastructure.

I wrote a broader post about this a while ago: https://sunilpai.dev/posts/the-future-of-serverless/

Ok, that's day 1. See you tomorrow.
