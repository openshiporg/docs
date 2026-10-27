---
name: openfront-coffee-shop-custom-storefront
description: Plan and build a custom Openfront Coffee Shop storefront by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Coffee Shop custom storefront

Use this skill to adapt the built-in Coffee Shop storefront or create a separately deployed client. Start from this product's current source—not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Repository: <https://github.com/openshiporg/openfront-coffee-shop>
- Built-in Coffee Shop customer experience, screens, components, data loaders (`features/storefront/lib/data`), cart storage, and UI composition: `features/storefront`.
- Thin customer-facing route entry points: `app/page.tsx` for `/`, and `app/(storefront)/**` for `/menu/[id]`, `/checkout`, `/order-confirmed`, `/catering`, `/account`, and `/account/reset`. There is no country or region prefix.
- Server contract: `features/keystone/models/**`, `features/keystone/access.ts`, `features/keystone/mutations/**` (wired in `mutations/index.ts`), `schema.graphql`, and `docs/schema-map.md`.
- Customer-facing operations: `getCoffeeStore`, `getCoffeeMenu`, `quoteCafeOrder`, `createCafePickupOrder`, `getCafeOrder` (order `secretKey` or owning session), `getCafeLoyaltyAccount`, `applyCafeLoyalty`, `requestCafeCatering`, `getCoffeeCustomerCatering`, `getCoffeeCustomerOrders`, `registerCoffeeCustomer`, `updateCoffeeCustomerProfile`, `initiateCafePaymentSession`, plus Keystone `authenticateUserWithPassword`, `endSession`, and password reset.
- Main models behind them: `StoreSetting` (singleton, one store per deployment, USD only), `MenuCategory`, `MenuItem`, `MenuItemModifier`, `CafeOrder`, `OrderItem`, `Payment`, `LoyaltyAccount`, `LoyaltyEvent`, `CateringOrder`, `User`.
- Provider boundaries: `features/integrations/payment/**` (Stripe, PayPal, manual adapters) and the webhook route `app/api/payment-providers/[providerCode]/webhook`.

Explain that `features/storefront` is the behavioral reference for routes, states, GraphQL calls, cookies/tokens, and provider handoffs. It should guide what is preserved or changed.

The current product focus is menu browsing and search, modifiers, a browser-stored cart, pickup order requests that staff accept, pay at pickup by default with optional Stripe Checkout, order receipt and status, rewards linking, catering inquiries, and a customer account with orders, rewards, catering, and profile. PayPal, customer subscriptions, and drink-credit redemption are not offered. This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Coffee Shop source checkout, and which revision/deployment is the target?
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

Design around menu discovery, modifiers, pickup order requests, checkout, order receipt and status, rewards, catering inquiries, and the customer account. Preserve the product's real workflow nouns and authority boundaries. Never rename Ecommerce products/orders into this vertical or borrow Ecommerce GraphQL roots without validating that they exist and are authorized here.

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
