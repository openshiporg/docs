---
name: openfront-financial-custom-dashboard
description: Plan and build a custom Openfront Financial operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Financial custom operator dashboard

Use this skill to adapt the built-in Financial operator console or create a separately deployed client. Start from this product's current source, not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Source repository: `https://github.com/openshiporg/openfront-financial`. Confirm the exact checkout path and revision the user wants to target.
- Generic Keystone dashboard shell, list/item screens, authentication helpers, onboarding mount, AI chat, and admin client (`keystoneClient`): `features/dashboard`. This shell is shared with Openfront E-commerce and is expected to stay identical to it.
- Financial-specific operator navigation, screens, server actions, and GraphQL documents mounted into that shell: `features/platform` (slices `orders`, `portfolio`, `transfers`, `reporting`, `store-settings`, `accounts`, `instruments`, `transactions`, `approvals`, `tasks`, `ledger`, `income`, `advisory`, `compliance`, `onboarding`; navigation in `features/platform/lib/navigation.ts`; capability checks in `features/platform/lib/auth.ts`).
- Thin route entry points: `app/dashboard/(admin)/platform/**`; generic model pages: `app/dashboard/(admin)/[listKey]/**`. Statement CSV export: `app/api/platform/statements/route.ts`.
- Server contract: `features/keystone/models/**` (53 lists), `features/keystone/access.ts`, `features/keystone/mutations/index.ts` (all custom queries and mutations), the lifecycle modules in `features/keystone/lib/**` (`financialLifecycle`, `ledgerLifecycle`, `complianceLifecycle`, `agentOrchestrationLifecycle`, `institutionConnectionLifecycle`, `institutionSyncLifecycle`, `providerImportLifecycle`, `providerObservationLifecycle`, `machineCredentialLifecycle`, `brokerSyncLifecycle`), and `schema.graphql`. `docs/schema-map.md` in the repo maps lists, workflows, and page coverage.

Explain that `features/dashboard` is the reusable Keystone administration layer and `features/platform` is the product-specific operator experience. These directories show how the console works and which server operations it calls.

The current product focus is a paper brokerage console: order queue with simulated fills and cancels (`simulateOrderFill`, `cancelFinancialOrder`), transfer settlement (`processFinancialTransfer`), connections, consent, sync, and provider observation review (`provisionInstitutionConnection`, `recordConnectionConsent`, `rotateInstitutionCredential`, `syncInstitutionConnection`, `admitProviderObservation`, `reviewProviderObservation`), reconciliation (`reconcileProviderTransaction`), approval policies and decisions (`upsertApprovalPolicy`, `requestOrderApproval`, `decideApprovalRequest`), agent proposals and delivery retries, machine credentials, a double-entry ledger, income records, advisory, compliance transitions (`transitionComplianceRecord`), and store settings. This list is orientation, not proof that every flow is safe or complete. Nothing reaches a real broker or bank, and dividends, tax lots, statements, KYC, risk profiles, cases, alerts, and recommendations are created only by onboarding.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Financial source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in console or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which operator jobs, screens, actions, roles (for example operations versus approver versus integration manager), approvals, and capability flags (`canViewFinancialOperations`, `canOperateFinancial`, `canApproveFinancial`, `canManageIntegrations`, `canManageMachineCredentials`, `canManageOnboarding`) are required?
5. Do they need a firm-wide view of every customer? Current pages read through the operator's own session and show the operator's own book.
6. What visual references, interaction direction, responsive targets, and deployment constraints matter?
7. Which non-production host, schema export, test data, and test identities (at least two, for separation of duties) are available?

Restate the brief, inspect the supplied source, identify presentation-only changes versus backend-contract work, and ask for confirmation before broad implementation.

## Required source inspection

Before proposing code:

1. Enumerate the actual app routes for this product under `app/dashboard/(admin)/platform`.
2. Trace the built-in screen components and every server action in `features/platform/<slice>/actions` they call.
3. Enumerate GraphQL documents and operation names used by those call sites (for example `PlatformOrderDetail`, `PlatformSimulateOrderFill`, `PlatformProcessTransfer`, `PlatformReconcileTransaction`, `PlatformTransitionCompliance`, `PlatformUpsertApprovalPolicy`, `OperatorDecideApproval`, `OperatorSyncConnection`, `OperatorIssueMachineCredential`, `RunFinancialOnboarding`).
4. Read `schema.graphql`, list access (most financial lists set generic create, update, and delete to `false` and filter reads to the session user), field access (for example the hidden `credentialReference`), and the custom resolvers.
5. Record actor, capability flag, owner scope, inputs, outputs, state transitions, idempotency key, separation-of-duties checks, approval-policy gates, audit and ledger writes, and error states for each required operation.
6. Inspect `features/brokerages/**` (Alpaca paper adapter, env-reference credentials), `app/api/webhooks/financial`, `app/api/financial/agent`, the outbox lifecycle, sessions (12-hour stateless Keystone sessions), and runtime configuration touched by the requested flow.
7. Produce a capability matrix: verified, presentation-only, needs backend contract, blocked, or absent.

Do not claim the skill already knows a deployed contract. It knows where and how to discover the exact calls. Generated CRUD or a schema-valid document is not proof of safe access.

## Built-in versus separate client

### Adapt the built-in client

- Keep route files thin.
- Put product UI and orchestration in the existing feature slice.
- Reuse current session, transport, design tokens, loading/error states, and named server operations where they are safe.
- Do not change `features/dashboard` unless the user accepts diverging from the shared Openfront shell.
- Do not duplicate approval thresholds, compliance transitions, balance math, ledger postings, or authorization decisions in components.

### Build a separate client

- Use a trusted, environment-pinned endpoint and checked named operations.
- Keep privileged credentials, machine tokens, and opaque references server-side behind a BFF when needed.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, relationships, provider keys, credential references, or endpoint URLs.
- Pin the exact schema, generate strict types, runtime-validate JSON/custom scalars and decimal strings, and fail closed when a required contract is absent.
- Generate a stable idempotency key per user intent and reuse it on retry.
- Test anonymous, wrong-user, missing-permission, self-approval, stale, duplicate, timeout, and provider-failure behavior against disposable data.

## Product-specific boundary

Design around paper orders, simulated fills, operator-settled transfers, consented paper connections, reconciliation, approvals with independent reviewers, the double-entry ledger, and compliance transitions. Preserve the product's real workflow nouns and authority boundaries. Never show an order as executed at a broker, a transfer as moved money, a bank as verified by a bank, a quote as live, or a recommendation as investment advice, and keep the paper-trading disclosure visible. Do not add a live-trading or live-money switch; the source restricts every provider to `sandbox` with execution off. Do not borrow Ecommerce GraphQL roots without validating that they exist and are authorized here.

For consequential actions, require one bounded server command that validates actor, capability, owner scope, related-record ownership, state transition, approval policy, separation of duties, transaction/concurrency, idempotency, provider behavior, and audit and ledger evidence. If it does not exist (for example a firm-wide customer view, tax-lot updates on fill, or generating statements), request the backend contract and show the feature as unavailable.

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
- auth, permission, secret, provider, migration, deployment, and rollback notes.

Never present a source path, generated schema, HTTP 200, or attractive empty state as proof that the operator dashboard workflow is operational.
