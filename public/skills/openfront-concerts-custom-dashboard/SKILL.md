---
name: openfront-concerts-custom-dashboard
description: Plan and build a custom Openfront Concerts operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Concerts custom operator dashboard

Use this skill to adapt the built-in Concerts operator dashboard or create a separately deployed client. Start from this product's current source, not E-commerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Repository: <https://github.com/openshiporg/openfront-concerts> (private; the user must supply a checkout).
- Generic Keystone dashboard shell, list and item screens, authentication helpers, and admin client: `features/dashboard`.
- Concerts operator screens, server reads, and workflows mounted into that shell: `features/platform`.
- Thin route entry points: `app/dashboard`, especially `app/dashboard/(admin)/platform/**`. Each route exports one `features/platform/<slice>/screens/*` component. The routes do not check role flags.
- Sidebar entries: `features/platform/lib/navigation.ts`. The sidebar brand comes from `StoreSettings.name`.
- Server contract: `features/keystone/models/**` (41 lists), `features/keystone/access.ts`, `features/keystone/mutations/**` (registered in `mutations/index.ts`), `features/keystone/lib/**` (settlement math, transactions, guest proof, audit), and `schema.graphql`.
- Providers: `features/integrations/payment` (Stripe is the only adapter checkout calls), webhook route `app/api/integrations/payment/[providerCode]/webhook`, assistant `app/api/completion`, MCP `app/api/mcp-transport/[transport]`.

Explain that `features/dashboard` is the reusable Keystone administration layer and `features/platform` is the product-specific operator experience. These directories show how the dashboard works and which server operations it calls.

Platform slices in `features/platform`: `events`, `calendar`, `deals`, `box-office`, `door`, `settlements`, `venues`, `artists`, `orders`, `promo-codes`, `customers`, `payment-providers`, `settings`, and `onboarding`.

Current routes under `/dashboard/platform`: `events`, `events/[id]`, `calendar`, `deals`, `box-office`, `door`, `settlements`, `settlements/[id]`, `venues`, `artists`, `orders`, `promo-codes`, `customers`, `payment-providers`, `settings`.

Key models: `Venue`, `SeatingChart`, `ChartSection`, `Seat`, `Artist`, `Agency`, `Tour`, `Event`, `EventArtist`, `DateHold`, `Offer`, `EventExpense`, `PriceLevel`, `PriceLevelPhase`, `SeatInventory`, `ProductionHold`, `InventoryHold`, `PromoCode`, `PromoRedemption`, `TicketOrder`, `TicketOrderLine`, `Ticket`, `ScanEvent`, `MerchSales`, `BarSales`, `Settlement`, `SettlementLine`, `ArtistPayment`, `AuditEvent`, `IdempotencyKey`, `StoreSettings`, and the Restaurant payment lists `PaymentProvider`, `PaymentCollection`, `PaymentSession`, `Payment`, `Refund`, `PaymentWebhookEvent`.

Key mutations: `placeDateHold`, `challengeHold`, `confirmHold`, `sendOffer`, `acceptOffer`, `publishEvent`, `setProductionHold`, `releaseProductionHold`, `scanTicket`, `recordMerchSales`, `computeSettlement`, `adjustSettlement`, `signSettlement`, `recordArtistPayment`, `postponeEvent`, `cancelEvent`, `refundTicketOrder`, `seedConcerts`, `updateActiveUser`. Only `publishEvent`, `postponeEvent`, `cancelEvent`, `challengeHold`, `signSettlement`, `computeSettlement`, `scanTicket`, and the setup commands have buttons today.

Tenancy: one promoter per deployment. There is no organization or per-venue staff membership. `Venue.ownedByPromoter` is data, not a scope. Access is by `Role` flags: `canManageEvents`, `canManageDeals`, `canManageInventory`, `canScanTickets`, `canManageSettlements`, `canApproveAdjustments`, `canIssueRefunds`, `canManagePayments`, `canReadPayments`, `canReadAudit`, `canManageOrders`, `canManageOnboarding`, and the people and role flags. `canManageVenues` and `canManageArtists` are defined but nothing checks them. Command-only lists block generated create, update, and delete. Catalog lists allow create and update with `canManageEvents`. Status fields are never writable through generated updates.

Known gaps to tell the user about: no command moves an event past `announced`, publishes a seating chart, or releases a date hold. The dashboard has no refund, comp, or door-sale button, and no camera scanner. Payments are Stripe TEST in development. The repository has no hosted app.

This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Concerts source checkout, and which revision or deployment is the target?
2. Do they want to adapt the built-in dashboard or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which operator jobs, screens, actions, roles, approvals, and scope are required?
5. What visual references, interaction direction, responsive targets, and deployment constraints matter?
6. Which non-production host, schema export, test data, and test identities are available?

Restate the brief, inspect the supplied source, identify presentation-only changes versus backend-contract work, and ask for confirmation before broad implementation.

## Required source inspection

Before proposing code:

1. Enumerate the actual app routes for this product.
2. Trace the built-in screen components and every data loader or command they call.
3. Enumerate GraphQL documents and operation names used by those call sites.
4. Read `schema.graphql`, model access, field access, and custom mutation resolvers.
5. Record actor, scope, inputs, outputs, lifecycle authority, idempotency, and error states for each required operation.
6. Inspect provider adapters, webhooks, uploads, cookies and tokens, and runtime configuration touched by the requested flow.
7. Produce a capability matrix: verified, presentation-only, needs backend contract, blocked, or absent.

Do not claim the skill already knows a deployed contract. It knows where and how to discover the exact calls. Generated CRUD or a schema-valid document is not proof of safe access.

## Built-in versus separate client

### Adapt the built-in client

- Keep route files thin.
- Put product UI and orchestration in the existing feature slice.
- Reuse the current session, transport, design tokens, loading and error states, and the commands where they are safe.
- Do not duplicate price, availability, lifecycle, settlement, payment, or authorization decisions in components. The settlement math lives in `features/keystone/lib/settlement.ts`.
- Keep status as a mono uppercase label with a status dot, not a badge.

### Build a separate client

- Use a trusted, environment-pinned endpoint and checked named operations.
- Keep privileged credentials server-side behind a backend-for-frontend when needed.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, relationships, provider ids, or endpoint URLs.
- Pin the exact schema, generate strict types, and runtime-validate JSON results. Most custom operations return the `JSON` scalar.
- Send a fresh `idempotencyKey` on every command and keep it across retries of the same request.
- Test anonymous, wrong-user, stale, duplicate, timeout, and provider-failure behavior against disposable data.

## Product-specific boundary

Design around date holds, offers and deals, events, price levels, seat inventory, orders and tickets, door scans, merchandise, settlements, and artist payments. Preserve the product's real workflow nouns and authority boundaries. Never rename E-commerce products or orders into this vertical or borrow E-commerce GraphQL roots without validating that they exist and are authorized here.

For consequential actions, require one bounded server command that validates actor, related-record ownership, state transition, transaction and concurrency, idempotency, provider behavior, and audit evidence. If it does not exist, request the backend contract and show the feature as unavailable. Settlement signing, adjustments, and refunds above the threshold need a second person. Do not weaken that in a client.

## Handoff

Report:

- built-in or separate mode;
- source path and revision inspected;
- routes and built-in screens reviewed;
- schema hash and named operations used;
- requested changes and what was preserved;
- capability matrix and backend blockers;
- implemented files and tests;
- responsive and accessibility evidence;
- auth, scope, secret, provider, migration, deployment, and rollback notes.

Never present a source path, generated schema, HTTP 200, or attractive empty state as proof that the operator workflow is operational.
