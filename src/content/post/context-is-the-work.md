---
title: the context is the work (what the day-to-day looks like now)
description: (corollary- pr descriptions are becoming the apprenticeship surface for remote teams and coding agents)
publishDate: "2026-01-07"
---

<style>
.prose-headings\:before\:-ms-4
  :is(
    :where(h1, h2, h3, h4, h5, h6, th):not(:where([class~="not-prose"], [class~="not-prose"] *))
  )::before {
  margin-inline-start: -1.5rem;
}
</style>

in my last post, [where good ideas come from (for coding agents)](/posts/seven-ways/), I argued that agents don’t magically make engineering easy; they make _implementation_ cheap, and then they amplify whatever you were already doing to keep work aligned with reality: constraints, context, an oracle, and a loop. this is the zoomed-in sequel.

after you’ve used coding agents for a bit, you start to notice something that feels a little backwards:

- code got cheaper.
- but review often feels harder.

not because the diffs are bigger (they’re often smaller). and definitely not because agents write unreadable code (they often write very clean code).

I think it’s because **the hard part of the job moved** ("shifted left", one might say)

tl;dr: the scarce part of the workflow _seems to be_ becoming _context_: intent, assumptions, constraints, trade-offs, and verification. and the place that ends up holding a lot of that is the pull request description. _not just the diff._

---

## a normal day now: one pr, one change, a lot of thinking

let’s reuse the same running example from the last post: webhook ingestion.

you have a handler that validates a signature, stores an event, and enqueues a job. and prod keeps reminding you that the world is adversarial:

- partners retry aggressively → duplicates
- downstream fails halfway → partial side effects
- p99 latency is creeping up → every “fix” risks making tails worse

you open a pr titled something like:

> make webhook ingestion reliable (idempotency + retries)

you ask an agent to help.

it comes back fast with a plausible diff:

- adds an idempotency key
- prevents duplicate enqueue
- adds a retry wrapper in the worker
- improves logging

tests pass. the code is clean.

a few years ago, you might have merged this (or at least felt good about it).

today, the thing you feel is: _unease_.

because the question isn’t “does this compile?” and it isn’t even “does this pass tests?”; it’s:

- **what does “idempotent” mean here, exactly?** (partner id + event id? payload hash? something else?)
- **where do retries live?** (edge handler vs background worker)
- **what is the p99 budget?** (and did we just tax it)
- **what’s the failure model?** (fail closed? fail open? dlq?)
- **what did we not change?** (data model? queues? partner contract?)

and here’s the part that I keep bumping into: the agent can generate the diff in minutes, but you can still spend _hours_ making sure it’s the right diff.

at least in my experience, that time doesn’t feel like overhead anymore, it feels like where the work _actually_ went.

---

## the inversion: the pr description starts carrying the engineering

the diff answers: **what changed**.

the pr description is supposed to answer:

- **what did we mean?**
- **what constraints shaped this?**
- **how do we know it’s correct?**
- **what should reviewers focus on?**

in the agent era, that list feels like it’s becoming the center of gravity.

a clean diff is only evidence of taste, or the lack of it. (taste matters, but it’s not the same thing.)

when codegen is cheap, “engineering” shifts toward:

- turning tribal knowledge into written constraints
- making trade-offs explicit
- choosing and running verification loops
- drawing scope boundaries

and the pr description becomes the place where all of that gets serialized.

I think this is why reviews can feel harder: **the implementation "matters" less; you’re reviewing an interpretation, and the history that brought you there.**

---

## why “paste the transcript” is usually not the move

a predictable reaction to this shift is: “ok, so we should attach the entire agent chat log to the pr.”

I get the instinct, but in practice I don’t think it works that well.

full transcripts have the same problem as raw debug logs:

- they are high volume
- they mix signal and noise
- they contain false starts and vibe-driven tangents
- they’re optimized for _getting to an answer_, not _making the answer auditable_

reviewers need the plot points! they need to follow the story as you've told it (indeed, as you discovered it). so you want **structured provenance** to help them follow that story:

- what the goal was
- what constraints were non-negotiable
- what decision points existed
- what you chose, and why
- what you ran to validate it

(I’m sure a bunch of tools will try to automate this; ai-generated pr summaries, walkthroughs, session logs, etc. those are useful, but most of them are currently better at _what changed_ than _what constraints mattered_. and that second part is still where correctness tends to live.)

---

## this was always the interview signal

