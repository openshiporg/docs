# docs-new

This is a Next.js application generated with
[Create Fumadocs](https://github.com/fuma-nama/fumadocs).

Run development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

## Explore

In the project, you can see:

- `lib/source.ts`: Code for content source adapter, [`loader()`](https://fumadocs.dev/docs/headless/source-api) provides the interface to access your content.
- `lib/layout.shared.tsx`: Shared options for layouts, optional but preferred to keep.

| Route                     | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `app/(home)`              | The route group for your landing page and other pages. |
| `app/docs`                | The documentation layout and pages.                    |
| `app/api/search/route.ts` | The Route Handler for search.                          |

### Fumadocs MDX

A `source.config.ts` config file has been included, you can customise different options like frontmatter schema.

Read the [Introduction](https://fumadocs.dev/docs/mdx) for further details.

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following
resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.dev) - learn about Fumadocs

## Checks

Run `npm test` (alias for `check:links`) or any script below with `npm run <name>`.

- `check:links`: runs the product coverage check, then verifies internal links and anchors in the content.
- `check:products`: confirms every product in the catalog has a complete documentation tree.
- `check:polish`: checks documentation navigation, titles and copy rules.
- `check:external`: checks advertised external URLs and the documentation API endpoints (needs network).
- `check:routes`: crawls the built site (run `npm run build` first) and fails on 404s, broken anchors, missing assets or error pages.
- `types:check`: generates Fumadocs and Next types, then runs `tsc --noEmit`.
