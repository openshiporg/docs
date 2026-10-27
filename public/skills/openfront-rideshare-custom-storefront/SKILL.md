---
name: openfront-rideshare-custom-storefront
description: Plan and build a custom Openfront Rideshare storefront by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Rideshare custom storefront

Use this skill to adapt the built-in Rideshare rider storefront or create a separately deployed client. Start from this product's current source, not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Source repository: `https://github.com/openshiporg/openfront-rideshare`. Confirm the exact checkout path and revision the user wants to target.
- Built-in rider experience, screens, components, and browser storage: `features/storefront` (`screens/RiderHomePage.tsx`, `TripStatusPage.tsx`, `RiderSignInPage.tsx`, `RiderAccountPage.tsx`; `components/**`; `domain/quoteBinding.ts`, `quoteResponse.ts`, `riderReceiptStorage.ts`).
- Thin rider route entry points at the app root, not under `app/(storefront)`: `app/page.tsx`, `app/book/page.tsx`, `app/rides/[confirmationCode]/page.tsx`, and `app/account/**` (`signin`, `signup`, `rides`). `proxy.ts` redirects every route to `/dashboard/init` while no users exist.
- Server contract: `features/keystone/models/**`, `features/keystone/access.ts`, `features/keystone/domain/**`, `features/keystone/mutations/**` (especially `marketplaceRideshare.ts`, `riderReceipts.ts`, `riderTripHistory.ts`, `rideLifecycle.ts`, `tripOperations.ts`), and `schema.graphql`.
- Provider boundaries: inspect `features/integrations/**` (manual route estimate, manual payment, console notifications) and the exact GraphQL calls made by the built-in client.

Explain that `features/storefront` is the behavioral reference for routes, states, GraphQL calls, request proofs, trip tokens, and browser-stored receipts. It should guide what is preserved or changed.

The current product focus is browsing a fleet's active ride services (`marketplaceRideshareServices`, `marketplaceRideshareService`, `marketplaceRideshareServiceAreas`), a priced quote with a 10-minute `quoteProof` (`marketplaceRideshareQuote`), requesting a ride (`requestRide`, `resolveRideRequestIntent`), request and trip status (`publicRideshareRequest`, `riderRequestStatus`, `publicRideshareTrip`, `riderTripHistory`), request cancellation (`riderRequestCancellationPreview`, `cancelRideRequest`), rider sign-in and signup (`riderAccountOptions`, generic `createUser`, `authenticateUserWithPassword`), the rider's ride list (`myRideshareRequests`), and signed-in after-ride actions (`submitTripReview`, `openSupportCase`, `reportSafetyIncident`, `sendTripMessage`). This list is orientation, not proof that every flow is safe or complete. There is no rider payment step, routes are estimated from text labels, and guests cannot rate, message, or open cases.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Rideshare source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in storefront or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which rider journeys, routes, content, brand, devices, accessibility needs, guest versus account behavior, and scheduled-ride states are required?
5. What visual references, interaction direction, responsive targets, and deployment constraints matter?
6. Which non-production host, schema export, test data, and test identities are available?

Restate the brief, inspect the supplied source, identify presentation-only changes versus backend-contract work, and ask for confirmation before broad implementation.

## Required source inspection

Before proposing code:

1. Enumerate the actual rider routes for this product (`app/page.tsx`, `app/book`, `app/rides`, `app/account`).
2. Trace the built-in screen components and every data loader and GraphQL call they make.
3. Enumerate GraphQL documents and operation names used by those call sites.
4. Read `schema.graphql`, model access, field access, and custom query/mutation resolvers, including the rider-safe projections (`PublicRideshareRequest`, `PublicRideshareTrip`).
5. Record actor, account or guest scope (account ownership, `requestProof`, trip token), inputs, outputs, quote expiry, state transition, `idempotencyKey`, and error states for each required operation.
6. Inspect provider adapters, cookies and sessions, browser storage of receipts, and runtime configuration touched by the requested flow.
7. Produce a capability matrix: verified, presentation-only, needs backend contract, blocked, or absent.

Do not claim the skill already knows a deployed contract. It knows where and how to discover the exact calls. Generated CRUD or a schema-valid document is not proof of safe access.

## Built-in versus separate client

### Adapt the built-in client

- Keep route files thin.
- Put product UI and orchestration in the existing feature slice.
- Reuse current session, transport, design tokens, loading/error states, receipt storage, and named server operations where they are safe.
- Do not duplicate fare, quote-expiry, availability, cancellation-fee, trip-state, or authorization logic in components.

### Build a separate client

- Use a trusted, environment-pinned endpoint and checked named operations.
- Keep privileged credentials and opaque capabilities server-side behind a BFF when needed.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, relationships, provider IDs, or endpoint URLs.
- Pin the exact schema, generate strict types, runtime-validate JSON/custom scalars, and fail closed when a required contract is absent.
- Keep quote proofs, request proofs, and trip tokens private to the rider. Never reach private trip data with a confirmation code alone.
- Send a stable `idempotencyKey` per rider intent and replay it after a lost response.
- Test anonymous, wrong-user, guest-proof, expired-quote, stale, duplicate, timeout, and provider-failure behavior against disposable data.

## Product-specific boundary

Design around service discovery, the quote and its disclosures, the request receipt, request and trip status, cancellation with its preview, rider accounts, and signed-in after-ride actions. Preserve the product's real workflow nouns and authority boundaries. Never show a driver as assigned, a route as mapped, a payment as taken, or a message as delivered unless the server says so, and never invent ETAs, live locations, safety claims, or reviews. Do not borrow Ecommerce GraphQL roots without validating that they exist and are authorized here.

For consequential actions, require one bounded server projection or command that validates actor, scope, related-record ownership, state transition, transaction/concurrency, idempotency, provider behavior, and audit evidence. If it does not exist (for example rider card payment or guest support cases), request the backend contract and show the feature as unavailable.

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
