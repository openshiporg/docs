---
name: openfront-comedy-club-custom-dashboard
description: Plan and build a custom Openfront Comedy Club operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Comedy Club custom operator dashboard

Use this skill to adapt the built-in Comedy Club operator dashboard or create a separately deployed client. Start from this product's current source, not E-commerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Repository: private; the user must supply a local checkout. There is no hosted app or demo.
- Status: no hosted app, no demo. Payments use Stripe test mode in development. The storefront is a plain placeholder.
- Generic Keystone dashboard shell, list/item screens, authentication helpers, and admin client: `features/dashboard`.
- Club-specific operator navigation, screens, server actions, and workflows mounted into that shell: `features/platform`.
- Thin route entry points: `app/dashboard`, especially `app/dashboard/(admin)/platform/**`. Each route re-exports a screen from `features/platform/<slice>/screens`. Routes are not wrapped in a permission guard; every mutation checks its own flag on the server.
- Sidebar entries: `features/platform/lib/navigation.ts`.
- Server contract: `features/keystone/models/**` (40 lists), `features/keystone/access.ts` (permission flags), `features/keystone/mutations/**` (registered in `mutations/index.ts`), `features/keystone/lib/**` (pure money and time functions with Node tests), `features/keystone/utils/**` (payment adapter executor, idempotency, manager approval), and `schema.graphql`.
- Providers: `features/integrations/payment` (`stripe`, `manual`). There is no webhook route. Payment is confirmed by asking the provider when the guest returns and from the sweeper at `app/api/cron/expire-holds`.
- Assistant and MCP: `app/api/completion` and `app/api/mcp-transport/[transport]`. The vertical MCP tools are in `features/keystone/mcp-oauth/clubTools.ts`.

Explain that `features/dashboard` is the reusable Keystone administration layer and `features/platform` is the product-specific operator experience. These directories show how the dashboard works and which server operations it calls.

Platform slices in `features/platform`: `tonight`, `shows`, `orders`, `talent`, `open-mic`, `floor-menu`, `payouts`, `promo-codes`, `customers`, `settings`, `payment-providers`, plus `onboarding`, `components`, `actions`, and `lib`.

Current routes under `/dashboard/platform`: `tonight` (the default, `/dashboard` redirects to it), `shows`, `shows/[id]`, `orders`, `orders/[id]`, `talent`, `open-mic`, `floor-menu`, `payouts`, `promo-codes`, `customers`, `settings`, `payment-providers`. Some screens link to generic list screens (`/dashboard/rooms`, `/dashboard/tables`, `/dashboard/menu-items`, `/dashboard/promo-codes`, `/dashboard/venues`, `/dashboard/venue-settings-items`, `/dashboard/payment-providers`) for edits.

Writes from the screens go through one server action, `features/platform/actions/commands.ts`, which allows a fixed list of custom operations and adds an idempotency key to each call.

Key models: `Venue`, `VenueSettings`, `Room`, `Section`, `Table`, `Comedian`, `ShowTemplate`, `Run`, `Show`, `LineupSlot`, `OpenMicSignup`, `PriceTier`, `InventoryHold`, `PromoCode`, `PromoRedemption`, `TicketOrder`, `TicketOrderLine`, `Ticket`, `Comp`, `CheckIn`, `SeatingAssignment`, `TableOccupancy`, `MenuItem`, `Check`, `CheckItem`, `ComedianPayout`, `ShowSettlement`, `Payment`, `Refund`, `PaymentProvider`, `AuditEvent`, `ManagerApproval`, `IdempotencyKey`.

Key mutations: `generateShowsFromTemplate`, `publishShow`, `pauseSales`, `cancelShow`, `offerSlot`, `confirmSlot`, `setLineup`, `issueComp`, `checkInTicket`, `seatParty`, `openCheck`, `addCheckItem`, `voidCheckItem`, `closeCheck`, `runOpenMicLottery`, `closeShow`, `closeRun`, `refundTicketOrder`, `requestApproval`, `approveRequest`, `ensureClubOnboardingRecord`, `seedClubOperations`. Key queries and guest operations: `showsOnSale`, `showAvailability`, `openMicShows`, `ticketOrderConfirmation`, `lookupTicketOrder`, `createTicketHold`, `applyPromoToHold`, `startTicketCheckout`, `completeTicketCheckout`, `abandonTicketCheckout`, `cancelMyTicketOrder`, `openMicSignup`, `expireHolds`, `sweepPendingCheckouts`.

Tenancy and rules: one venue per deployment, no tenant or organization model. Access comes from boolean flags on `Role` (`canManageShows`, `canManageTalent`, `canManageDoor`, `canManageChecks`, `canManageOrders`, `canManagePayouts`, `canManageSettings`, `canManagePayments`, `canIssueRefunds`, `canReadAudit`, `canManageOnboarding`, and the people and role flags). There is no manager override flag. Most business lists block generated create, update, and delete, so writes must go through the custom mutations. Capacity changes run under a per-show database lock. Orders and checks keep copies of price and rules at the time. Money is integer cents. Refunds above a threshold, large comps, check item voids, and drink-minimum waivers need an approval from a different user.

Not built yet, so do not assume them: a webhook receiver, QR images, screens to request or approve approvals, to issue comps, to open checks, to approve or pay payouts, or to resume paused tiers; a use for `perOrderLimit` and the bringer guest counts; SMS or email reminders.

This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Comedy Club source checkout, and which revision/deployment is the target?
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

Design around shows, lineups, price tiers and holds, ticket orders, the door, seating, checks with the drink minimum, comedian payouts, and settlements. Preserve the product's real workflow nouns and authority boundaries. Never rename E-commerce products/orders into this vertical or borrow E-commerce GraphQL roots without validating that they exist and are authorized here.

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
