---
title: solving the jest.mock()+esmodules hoisting problem
description: A proposal to use jest.mock() with esmodules without babel shenanigans
publishDate: "2021-02-06"
---

(This is a pretty niche post, but I needed to write it down so I can point to it from elsewhere.)

Ok, so. This is about [`jest.mock()`](https://jestjs.io/docs/en/manual-mocks). Let's say you have a module:

```jsx
// a.js
export const x = 123;
```

Alright, now let's say we write a test that mocks `a.js`:

```jsx
// a.test.js
import { x } from "./a";

jest.mock("./a", () => {
  return { x: 456 };
});

it("should be mocked", () => {
  expect(x).toBe(456); // this test should pass.
});
```

If you look closely at the test, you'll note something odd. The value `x` is imported _before_ the module is mocked, yet behaves like it was imported _after_. If this code behaved as it was written, you'd expect `x` to have the value `123`, since it was imported and destructured _before_ its module was mocked. How is that possible?

[The docs explain it.](https://jestjs.io/docs/en/manual-mocks#using-with-es-module-imports) What's happening, (and I'm trivialising it a bit here), is that common `jest` setups send the code through [`babel-plugin-jest-hoist`](https://github.com/facebook/jest/blob/master/packages/babel-plugin-jest-hoist/README.md), which rewrites it and _hoists_ every `jest.mock()` call to _above_ the `import` statements. So the module _first_ gets mocked, _then_ gets imported.

This is cool becase it solves a clear problem; you can't technically write code before `import` statements, but when writing tests you _do_ want to kinda do it.

That said, this kinda sucks. It's clearly special behaviour that you have to have learnt elsewhere, applies only inside `jest`, and requires a specialised setup. It also means that if you invent a new kind of javscript compiler that doesn't use `babel` and stuff (ahem, [`esbuild`](https://esbuild.github.io/)), you can't get mocking to work correctly (or you have to bring along the baggage, which removes the benefits of using something like `esbuild`).

I have a proposal for a better solution. It involves a new language feature, called [top-level `await`](https://github.com/tc39/proposal-top-level-await). tl;dr - this new feature lets you use `await` at the top-most scope of a module (instead of having to wrap that code with an `async function(){...}` ). Combined with dynamic imports, we can rewrite the test from above like this:

```jsx
// a.test.js
jest.mock("./a", () => {
  return { x: 456 };
});

const { x } = await import("./a");

it("should be mocked", () => {
  expect(x).toBe(456); // this test should pass.
});
```

I like this more. Not only does it not require any special code transform, but it also makes 'sense'. If you're migrating a bunch of already existing tests, you could write a codemod that converts all tests into this format.

You can't use this today though, even though the latest versions of `node.js` (14.3 and up) support top level await. I tried and failed (maybe someone smarter than me could do so?) I looks like `jest` has to support this too; conveniently [there's work in motion](https://github.com/facebook/jest/issues/9430) to bring ES module support to `jest` (and subsequently, support top-level `await`).

So, to summarise, I think it should be possible, in the relatively near future, to use `jest.mock()` and co. with `esbuild` without having to do anything bespoke.
