---
title: Feature flags
description: An introduction to feature flags
publishDate: "2020-08-08"
---

(_This post was originally posted on [gist.github.com](https://gist.github.com/threepointone/2c2fae0622681284410ec9edcc6acf9e)_)

I'm enjoying doing these raw, barely edited writeups; I hope they're useful to you too.

## Feature flags

This is my own writeup on feature flags; for a deep dive I'd recommend something like Martin Fowler's article (https://martinfowler.com/articles/feature-toggles.html).

So. Feature flags. The basic idea that you'll store configuration/values on a database/service somewhere, and by changing those values, you can change the user experience/features for a user on the fly.

Let's say that you're building a new feature, called 'new-button' which changes the color of buttons, which is currently red, to blue. Then you'd change code that looks like this -

```jsx
function Button(props) {
  return <button style={{ backgroundColor: "red" }} {...props} />;
}
```

to this -

```jsx
function Button(props) {
  const isNewButton = useFlag("new-button");
  return <button style={{ backgroundColor: isNewButton ? "blue" : "red" }} {...props} />;
}
```

(NB: This is a completely made-up implementation, I used a hook here just because.)

This is as simple as it gets. The value of `isNewButton` is fetched from a service somewhere, usually just once for the lifetime of the application (possibly right when the application starts?) Someone could then go to a hosted page somewhere listing all the configuration values, flip a switch, and decided whether to turn the button color red/blue. Flags don't have to be just booleans; they could be strings, or numbers, or any other values as well.

But wait. Some of this sounds like over-engineering. Why not simply have a module (say, features.js) that exports an object with these values? You could change them whenever, commit and deploy, and that would achieve the same thing. Or if you're going to use a service, why not a regular configuration service? Or a regular key value store with a simple UI on top of it?

The answer is targeting.

Feature flag services let you serve different values for different groups of people (based on whatever conditions you choose.) Typically, they'll integrate with some form of user service that you're using in your application/firm, and you'll be able to target values based on identity (like a user id), some grouping condition (like, what teams/groups a user belongs to), or a bucketing system (e.g - only for x% of users, where x can be dynamically changed at any time). This is an incredibly powerful feature that lets you achieve many things:

- mainline development: All PRs directly target your main branch. All new features are wrapped in a feature flag, and are turned on and off only once in a deployed environment. This also means you only need to deploy in-progress work to one environment/server, instead of needing different targets for different PRs, for example.

- prototypes: Want to build a quick product idea and share it with (only some) people? Put it behind a feature flag, add those people to the flag's filter, done.

- demos for stake holders: similarly, if you're building some cool stuff and want to impress your boss, or their boss, or some new client; feature flags ftw.

- qa on prod: Instead of deploying new changes to another environment for QA (realistically, a farm of machines, for every new feature being developed), the application can be deployed to production directly, turning on features for QA/UAT folks either manually by IDs, or targeting their team as a group. Once they signoff on features, it can be turned for users without any new deploys or releases.

- gradual rollouts: You can mark feature flags are being turned on/to a particular value for a given percentage of users. This lets you roll out the feature gradually; you can observe analytics to make sure nothing is broken and you're seeing expected results (based on what the feature achieves), and if all is going well, roll it out to more people. Similarly, if you see something wrong, or start getting bug reports about something being broken, you can turn it all the way down without a fresh deploy, which gives you time to investigate and fix the problem. Super neat.

- (Y'all got any more ideas? Lemme know.)

## Notes

- You want to be sure that your application is resilient to the feature flag service failing; i.e. make sure the 'default' choice is the safe choice.

- You may get concerned that your codebase will end up as a tangle of if-conditions, littered with feature flags. This is a good problem to have; a better problem than not being able to ship features, getting mired by infrastructure/architecture/process problems! I would recommend doing a regular cleanup; you could possibly run a script on your codebase every month or so, and detect flags that are set at 100% in production. Your script could get smart and codemod out the branch as well.

- A concern is that you'll end up shipping more code to a user than is generally used/required for the application. This is valid, and as such, feature flags for front end development are probably best for applications where bundles size isn't the most critical metric. Suggestions to improve this could be using dynamic imports for features (i.e. - condn? import('feature1') : import('feature2')), to integrating your build system with your feature flag service, generating multiple bundles based on combinations of feature flag values, and serving the right combination of bundles to your users (this is what big corps like fb do.)

- How do you write tests for stuff behind feature flags? You would mock the feature flag service itself, and set the required flags to the values you need for the tests you're running. Nice.

- Some examples of third party products (I haven't used any of these myself): [LaunchDarkly](https://launchdarkly.com/), [Optimizely](https://www.optimizely.com/), [ConfigCat](https://configcat.com/), [split](https://www.split.io/)

- Some good counterpoints here https://software.rajivprab.com/2019/12/19/when-feature-flags-do-and-dont-make-sense/

(todo: write about how to query values inline, but fetch all values at the beginning).
