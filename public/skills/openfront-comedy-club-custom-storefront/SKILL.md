---
name: openfront-comedy-club-custom-storefront
description: Plan and build a custom Openfront Comedy Club storefront by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Comedy Club custom storefront

Use this skill to adapt the built-in Comedy Club storefront or create a separately deployed client. Start from this product's current source, not E-commerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Repository: <https://github.com/openshiporg/openfront-comedy-club> (private; the user needs access to a checkout).
- Status: no hosted app, no demo. Payments use Stripe test mode in development. The built-in storefront is a plain placeholder with default styles, waiting for a designed replacement.
- Built-in customer experience, forms, data loaders, and server actions: `features/storefront`.
- Thin customer-facing route entry points: `app/(storefront)/**`. Data loader and request wrapper: `features/storefront/lib/data.ts`. Server actions: `features/storefront/lib/actions.ts` and `clientActions.ts`. Client components: `features/storefront/components` (`HoldForm`, `CheckoutForm`, `Confirmation`, `LookupForm`, `OpenMicForm`).
- Server contract: `features/keystone/models/**`, `features/keystone/access.ts`, `features/keystone/mutations/**` (registered in `mutations/index.ts`), and `schema.graphql`.
- Provider boundary: `features/integrations/payment/stripe.ts` and the checkout code in `features/keystone/mutations/checkout.ts`. The browser loads Stripe.js and confirms with Stripe's card form. The server confirms the payment with the provider before it makes tickets. There is no webhook route.
- Sweeper: `app/api/cron/expire-holds` releases expired holds and settles old pending orders. A scheduler calls it with `CRON_SECRET`.

Explain that `features/storefront` is the behavioral reference for routes, states, GraphQL calls, tokens, and the provider handoff. It should guide what is preserved or changed.

Current routes: `/` (shows on sale), `/shows/[id]` (lineup, tiers, table choice, hold), `/checkout?hold=<holdKey>` (hold timer, details, promo, age confirmation, Stripe card form), `/orders/[orderNumber]` (confirmation; the order secret is in the URL fragment or session storage), `/lookup` (email and order number, self-cancel), `/open-mic` (signup).

Operations used: queries `showsOnSale`, `showAvailability`, `openMicShows`, `ticketOrderConfirmation`, `lookupTicketOrder`; mutations `createTicketHold`, `applyPromoToHold`, `startTicketCheckout`, `completeTicketCheckout`, `abandonTicketCheckout`, `cancelMyTicketOrder`, `openMicSignup`. All are custom operations with `JSON` results. The storefront uses no generated list operations.

Key models: `Show`, `PriceTier`, `Room`, `Section`, `Table`, `LineupSlot`, `Comedian`, `InventoryHold`, `PromoCode`, `PromoRedemption`, `TicketOrder`, `TicketOrderLine`, `Ticket`, `PaymentSession`, `Payment`, `OpenMicSignup`, `VenueSettings`.

Rules to preserve: holds and orders are proved with secrets (`cartToken`, `orderSecret`), whose hashes are the only copy stored. Lookup and self-cancel need the order number and the order's email. A hold lasts `holdMinutes` (default 10). A show with an age rule needs the age confirmation. Table tiers sell whole tables whose seats must add up to the quantity. A table cannot be held or seated twice for one show. A payment the provider cannot confirm stays `pending_payment` and is never marked paid on a timeout. Business error messages reach the page and everything else is replaced with a generic message. There is one venue per deployment and no tenant scope.

Not built yet, so do not assume them: QR images (only the code and the scan token text are shown), order confirmation email, a webhook receiver, guest accounts, and a use for the order `perOrderLimit` on promo codes.

This list is orientation, not proof that every flow is safe or complete.

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

Design around shows, lineups, tiers and tables, holds, checkout, order confirmation, lookup, and open mic signup. Preserve the product's real workflow nouns and authority boundaries. Never rename E-commerce products/orders into this vertical or borrow E-commerce GraphQL roots without validating that they exist and are authorized here.

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
