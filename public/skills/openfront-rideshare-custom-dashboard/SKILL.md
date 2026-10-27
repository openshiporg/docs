---
name: openfront-rideshare-custom-dashboard
description: Plan and build a custom Openfront Rideshare operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Rideshare custom operator dashboard

Use this skill to adapt the built-in Rideshare operator dashboard or create a separately deployed client. Start from this product's current source, not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Source repository: `https://github.com/openshiporg/openfront-rideshare`. Confirm the exact checkout path and revision the user wants to target.
- Generic Keystone dashboard shell, list/item screens, authentication helpers, onboarding mount, and admin client: `features/dashboard`. This shell is shared with the other Openfront products and is expected to stay identical to it.
- Rideshare-specific operator navigation, screens, server actions, and workflows mounted into that shell: `features/platform` (`dispatch`, `driver-workspace`, `trips`, `services`, `drivers`, `vehicles`, `safety`, `reviews`, `finance`, `team`, `settings`, `onboarding`, plus shared `components`, `lib/navigation.ts`, and `setup/setupMutations.ts`). `overview/screens/OverviewPage.tsx` exists but no route renders it.
- Thin route entry points: `app/dashboard/(admin)/platform/**`; generic model pages: `app/dashboard/(admin)/[listKey]/**`.
- Server contract: `features/keystone/models/**` (`Identity.ts`, `Operations.ts`, `Service.ts`, `Ride.ts`, `Safety.ts`, `Finance.ts`, `Integration.ts`, and the journal lists), `features/keystone/access.ts`, `features/keystone/domain/**`, `features/keystone/mutations/**` (custom queries and mutations are registered in `mutations/index.ts`), and `schema.graphql`. `docs/schema-map.md` in the repo maps lists, workflows, and page coverage.

Explain that `features/dashboard` is the reusable Keystone administration layer and `features/platform` is the product-specific operator experience. These directories show how the dashboard works and which server operations it calls.

The current product focus is fleet setup and go-live (`setupFleet`, `setupServiceArea`, `setupRideService`, `setupFareRule`, fleet status, operations mode `off`/`manual`, rider accounts), staff memberships (`addFleetMember`, `updateFleetMember`), driver and vehicle readiness (compliance documents, `reviewDriver`, `reviewVehicle`, policy evaluations, weekly hours and time off), manual dispatch (`dispatchCandidatePage`, `offerRideToDriver`, `respondToRideOffer`), the trip lifecycle (`transitionTrip`, `cancelRide`), manual payments and refunds (`initiateTripPayment`, `confirmManualPayment`, `requestTripRefund`, `confirmManualRefund`), safety incidents, support cases, trip messages, review moderation, and fleet branding. This list is orientation, not proof that every flow is safe or complete. Dispatch is manual, the only payment adapter records obligations without moving money, routes are estimated from labels, notifications only log to the console, and payouts have no workflow.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Rideshare source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in dashboard or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which operator jobs, screens, actions, and fleet roles (owner, dispatcher, support, finance, viewer, and drivers using My driving) are required?
5. What visual references, interaction direction, responsive targets (for example a driver on a phone), and deployment constraints matter?
6. Which non-production host, schema export, test data, and test identities are available?

Restate the brief, inspect the supplied source, identify presentation-only changes versus backend-contract work, and ask for confirmation before broad implementation.

## Required source inspection

Before proposing code:

1. Enumerate the actual app routes for this product under `app/dashboard/(admin)/platform`.
2. Trace the built-in screen components and every data loader/server action they call.
3. Enumerate GraphQL documents and operation names used by those call sites.
4. Read `schema.graphql`, list access in `features/keystone/access.ts` (`membershipRoles`, fleet-scoped and locked access, closed generic create/delete), field access (immutable tenant relationships, locked driver and vehicle status fields), and the custom query/mutation resolvers.
5. Record actor, fleet capability (operations, drivers, finance, safety, fleetAdmin), inputs, outputs, state transition, `idempotencyKey`, expected-state arguments (`expectedActorId`, `expectedAcceptedOfferId`, `expectedUpdatedAt`), and error states for each required operation.
6. Inspect provider adapters (`features/integrations/payment`, `features/integrations/mapping`, `features/integrations/notifications`), `ProviderConnection` records, the MCP route (`app/api/mcp-transport`), the assistant route (`app/api/completion`), sessions, and runtime configuration touched by the requested flow.
7. Produce a capability matrix: verified, presentation-only, needs backend contract, blocked, or absent.

Do not claim the skill already knows a deployed contract. It knows where and how to discover the exact calls. Generated CRUD or a schema-valid document is not proof of safe access.

## Built-in versus separate client

### Adapt the built-in client

- Keep route files thin.
- Put product UI and orchestration in the existing feature slice.
- Reuse current session, transport, design tokens, loading/error states, durable command recovery (`features/platform/components/durableCommand.ts`, `CommandRecovery.tsx`), and named server operations where they are safe.
- Do not change `features/dashboard` unless the user accepts diverging from the shared Openfront shell.
- Do not duplicate eligibility, dispatch, fare, trip-transition, cancellation-fee, payment, or authorization decisions in components.

### Build a separate client

- Use a trusted, environment-pinned endpoint and checked named operations.
- Keep privileged credentials and opaque capabilities server-side behind a BFF when needed.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, relationships, provider IDs, or endpoint URLs.
- Pin the exact schema, generate strict types, runtime-validate JSON/custom scalars, and fail closed when a required contract is absent.
- Send a stable `idempotencyKey` per user intent and replay it after a lost response instead of issuing a new command.
- Test anonymous, wrong-fleet, missing-capability, stale, duplicate, timeout, and provider-failure behavior against disposable data.

## Product-specific boundary

Design around fleets and memberships, driver and vehicle readiness, services and versioned fare rules, the dispatch queue and offers, the trip lifecycle, manual payment records, safety and support queues, and reviews. Preserve the product's real workflow nouns and authority boundaries. Never show a driver as eligible, a payment as received, a refund as sent, or a notification as delivered unless the server says so, and never present route estimates as map data. Do not borrow Ecommerce GraphQL roots without validating that they exist and are authorized here.

For consequential actions, require one bounded server projection or command that validates actor, fleet capability, related-record ownership, state transition, transaction/concurrency, idempotency, provider behavior, and audit evidence. If it does not exist (for example payouts), request the backend contract and show the feature as unavailable.

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
- auth, capability, secret, provider, migration, deployment, and rollback notes.

Never present a source path, generated schema, HTTP 200, or attractive empty state as proof that the operator dashboard workflow is operational.
