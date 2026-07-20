---
title: one document, two hands
description: (the agent should be a guest in your app, not the app itself)
publishDate: "2026-07-20"
draft: true
---

I built a little music app called Pizzo for a talk at Local-First Conf.

it has the normal things you'd expect from a music app: a chord progression, a tempo control, drums, bass, a synth, buttons and sliders and pads you can click. you can press play and hear the song. you can grab the controls and change it. extremely computer stuff.

it also has an agent.

you can tell it “make this dreamier in D” and the chords change. ask for a walking bass line and it adds one. ask it to take the whole thing up a step and it transposes the song.

the important bit is what _doesn't_ happen.

the agent does not generate a new music app. it does not produce a blob of code for you to download. it does not describe where the tempo slider is and politely ask you to move it yourself. it reaches for the same song you already have open and changes it.

then you can reach back in with your hands and change it again.

one document. two hands.

I think this is a useful way to think about what comes after chatbots. the agent should not become the app. it should be a guest inside the app, invited to edit the same document that you already manipulate directly.

## why coding agents felt like magic first

coding agents are the first agent-shaped thing that has felt properly general-purpose to a lot of people.

you can drop one into a repository and ask it to fix a bug, add a feature, inspect some logs, run tests, or explain why the build is doing something cursed. it can move across a surprisingly large space of tasks without every possible action being designed in advance.

it is tempting to attribute all of this to the model getting smarter. obviously the model matters. but I don't think that is the whole trick.

we gave coding agents four extremely useful things:

- a workspace: somewhere to create artifacts and read them again later
- a place to run things: write something, execute it, see what happened
- tools: verbs that reach outside the model to read, write, fetch, call, and act
- a computer: CPU, memory, programs, and access to the user's data and capabilities

that combination creates a loop:

> act → observe → adjust

the model can make a change, run the code, inspect the output, notice that it got something wrong, and try again. the repository is both the material it works on and a source of feedback about the work.

code happened to be a spectacular substrate for this because code is runnable text. the feedback loop closed almost for free.

but “the output is code” is not actually essential to the shape.

snip that bit off and you are left with something much more general: an agent with a workspace, capabilities, and a feedback loop, acting on a document that belongs to the user.

that can be a codebase, sure. it can also be a song.

or a spreadsheet. or a canvas. or a map. or a video timeline. or a CAD model. whatever. the useful part is not that the agent emits code. the useful part is that it can inspect and change the thing, then observe what happened.

## chat is not the new GUI

there's a slightly depressing version of the AI future where every app becomes a chat box.

want to make the text bigger? ask the chat. want to move the rectangle three pixels left? ask the chat. want to inspect the formula in this cell? ask the chat. want to hear the next chord? write a tiny letter to the computer and wait for it to reply.

my brother in christ, we already invented direct manipulation.

the WIMP era—windows, icons, menus, pointer—was not a historical accident that we need to wash away with a sufficiently large model. graphical interfaces gave us stable, visual, learnable systems. they let us mold software with our hands. a spreadsheet cell, a canvas shape, a piano roll, and a slider all have a spatial obviousness that language often doesn't.

chat-only interaction throws a lot of that away. it takes software that you could touch and turns it back into a command line, except the command line is nondeterministic and types “absolutely!” before doing anything.

the mistake is assuming we have to choose.

direct manipulation is good when you know the move you want to make. intent is good when you know the outcome you want but not the exact series of moves. those are complementary inputs.

in Pizzo I can drag the tempo slider because my hand is already there and I know exactly what I want. then I can ask the agent to make the progression “more wistful” because that is easier to express as intent than as four precisely chosen replacement chords.

both should edit the same thing.

## the document is the interface

the old application contract looked roughly like this:

> you → fixed GUI → preset actions

the product team decided which actions existed, built controls for them, and shipped that finite surface to the user. if the button didn't exist, neither did the capability (unless you were one of the people allowed to program the machine).

the new contract can look more like:

> you + your agent → intent → your document → result / UI / action

this doesn't mean the GUI disappears. it means the GUI stops being the whole app.

the document becomes the durable center of the system. the interface is one way to read and modify it. the agent is another. maybe there are several interfaces: a desktop editor, a phone, a controller, a MIDI keyboard, a voice surface, whatever. they are all projections over and inputs into the same underlying thing.

this distinction matters because otherwise we accidentally make the chat transcript the source of truth.

