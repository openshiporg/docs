---
name: openfront-collectibles-custom-storefront
description: Plan and build a custom Openfront Collectibles storefront by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Collectibles custom storefront

Use this skill to adapt the built-in Collectibles storefront or create a separately deployed client. Start from this product's current source—not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Public source: `https://github.com/openshiporg/openfront-collectibles`. Confirm the checkout path and revision the user wants to target.
- Built-in Collectibles customer experience, screens/modules, data loaders, sessions, and UI composition: `features/storefront` (`screens`, `modules`, `lib/data`).
- Shared card UI (card grid and tile, checklist rows, card art, rarity marks, condition run, filter bar, binder summary, price history, slab view, sealed box), themed from CSS variables and also used by the dashboard: `features/storefront/components/cards`.
- Thin customer-facing route entry points: `app/(storefront)/[countryCode]/(main)/**` and `app/(storefront)/[countryCode]/(checkout)/checkout`. Routes include home, `sets`, `sets/[handle]`, `cards/[id]`, `products/[handle]`, `store`, `categories/[...category]`, `collections/[handle]`, `search`, `trade-in`, `cart`, `order/confirmed/[id]`, and `account/*` (orders, binder, wishlist as the want list, saved-searches, trade-ins, profile, addresses, invoices).
- Server contract: `features/keystone/models/**`, `features/keystone/access.ts`, `features/keystone/mutations/**` (public projections `publicCardSets`, `publicSetChecklist`, `publicCardMarket`, `publicBuylist`; owner-scoped `activeBinder`, `addToBinder`, `removeFromBinder`, `activeWantList`, `toggleWantList`, `activeTradeIns`, `submitTradeIn`; shared cart and checkout), and `schema.graphql`.
- Provider boundaries: inspect `features/integrations/**` (Stripe, PayPal, manual bank transfer; Shippo, ShipEngine, manual) and the exact server actions called by the built-in client. Pre-order limits live in `features/keystone/lib/pokemon/preorder-limit.ts` and are enforced in the cart mutations.

Explain that `features/storefront` is the behavioral reference for routes, states, GraphQL calls, cookies/tokens, and provider handoffs. It should guide what is preserved or changed.

The current product focus is browsing Pokémon sets as full checklists with stock and market readings, buying singles by condition, graded slabs, and sealed product (including capped pre-orders), selling cards to the shop through the "Sell to us" buylist, and collector accounts with a binder, want list, saved searches, and trade-in history. Offers and bidding are disabled in code. This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Collectibles source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in storefront or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which customer journeys, routes, content, brand, devices, accessibility, and commerce states (checklists, condition choice, slabs, pre-orders, trade-in, binder, want list) are required?
5. What visual references, interaction direction, responsive targets, and deployment constraints matter?
6. Which non-production host, schema export, test data, and test identities are available?

Restate the brief, inspect the supplied source, identify presentation-only changes versus backend-contract work, and ask for confirmation before broad implementation.

## Required source inspection

Before proposing code:

1. Enumerate the actual app routes for this product.
2. Trace the built-in screen components and every data loader/server action they call.
3. Enumerate GraphQL documents and operation names used by those call sites.
4. Read `schema.graphql`, model access, field access, and custom query/mutation resolvers.
5. Record actor, tenant/store/organization scope, inputs, outputs, lifecycle authority, idempotency, and error states for each required operation.
6. Inspect provider adapters, webhooks, workers, uploads, cookies/tokens, and runtime configuration touched by the requested flow.
7. Produce a capability matrix: verified, presentation-only, needs backend contract, blocked, or absent.

Do not claim the skill already knows a deployed contract. It knows where and how to discover the exact calls. Generated CRUD or a schema-valid document is not proof of safe access.

## Built-in versus separate client

### Adapt the built-in client

- Keep route files thin.
- Put product UI and orchestration in the existing feature slice.
- Reuse current session, transport, design tokens, loading/error states, and named server operations where they are safe.
- Do not duplicate price, availability, pre-order limit, buylist offer, grade/certificate, payment, or authorization decisions in components.

### Build a separate client

- Use a trusted, environment-pinned endpoint and checked named operations.
- Keep privileged credentials and opaque capabilities server-side behind a BFF when needed.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, relationships, provider IDs, or endpoint URLs.
- Pin the exact schema, generate strict types, runtime-validate JSON/custom scalars, and fail closed when a required contract is absent.
- Treat certificate "Verify with" links and sample-certificate flags exactly as the server projection returns them.
- Test anonymous, wrong-user, wrong-tenant/store/organization, stale, duplicate, timeout, and provider-failure behavior against disposable data.

## Product-specific boundary

Design around set checklists, card printings and conditions, market readings with their observed date, slabs with grade and certificate, sealed and pre-order limits, the buylist and trade-in submission, and owner-only binder and want list. Preserve the product's real workflow nouns and authority boundaries. Never rename Ecommerce products/orders into this vertical or borrow Ecommerce GraphQL roots without validating that they exist and are authorized here.

For consequential actions, require one bounded server projection or command that validates actor, scope, related-record ownership, state transition, transaction/concurrency, idempotency, provider behavior, and audit evidence. If it does not exist, request the backend contract and show the feature as unavailable.

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
- auth, scope, secret, provider, migration, deployment, and rollback notes.

Never present a source path, generated schema, HTTP 200, or attractive empty state as proof that the storefront workflow is operational.
