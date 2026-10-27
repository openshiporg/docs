---
name: openfront-sportsbook-custom-dashboard
description: Plan and build a custom Openfront Sportsbook operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Sportsbook custom operator dashboard

Use this skill to adapt the built-in Sportsbook operator dashboard or create a separately deployed client. Start from this product's current source, not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Source repository: `https://github.com/openshiporg/openfront-sportsbook`. Confirm the exact checkout path and revision the user wants to target.
- Generic Keystone dashboard shell, list/item screens, authentication helpers, onboarding mount, and admin client: `features/dashboard`. This shell is shared with Openfront E-commerce and is expected to stay identical to it.
- Sportsbook-specific operator navigation (`features/platform/lib/navigation.ts`), screens, server actions, and workflows mounted into that shell: `features/platform` (slices `overview`, `onboarding`, `catalog` (including `catalog/reference`), `trading`, `wagers`, `risk`, `results`, `grading`, `settlements`, `customers`, `compliance`, `responsible-gaming`, `closures`, `support`, `notifications`, `finance` (including `finance/tax`), `promotions`, `providers`, `integrations`, `recovery`, `incidents`, `reports`, `configuration`, `settings`, `store-settings`, `roles`, `security`, `approvals`, `audit`). Shared helpers live in `features/platform/lib` (`graphql.ts`, `operator.ts`) and `features/platform/components`.
- Thin route entry points: `app/dashboard/(admin)/platform/**`; generic model pages: `app/dashboard/(admin)/[listKey]/**`.
- Server contract: `features/keystone/models/**` (`Sportsbook.ts`, `SportsbookFull.ts`, `SportsbookP0.ts`, `Customer.ts`, `User.ts`, `Role.ts`), `features/keystone/access.ts`, `features/keystone/session-assurance.ts`, `features/keystone/tenant-scope.ts`, `features/keystone/mutations/**` (`sportsbook.ts`, `sportsbook-full.ts`, `approval-control.ts`, `setting-policy.ts`, `onboarding-catalog.ts`), domain logic in `features/sportsbook/domain/**` and `features/sportsbook/settlement/**`, the GraphQL handler `pages/api/graphql.ts`, and `schema.graphql`. `docs/schema-map.md` in the repo maps lists, workflows, and page coverage.

Explain that `features/dashboard` is the reusable Keystone administration layer and `features/platform` is the product-specific operator experience. These directories show how the dashboard works and which server operations it calls.

The current product focus is a tenant-scoped sportsbook: onboarding (`applySportsbookOnboarding`), catalog and market creation, pricing and market status (`setMarketPrices`, `setMarketStatus`, `setEventTradingState`), wager investigation, risk limits and correlation rules, results with independent approval (`requestResultApproval`, `approveResultVersion`), per-selection grading (`gradeMarketSelection`), settlement and resettlement, the double-entry ledger, reconciliation, safeguarding, tax, customer verification and AML, responsible gaming, support and disputes, promotions, provider certification, webhooks, recovery queues, incidents, reports, configuration, roles, operator MFA, the approval inbox, and the hash-chained audit log. Most Sportsbook lists are read-only through GraphQL CRUD; changes go through named custom mutations, many as request/apply pairs under dual control. This list is orientation, not proof that every flow is safe or complete; every provider is a sandbox adapter.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Sportsbook source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in dashboard or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which operator jobs, screens, actions, roles (for example trader, risk, compliance, finance, independent approver), approvals, and permission flags are required?
5. What visual references, interaction direction, responsive targets, and deployment constraints matter?
6. Which non-production host, schema export, test data, test operators with enrolled MFA, and a second approver identity are available?

Restate the brief, inspect the supplied source, identify presentation-only changes versus backend-contract work, and ask for confirmation before broad implementation.

## Required source inspection

Before proposing code:

1. Enumerate the actual app routes for this product under `app/dashboard/(admin)/platform`.
2. Trace the built-in screen components and every data loader/server action they call (`platformRead`, `keystoneClient`, `getOperatorContext`, and any direct Prisma reads in `features/platform/lib/operator.ts`).
3. Enumerate GraphQL documents and operation names used by those call sites.
4. Read `schema.graphql`, list access (`scopedAccess` with a capability, `currentTenantScope`, denied create/update/delete, omitted customer lists), field access, and custom query/mutation resolvers.
5. Record actor, capability flag, MFA assurance (`operatorSessionAssured`), tenant, inputs, outputs, expected version or state checks, dual-control approval (`ApprovalRequest`, payload hash, expiry, `DUAL_CONTROL_REQUIRED`), idempotency key, audit event, and refusal codes for each required operation.
6. Inspect provider adapters (`features/sportsbook/adapters/**`, `features/keystone/utils/paymentProviderAdapter.ts`), webhooks, the worker (`features/sportsbook/workers/**`), sessions, and runtime configuration touched by the requested flow.
7. Produce a capability matrix: verified, presentation-only, needs backend contract, blocked, or absent.

Do not claim the skill already knows a deployed contract. It knows where and how to discover the exact calls. Generated CRUD or a schema-valid document is not proof of safe access.

## Built-in versus separate client

### Adapt the built-in client

- Keep route files thin.
- Put product UI and orchestration in the existing feature slice.
- Reuse current session, transport, design tokens, loading/error states, refusal-code copy, and named server operations where they are safe.
- Do not change `features/dashboard` unless the user accepts diverging from the shared Openfront shell.
- Do not duplicate pricing, acceptance, grading, settlement, ledger, exposure, approval, or authorization decisions in components.

### Build a separate client

- Use a trusted, environment-pinned endpoint and checked named operations.
- Keep privileged credentials and opaque capabilities server-side behind a BFF when needed.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, relationships, tenant IDs, provider IDs, or endpoint URLs.
- Pin the exact schema, generate strict types, runtime-validate JSON and minor-unit money strings, and fail closed when a required contract is absent.
- Respect the GraphQL query guard (size, depth, alias limits, 256 KB body) and production error masking.
- Test anonymous, wrong-tenant, missing-capability, no-MFA, self-approval, expired-approval, stale-version, duplicate, timeout, and provider-failure behavior against disposable data.

## Product-specific boundary

Design around the real nouns: tenant, brand, jurisdiction, event, market, selection, price snapshot, quote, wager, acceptance decision, result version, grade, settlement, journal, hold, approval request, and audit event. Preserve two-factor assurance and dual control: never let a client apply a sensitive change without an approved request from a different operator. Never show a market as open, a result as approved, a wager as settled, a provider as certified, or a jurisdiction as licensed unless the server says so. Show sandbox status plainly. Do not borrow Ecommerce GraphQL roots (products, orders, carts) without validating that they exist and are authorized here.

For consequential actions, require one bounded server projection or command that validates actor, capability, MFA, tenant, related-record ownership, state transition, transaction/concurrency, idempotency, approval, provider behavior, and audit evidence. If it does not exist (for example writers for `Team`, `AccessReview`, `LegalHold`, `DataCorrectionCase`, or `ResettlementCase`), request the backend contract and show the feature as unavailable.

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
- auth, MFA, dual-control, tenant, secret, provider, worker, migration, deployment, and rollback notes.

Never present a source path, generated schema, HTTP 200, or attractive empty state as proof that the operator dashboard workflow is operational.