you see this in a lot of current AI software. the work lives somewhere inside a conversation. the user asks for a thing, the model emits a result, the user asks for a revision, the model emits the whole thing again. state is implicit, smeared across messages, and increasingly expensive to reconstruct. if you want to edit something directly, good luck; you are now negotiating with a transcript.

the chat should not own the song. the song should own the song.

the agent is a guest in that document. invited to edit, never to own.

## the model should steer the machine, not impersonate it

there is another important detail in Pizzo: the model is not secretly doing music theory by vibes.

when I ask it to transpose the song, a deterministic function transposes the song. when I ask for richer chords, a music theory library does the actual transformation. when I ask for a bass line, the app's bass-line operation produces state that the sequencer knows how to play.

the model's job is to translate fuzzy human intent into precise operations.

roughly:

```ts
const operations = {
  setProgression(chords: Chord[]) {
    song.update((draft) => {
      draft.chords = chords;
    });
  },

  transpose(semitones: number) {
    song.update((draft) => {
      draft.chords = transposeChords(draft.chords, semitones);
      draft.bass = transposeNotes(draft.bass, semitones);
    });
  },

  addBassline(style: BassStyle) {
    song.update((draft) => {
      draft.bass = generateBassline(draft.chords, style);
    });
  },
};
```

the button calls `transpose(2)`. the agent can call `transpose(2)`. the important thing is that there aren't two implementations of transposition, one “normal” and one “AI.” there is one operation on one document.

this gives the system a hard, testable core. the model chooses an operation and arguments; ordinary software applies them. you can validate the arguments, enforce permissions, record the change, undo it, sync it, test it, and show it in the UI.

the model steers. the application does the work.

(this is also a much healthier relationship with probabilistic software than asking a model to hallucinate an entire valid state object on every turn and hoping it remembered all the fields.)

## sync is the spine

once the document is the center, sync stops being an add-on and becomes the spine of the application.

your hand changes the document and the agent should see it. the agent changes the document and every open interface should see it. reconnecting should not require reconstructing reality from the chat history. the current state of the document is reality.

in the version I showed at Local-First Conf, the song is associated with a Durable Object. the browser renders and manipulates it, while the Durable Object gives the document a durable, addressable home and a place where an agent can join it. direct input and agent tools converge on the same set of operations; updates fan out to the connected surfaces.

there is an important bit of precision here: putting state in a nearby Durable Object does not, by itself, make an application local-first in the strongest technical sense. if every edit requires a server round-trip, you have built a fast server-backed app, not a local-first one. a fully local-first implementation also needs a durable local replica, offline edits, and a reconciliation story.

the value I care about here is the local-first contract:

- the user's document is the source of truth, not the model's transcript
- direct edits happen at the user's hands and should feel immediate
- the application remains useful without asking the agent for permission
- sync connects surfaces and collaborators; it does not redefine ownership
- the agent joins the document as another client

you can implement that contract at different levels of local-first-ness. the strongest version keeps a durable copy on the user's device and syncs when it can. a simpler version can start with optimistic local state plus durable persistence and fan-out. but the direction matters: the network helps the user's document travel; it does not turn the user into a thin client for the agent.

## the harness is the app

people use “agent harness” to describe the stuff wrapped around a model: workspace, tools, memory, sandbox, permissions, the execution loop, all of that.

for coding agents, the harness looks like a developer environment because the document is a codebase.

for everyone else, the harness can just look like the application.

a spreadsheet is a harness around a grid: cells, formulas, recalculation, selection, history, persistence. give an agent tools to inspect and modify that grid and it can fill the column beside your cursor without replacing the spreadsheet with chat.

a canvas is a harness around shapes and layers. give the agent the same move, resize, group, align, and style operations used by the pointer and it can act on the canvas you already understand.

a music app is a harness around a song: notes, chords, instruments, time, playback, transformations. your fingers and the agent can play the same instrument.

the pattern is the same:

1. a document the user owns
2. direct manipulation that remains fully useful
3. a deterministic set of operations over the document
4. an agent that translates intent into those operations
5. a feedback loop so the agent can observe and adjust
6. sync and persistence that keep every surface honest

this is why I don't think the future is “every app gets a chatbot.” chat can be one useful input surface, especially for intent, explanation, and ambiguity. but the larger opportunity is to make applications inhabitable by agents without surrendering them to agents.

the magic of coding agents was never exclusively about code. it was what happened when we gave a model a workspace, tools, a loop, and a computer.

now give it access to everyone else's documents.

not as the owner. as a guest.

one document. two hands.
