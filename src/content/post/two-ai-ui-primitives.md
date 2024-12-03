---
title: Three missing primitives in every UI framework
description: (please build them)
publishDate: "2024-12-03"
---

(Day 2 of DecemberDumps '24: an exercise in loose unedited writing)

If you're a "User Interface" framework, then you should have opinions on things people use to build User Interfaces. Or else call yourself Component Scaffolding and be done with it.

## Anything with Images and Typography

Images, layouts, and typography are like 90% of what sets the tone for a UI. It's weird that none of the frameworks have strong opinions on these things, and you need to add a library to get any of these things done. I need loading and sequencing primitives for images, good defaults for typography styles and pairings. MS Word did a better job at this in '97 than frameworks do today in '24 (and it otherwise still sucks).

## An audio input / speech-to-text hook/component

I want to talk to my computer. I've been playing with OpenAI's new realtime API, and it's pretty cool. But building an app to do that is a pain. I note that even in third-party land, there isn't a good hook and/or component for this. Even for just recording audio from a mic, potentially with a push-to-talk button, there's not a good story. You could probably become an overnight hit of you built this, and made it work well with the ecosystem (using whisper over the wire is good, maybe even wiring up to the web speechrecogition API would be nice). The output should also have that UI pattern where it might correct some text as you speak. Someobody build this.

## autocomplete for `<input type="text/>` and `<textarea>`

If there's something that LLMs have influence me about, it's that autocomplete while typing is a complete game changer. I use the Cursor IDE regularly, and especially for the braindead stuff, I'm mostly hitting tab to autocomplete. But it's so hard to do thisin a web app, you have to build it from scratch. There are good text editor components, but they're not autocomplete-friendly just yet. Somebody do this, every app needs it. There's a future where every single input/textarea has autocomplete, and you(r open source library) could be the reason that it went mainstream.