this is the part that made me feel less crazy: we've been here before.

think about coding interviews; the ones where the prompt is intentionally under-specified.

yes, you’re “solving a problem.” but the real signal isn’t whether you can type out a solution under time pressure. the real signal is usually:

- what clarifying questions you ask
- what constraints you surface
- what assumptions you state explicitly
- how you test the edges mentally before writing code

good interviewers, they watch how you construct the problem, and actually consider the code that you write to be a side effect of that process.

and agents, aha, they didn't invent this skill! they just make the gap obvious when you skip it (I do wonder if having interview banks and tips in the training dataset influenced this, but that's a digression for another day.)

in day-to-day work with coding agents, the first five minutes often look like the best kind of interview:

> before we write anything: what does “correct” mean here, and what would make this wrong?

---

## the lost apprenticeship (and where it went)

there’s another shift here that I think we’re still metabolizing: remote work.

pre-remote (or even just pre-async), juniors learned the job by proximity:

- you sat next to seniors (like, literally, peering over their shoulder. it's how even I learnt javascript 20 years ago)
- you overheard how they reasoned
- you watched how they decomposed work
- you saw what they worried about _before_ they wrote code
- you learned the “how we do things here” stuff without anyone having to name it

that apprenticeship surface was always real, even if informal, and it was so fkin critical.

now, in remote teams, and _especially_ with agents, most of that ambient learning doesn’t travel the same way.

you can’t really overhear judgment.

if you want it to transmit, you have to serialize it.

and where does that serialization most naturally happen?

- in pr descriptions
- in review comments
- in small design notes
- in decision logs

this is the part I care about for juniors: **your future job is probably not to out-type the agent. it’s to learn the questions that make the work converge.**

---

## “knowing what questions to ask” becomes the job

I think juniors often feel like their job is “ship tickets.”

in an agent-heavy world, the more durable job description might be:

> turn ambiguity into constraints, and make correctness legible.

some questions that almost always matter (and that you can learn to ask on purpose):

- **goal:** what outcome are we trying to produce? (not the mechanism)
- **non-goals:** what are we explicitly _not_ doing?
- **invariants:** what would make this change wrong even if tests pass?
- **failure modes:** how does this fail in prod? what do we do then?
- **verification:** what did we run? what would convince us this works?
- **rollout/rollback:** how do we deploy safely, and how do we undo it?

I don’t think these are “soft skills.” they’re the mechanics of building correct systems.

seniors often have these questions in their head as scar tissue. agents make that scar tissue more visible because if you don’t write it down, the model will happily fill the gaps with a plausible completion.

---

## the pr description as interface

the pr body feels like it’s becoming the interface between:

- fast, probabilistic agent work
- slow, accountable human judgment

and also between:

- seniors and juniors
- your team and the rest of the org
- present you and future you

what I think would work is a three-layer pr description. think of it as optimizing for three reader modes.

### layer 1: executive intent (30 seconds)

answer:

- what changed?
- why now?
- what’s the user/system-visible outcome?

### layer 2: reviewer guidance (3–7 minutes)

answer:

- where should I look?
- what invariants matter?
- what trade-offs did you make?
- what did you deliberately not change?

### layer 3: provenance + replay (only if needed)

answer:

- what context did you use?
- what decisions were made?
- what commands/tests were run?

(this is the part that belongs in a collapsed `<details>` block. it’s there when you need it, but it doesn’t turn the pr into a novel.)

---

## a concrete format (with one filled example)

here’s a format that reads well (imo). it’s intentionally similar to the “context packet” template from the last post, but aimed at _review_ rather than _prompting_.

### suggested pr body

- **goal:**
- **non-goals:**
- **constraints / invariants:**
- **approach:**
- **what changed (walkthrough):**
- **verification:**
- **risks & rollback:**
- **context manifest** (for audit / archeology, put this inside a `<details>` block)
  - **prompt summary (not transcript):** what we asked the agent to do, in intent/constraints form
  - **repo anchors used:** the handful of files/docs that defined “truth”
  - **decision points:** the 2–4 moments where options existed and we chose one
  - **tools invoked:** tests, linters, benchmarks, and outcomes

### filled example (webhook reliability)

**goal:** prevent duplicate downstream effects when partners retry the same webhook delivery.

**non-goals:** no new datastore; no partner-facing contract changes; no retries inside the http handler; no large refactors.

**constraints / invariants:**

- idempotent under partner retries
- p99 handler latency must not regress
- no payload logging (pii)
- retries must be bounded + jittered (worker-side)

**approach:** implement ingestion idempotency keyed by `(partner_id, event_id)`; keep edge path fast; move retries to worker; add dlq path for poison events.

**what changed (walkthrough):**

- added idempotency guard at ingestion to prevent duplicate enqueue
- reused existing retry policy helper for worker retries
- added dlq handling for permanent failures
- added metrics: duplicate rate, retry count, dlq depth

**verification:**

- added tests for duplicate deliveries → only one enqueue
- added tests for transient downstream failure → bounded retries
- ran: unit tests + integration tests

**risks & rollback:**

- risk: incorrect idempotency key choice could drop legitimate events
- rollout: feature flag at 1% for one partner, monitor duplicate rate + p99
- rollback: disable flag

<details>
<summary><strong>context manifest</strong></summary>

- **prompt summary:** implement ingestion idempotency only; keep diff small; reuse retry policy; do not add new abstractions; add tests for duplicates and retries.
- **repo anchors used:** existing retry module; queue abstraction; error taxonomy types; logging/metrics helpers; prior ingestion endpoint pr.
- **decision points:**
  - key choice: `(partner_id, event_id)` vs payload hash → chose ids because hashes aren’t stable identifiers across real retries
  - retry placement: worker vs handler → chose worker to protect p99
- **tools invoked:** unit tests, integration tests (green)

</details>

---

## how this relates to the “context packet” from seven-ways

in the last post I described a context packet as an _input artifact_: a small, curated bundle that stops the agent from guessing what “truth” is.

this post is about the corresponding _output artifact_:

- the context packet tells the agent what truth is.
- the pr description tells humans how we enforced it.

same discipline, different direction.

---

## zooming out: prs are the smallest unit of org sense-making

once you take this seriously, it’s hard not to notice the scale effect.

pr descriptions are the “small” version of a bigger job:

- explaining what your team is doing
- explaining what you _aren’t_ doing (and why)
- sequencing work so the org doesn’t invent a story for you

this sounds like “communication,” but I think it’s more precise to call it **engineering judgment at larger radii**.

the failure mode is the same as with agents:

- people fill in missing context with plausible completions
- you get misalignment that nobody intended
- and then you pay for it later

a good pr description starts by helping a reviewer, but then it helps your future teammate, your future oncall, your future self, and anyone trying to understand what changed and why. this is the job!

---

## what this changes about onboarding and growth

in remote teams, onboarding is mostly archaeology.

people learn your system by:

- reading prs
- reading code
- reading runbooks
- reading incident docs

if those artifacts aren’t interrogable (i.e. - if they don’t encode intent and constraints) then onboarding turns into a game of telepathy.

for juniors, this can be weirdly good news:

- you don’t need to be the fastest typist
- you need to become fluent in constraints, verification, and failure modes

for seniors, it explains why the job can feel heavier:

- you may write less code
- but you’re responsible for coherence

so it seems to me that agents didn't remove senior work, they mostly _exposed_ it.

---

## closing

we've said this before:agents make code cheaper; they don’t seem to make judgment cheap.

so the job shifts toward making your intent, constraints, and verification legible; first to the agent, then to your reviewer, then to your team, and eventually to the rest of the org.

if the future junior can’t sit next to you and absorb how you work, they’ll learn from what you actually wrote down.

which means pr descriptions probably can’t be a formality anymore. they might be the actual apprenticeship surface.

---

## epilogue: what it might mean to “review” context

there’s a follow-on idea I can’t stop thinking about.

in the past, review wasn’t just reading:

- you checked the branch out
- you ran tests
- you poked at it in a repl
- you wrote a quick harness

that was a way of _interrogating_ the work.

if the pr description now carries a meaningful chunk of the engineering judgment, we might need an equivalent way to interrogate that too.

maybe that looks like:

- linking a pr to the coding session that produced it
- replaying the session in a sandbox
- branching the session to ask your own “what if…” questions
- and (somehow) merging the results back, just like we used to merge commits from multiple humans into one pr

this opens a bunch of weird questions:

- what’s the “diff” for reasoning?
- what’s a merge conflict between two interpretations?
- what does it mean to rebase intent?

we invented branches, diffs, and reviews to collaborate on code.

if context is now the work, we’ll need equally good ways to collaborate on reasoning. who's building this?
