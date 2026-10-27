---
name: openfront-analytics-custom-storefront
description: Plan and build a custom Openfront Analytics public site (public and shared dashboards) by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Analytics custom public site

Use this skill to adapt the built-in Analytics public site or create a separately deployed client. Start from this product's current source, not Ecommerce conventions, screenshots, or another vertical's schema.

Openfront Analytics has no shop. There are no products, carts, checkout, orders, or customer accounts. Its "storefront" is a public site that lists public dashboards and shows read-only, aggregate analytics for public sites and shared links.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Source repository: `https://github.com/openshiporg/analytics`. Confirm the exact checkout path and revision the user wants to target.
- Built-in public experience, screens, data loaders, and layout: `features/storefront` (`screens/HomePage.tsx`, `screens/PublicDashboardPage.tsx`, `screens/MainLayout.tsx`, `components/SharePasswordForm.tsx`, `lib/data/store.ts`, `lib/data/dashboards.ts`, `lib/data/share.ts`, `lib/data/client.ts`, `modules/layout`). `features/storefront/middleware.ts` passes every public route through.
- Thin route entry points: `app/(storefront)/(main)/page.tsx` (`/`), `app/(storefront)/(main)/sites/[slug]/page.tsx`, and `app/(storefront)/(main)/share/[slug]/page.tsx`. Styles: `app/(storefront)/storefront.css`.
- The dashboard view itself is the operator component `features/platform/sites/components/dashboard/SiteDashboard.tsx`, fed by a public loader. Changing it also changes the operator overview.
- Server contract: `features/keystone/mutations/publicDashboards.ts` (`publicSites`, `publicDashboard`, `unlockSharedLink`), `features/keystone/lib/analytics/engine.ts`, `features/lib/analytics/**` (dimensions, filters, periods), `features/keystone/models/Site.ts`, `SharedLink.ts`, `StoreSettings.ts`, and `schema.graphql`.

Explain that `features/storefront` is the behavioral reference for routes, states, GraphQL calls, and the shared-link unlock cookie. It should guide what is preserved or changed.

The current product focus is the home page (store name, tagline, and description from `StoreSettings`, then public sites with 30-day visitors and a sparkline), the public dashboard at `/sites/[slug]` for sites with `isPublic` on, and the shared-link dashboard at `/share/[slug]` with an optional password form. Public reports are aggregate only: `site`, `overview`, `breakdown`, `realtime`, `goals`, `funnels`, `funnel`, and `vitals`. Visit lists and visit timelines are never public. This list is orientation, not proof that every flow is complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Analytics source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in public site or create an independently deployed client (for example an embedded dashboard on their own marketing site)?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which public journeys, reports, periods, filters, branding, devices, and accessibility needs are required?
5. What visual references, chart direction, responsive targets, and deployment constraints matter?
6. Which non-production host, schema export, test data (for example the onboarding demo sites and shared links), and test shared-link passwords are available?

Restate the brief, inspect the supplied source, identify presentation-only changes versus backend-contract work, and ask for confirmation before broad implementation.

## Required source inspection

Before proposing code:

1. Enumerate the actual public routes under `app/(storefront)`.
2. Trace the built-in screen components and every data loader/server action they call.
3. Enumerate GraphQL documents and operation names used by those call sites (`storeSettings`, `publicSites`, `PublicDashboard` / `publicDashboard`, `unlockSharedLink`).
4. Read `schema.graphql` and the public resolvers: how a `siteSlug` or `shareSlug` resolves, which statuses return (`ok`, `password_required`, `not_found`), how archived sites, inactive or expired links, and passwords are handled, and that a `site` report through a shared link increments `viewCount`.
5. Record inputs, outputs (untyped `JSON`; read the real shapes from the engine), period and filter semantics (site timezone, up to ten filters, known dimensions only), breakdown limits, and error states for each report.
6. Inspect the unlock token flow: `unlockSharedLink` returns an HMAC token signed with `SESSION_SECRET`, stored by `lib/data/share.ts` in an httpOnly cookie named `share_<slug>` scoped to `/share/<slug>` for 30 days. Shared-link pages are `noindex`.
7. Produce a capability matrix: verified, presentation-only, needs backend contract, blocked, or absent.

Do not claim the skill already knows a deployed contract. It knows where and how to discover the exact calls. Generated CRUD or a schema-valid document is not proof of safe access.

## Built-in versus separate client

### Adapt the built-in client

- Keep route files thin.
- Put product UI and orchestration in the existing feature slice.
- Reuse current transport, design tokens, loading/error and not-found states, and named server operations where they are safe.
- Do not recompute metrics in components; read them from `publicDashboard`.

### Build a separate client

- Use a trusted, environment-pinned endpoint and the public operations only. A public client needs no API key; do not add one.
- Keep the shared-link unlock token server-side or in an httpOnly cookie; never put it or the password in a URL, log, or analytics event.
- Never expose an arbitrary GraphQL proxy or accept browser-selected operations, fields, or endpoint URLs.
- Pin the exact schema, generate strict types, runtime-validate the `JSON` results, and fail closed on `not_found` and `password_required`.
- Do not index shared-link pages, and treat the share slug as a secret capability.
- Test unknown slug, private site, archived site, inactive link, expired link, wrong password, changed password (old token rejected), and timeout behavior against disposable data.

## Product-specific boundary

Design around read-only, aggregate dashboards. Preserve the product's real nouns (site, visitors, visits, pageviews, sources, goals, funnels, vitals) and privacy boundaries. Never expose visit lists, visit timelines, visitor hashes, or `distinctId` values publicly, and never add viewer accounts, comments, or exports without a backend contract. Never show numbers the instance has not recorded or invent traffic claims. Do not borrow Ecommerce storefront roots such as carts or products; they do not exist here.

For any new public capability (for example embeds, CSV export, or per-link report restrictions), require one bounded server projection that validates the slug or link, its status and expiry, the password token, and which reports are allowed. If it does not exist, request the backend contract and show the feature as unavailable.

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
- shared-link token, secret, deployment, and rollback notes.

Never present a source path, generated schema, HTTP 200, or attractive empty chart as proof that the public dashboard workflow is operational.
