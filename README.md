<div align="center">
  <h1>Solving the decision problem</h1>
  <p>Sunil Pai’s personal site—essays, notes, and experiments.</p>
</div>

## About the site

This repository powers <em>Solving the decision problem</em>, a long-form Astro site authored by Sunil Pai. Posts live under <code>src/content/post</code> and are rendered through custom layouts, OG images, and Pagefind-powered search. Metadata such as the site title/description lives in <code>src/site.config.ts</code>.

## Local development

```bash
npm install          # install dependencies
npm run sync         # generate content types
npm run dev          # start the dev server (default http://localhost:4321)
```

### Common scripts

| Command             | Description                                                              |
| ------------------- | ------------------------------------------------------------------------ |
| `npm run dev`       | Launch Astro dev server with live reload                                 |
| `npm run build`     | Production build (outputs to `dist/`)                                    |
| `npm run preview`   | Preview the production build locally                                     |
| `npm run postbuild` | Build the Pagefind search index after a production build                 |
| `npm run sync`      | Regenerate types from `src/content.config.ts`                            |
| `npm run format`    | Format the repository with [oxfmt](https://github.com/oxc-project/oxfmt) |

Swap `npm` for `pnpm`/`yarn` if you prefer other package managers.

## Content workflow

1. Create or edit Markdown/MDX files inside `src/content/post`.
2. Each file’s filename becomes its slug; use `entry.id` when referencing entries in code.
3. Frontmatter is validated by `src/content.config.ts` (title, description, publish date, tags, optional cover/OG image fields).
4. Generated OG images live at `/og-image/[id].png`; set `ogImage` in frontmatter to override.

## Styling & configuration

- Global design tokens and Tailwind CSS utilities live in `src/styles/global.css` and `tailwind.config.ts`.
- Site metadata (author, title, description, locale preferences) is managed in `src/site.config.ts`.
- Modify layout behavior by editing components under `src/layouts` and `src/components`.

## Deployment

Run a full build (`npm run build && npm run postbuild`) and deploy the `dist/` directory to your hosting provider.

## License

[MIT](./LICENSE)
