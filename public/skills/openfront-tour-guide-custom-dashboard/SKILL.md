---
name: openfront-tour-guide-custom-dashboard
description: Plan and build a custom Openfront Tour Guide operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Tour Guide custom operator dashboard

Use this skill to adapt the built-in Tour Guide operator dashboard or create a separately deployed client. Start from this product's current source, not E-commerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Repository: private; the user must supply a local checkout. There is no hosted app or demo.
- Generic Keystone dashboard shell, list/item screens, authentication helpers, and admin client: `features/dashboard`.
- Tour Guide operator navigation, screens, server actions, and workflows mounted into that shell: `features/platform`.
- Thin route entry points: `app/dashboard`, especially `app/dashboard/(admin)/platform/**`. Each route file imports one screen. There is no per-route role guard; `canAccessDashboard` gates sign-in and each custom operation checks its own flag.
- Sidebar entries: `features/platform/lib/navigation.ts`.
- Server contract: `features/keystone/models/**` (41 lists), `features/keystone/access.ts`, `features/keystone/mutations/**` (registered in `mutations/index.ts`, typed as `JSON`), `features/keystone/lib/**` (locks, money math, schedule expansion), and `schema.graphql`.
- Providers: `features/integrations/payment` (`stripe`, `manual`), webhook route `app/api/webhooks/payment/[provider]`, assistant `app/api/completion` and `app/api/mcp-transport/[transport]`.

Explain that `features/dashboard` is the reusable Keystone administration layer and `features/platform` is the product-specific operator experience.

Purpose-built slices in `features/platform`: `today`, `calendar`, `bookings`, `check-in`, `guides`, and `onboarding`. The routes `tours`, `waivers`, `promo-codes`, `resources`, `channels`, `customers`, `payment-providers`, and `settings` are generic list wrappers (`features/platform/components/ListScreen.tsx`), not bespoke editors.

Current routes under `/dashboard/platform`: `today`, `calendar`, `bookings`, `check-in`, `guides`, `tours`, `waivers`, `promo-codes`, `resources`, `channels`, `customers`, `payment-providers`, `settings`.

Key models: `Tour`, `TicketType`, `AddOn`, `Schedule`, `Departure`, `Guide`, `GuideCertification`, `GuideAssignment`, `Resource`, `ResourceAssignment`, `GuidePayout`, `Booking`, `BookingLine`, `InventoryHold`, `Participant`, `WaiverTemplate`, `WaiverSignature`, `Channel`, `ChannelStatement`, `PromoCode`, `PromoRedemption`, `Payment`, `Refund`, `ManagerApproval`, `AuditEvent`.

Key operator operations: `departuresInRange`, `departureManifest`, `generateDepartures`, `sweepDepartures`, `resizeDeparture`, `cancelDeparture`, `closeDeparture`, `assignGuide`, `respondToAssignment`, `assignResource`, `checkInParticipant`, `markNoShow`, `createChannelBooking`, `refundBooking`, `requestRefundApproval`, `approveRefund`, `generateChannelStatement`, `ensureTourOnboardingRecord`, `seedTourActivity`.

Tenancy and status: one operator per deployment, no organization or tenant list, and no manager-override flag (each `Role` flag stands alone). Bookings, holds, departures, participants, assignments, payouts, statements, and audit events block generated create and update. Status fields cannot be changed through generated update. Several jobs have no screen yet: offering guides, assigning vehicles, phone booking, refund approvals, resizing, and statements. Some stored fields are read by nothing (`PricingRule`, `NotificationPreference`, `GuideAvailability.weeklyRules`, and the roles `canManageSettings` and `canManageCustomers`). Payments use Stripe test mode in development.

This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Tour Guide source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in dashboard or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which operator jobs, screens, actions, roles, approvals, and scope are required?
5. What visual references, interaction direction, responsive targets (the manifest must work at 402 pixels), and deployment constraints matter?
6. Which non-production host, schema export, test data, and test identities are available?

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

Design around tours, departures with capacity, guides and certifications, vehicles and pools, bookings and participants, waivers, reseller channels, refunds, and guide payouts. Preserve the product's real workflow nouns and authority boundaries. Never rename E-commerce products/orders into this vertical or borrow E-commerce GraphQL roots without validating that they exist and are authorized here.

Seat counts, guide and vehicle overlap, and refund amounts are decided on the server under a departure lock. A client must call the custom operation and never compute them. For consequential actions, require one bounded server command that validates actor, related-record ownership, state transition, transaction and concurrency, idempotency, provider behavior, and audit evidence. If it does not exist, request the backend contract and show the feature as unavailable.

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

Never present a source path, generated schema, HTTP 200, or attractive empty state as proof that the operator dashboard workflow is operational.
