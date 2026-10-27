---
name: openfront-vape-custom-storefront
description: Plan and build a custom Openfront Vape storefront by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Vape custom storefront

Use this skill to adapt the built-in Vape storefront or create a separately deployed client. Start from this product's current source, not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Source repository: `https://github.com/openshiporg/openfront-vape`. Confirm the exact checkout path and revision the user wants to target.
- Built-in Vape customer experience, screens/modules, data loaders, sessions, and UI composition: `features/storefront` (`modules`, `screens`, `lib/data`, including `lib/data/compliance.ts` and `modules/checkout/components/compliance-panel`).
- Thin customer-facing route entry points: `app/(storefront)/[countryCode]/(main)/**` and `app/(storefront)/[countryCode]/(checkout)/checkout`. Storefront styles live in the `vp-*` section of `app/globals.css` plus `features/storefront/**`.
- Server contract: `features/keystone/models/**`, `features/keystone/access.ts`, `features/keystone/mutations/**`, `features/keystone/queries/**` (especially `evaluateActiveCartCompliance`), `features/regulated-commerce/core/**`, and `schema.graphql`.
- Provider boundaries: inspect `features/integrations/**`, `features/regulated-commerce/providers/contracts.ts`, and the exact server actions called by the built-in client.

Explain that `features/storefront` is the behavioral reference for routes, states, GraphQL calls, cookies/tokens, and provider handoffs. It should guide what is preserved or changed.

The current product focus is the 21+ age gate (cookie self-attestation), browse by store, category, collection, and product, the bag, checkout with a compliance panel that keeps Place order disabled unless the decision allows, order confirmation, sign-in and sign-up with a 21+ box, account pages (profile, addresses, orders, invoices, business invoicing, privacy), and policy pages. This list is orientation, not proof that every flow is safe or complete; regulated checkout currently ends in deny because no identity, tax, or carrier evidence adapter exists.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Vape source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in storefront or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which customer journeys, routes, content, brand, devices, accessibility, age-gate behavior, and checkout states are required?
5. What visual references, interaction direction, responsive targets, and deployment constraints matter?
6. Which non-production host, schema export, test data, and test identities are available?

Restate the brief, inspect the supplied source, identify presentation-only changes versus backend-contract work, and ask for confirmation before broad implementation.

## Required source inspection

Before proposing code:

1. Enumerate the actual app routes for this product under `app/(storefront)/[countryCode]`.
2. Trace the built-in screen components and every data loader/server action they call.
3. Enumerate GraphQL documents and operation names used by those call sites (`activeCart`, active-cart mutations, `evaluateActiveCartCompliance`, `completeActiveCart`, customer queries, privacy mutations).
4. Read `schema.graphql`, model access, field access, and custom query/mutation resolvers.
5. Record actor, customer/guest scope, inputs, outputs, compliance purpose (`cart`, `payment`, `checkout`), evidence invalidation on cart change, idempotency, and error states for each required operation.
6. Inspect provider adapters, payment webhooks, cookies/tokens (age-gate cookie, cart, customer token), and runtime configuration touched by the requested flow.
7. Produce a capability matrix: verified, presentation-only, needs backend contract, blocked, or absent.

Do not claim the skill already knows a deployed contract. It knows where and how to discover the exact calls. Generated CRUD or a schema-valid document is not proof of safe access.

## Built-in versus separate client

### Adapt the built-in client

- Keep route files thin.
- Put product UI and orchestration in the existing feature slice.
- Reuse current session, transport, design tokens, loading/error states, and named server operations where they are safe.
- Do not duplicate price, availability, compliance decision, payment, or authorization logic in components.

### Build a separate client

- Use a trusted, environment-pinned endpoint and checked named operations.
- Keep privileged credentials and opaque capabilities server-side behind a BFF when needed.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, relationships, provider IDs, or endpoint URLs.
- Pin the exact schema, generate strict types, runtime-validate JSON/custom scalars, and fail closed when a required contract is absent.
- Re-evaluate compliance after every cart change; never cache a decision.
- Test anonymous, wrong-user, guest-secret, stale, duplicate, timeout, and provider-failure behavior against disposable data.

## Product-specific boundary

Design around the age gate, published-only catalog, bag, compliance-gated checkout with readable reason codes, accounts, and policies. Preserve the product's real workflow nouns and authority boundaries. Never imply that sales are open, that products are compliant, or that a self-attestation verifies age, and never invent regulatory warning copy or reviews. Do not borrow Ecommerce GraphQL roots without validating that they exist and are authorized here.

For consequential actions, require one bounded server projection or command that validates actor, scope, related-record ownership, state transition, transaction/concurrency, idempotency, provider behavior, and audit evidence. If it does not exist (for example customer returns or claims), request the backend contract and show the feature as unavailable.

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
