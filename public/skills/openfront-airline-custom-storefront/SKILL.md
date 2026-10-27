---
name: openfront-airline-custom-storefront
description: Plan and build a custom Openfront Airline storefront by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Airline custom storefront

Use this skill to adapt the built-in Airline storefront or create a separately deployed client. Start from this product's current source—not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Source repository: `https://github.com/openshiporg/openfront-airline`. Confirm the exact checkout path and revision the user wants to target. `docs/schema-map.md` in the repo maps lists, workflows, and storefront coverage.
- Built-in Airline traveler experience: `features/storefront`. `components/FlightShop.tsx` runs search, hold, booking, manage-booking, payment, seats, and check-in in `book`, `manage`, and `check-in` modes. `FlightStatusSearch.tsx`, `Timetable.tsx`, `StorefrontChrome.tsx`, and `PublicPageShell.tsx` cover status, timetable, and layout. `lib/carrier.ts`, `lib/network.ts`, `lib/booking-intent.ts`, `lib/branding.ts`, and `lib/theme.ts` load carrier identity, routes, booking documents, and brand palette.
- Thin traveler route entry points are top-level under `app/` (no route group): `/` (book), `/destinations`, `/status`, `/manage-booking`, `/check-in`, `/manage` (redirect), `/help`, `/contact`.
- Server contract: `features/keystone/mutations/storefront.ts`, `storefrontAccess.ts`, `storefrontPayments.ts`, `features/keystone/models/**`, `features/keystone/access.ts`, and `schema.graphql`. Public operations: `publicCarrierIdentity`, `publicAirlineFlightOptions`, `publicFlightStatuses`, `customerBooking`, `createCustomerOffer`, `createCustomerBooking`, `startCustomerCheckout`, `completeCustomerCheckout`, `assignCustomerSeat`, `checkInCustomerBooking`, `cancelCustomerBooking`, `rotateCustomerBookingAccessToken`, `recoverCustomerBookingAccess`.
- Provider boundaries: `features/integrations/payment` (Stripe Checkout and manual settlement), `pages/api/payments/webhooks/[providerKey].ts`, the worker's hold and unpaid-booking expiry, and SMTP mail for access recovery.

Explain that `features/storefront` is the behavioral reference for routes, states, GraphQL calls, booking access tokens (stored per record locator in `localStorage`, hashed on the server), shopping session tokens, and the Stripe redirect. It should guide what is preserved or changed. Every public call is pinned to one carrier (`STOREFRONT_CARRIER_CODE` or the first carrier), and selling also needs storefront branding and direct sales.

The current product focus is nonstop flight search and 15-minute fare holds, booking with a record locator and access code, optional Stripe payment, seat selection, check-in and boarding passes, cancellation, access-code rotation and recovery, flight status with disruption summaries, and a route timetable. There are no traveler accounts, ancillary sales, service requests, or exchanges. This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Airline source checkout, and which revision/deployment is the target?
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

Design around flight search and fare holds, passenger details, booking, trip access by record locator and access code, payment, seats, check-in and boarding passes, cancellation, and flight status and disruption states. Preserve the product's real workflow nouns and authority boundaries. Never rename Ecommerce products/orders into this vertical or borrow Ecommerce GraphQL roots without validating that they exist and are authorized here.

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
