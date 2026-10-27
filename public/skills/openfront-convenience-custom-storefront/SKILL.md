---
name: openfront-convenience-custom-storefront
description: Plan and build a custom Openfront Convenience storefront by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Convenience custom storefront

Use this skill to adapt the built-in Convenience public catalog site or create a separately deployed client. Start from this product's current source—not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Repository: <https://github.com/openshiporg/openfront-convenience>
- Built-in storefront: `features/storefront` — `screens/StorefrontPage.tsx` (home), `screens/ShopPages.tsx` (shop, product, basket, checkout, account, receipt, sign-in/up), `components/**`, loaders in `lib/data.ts` and `lib/public-storefront.ts`, server actions in `actions.ts`, and a pass-through `middleware.ts` called from the root `proxy.ts`.
- Thin routes: `app/page.tsx` (`/`) and `app/(shop)/**`: `/shop`, `/shop/[productId]`, `/basket`, `/checkout`, `/account`, `/account/[mode]` (`signin`, `signup`), `/account/receipts/[saleId]`; plus `app/sitemap.ts` and `app/robots.ts`.
- Backend: `features/keystone/mutations/storefrontOperations.ts` and `publicStorefrontProjection.ts`. Queries: `conveniencePublicStorefront`, `storefrontCatalog`, `storefrontHistory`, `storefrontRewards`, `storefrontBasket`. Mutation: `updateStorefrontBasket`. Auth uses generic `createUser`, `authenticateUserWithPassword`, `revokeCurrentUserSessions`, and `endSession`.
- Models it reads: `Business` (`storefrontStatus`, brand fields, `storefrontStore`), `Store`, `Product`, `ProductVariant`, `ProductCategory`, `ProductImage`, `PriceBookEntry`, `StockLevel`, `FuelPrice`, `Sale`, `SaleLine`, `LoyaltyAccount`, `LoyaltyLedgerEntry`, `Cart`, `CartLine`.

Explain the current limits: the site is a catalog for one published business; restricted-sale products are never listed; `/basket` and `/checkout` redirect to `/shop`; the basket API exists but no page uses it and a storefront cart cannot become a sale; there is no online payment provider. Online ordering would need new bounded backend contracts before presentation work.

The current product focus is a convenience-store public catalog with store details, aisles, product detail, customer accounts, rewards, and receipts. This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Convenience source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in storefront or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which customer journeys, routes, content, brand, devices, accessibility, and commerce/booking states are required?
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
- Do not duplicate price, availability, lifecycle, payment, clinical/legal, or authorization decisions in components.

### Build a separate client

- Use a trusted, environment-pinned endpoint and checked named operations.
- Keep privileged credentials and opaque capabilities server-side behind a BFF when needed.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, relationships, provider IDs, or endpoint URLs.
- Pin the exact schema, generate strict types, runtime-validate JSON/custom scalars, and fail closed when a required contract is absent.
- Test anonymous, wrong-user, wrong-tenant/store/organization, stale, duplicate, timeout, and provider-failure behavior against disposable data.

## Product-specific boundary

Design around the public catalog, store details, aisles, product detail, customer rewards, and receipts. Preserve the product's real workflow nouns and authority boundaries. Never rename Ecommerce products/orders into this vertical or borrow Ecommerce GraphQL roots without validating that they exist and are authorized here.

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
