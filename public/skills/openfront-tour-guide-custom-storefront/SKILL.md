---
name: openfront-tour-guide-custom-storefront
description: Plan and build a custom Openfront Tour Guide storefront by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in placeholder or creating a safe separate client.
---

# Openfront Tour Guide custom storefront

Use this skill to adapt the built-in Tour Guide storefront or create a separately deployed client. Start from this product's current source, not E-commerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Repository: <https://github.com/openshiporg/openfront-tour-guide> (private; the user needs access).
- Built-in customer experience: `features/storefront` (screens, components, and the server-side data layer `features/storefront/lib/data.ts`).
- Thin route entry points: `app/(storefront)/**`. Screens: `features/storefront/screens`. The shared layout shows the operator name from settings.
- Server contract: `features/keystone/models/**`, `features/keystone/access.ts`, `features/keystone/mutations/**` (registered in `mutations/index.ts`, typed as `JSON`), and `schema.graphql`.
- Provider boundaries: `features/integrations/payment/**`, the Stripe card form in `features/storefront/components/CheckoutForm.tsx`, and the webhook `app/api/webhooks/payment/[provider]`.

The built-in storefront is a plain placeholder with the starter's default styling. It makes the booking loop work end to end. A designed storefront is still to come, so the built-in screens are a behavior reference, not a design to copy.

Explain that `features/storefront` is the behavioral reference for routes, states, GraphQL calls, cookies, and the payment handoff.

Current routes: `/` (tours), `/tours/[slug]` (date picker, departure times, tickets, add-ons, promo code), `/checkout/[holdId]` (hold timer, guests, card payment), `/bookings/[ref]` (confirmation, meeting point, waiver links, cancel), `/lookup` (code and email), `/waiver/[token]`.

Key operations: queries `toursOnSale`, `tourAvailability`, `checkoutHold`, `lookupBooking`, `waiverForToken`, `operatorName`; mutations `createDepartureHold`, `startBookingCheckout`, `completeBookingCheckout`, `cancelMyBooking`, `signWaiver`. `rebookWithCredit` exists but has no storefront page.

Key models: `Tour`, `TicketType`, `AddOn`, `MeetingPoint`, `CancellationPolicy`, `Departure`, `InventoryHold`, `Booking`, `BookingLine`, `Participant`, `WaiverTemplate`, `WaiverSignature`, `PromoCode`, `PaymentSession`, `Payment`.

Rules to preserve: guests have no account. A random token in an http-only cookie proves a hold, and only its SHA-256 hash is stored. Lookup and cancel need the booking code and the booking email together. Waiver and rebook links are derived on the server. Prices, seat counts, and refund amounts come from the server quote, so the page sends choices only. A hold lasts 10 minutes and checkout extends it to 15. Payments use Stripe test mode in development, and the webhook confirms the booking if the guest closes the tab after paying. One operator per deployment, no tenant scope.

This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Tour Guide source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in storefront or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which customer journeys, routes, content, brand, devices, accessibility, and booking states are required?
5. What visual references, interaction direction, responsive targets, and deployment constraints matter?
6. Which non-production host, schema export, test data, Stripe test keys, and test identities are available?

Restate the brief, inspect the supplied source, identify presentation-only changes versus backend-contract work, and ask for confirmation before broad implementation.

## Required source inspection

Before proposing code:

1. Enumerate the actual app routes for this product.
2. Trace the built-in screen components and every data loader/server action they call.
3. Enumerate GraphQL documents and operation names used by those call sites.
4. Read `schema.graphql`, model access, field access, and custom query/mutation resolvers.
5. Record actor, scope, inputs, outputs, lifecycle authority, idempotency, and error states for each required operation.
6. Inspect provider adapters, webhooks, cookies/tokens, and runtime configuration touched by the requested flow.
7. Produce a capability matrix: verified, presentation-only, needs backend contract, blocked, or absent.

Do not claim the skill already knows a deployed contract. It knows where and how to discover the exact calls. Generated CRUD or a schema-valid document is not proof of safe access.

## Built-in versus separate client

### Adapt the built-in client

- Keep route files thin.
- Put product UI and orchestration in the existing feature slice.
- Reuse current session, transport, design tokens, loading/error states, and named server operations where they are safe.
- Do not duplicate price, availability, seat counting, refund, payment, or authorization decisions in components.

### Build a separate client

- Use a trusted, environment-pinned endpoint and checked named operations.
- Keep privileged credentials and opaque capabilities server-side behind a BFF when needed.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, relationships, provider IDs, or endpoint URLs.
- Pin the exact schema, generate strict types, runtime-validate the JSON results (custom operations return a JSON scalar), and fail closed when a required contract is absent.
- Test anonymous, wrong-user, stale, duplicate, timeout, and provider-failure behavior against disposable data.

## Product-specific boundary

Design around tours, departures and seats left, ticket types and add-ons, the seat hold, guest details, card payment, the booking code, waivers, and cancellation by policy. Preserve the product's real workflow nouns and authority boundaries. Never rename E-commerce products/orders into this vertical or borrow E-commerce GraphQL roots without validating that they exist and are authorized here.

Never recompute price, seats left, or refund amounts in the browser. Keep the hold token out of URLs and local storage. For consequential actions, require one bounded server command that validates proof, state transition, concurrency, idempotency, and provider behavior. If it does not exist, request the backend contract and show the feature as unavailable.

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
- auth, secret, provider, migration, deployment, and rollback notes.

Never present a source path, generated schema, HTTP 200, or attractive empty state as proof that the storefront workflow is operational.
