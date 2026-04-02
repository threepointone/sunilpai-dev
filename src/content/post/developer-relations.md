---
title: developer relations after the cheat code machine
description: (corollary- developer relations is becoming more about helping humans develop judgment around these systems)
publishDate: "2026-04-02"
---


I’ve been thinking a bit lately about what developer relations means right now, and the thought keeps coming back because of a pattern I’ve heard from a bunch of different people over the last few months. educators and technical content creators keep telling me the same thing: engagement is softer, course sales are softer, and people seem much less willing to pay for educational material than they were even a year ago.

that’s a strange thing to hear at a moment when software activity itself does not seem to be shrinking. if anything, more code is being produced than ever. “produced” is probably the better word now, since “written” no longer quite captures what many of us are doing, but the point stands. there is a lot of software being made, so why does the market for learning feel weaker?

I have a theory, or at least the beginning of one.

I don’t think most people were really buying courses because they wanted to learn APIs in the narrow sense. of course that was part of it. people wanted help understanding frameworks, libraries, ecosystem conventions, and all the little things that documentation tends to assume rather than explain. but I think the deeper thing they were buying was a way of working. they were buying a model for how to do the job: how to structure things, how to debug, how to choose between options, how to work with a framework instead of fighting it, how to collaborate, how to ship, and how to notice when something is wrong even when it technically works.

that feels like a different category of learning from simply understanding the surface area of a tool.

if you’re a hacker, a tinkerer, or just someone who likes getting mildly dangerous as quickly as possible, you can usually get pretty far without paying for a course. you read enough docs to get your bearings, steal a few examples, poke at the thing until it twitches, and eventually force it into doing what you want. that mode of learning is real and useful, and a lot of us learned at least part of the craft that way. but it mostly gets you to “I made it work.” courses, at their best, were often selling something else. they were selling “here is how to work in a way that survives contact with an actual job.”

and that, I think, is exactly the layer that ai coding tools have crashed into.

for a lot of software engineers right now, work comes with this strange cheat code machine attached to it. every time you pull the lever, code comes out. not perfect code, obviously, and not always code you should trust, but often useful code, increasingly plausible code, and enough of it to create the powerful feeling that progress is happening. if I can point a coding agent at the docs for a thing and ask it to explain the API, generate an example, scaffold the project, or simply take a run at the task itself, it makes complete sense that the value of a course begins to wobble. if my choice is between paying for a course and paying for more access to the machine, I can see why many people are choosing the machine.

that doesn’t mean they no longer want to learn. I think they absolutely do. it just seems to me that the object of learning has moved up a layer.

you can see some of that in the formats that still seem healthy. coding streams still make sense to people. certain youtube creators still make sense to people. the more compelling ones are not just explaining documentation, they are showing how they actually work with these tools. people want to see what gets delegated and what gets checked by hand. they want to see where someone trusts the model and where they absolutely do not. they want to watch someone notice that the output is plausible but cursed, or technically correct but somehow still the wrong shape. they want to see how a person recovers when the agent has confidently wandered off in the wrong direction. what they are looking for, really, is judgment in motion.

that part feels familiar to me, because it is basically how I learned to become a software engineer in the first place.

when I was getting started in hyderabad, I sat next to a much more senior engineer and more or less watched her work all day. I copied everything. not just the code, but the whole texture of the job: how she used the editor, how she debugged, how she moved around a codebase, how she wrote emails, how she asked for help, how she collaborated, even the way she used the keyboard. a lot of what I was learning was too small and too tacit to be taught directly. nobody was going to make a course out of “watch how this person narrows down a problem,” or “notice how they do not panic when the first thing they tried doesn’t work.” you had to observe it, then try it, then absorb it.

honestly, I still think I work like that now. I’m still trying to steal moves from people around me all the time. if someone is sharper than me, or sees a kind of problem more clearly than I do, or has some instinct that I haven’t developed yet, I want to know how they think. I do not particularly care whether they are older or younger than me. I want to learn the move and add it to the toolkit.

