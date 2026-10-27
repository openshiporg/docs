---
name: openfront-collectibles-custom-dashboard
description: Plan and build a custom Openfront Collectibles operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Collectibles custom operator dashboard

Use this skill to adapt the built-in Collectibles operator dashboard or create a separately deployed client. Start from this product's current source—not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Public source: `https://github.com/openshiporg/openfront-collectibles`. Confirm the checkout path and revision the user wants to target.
- Generic Keystone dashboard shell, list/item screens (`/dashboard/[listKey]`), authentication helpers, and admin client: `features/dashboard`.
- Collectibles-specific operator navigation, screens, server actions, and workflows mounted into that shell: `features/platform`. Key slices: `card-shop` (Cards & Sets, set checklists, Graded Slabs, Sealed & Pre-orders, Market & Repricing, Buylist), `trade-ins`, `consignments`, `collectible-items` (receive items, item record, evidence), `collectibles` (catalog, inventory and custody, evidence, listings, auctions, consignment payout, and collectors desks), `disputes`, `high-value-fulfillment`, `sellers`, `onboarding`, plus inherited commerce slices (orders, products, regions, discounts, gift cards, payment and shipping providers).
- Navigation: `features/platform/lib/navigation.ts`.
- Thin route entry points: `app/dashboard/(admin)/platform/**`.
- Shared card UI used by both dashboard and storefront: `features/storefront/components/cards`.
- Server contract: `features/keystone/models/**` (collectibles lists in `Collectible*.ts`; card fields on `ProductVariant`), `features/keystone/access.ts`, `features/keystone/models/fields.ts` (role permissions), `features/keystone/mutations/**` (notably `pokemon.ts`, `receiveCollectibleItem.ts`, `collectibles.ts`, `collectibles-customer.ts`), `features/keystone/lib/pokemon/**`, `schema.graphql`, and `docs/schema-map.md`.

Explain that `features/dashboard` is the reusable Keystone administration layer and `features/platform` is the product-specific operator experience. These directories show how the dashboard works and which server operations it calls.

The current product focus is a single Pokémon card shop: set checklists imported with `importCardCatalog`, singles per printing/language/condition, graded slabs as serialized items, sealed product and pre-orders, TCGplayer market readings via `refreshMarketPrices`, rule-based `repriceInventory`, buylist and trade-ins, consignment intakes/items/agreements, evidence observations, high-value fulfillment, disputes, and seller approval. Auctions and offers are disabled in code, and consignment settlements are never generated. Trade-in, consignment, dispute, and seller transition maps are enforced in the dashboard server actions, not in Keystone hooks. This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Collectibles source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in dashboard or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which operator jobs, screens, actions, roles, approvals, and scope are required (for example pricing, buylist, trade-in desk, consignment, slabs, fulfillment)?
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
- Do not duplicate price, availability, lifecycle, payment, grading/authenticity, or authorization decisions in components.

### Build a separate client

- Use a trusted, environment-pinned endpoint and checked named operations.
- Keep privileged credentials and opaque capabilities server-side behind a BFF when needed.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, relationships, provider IDs, or endpoint URLs.
- Pin the exact schema, generate strict types, runtime-validate JSON/custom scalars, and fail closed when a required contract is absent.
- A separate client calling generic list updates bypasses the transition maps in `features/platform/*/lib`; move those checks into a server command first or re-implement them in the BFF.
- Test anonymous, wrong-user, wrong-tenant/store/organization, stale, duplicate, timeout, and provider-failure behavior against disposable data.

## Product-specific boundary

Design around set checklists, condition-based singles, graded slabs, sealed and pre-orders, market readings and repricing review, buylist and trade-in desk, consignment, item evidence, high-value fulfillment, disputes, and sellers. Preserve the product's real workflow nouns and authority boundaries. Never rename Ecommerce products/orders into this vertical or borrow Ecommerce GraphQL roots without validating that they exist and are authorized here.

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

Never present a source path, generated schema, HTTP 200, or attractive empty state as proof that the operator dashboard workflow is operational.
