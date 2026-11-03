---
name: openfront-concerts-custom-storefront
description: Plan and build a custom Openfront Concerts storefront by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Concerts custom storefront

Use this skill to design the Concerts storefront or build a separately deployed one. Start from this product's current source, not E-commerce conventions, screenshots, or another vertical's schema. The built-in storefront is a plain placeholder with no brand design, so a designed storefront is expected work.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Repository: private; the user must supply a local checkout. There is no hosted app or demo.
- Built-in customer screens: `features/storefront/screens` (`EventsHome`, `EventBuy`, `OrderView`, `LookupPage`). The browser GraphQL helper and price and time formatting are in `features/storefront/lib/api.ts`.
- Thin route entry points: `app/page.tsx`, `app/events/[id]/page.tsx`, `app/orders/[id]/page.tsx`, `app/lookup/page.tsx`.
- Server contract: `features/keystone/models/**`, `features/keystone/access.ts`, `features/keystone/mutations/**` (registered in `mutations/index.ts`; storefront operations are in `inventory.ts` and `checkout.ts`), `features/keystone/lib/guest-proof.ts`, and `schema.graphql`.
- Provider boundary: `features/integrations/payment` and the Stripe flow in `features/keystone/mutations/checkout.ts`. The storefront loads Stripe's payment form from `js.stripe.com` and never sees secret keys. Webhook route: `app/api/integrations/payment/[providerCode]/webhook`.

Current routes: `/` (upcoming events), `/events/[id]` (select, hold, pay), `/orders/[id]` (confirmation, ticket codes, transfer), `/lookup` (find an order by email and order number).

Key operations, all custom: queries `eventsOnSale`, `eventAvailability(eventId)`, `lookupTicketOrder(email, orderNumber)`; mutations `createGaHold`, `createSeatHold`, `startTicketCheckout`, `completeTicketCheckout`, `transferTicket`. They return the `JSON` scalar. The storefront does not read raw lists. Orders, tickets, and holds are not readable by guests.

Rules to preserve:

- A hold lasts 10 minutes. Starting checkout extends it to 20 minutes.
- Holds, checkout, and transfers all take an `idempotencyKey`. Generate one per user action and reuse it on retry.
- A hold and an order each return a `proof`: signed, expiring, bound to that one id. Every later mutation sends it. Lookup returns a proof that lasts 15 minutes.
- Up to eight seats per hold, in one price level. General-admission quantity is capped by the level's per-order limit.
- A presale event, or one before `onSaleAt`, needs a valid presale or promo code.
- Age-restricted events need `ageAttested`.
- Quotes are priced on the server: tickets, service fees, facility fees, discount, tax. Never compute a total in the browser.
- Times are stored as UTC and shown in the venue's `timezone`.
- Only `presale` and `on_sale` events can be held. Entry tokens are shown once at confirmation and stored only as a hash.
- The confirmation page keeps the order and its proof in `sessionStorage`. A new tab needs `/lookup`.

Known gaps to tell the user about: no customer accounts, no QR image, no wallet pass, no emailed receipt, no resale. The transfer button exists only on the confirmation page. Payments are Stripe TEST in development, and the repository has no hosted app. No command moves an event to on sale, so only seeded or manually updated events can be bought.

This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Concerts source checkout, and which revision or deployment is the target?
2. Do they want to adapt the built-in storefront or create an independently deployed client?
3. What do they dislike about the placeholder, what must stay, and what should change?
4. Which customer journeys, pages, seat-map behavior, and accessibility needs matter?
5. What brand, visual references, responsive targets (at least 402 px wide with no horizontal overflow), and deployment constraints apply?
6. Which non-production host, Stripe TEST keys, schema export, and test data are available?

Restate the brief, inspect the supplied source, identify presentation-only changes versus backend-contract work, and ask for confirmation before broad implementation.

## Required source inspection

Before proposing code:

1. Enumerate the actual customer routes.
2. Trace the built-in screens and every GraphQL document they send.
3. Read `schema.graphql`, the model access rules, and the storefront resolvers.
4. Record who can call each operation, what proof it needs, its inputs and outputs, idempotency, and error states.
5. Inspect the Stripe flow end to end: intent creation, browser confirmation, server verification, webhook.
6. Produce a capability matrix: verified, presentation-only, needs backend contract, blocked, or absent.

Do not claim the skill already knows a deployed contract. Generated CRUD or a schema-valid document is not proof of safe access.

## Built-in versus separate client

### Adapt the built-in client

- Keep route files thin and put UI in `features/storefront`.
- Keep the seat map readable and keyboard-operable. Keep each section's grid in its own scroll container so the page never scrolls sideways.
- Do not duplicate pricing, capacity, hold, or payment decisions in components.

### Build a separate client

- Use a trusted, environment-pinned endpoint and the named operations only.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, or endpoint URLs.
- Never put Stripe secret keys, `SESSION_SECRET`, or admin cookies in the browser.
- Pin the exact schema, generate strict types, and runtime-validate the JSON results.
- Test expired hold, reused idempotency key, wrong proof, sold-out race, presale without a code, declined card, and a webhook that arrives before the browser returns, against disposable data.

## Product-specific boundary

Design around events, price levels and tiers, seats, holds, orders, tickets, and transfer. Preserve the product's real nouns. Never rename E-commerce carts or products into this vertical. Copy should be labels, states, and errors only.

For consequential actions, require one bounded server command that validates ownership proof, state, concurrency, idempotency, and provider behavior. If it does not exist, request the backend contract and show the feature as unavailable.

## Handoff

Report:

- built-in or separate mode;
- source path and revision inspected;
- routes and screens reviewed;
- schema hash and named operations used;
- requested changes and what was preserved;
- capability matrix and backend blockers;
- implemented files and tests;
- responsive evidence at 402 px and desktop;
- auth, proof, secret, provider, and deployment notes.

Never present a source path, generated schema, HTTP 200, or attractive empty state as proof that the buying flow works. Run one Stripe TEST purchase end to end and record the order number.