that kind of learning matters a lot, and I think we have less of it than we used to. remote work changed how much ambient apprenticeship people get. not in some silly “remote work ruined everything” sense, because that’s crazy man, but one thing it definitely reduced was the casual, high-bandwidth proximity where you learn the craft by osmosis. coding agents have now added another layer of separation. a lot of younger engineers are not sitting near experienced engineers in the old way, and they are also not always touching the raw material of the work in the same way because the machine is generating so much of it. there is less osmosis right at the moment when I think osmosis may matter more.

that may be part of why “watch me work” content feels so compelling right now. it restores, in some partial way, the thing people are missing. not just instruction, but witnessed practice.

I keep coming back to that phrase. what many people want now is not really explanation in the old sense. they want to see how someone actually navigates uncertainty. they want to see where a person pauses, what they inspect closely, what they ignore, what they decide is good enough for now, where they get suspicious, and how they tell the difference between something that merely works and something that is actually good.

this is where words like “taste” start to show up, which is always a little dangerous because it can sound preachy if you are not careful. it can sound like one of those words people use when they mean “my preferences, but make them moral.” that is not what I mean. I think taste in software is becoming more important because code is getting cheaper. if an agent can generate ten plausible solutions, the scarce skill is no longer producing a solution at all. the scarce skill is being able to tell which one is brittle, which one hides complexity instead of removing it, which one is overfit to the prompt, which one will be miserable to maintain, which one quietly makes the user’s life worse, and which one is actually the right tradeoff for the moment you’re in.

that does not seem ornamental to me. it seems operational.

the same goes for UI and architecture. taste in UI is not mainly about prettiness, it is about knowing when an interface is confusing, when the defaults are wrong, when the state is illegible, when the product is making the user work too hard, or when some supposedly magical interaction is actually just disorienting. taste in architecture is not really about drawing nice boxes. it is about having a feel for future pain, for hidden coupling, for the places where complexity has been concealed rather than reduced, and for the choices that look clean in a demo but create an absolute tax on the team six months later.

the awkward thing is that these are exactly the areas where people need help, and exactly the areas that are hardest to package as tidy educational products. you can sell a course on a framework. it is much harder to sell a course on judgment without turning it into ten slogans and a worksheet. judgment develops through exposure, comparison, critique, and repeated contact with consequences. people learn it by seeing two things that both work and understanding why one of them has the better shape, or why one of them will age more gracefully, or why one of them creates less confusion for the next person.

so maybe that means devrel itself has to change shape a bit. maybe it matters less that we can explain the features of a product beautifully, and more that we can show how someone competent would actually use it. maybe the thing to optimize for is not just time to first successful demo, because the machine is getting pretty good at fabricating those. maybe the thing to optimize for is making good work visible.

not just “here is our sdk,” but “here is how a thoughtful person uses this sdk in a real workflow.” here is what they let the agent do, here is what they verify, here is what they test, here is the shape of the mistakes, and here is how they recover when the generated answer is slick but wrong. that feels closer to apprenticeship than marketing, which, now that I write it down, is maybe what good devrel was always closer to anyway.

there’s a whole other thread here about what happens when agents themselves become the primary consumers of your docs, APIs, and error messages, and when devrel has to be legible not just to humans but to the machines working alongside them. I want to pull on that separately in a different post.

but for now, the human side.

I don’t think I have a neat conclusion here, and I’m suspicious of anyone who sounds too certain about this stuff right now. mostly I just think there is a category change happening in front of us, and some of the old language is no longer doing enough work.

but one thing does feel true.

people were never only paying to learn APIs. they were paying to learn how to work. ai has made a lot of API knowledge cheaper, but in doing that it may also have made witnessed practice, judgment, and taste more valuable than they were before. the old devrel bargain was often something like “we will help you understand the tool.” the emerging one might be “we will help you understand how to work well with the tool, with the agent, and with each other.”

that feels like a meaningful shift. it also feels, to me at least, like a more honest description of what the best developer relations has always been trying to do. not just explain the surface area of a product, but make good work visible. and in a world where the machine can generate an endless supply of plausible answers, that kind of visibility may be the thing people need most.