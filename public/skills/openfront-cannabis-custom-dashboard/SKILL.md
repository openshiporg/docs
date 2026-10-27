---
name: openfront-cannabis-custom-dashboard
description: Plan and build a custom Openfront Cannabis operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Cannabis custom operator dashboard

Use this skill to adapt the built-in Cannabis operator dashboard or create a separately deployed client. Start from this product's current source—not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Public source: `https://github.com/openshiporg/openfront-cannabis`. Confirm the user's checkout path and revision before relying on it.
- Generic Keystone dashboard shell, list/item screens, authentication helpers, and admin client: `features/dashboard`.
- Cannabis-specific operator navigation, screens, server actions, projections, and workflows mounted into that shell: `features/platform`.
- Thin route entry points: `app/dashboard`, especially `app/dashboard/(admin)/platform/**`.
- Server contract: `features/keystone/models/**`, `features/keystone/access.ts`, `features/keystone/mutations/**` (registered in `mutations/index.ts`), `features/keystone/domain/**`, and `schema.graphql`. `docs/schema-map.md` summarizes every list, its creating command, and its states.
- Read path: every platform page loads through the single `cannabisOperationsWorkspace(section, options)` query, validated client-side by `features/platform/workspaces/lib/contract.ts`. Writes go through named commands via `features/platform/lib/commandClient.ts`; generic list create/update/delete is denied on every list.
- Launch boundary: `features/keystone/domain/runtimeCapabilities.ts` lists enabled capabilities. Commands for online intake, pickup carts, generic inventory events, integration activation, inbound state events, and reconciliation runs exist but refuse to run.

Explain that `features/dashboard` is the reusable Keystone administration layer and `features/platform` is the product-specific operator experience. These directories show how the dashboard works and which server operations it calls.

The current product focus is licenses and staff credentials, jurisdiction rule packs, staff and roles, package receiving and custody (lab results, release, holds), recall cases, counter ID check-in and customers, POS carts and order preparation, sale finalization, second-approver refunds, register shifts and blind-count cash close, state-reporting outbox, incidents, and the audit log. Platform routes live under `/dashboard/platform`: control room, authority, staff, compliance, customers, recalls, inventory, receiving, menu, store-settings, pos, sales, cash, reconciliation, incidents, and audit. This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Cannabis source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in dashboard or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which operator jobs, screens, actions, roles, approvals, and organization/premises scope are required?
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
- Do not duplicate price, availability, lifecycle, payment, eligibility/legal, or authorization decisions in components.

### Build a separate client

- Use a trusted, environment-pinned endpoint and checked named operations.
- Keep privileged credentials and opaque capabilities server-side behind a BFF when needed.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, relationships, provider IDs, or endpoint URLs.
- Pin the exact schema, generate strict types, runtime-validate JSON/custom scalars, and fail closed when a required contract is absent.
- Test anonymous, wrong-user, wrong-tenant/store/organization, stale, duplicate, timeout, and provider-failure behavior against disposable data.

## Product-specific boundary

Design around licenses, credentials, rule packs, package custody, recalls, counter eligibility, POS, sales, cash, refunds, outbox state, incidents, and audit. Preserve the product's real workflow nouns and authority boundaries. Never rename Ecommerce products/orders into this vertical or borrow Ecommerce GraphQL roots without validating that they exist and are authorized here.

For consequential actions, require one bounded server projection or command that validates actor, scope, related-record ownership, state transition, transaction/concurrency, idempotency, provider behavior, and audit evidence. In this codebase that usually means `runControlledOperation` (role permission, active staff credential covering the activity, current premises license, idempotency key, audit event, optional outbox event) and, for hold release, shift close, refunds, and recall close, the second-approver check in `mutations/approval.ts`. If it does not exist, request the backend contract and show the feature as unavailable.

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
