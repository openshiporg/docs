---
name: openfront-social-custom-storefront
description: Plan and build a custom Openfront Social public creator site by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Social custom public site

Use this skill to adapt the built-in Social public site (landing page, creator profiles, collections, items, feeds) or create a separately deployed client. Start from this product's current source, not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Source repository: `https://github.com/openshiporg/openfront-social`. Confirm the exact checkout path and revision before relying on it.
- Public creator site screens, data loaders, themes, branding, markdown rendering, and RSS: `features/personal-site` (`screens/ProfilePage.tsx`, `CollectionPage.tsx`, `ItemPage.tsx`; `lib/data.ts`, `lib/queries.ts`, `lib/public-read.ts`, `lib/theme.ts`, `lib/rss.ts`, `lib/public-origin.ts`; `branding/**`).
- Product landing page and creator account screens: `features/storefront` (`screens/LandingPage.tsx`, `account/**`, `lib/viewer.ts`, `middleware.ts`).
- Thin public route entry points: `app/page.tsx`, `app/[handle]/page.tsx`, `app/[handle]/[collection]/page.tsx`, `app/[handle]/[collection]/[slug]/page.tsx`, `app/feeds/[handle]/route.ts`, `app/media/[id]/route.ts`, `app/sitemap.ts`, `app/robots.ts`, `app/account/signin`, `app/account/signup`.
- Server contract: `features/keystone/models/**`, `features/keystone/access.ts`, `features/keystone/mutations/**` (public reads in `personalPublishing.ts`, `public-sitemap.ts`, `public-redirect.ts`, `public-query-selection.ts`), `schema.graphql`, and `docs/schema-map.md`.

Explain that `features/personal-site` is the behavioral reference for public visibility: a site must be published, a collection must be public (listed, in RSS, indexed) or unlisted (link-only, noindex), and only items with a live canonical publication appear. Public queries are `publicPersonalSite`, `publicPersonalCollection`, `publicPersonalItem`, `publicPersonalFeed`, `publicSitemap`, and `publicHandleRedirect` (renamed handles redirect).

The current product focus is reading: profile, then collection, then item with newer/older navigation, plus RSS, sitemap, and creator sign-in or sign-up (only when `PUBLIC_SIGNUPS_ALLOWED=true`). There is no cart, checkout, booking, reader account, comments, or follows. This list is orientation, not proof that every flow is complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Social source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in public site or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which visitor journeys, routes, content types, themes, brand, devices, and accessibility needs are required?
5. What visual references, interaction direction, responsive targets, and deployment constraints matter?
6. Which non-production host, schema export, test data, and test identities are available?

Restate the brief, inspect the supplied source, identify presentation-only changes versus backend-contract work, and ask for confirmation before broad implementation.

## Required source inspection

Before proposing code:

1. Enumerate the actual app routes for this product.
2. Trace the built-in screen components and every data loader/server action they call.
3. Enumerate GraphQL documents and operation names used by those call sites.
4. Read `schema.graphql`, model access, field access, and custom query/mutation resolvers.
5. Record visibility rules, pagination limits, redirect behavior, caching headers, and error states for each required public read.
6. Inspect `/media/[id]` presigned redirects, public origin configuration (`NEXT_PUBLIC_APP_URL`, `RAILWAY_PUBLIC_DOMAIN`), RSS output, robots/sitemap, cookies, and runtime configuration touched by the requested flow.
7. Produce a capability matrix: verified, presentation-only, needs backend contract, blocked, or absent.

Do not claim the skill already knows a deployed contract. It knows where and how to discover the exact calls. Generated CRUD or a schema-valid document is not proof of safe access; creator lists are owner-scoped and not readable anonymously.

## Built-in versus separate client

### Adapt the built-in client

- Keep route files thin.
- Put product UI and orchestration in the existing feature slice.
- Reuse the current themes (`paper`, `midnight`, `forest`), site branding (`logoIcon`, `logoColor`), markdown renderer, loading/error states, and public queries.
- Do not duplicate visibility, publication, or redirect decisions in components.

### Build a separate client

- Use a trusted, environment-pinned endpoint and the public queries only.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, relationships, or endpoint URLs.
- Pin the exact schema, generate strict types, runtime-validate JSON results (for example `publicPersonalFeed`, `publicSitemap`), and fail closed when a required contract is absent.
- Keep image URLs on the stable `/media/[id]` path rather than caching presigned URLs.
- Test hidden sites, private and unlisted collections, unpublished and archived items, renamed handles, and large collections against disposable data.

## Product-specific boundary

Design around creator profiles, collections, items, feeds, and sharing. Preserve the product's real nouns and its visibility rules. Never rename Ecommerce products/orders into this vertical or borrow Ecommerce GraphQL roots.

Do not add reader accounts, comments, follows, or external posting without a bounded server contract; none exist today. If a requested feature needs one, request the backend contract and show the feature as unavailable.

## Handoff

Report:

- built-in or separate mode;
- source path/repository and revision inspected;
- routes and built-in screens reviewed;
- schema hash and named operations used;
- requested changes and what was preserved;
- capability matrix and backend blockers;
- implemented files and tests;
- responsive/accessibility evidence;
- origin, caching, storage, deployment, and rollback notes.

Never present a source path, generated schema, HTTP 200, or attractive empty state as proof that the public site workflow is operational.
