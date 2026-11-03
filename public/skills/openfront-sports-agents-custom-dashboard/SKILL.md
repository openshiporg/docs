---
name: openfront-sports-agents-custom-dashboard
description: Plan and build a custom Openfront Sports Agents operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Sports Agents custom operator dashboard

Use this skill to adapt the built-in Sports Agents dashboard or create a separately deployed client. Start from this product's current source, not E-commerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Repository: private; the user must supply a local checkout. There is no hosted app or demo.
- Generic Keystone dashboard shell, list/item screens, authentication helpers, and admin client: `features/dashboard`.
- Agency-specific operator screens, server actions, and navigation mounted into that shell: `features/platform`.
- Thin route entry points: `app/dashboard`, especially `app/dashboard/(admin)/platform/**`. Each route imports one screen from `features/platform/<slice>/screens/*`. There are no per-route permission wrappers; access comes from list access and athlete scope.
- Sidebar entries: `features/platform/lib/navigation.ts`.
- Data reads: `platformQuery` in `features/platform/lib/query.ts`. Commands: `runAgencyCommand` in `features/platform/actions/agency.ts` and `actions/approvals.ts`.
- Server contract: `features/keystone/models/**` (most built with `domainList` in `domainFields.ts`), `features/keystone/access.ts`, `features/keystone/mutations/**` (registered in `mutations/index.ts`), `features/keystone/lib/**` (commission math, per-athlete command wrapper, invoice proof, receipts), `features/keystone/utils/**` (idempotency, approvals, payment adapter), and `schema.graphql`. `docs/REUSE.md` lists the sibling products each piece came from.
- Providers: `features/integrations/payment` (`stripe`, `manual`), webhook route `app/api/integrations/payment/[providerCode]/webhook`, assistant `app/api/completion`, MCP `app/api/mcp-transport/[transport]`.

Explain that `features/dashboard` is the reusable Keystone administration layer and `features/platform` is the product-specific operator experience. These directories show how the dashboard works and which server operations it calls.

Platform slices in `features/platform`: `dashboard`, `clients`, `recruiting`, `contracts`, `endorsements`, `commissions`, `trust`, `approvals`, `brands`, `tasks`, `certifications`, `payment-providers`, `settings`, and `onboarding`.

Current routes: `/dashboard` (money view) and under `/dashboard/platform`: `clients`, `clients/[id]`, `recruiting`, `contracts`, `contracts/[id]`, `endorsements`, `commissions`, `trust`, `approvals`, `brands`, `tasks`, `certifications`, `payment-providers`, `settings`.

Key models: `Agency`, `Athlete`, `RepresentationAgreement`, `PlayingContract`, `ContractYear`, `Incentive`, `EndorsementDeal`, `Deliverable`, `ScheduledPayment`, `CommissionInvoice`, `CommissionInvoiceLine`, `CommissionLedgerEntry`, `AgentSplit`, `ClientTrustAccount`, `ClientTrustEntry`, `ManagerApproval`, `AuditEvent`, `IdempotencyKey`, `Task`, `AgentCertification`, `Document`, and the payment lists (`PaymentProvider`, `Payment`, `PaymentCollection`, `PaymentSession`, `Refund`, `PaymentWebhookEvent`).

Key mutations: `signRepresentationAgreement`, `recordContractSigned`, `generatePaymentSchedule`, `markPaymentReceived`, `draftCommissionInvoice`, `sendCommissionInvoice`, `voidCommissionInvoice`, `recordInvoicePayment`, `reverseLedgerEntry`, `writeOffCommissionInvoice`, `postTrustEntry`, `moveRecruitingStage`, `completeDeliverable`, `activateEndorsementDeal`, `requestManagerApproval`, `decideManagerApproval`, `generateAutoTasks`, `ensureOnboardingRecord`. Key query: `checkEndorsementConflicts`.

Tenancy: one agency per deployment, no tenant model. Athlete scope: a user sees an athlete only as lead agent or support staff, unless the role has `canViewAllClients`. Permissions are role checkboxes (`canManageAthletes`, `canManageContracts`, `canManageEndorsements`, `canManageCommissions`, `canManageTrust`, `canViewAllClients`, `canApproveActions`, and others in `access.ts`). Money lists block generated create and delete; their status fields change only through the commands. Money commands take an idempotency key and a per-athlete advisory lock. Ledger and trust entries are append-only with exact one-time reversals. Exclusivity overrides and write-offs need a single-use approval from a different user.

Known gaps to say out loud: `Document` has no upload flow, `Incentive` has no earn command, the `Agency` rate defaults and refund threshold are stored but not read, no command refunds a card payment, and the trust screen is read-only.

This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Sports Agents source checkout, and which revision is the target?
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
- Do not duplicate price, availability, lifecycle, payment, legal, or authorization decisions in components.

### Build a separate client

- Use a trusted, environment-pinned endpoint and checked named operations.
- Keep privileged credentials and opaque capabilities server-side behind a BFF when needed.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, relationships, provider IDs, or endpoint URLs.
- Pin the exact schema, generate strict types, runtime-validate JSON/custom scalars, and fail closed when a required contract is absent.
- Test anonymous, wrong-user, wrong-tenant/store/organization, stale, duplicate, timeout, and provider-failure behavior against disposable data.

## Product-specific boundary

Design around athletes, recruiting, agreements, contracts, endorsement deals, scheduled payments, commission invoices, the ledger, trust, and approvals. Preserve the product's real workflow nouns and authority boundaries. Never rename E-commerce products/orders into this vertical or borrow E-commerce GraphQL roots without validating that they exist and are authorized here.

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
