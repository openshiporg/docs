---
name: openfront-vape-custom-dashboard
description: Plan and build a custom Openfront Vape operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Vape custom operator dashboard

Use this skill to adapt the built-in Vape operator dashboard or create a separately deployed client. Start from this product's current source, not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Source repository: `https://github.com/openshiporg/openfront-vape`. Confirm the exact checkout path and revision the user wants to target.
- Generic Keystone dashboard shell, list/item screens, authentication helpers, onboarding mount, and admin client: `features/dashboard`. This shell is shared with Openfront E-commerce and is expected to stay identical to it.
- Vape-specific operator navigation, screens, server actions, and workflows mounted into that shell: `features/platform` (for example `overview`, `compliance-center`, `merchant-profiles`, `jurisdictions`, `product-evidence`, `provider-approvals`, `compliance-ledger`, `compliance-reports`, `products`, `inventory`, `orders`, `users`, `store-settings`, `onboarding`).
- Thin route entry points: `app/dashboard/(admin)/platform/**`; generic model pages: `app/dashboard/(admin)/[listKey]/**`.
- Server contract: `features/keystone/models/**` (including `RegulatedAuthority.ts`, `RegulatedProduct.ts`, `RegulatedTransaction.ts`, `RegulatedReporting.ts`, `regulatedAccess.ts`), `features/keystone/access.ts`, `features/keystone/mutations/**`, `features/keystone/queries/**`, `features/keystone/regulated/**`, `features/regulated-commerce/**`, and `schema.graphql`. `docs/schema-map.md` in the repo maps lists, workflows, and page coverage.

Explain that `features/dashboard` is the reusable Keystone administration layer and `features/platform` is the product-specific operator experience. These directories show how the dashboard works and which server operations it calls.

The current product focus is the go-live release gate (`regulatedCommerceReadiness`, `releaseBlockers`), merchant profiles and licenses, jurisdictions and signed rule sets, per-variant classification and authorization evidence, provider approvals, the read-only compliance ledger, evidence reports, the emergency stop (`stopRegulatedCommerce`), plus retail catalog, inventory, orders, fulfillment with adult-signature carrier evidence, returns, and customers. This list is orientation, not proof that every flow is safe or complete; regulated checkout currently fails closed because no identity, tax, or carrier adapter is implemented.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Vape source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in dashboard or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which operator jobs, screens, actions, roles (for example compliance lead versus fulfillment staff), approvals, and permission flags are required?
5. What visual references, interaction direction, responsive targets, and deployment constraints matter?
6. Which non-production host, schema export, test data, and test identities are available?

Restate the brief, inspect the supplied source, identify presentation-only changes versus backend-contract work, and ask for confirmation before broad implementation.

## Required source inspection

Before proposing code:

1. Enumerate the actual app routes for this product under `app/dashboard/(admin)/platform`.
2. Trace the built-in screen components and every data loader/server action they call.
3. Enumerate GraphQL documents and operation names used by those call sites.
4. Read `schema.graphql`, model access (`managedComplianceAccess`, `immutableComplianceAccess`), field access (evidence digests, identity evidence, `killSwitch`), and custom query/mutation resolvers.
5. Record actor, permission flag, inputs, outputs, lifecycle authority, evidence immutability (`validateAuthorityRevision`), idempotency, and error states for each required operation.
6. Inspect provider adapters (`features/integrations/payment`, `features/integrations/shipping`, `features/regulated-commerce/providers/contracts.ts`), webhooks, uploads, cookies/tokens, and runtime configuration touched by the requested flow.
7. Produce a capability matrix: verified, presentation-only, needs backend contract, blocked, or absent.

Do not claim the skill already knows a deployed contract. It knows where and how to discover the exact calls. Generated CRUD or a schema-valid document is not proof of safe access.

## Built-in versus separate client

### Adapt the built-in client

- Keep route files thin.
- Put product UI and orchestration in the existing feature slice.
- Reuse current session, transport, design tokens, loading/error states, and named server operations where they are safe.
- Do not change `features/dashboard` unless the user accepts diverging from the shared Openfront shell.
- Do not duplicate release-gate, evidence, publication, price, lifecycle, payment, or authorization decisions in components.

### Build a separate client

- Use a trusted, environment-pinned endpoint and checked named operations.
- Keep privileged credentials and opaque capabilities server-side behind a BFF when needed.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, relationships, provider IDs, or endpoint URLs.
- Pin the exact schema, generate strict types, runtime-validate JSON/custom scalars, and fail closed when a required contract is absent.
- Test anonymous, wrong-user, missing-permission, stale, duplicate, timeout, and provider-failure behavior against disposable data.

## Product-specific boundary

Design around the release gate and its blocker codes, merchant authority, jurisdictions and rule sets, product evidence, provider approvals, the compliance ledger, reports, the kill switch, and retail order and fulfillment work. Preserve the product's real workflow nouns and authority boundaries. Never show sales as open, products as compliant, or providers as approved unless the server says so, and never invent regulatory warning copy. Do not borrow Ecommerce GraphQL roots without validating that they exist and are authorized here.

For consequential actions, require one bounded server projection or command that validates actor, permission, related-record ownership, state transition, evidence immutability, transaction/concurrency, idempotency, provider behavior, and audit evidence. If it does not exist, request the backend contract and show the feature as unavailable.

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
