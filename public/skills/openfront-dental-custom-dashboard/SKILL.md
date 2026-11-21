---
name: openfront-dental-custom-dashboard
description: Plan and build a custom Openfront Dental operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Dental custom operator dashboard

Use this skill to adapt the built-in Dental operator dashboard or create a separately deployed client. Start from this product's current source—not E-commerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Repository: <https://github.com/openshiporg/openfront-dental>
- Generic Keystone dashboard shell, list/item screens, authentication helpers, and admin client: `features/dashboard`.
- Dental-specific operator navigation, screens, server actions, and workflows mounted into that shell: `features/platform`.
- Thin route entry points: `app/dashboard`, especially `app/dashboard/(admin)/platform/**`.
- Server contract: `features/keystone/models/**`, `features/keystone/access.ts`, `features/keystone/mutations/**` (custom resolvers merged in `mutations/index.ts`), and `schema.graphql`.
- Provider boundaries: `features/integrations/clearinghouse` (manual, Stedi), `features/integrations/payments` (Stripe, manual), `features/integrations/voice` (Twilio).
- Onboarding: `features/platform/onboarding` (`config/sections.ts` lists what each setup section loads).

Explain that `features/dashboard` is the reusable Keystone administration layer and `features/platform` is the product-specific operator experience. These directories show how the dashboard works and which server operations it calls.

Current operator routes (`app/dashboard/(admin)/platform/<route>/page.tsx`): `/platform/schedule`, `/platform/patients`, `/platform/assistant`, `/platform/approvals`, `/platform/forms`, `/platform/codes`, `/platform/fees`, `/platform/claims`, `/platform/payments`, `/platform/memberships`, `/platform/close`, `/platform/remittances`, `/platform/insurance`, `/platform/verifications`, `/platform/schedule/asap`, `/platform/schedule/confirmations`, `/platform/schedule/booking-requests`, `/platform/recall`, `/platform/labs`, `/platform/prescriptions`, `/platform/calls`, `/platform/reviews`, `/platform/compliance`, `/platform/data`, `/platform/settings/locations`, `/platform/audit`, `/platform/privacy`, `/platform/settings/security`, `/platform/settings`. Also generic list pages at `/dashboard/[listKey]`, and `/dashboard/init`, `/dashboard/signin`, `/dashboard/reset`, `/dashboard/no-access`.

Key lists: `Patient`, `FamilyGroup`, `Guarantor`, `Appointment`, `Operatory`, `ChartEntry`, `ClinicalNote`, `PerioExam`, `TreatmentPlan`, `Coverage`, `BenefitVerification`, `Claim`, `Remittance`, `LedgerEntry`, `Statement`, `Payment`, `PatientMembership`, `PatientRecall`, `LabCase`, `Proposal`, `ApprovalRequest`, `AuditEvent`.

Main operator operations: `bookAppointment`, `confirmAppointment`, `markArrived`, `seatPatient`, `completeAppointment`, `addChartProcedure`, `completeProcedure`, `signClinicalNote`, `buildTreatmentPlan`, `presentTreatmentPlan`, `acceptTreatmentPlan`, `requestVerification`, `buildClaim`, `scrubClaim`, `releaseClaim`, `matchRemittance`, `takePayment`, `closeDay`, `decideApprovalRequest`. Every state change takes an idempotency key and writes an audit event.

The current product focus is scheduling by operatory and provider, charting, treatment plans, insurance verification, claims and remittance, patient ledger, payments, day and month close, recall, lab cases and approvals. This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Dental source checkout, and which revision/deployment is the target?
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

Design around scheduling by operatory and provider, charting, treatment plans, insurance verification, claims and remittance, patient ledger, payments, day and month close, recall, lab cases and approvals. Preserve the product's real workflow nouns and authority boundaries. Never rename E-commerce products/orders into this vertical or borrow E-commerce GraphQL roots without validating that they exist and are authorized here.

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
