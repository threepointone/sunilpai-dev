---
title: every company needs a cassandra
description: an ai agent for the socially expensive work of organizational dissent
publishDate: "2026-08-09"
---

every company has had this person. they're... annoying. when everyone is excited about something, they'll tell you why it won't work. when someone drops a competitor's launch into slack and everyone starts making fun of it, they'll point out the thing the competitor is actually doing well. and ffs, the annoying part is that they're often right.

I've worked with a few people like this. sometimes I've been this person. they can sound like pessimists, but mostly they're willing to say something everyone else would rather not hear.

organizations have a weird relationship with these people. we say we want disagreement, but every disagreement costs the person making it a little social/political capital. do it often enough and you become _the negative person_. people stop evaluating the argument and start evaluating the source. "oh, that's just alice being alice." eventually alice learns to keep quiet, or stops getting invited to the conversations where everyone wants to move quickly. a lot of times they just leave.

that's bad, because organizations are terrible at being self-critical without people like alice around. consensus feels good, especially when the people agreeing with you are smart people you respect. a group of intelligent people can build a very convincing explanation for why the thing they already want to believe is true. so I've been wondering: what if alice was an ai agent?

## cassandra

I'm going to call this agent cassandra, after the [woman in greek mythology](https://en.wikipedia.org/wiki/Cassandra) who could see the future but was cursed so nobody would believe her. cassandra sits in your slack channels like any other work agent. nobody really asks her to do anything. most of the time she just watches.

someone posts a competitor's new product and everyone piles on about how stupid the architecture is. cassandra might say:

> the architecture criticism seems fair, but I think we're dismissing something important. they've reduced the setup process to about five minutes. ours still requires understanding three platform concepts. customers might care considerably more about that than the architectural problem we're laughing at.

or perhaps you've spent a few days discussing the risks of shipping something:

> we've spent three days discussing the risks of shipping this. as far as I can tell they're all reversible. I think caution might now be costing us more than the risks we're avoiding.

(that last one is a good one imo).

cassandra should disagree with pessimists too. "you are a devil's advocate, disagree with everything" is probably the worst possible prompt for this agent. within a week everyone would ignore her. she'd become the slack equivalent of a smoke detector that goes off whenever somebody makes toast.

her actual job is to form her own view of what is happening, then speak when it differs enough from the consensus to be worth the interruption. sometimes cassandra should look hard for an objection and say nothing. sometimes she should say, "I tried to find a strong counterargument here and couldn't." I'd trust her much more after that.

## the economics of being annoying

an ai is oddly well suited to this job. cassandra doesn't want a promotion and doesn't need the people in the channel to like her. disagreeing with the vp three times this month won't show up in a performance review. she doesn't have an ego invested in being right either. if she objects to a project in january and the data proves her wrong in march, she can just say so. being wrong should make her model of the company better.

she also isn't in the critical path of anything. the human version of this character is hard to work with when you need them to finish the database migration by friday and they're still challenging every decision around it. at some point the practical cost of the disagreement overwhelms its value. an agent doesn't have that problem, though it creates a new one: cassandra can be infinitely annoying. so the hard part of building her isn't so much the prompt, but "deciding" when she gets to speak.

## knowing when to shut up

almost all messages should get no response. cassandra could (should?) read everything and maintain a private model of the organization: assumptions, decisions, predictions, rejected alternatives, the customer complaints that keep coming back. then she'd have to decide whether any of it is worth interrupting humans about.

the rough calculation is something like:

importance × disagreement × evidence × novelty

if you're choosing the color of a button, cassandra can go away. if twenty people are converging on a decision that will take six months to reverse, and she has evidence that an assumption underneath it is wrong, she should probably say something. another useful test is:

_if nobody says this now, is there a plausible future where we wish somebody had?_

so much better than "find something wrong." it makes the _cost_ of interrupting part of the decision.

## give her a different brain

there's an architectural problem here. if cassandra reads the same summaries and starts from the same assumptions as every other corporate ai agent, we're asking one worldview to manufacture disagreement with itself. that... wouldn't work. (it's also why you never want to do code review in the same ai chat thread where you made the actual PR). cassandra needs some independent context.

let her read the competitor's documentation instead of only the internal thread making fun of it. give her support tickets, failed deals and old postmortems. let her keep her own ledger of assumptions and predictions instead of accepting the company's current explanation of why things happened.

the point is to give her enough _distance_ from the company line that her disagreement means something. it also means giving her what the kids are calling "memory". imagine cassandra has been sitting in your company for three years and you propose simplifying onboarding. she says:

> this is the fourth project we've described internally as "simplifying onboarding." the previous three gradually expanded into platform architecture projects. in each case we stopped measuring onboarding time once the scope changed. perhaps we should decide now what number we're actually trying to move.

companies have databases containing almost everything that has happened inside them, but their actual memory is surprisingly bad. people leave, decisions lose their original context, predictions disappear, and stories get rewritten once we know the outcome. an agent can keep the original version around. it can keep receipts.

## this could also go badly

ok, so there's a failure mode. imagine management starts saying, "we don't need someone to raise that concern, cassandra already looks for problems." that would be awful! cassandra should make it easier for humans to disagree with each other. maybe she does that by asking questions instead of delivering verdicts?

> I think everyone here is assuming migration cost is negligible. is that actually something we know?

or:

> nobody in this thread has argued the opposite position. before we commit to this, does anyone disagree?

(is this the socratic method of disgareement? but I don't want to namedrop 2 greek references. anyway.)

the agent can absorb some of the social cost of _starting_ the disagreement. humans still have to have it. cassandra could also become a ceremonial dissenter: she says the uncomfortable thing, everyone reacts with a thoughtful emoji, and then the company does exactly what it was going to do anyway. cassandra, after all, was cursed to see what was coming and be ignored. it would be a little too on the nose.

## maybe agents aren't just workers

I came up with this idea while wondering what other "personas" ai agents could have, and realised cassandra is a legitimately different kind of thing. most of the agents we're building today are workers. a coding agent writes code. a support agent answers tickets. research agents research and sales agents send emails. the organization has work that humans already do, and agents give it more hands.

cassandra doesn't fit that model. nobody had a cassandra ticket sitting in jira. she gives the organization a way of thinking that is hard for a human to sustain. once you see it that way, you start imagining much stranger agents.

one could be the company's institutional memory, noticing when a discussion resembles one from two years ago and remembering what happened next. another could remain permanently naïve, asking the question a new employee asks before they learn which assumptions everyone else has stopped noticing (my inspiration here is tom hanks in big, [during his first company meeting saying "I don't get it"](https://www.youtube.com/watch?v=3ERuhks3GNk)). a prediction accountant could write down claims like "this will increase adoption" or "customers won't care about this," then _come back six months later with the result_.

I think of these as cognitive functions modelled as ai agents. I wouldn't hire a full-time "person who remembers when we've had this argument before," but I'd like an organization to be able to remember.

we've spent a lot of time asking what kinds of labor we can give agents. more hands. cassandra suggests a different question: which useful ways of thinking are our organizations missing because they're expensive, exhausting, awkward, or impossible for a person to perform continuously? cassandra is one. there are probably many others.
