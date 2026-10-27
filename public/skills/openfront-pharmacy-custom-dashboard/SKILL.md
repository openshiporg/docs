---
name: openfront-pharmacy-custom-dashboard
description: Plan and build a custom Openfront Pharmacy operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Pharmacy custom operator dashboard

Use this skill to adapt the built-in Pharmacy operator dashboard or create a separately deployed client. Start from this product's current source—not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Repository: https://github.com/openshiporg/openfront-pharmacy. Confirm the checkout path and revision the user wants changed.
- Generic Keystone dashboard shell, list/item screens (`app/dashboard/(admin)/[listKey]`), authentication pages (`/dashboard/init`, `/dashboard/signin`, `/dashboard/signup`, `/dashboard/reset`), and admin client: `features/dashboard`.
- Pharmacy-specific operator navigation (`features/platform/lib/navigation.ts`), screens, server actions, and onboarding mounted into that shell: `features/platform`. Slices: overview, prescriptions, refills, requests, patients, prescribers, products, drug-references, suppliers, inventory, recalls, orders, pos, payments, staff, credentials, locations, store-settings, integrations, audit, onboarding.
- Thin route entry points under `app/dashboard/(admin)/platform/`: overview; prescriptions, `/intake`, `/[id]`; refills; requests; patients, `/create`, `/[id]`; prescribers, `/[id]`; products, `/[id]`; drug-references, `/[id]`; suppliers, `/[id]`; inventory, `/receive`, `/[id]`; recalls, `/open`, `/[id]`; orders, `/[id]`; pos; payments; staff; credentials; locations, `/[id]`; store-settings; integrations; audit. Users and roles use the generic `/dashboard/users` and `/dashboard/roles`.
- Server contract: `features/keystone/models/**` (45 lists), `features/keystone/access.ts` (19 role flags), `features/keystone/mutations/index.ts` (custom queries and mutations), `features/keystone/workflows/**` (state machines and rules), `schema.graphql`, and `docs/schema-map.md`.

Explain that `features/dashboard` is the reusable Keystone administration layer and `features/platform` is the product-specific operator experience. These directories show how the dashboard works and which server operations it calls.

The current product focus is prescription intake, clinical safety review, pharmacist review, dispensing authorization, fill reservation, dispensing with labels and cash tender, refills, transfers, online prescription requests, patients with allergies and medications, prescribers, drug reference reviews, products, suppliers, lot receipt and adjustment, recalls with exposure outreach and disposition, orders and fulfillment, POS cash sales, payments and reconciliation, staff memberships and credential reviews, locations, store settings, integrations, and the audit/outbox log. Key operator commands: `intakePharmacyPrescription`, `recordPrescriptionClinicalSafetyReview`, `recordPrescriptionReview`, `authorizePrescriptionDispensing`, `reservePharmacyPrescriptionFill`, `releasePharmacyPrescriptionFill`, `recordPrescriptionDispensing`, `resolvePrescriptionRefill`, `requestPrescriptionTransfer`, `approvePrescriptionTransfer`, `resolvePharmacyPrescriptionRequest`, `createPharmacyPatient`, `linkPharmacyPatientAccount`, `receivePharmacyInventoryLot`, `adjustPharmacyInventoryLot`, `openPharmacyRecall`, `quarantineRecallLots`, `recordRecallExposureAction`, `disposeRecallLot`, `closePharmacyRecall`, `transitionOrderFulfillment`, `submitPharmacyPosCashOrder`, `refundPharmacyPayment`, `refundPharmacyCashPayment`, `reconcilePharmacyPaymentSession`, `recordPharmacyCashPolicy`, `recordPharmacyFillPolicy`, `recordPharmacyStaffCredentialReview`, `recordPharmacyPrescriberCredentialReview`, `recordPharmacyDrugReferenceReview`, `configurePharmacyIntegrationProvider`, `validatePharmacyPrescriber`, `replayPharmacyOutboxEvent`, and `runPharmacyOnboarding`. Clinical, inventory, and money lists deny generic create/update/delete; their records change only through these attested commands. Cold-chain receiving and temperature-excursion recording are not available, controlled substances are blocked, and no outbox worker exists. This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Is the target the public repository (https://github.com/openshiporg/openfront-pharmacy) or a fork/local checkout, and which revision/deployment is it?
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

Design around prescription intake and review, pharmacist decisions, fills and dispensing, refills and transfers, patients, lots and expiry, recalls, OTC orders and POS, payments, and fulfillment. Preserve the product's real workflow nouns and authority boundaries. Never rename Ecommerce products/orders into this vertical or borrow Ecommerce GraphQL roots without validating that they exist and are authorized here.

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
