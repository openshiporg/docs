---
name: openfront-travel-agent-custom-dashboard
description: Plan and build a custom Openfront Travel Agent operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Travel Agent custom operator dashboard

Use this skill to adapt the built-in Travel Agent dashboard or create a separately deployed client. Start from this product's current source, not E-commerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Repository: private; the user must supply a local checkout. There is no hosted app or demo.
- Generic Keystone dashboard shell, list and item screens, authentication helpers, and admin client: `features/dashboard`.
- Agency-specific screens, server actions, and navigation mounted into that shell: `features/platform`.
- Thin route entry points: `app/dashboard/(admin)/platform/**`. Each page exports one screen from `features/platform/<slice>/screens`. Sidebar entries come from `features/platform/lib/navigation.ts`.
- Server contract: `features/keystone/models/**` (37 lists), `features/keystone/access.ts`, `features/keystone/mutations/**` (registered in `mutations/index.ts`; operator mutations are in `travel.ts`, setup in `onboarding.ts`), `features/keystone/utils/managerApproval.ts`, `features/keystone/lib/travel-money.ts` (pure money math with tests), and `schema.graphql`.
- Providers: `features/integrations/payment` (`stripe`, `manual`). There is no webhook route.
- MCP: `app/api/mcp-transport/[transport]` and OAuth routes in `app/oauth`. The assistant is `app/api/completion`.

Explain that `features/dashboard` is the reusable Keystone administration layer and `features/platform` is the product-specific operator experience. They show how the dashboard works and which server operations it calls.

Platform slices: `overview`, `inquiries`, `trips`, `commissions`, `invoices`, `approvals`, `tasks`, `clients`, `suppliers`, `payment-providers`, `settings`, `onboarding`, plus shared `components`, `actions`, and `lib`. The client and supplier, task, settings, and provider pages are read-only lists. Edits there go through the generic list screens.

Current routes under `/dashboard/platform`: `overview`, `inquiries`, `trips`, `trips/[id]` (tabs: overview, travelers, proposals, components, itinerary, payments, funds, commissions, documents, tasks), `commissions`, `invoices`, `approvals`, `tasks`, `clients`, `suppliers`, `payment-providers`, `settings`.

Client actions are allow-listed in `features/platform/actions/operators.ts` (`runOperator`, a fresh idempotency key per call) and `approvals.ts` (`requestApproval`, `decideApproval`).

Key models: `Client`, `Traveler`, `Inquiry`, `Destination`, `Trip`, `Proposal`, `ProposalOption`, `ProposalItem`, `TripComponent`, `ItineraryDay`, `ItineraryItem`, `Supplier`, `SupplierContact`, `ClientInvoice`, `ClientInvoiceLine`, `PaymentSchedule`, `ClientFundsEntry`, `SupplierPayment`, `CommissionReceipt`, `CommissionAllocation`, `AdvisorCommissionLedger`, `Payment`, `Refund`, `ManagerApproval`, `AuditEvent`, `IdempotencyKey`, `AgencySettings`, `Document`, `Task`.

Key operator mutations (each takes `input` with an `idempotencyKey`): `createTripFromInquiry`, `buildProposal`, `sendProposal`, `bookComponent`, `cancelComponent`, `shareItinerary`, `transitionTrip`, `sweepTripDates`, `generatePaymentSchedule`, `issueClientInvoice`, `recordClientPayment`, `recordSupplierPayment`, `postClientFundsEntry`, `reverseEntry`, `recordCommissionReceipt`, `writeOffCommission`, `refundClientPayment`. Also `requestManagerApproval`, `decideManagerApproval`, `ensureTravelOnboardingPhase`, `setOnboardingStatus`.

Tenancy and authority: one agency per deployment, no tenant scope. Each role flag stands alone (`canManageTrips`, `canManageClients`, `canManageSuppliers`, `canManagePayments`, `canReadPayments`, `canIssueRefunds`, `canManageCommissions`, `canManageDocuments`, `canManageTasks`, `canManageSettings`, `canReadAudit`, `canManageOnboarding`, plus the people and role flags). Travelers and documents are limited to the advisor's own trips unless the user has `canManageRoles`. Raw create and update are closed on trips, components, proposals, invoices, funds, receipts, allocations, and audit events, so writes go through the mutations. Refunds above `AgencySettings.refundApprovalThresholdCents`, commission over-payments, and write-offs need a single-use approval from a different user.

Not built: a way to edit a trip's planning fee, travelers, or component due dates (they come from the seed), a receipt screen, upload of documents, and a Stripe webhook.

This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Travel Agent source checkout, and which revision is the target?
2. Do they want to adapt the built-in dashboard or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which operator jobs, screens, actions, roles, and approvals are required?
5. What visual references, interaction direction, responsive targets, and deployment constraints matter?
6. Which non-production host, schema export, test data, and test identities are available?

Restate the brief, inspect the supplied source, identify presentation-only changes versus backend-contract work, and ask for confirmation before broad implementation.

## Required source inspection

Before proposing code:

1. Enumerate the actual app routes for this product.
2. Trace the built-in screen components and every data loader or server action they call.
3. Enumerate GraphQL documents and operation names used by those call sites.
4. Read `schema.graphql`, model access, field access, and the custom query and mutation resolvers.
5. Record actor, scope, inputs, outputs, lifecycle authority, idempotency, and error states for each required operation.
6. Inspect provider adapters, cookies and tokens, and runtime configuration touched by the requested flow.
7. Produce a capability matrix: verified, presentation-only, needs backend contract, blocked, or absent.

Do not claim the skill already knows a deployed contract. It knows where and how to discover the exact calls. Generated CRUD or a schema-valid document is not proof of safe access.

## Built-in versus separate client

### Adapt the built-in client

- Keep route files thin.
- Put UI and orchestration in the existing feature slice.
- Reuse the session, transport, design tokens, and the named server actions where they are safe.
- Do not duplicate money, state-transition, approval, or authorization decisions in components. Use `features/keystone/lib/travel-money.ts` and the mutations.

### Build a separate client

- Use a trusted, environment-pinned endpoint and checked named operations.
- Keep credentials and private-link tokens server-side behind a backend-for-frontend when needed.
- Never expose an arbitrary GraphQL proxy or accept browser-selected operations, fields, or endpoints.
- Pin the exact schema, generate strict types, and validate the JSON returned by the custom operations. They return a JSON scalar, so their shape is defined in the resolvers.
- Test signed-out, wrong-role, stale, duplicate, timeout, and provider-failure behavior against disposable data.

## Product-specific boundary

Design around inquiries, proposals, trips, components, client funds, commissions, and approvals. Keep the product's real nouns and authority boundaries. Never rename E-commerce orders into this vertical or borrow E-commerce GraphQL roots without validating that they exist and are authorized here.

For consequential actions (state changes, money movement, refunds, write-offs), require one server command that validates the actor, state, amount, idempotency, and audit. If it does not exist, ask for the backend contract and show the feature as unavailable.

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
- auth, scope, secret, provider, migration, and rollback notes.

Never present a source path, a generated schema, an HTTP 200, or an attractive empty state as proof that an operator workflow works.
