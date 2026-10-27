---
name: openfront-cannabis-custom-storefront
description: Plan and build a custom Openfront Cannabis storefront by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Cannabis custom storefront

Use this skill to adapt the built-in Cannabis storefront or create a separately deployed client. Start from this product's current source—not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Public source: `https://github.com/openshiporg/openfront-cannabis`. Confirm the user's checkout path and revision before relying on it.
- Built-in Cannabis customer experience, screens/modules, data loaders, sessions, and UI composition: `features/storefront`.
- Thin customer-facing route entry points: `app/page.tsx` (menu), `app/menu/[id]/page.tsx` (product), and `app/visit/page.tsx` (visit details). There is no route group and no cart, checkout, or account route.
- Server contract: `features/keystone/models/**`, `features/keystone/access.ts`, `features/keystone/mutations/**`, and `schema.graphql`.
- Public data: `publicCannabisMenu` and `publicCannabisStorefrontSettings` in `features/keystone/mutations/public.ts`, loaded by `features/storefront/lib/data/menu.ts`. The public scope requires exactly one active organization with one active premises.
- Provider and launch boundaries: there is no `features/integrations` directory. Check `features/keystone/domain/runtimeCapabilities.ts`; `submitCannabisCustomerIntake` (`privacy.approved-intake`) and `createCustomerPickupCart` (`commerce.customer-cart`) exist but are disabled, and the `CustomerIntakeForm` screen is not routed.

Explain that `features/storefront` is the behavioral reference for routes, states, GraphQL calls, cookies/tokens, and provider handoffs. It should guide what is preserved or changed.

The current product focus is an age-gated public menu (form, adult-use/medical, search, sort), product detail for released and in-stock packages, and a visit page (address, hours, ages, payment types). Purchase happens in store; online ordering is not available. This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Cannabis source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in storefront or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which customer journeys, routes, content, brand, devices, accessibility, and menu availability and unavailable/not-set-up states are required?
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
- Do not duplicate price, availability, lifecycle, payment, eligibility/legal, or authorization decisions in components.

### Build a separate client

- Use a trusted, environment-pinned endpoint and checked named operations.
- Keep privileged credentials and opaque capabilities server-side behind a BFF when needed.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, relationships, provider IDs, or endpoint URLs.
- Pin the exact schema, generate strict types, runtime-validate JSON/custom scalars, and fail closed when a required contract is absent.
- Test anonymous, wrong-user, wrong-tenant/store/organization, stale, duplicate, timeout, and provider-failure behavior against disposable data.

## Product-specific boundary

Design around the age gate (`features/storefront/components/AgeGate.tsx`, ages from the rule pack), menu, product detail, and visit details, with in-store purchase. Preserve the product's real workflow nouns and authority boundaries. Never rename Ecommerce products/orders into this vertical or borrow Ecommerce GraphQL roots without validating that they exist and are authorized here.

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
