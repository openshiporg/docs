---
name: openfront-airline-custom-dashboard
description: Plan and build a custom Openfront Airline operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Airline custom operator dashboard

Use this skill to adapt the built-in Airline operator dashboard or create a separately deployed client. Start from this product's current source—not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Source repository: `https://github.com/openshiporg/openfront-airline`. Confirm the exact checkout path and revision the user wants to target. `docs/schema-map.md` in the repo maps lists, workflows, and page coverage.
- Generic Keystone dashboard shell, list/item screens (`/dashboard/<list-key>`), authentication pages (`init`, `signin`, `signup`, `reset`, `no-access`), onboarding dialog mount, AI chat, and admin client: `features/dashboard`.
- Airline-specific operator navigation (`features/platform/lib/navigation.ts`), screens, server actions, worklists, and workflows mounted into that shell: `features/platform`. Older desks render from `features/platform/screens/Canonical/PlatformDeskPages.tsx` with `components/BookingDesk.tsx`, `DepartureDesk.tsx`, `NetworkDesk.tsx`, `RecoveryDesk.tsx`, and `ShoppingResults.tsx`. Newer slices: `network`, `fares`, `flight-ops`, `stations`, `baggage`, `tickets`, `refunds`, `payment-providers`, `store-settings`, `onboarding`.
- Thin route entry points: `app/dashboard/(admin)/platform/**` (`network`, `fares`, `schedules`, `flight-ops`, `inventory`, `offers`, `bookings`, `tickets`, `passengers`, `departures`, `baggage`, `disruptions`, `payments`, `refunds`, `payment-providers`, `manifests`, `stations`, `store-settings`, `settings`, most with `/[id]` detail pages), plus `app/dashboard/(admin)/operations` (Carrier operations home), `onboarding`, and legacy redirects (`departures`, `network`, `recovery`, `shopping`).
- Server contract: `features/keystone/models/**` (59 lists; `Carrier` is the tenant, `Airport` is shared), `features/keystone/access.ts` (carrier-scoped, command-only, and station-scoped access), `features/keystone/lib/lifecycle.ts`, `features/keystone/mutations/**`, and `schema.graphql`.
- Custom commands the dashboard calls: `registerAirport`, `provisionDatedFlight`, `setDatedFlightSalesStatus`, `setInventoryAuthorization`, `updateFlightOperations`, `airlineFlightOptions`, `createOfferFromShopping`, `createBookingFromOffer`, `cancelBooking`, `reissueBookingAccessCode`, `operatorBookingReceipt`, `recordReceivedPayment`, `approveManualPaymentEvidence`, `rejectManualPaymentEvidence`, `captureBookingPayment`, `issueBookingTickets`, `processBookingRefund`, `departureManifest`, `registerPassengerTravelDocument`, `verifyPassengerTravelDocument`, `checkInBookingPassenger`, `acceptCheckedBag`, `boardBookingPassenger`, `offloadBookingPassenger`, `recordBagEvent`, `publishFlightDisruption`, `reaccommodateBooking`, `completeCarrierOnboarding`, `dismissCarrierOnboarding`, `updateCarrierStorefrontSettings`, `issueMachineCredential`, `revokeMachineCredential`, `machineCredentialSummaries`. Routes, schedules, cabins, fares, ancillaries, station assignments, and payment providers use generic Keystone create/update mutations.
- Providers and runtime: `features/integrations/**` (manual and Stripe payment adapters, outbox worker, hold reaper, booking expiry), `pages/api/**` (GraphQL, payment and integration webhooks, settlement import), and `scripts/runtime-worker.ts`.

Explain that `features/dashboard` is the reusable Keystone administration layer and `features/platform` is the product-specific operator experience. These directories show how the dashboard works and which server operations it calls.

The current product focus is network and schedules, fares and inventory, offers, bookings with maker-checker manual settlement or Stripe Checkout, tickets and coupons, departures (documents, check-in, bags, boarding), baggage tracking, flight operations, disruption recovery, station access, and storefront settings. Service requests, EMDs, exchanges, and agency sales have models but no commands. This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Airline source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in dashboard or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which operator jobs, screens, actions, roles, approvals, and scope are required?
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

Design around network and schedules, fares and inventory, offers, bookings and settlement, tickets and coupons, airport service, baggage, flight operations, and disruption recovery. EMDs, service requests, and exchanges have no commands yet. Preserve the product's real workflow nouns and authority boundaries. Never rename Ecommerce products/orders into this vertical or borrow Ecommerce GraphQL roots without validating that they exist and are authorized here.

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
