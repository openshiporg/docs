---
name: openfront-comedy-club-custom-storefront
description: Plan and build a custom Openfront Comedy Club storefront by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Comedy Club custom storefront

Use this skill to adapt the built-in Comedy Club storefront or create a separately deployed client. Start from this product's current source—not E-commerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Repository: <https://github.com/openshiporg/openfront-comedy-club>
- Built-in Comedy Club customer experience: `features/storefront` (`components` such as `HoldForm`, `CheckoutForm`, `Confirmation`, `LookupForm`, `OpenMicForm`, `WaitlistForm`, `WaitlistClaim`, `SlotResponse`, `TransferTicket`, `TicketQr`, `screens`, and `lib` loaders/actions).
- Thin customer-facing route entry points: `app/(storefront)/**`.
- Server contract: `features/keystone/models/**`, `features/keystone/access.ts`, `features/keystone/mutations/**` (custom operations merged in `mutations/index.ts`), and `schema.graphql`. The raw lists are not public; the storefront calls only named operations.
- Provider boundaries: `features/integrations/payment` (`stripe.ts`, `manual.ts`), the Stripe webhook at `/api/integrations/payment/pp_stripe/webhook`. Hold expiry runs on storefront reads (`showsOnSale`, `showAvailability`); there is no cron route.

Explain that `features/storefront` is the behavioral reference for routes, states, GraphQL calls, guest proofs, and provider handoffs. It should guide what is preserved or changed.

Current storefront routes: `/`, `/shows/[id]`, `/checkout?hold=`, `/orders/[orderNumber]`, `/tickets/[code]`, `/lookup`, `/open-mic`, `/waitlist/claim`, `/lineup/respond`.

Main server operations behind them: `showsOnSale`, `showAvailability`, `expireHolds`, `applyPromoToHold`, `startTicketCheckout`, `completeTicketCheckout`, `abandonTicketCheckout`, `ticketOrderConfirmation`, `lookupTicketOrder`, `cancelMyTicketOrder`, `holderTicket`, `transferTicket`, `joinWaitlist`, `waitlistOffer`, `openMicShows`, `openMicSignup`, `slotInvite`, `respondToSlot`. The storefront serves one venue; guests reach orders through the order number plus the secret in the confirmation link.

The current product focus is show discovery, tier or table choice, holds with a timer, checkout and Stripe payment, order confirmation and tickets, order lookup and self-cancel, ticket transfer, waitlist, open mic signup, and comedian lineup responses. This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Comedy Club source checkout, and which revision/deployment is the target?
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

Design around show discovery, tier or table choice, holds with a timer, checkout and Stripe payment, order confirmation and tickets, order lookup and self-cancel, ticket transfer, waitlist, open mic signup, and comedian lineup responses. Preserve the product's real workflow nouns and authority boundaries. Never rename E-commerce products/orders into this vertical or borrow E-commerce GraphQL roots without validating that they exist and are authorized here.

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
