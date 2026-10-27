---
name: openfront-convenience-custom-dashboard
description: Plan and build a custom Openfront Convenience operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Convenience custom operator dashboard

Use this skill to adapt the built-in Convenience operator dashboard or create a separately deployed client. Start from this product's current source—not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Repository: <https://github.com/openshiporg/openfront-convenience>
- Generic Keystone dashboard shell, list/item screens, authentication helpers (`/dashboard/init`, `signin`, `signup`, `reset`, `no-access`), and admin client: `features/dashboard`.
- Convenience-specific operator navigation (`features/platform/lib/navigation.ts`), projection loader (`features/platform/lib/projection.ts`), shared server actions (`features/platform/actions.ts`), and onboarding dialog (`features/platform/onboarding`): `features/platform`.
- Platform slices: `overview`, `pos`, `sales`, `tills`, `staff`, `store-settings`, `fuel`, `reconciliation`, `exceptions`, `recovery`, `products`, `stock`, `inventory`, `purchasing`, `vendors`, `purchase-orders`, `pricing`, `promotions`, `foodservice`, `compliance` (Restricted Sales), `lottery`, `money-services`, `payments`, `customers`, `loyalty`, `reports`, `exports`.
- Thin route entry points: `app/dashboard/(admin)/platform/**`. Routes: `/dashboard/platform`, `/pos`, `/pos/receipt/[saleId]`, `/store-settings`, `/sales` and `/sales/[id]`, `/tills` and `/tills/[id]`, `/staff` and `/staff/[id]`, `/fuel`, `/reconciliation`, `/exceptions`, `/recovery`, `/products` and `/products/[id]`, `/stock`, `/inventory`, `/purchasing`, `/vendors` and `/vendors/[id]`, `/purchase-orders` and `/purchase-orders/[id]`, `/pricing`, `/promotions`, `/foodservice`, `/restricted-sales`, `/lottery`, `/money-services`, `/payments`, `/customers` and `/customers/[id]`, `/loyalty`, `/reports`, `/exports`.
- Server contract: `features/keystone/models/**` (95 lists; `Business` is the tenant root, `Employee` joins a `User` to one business, one `Role` with 47 permission flags, and permitted stores), `features/keystone/access.ts`, `features/keystone/mutations/index.ts` (all named queries and mutations), and `schema.graphql`. `docs/schema-map.md` maps each list to its states, access mode, and page.
- Platform reads: `conveniencePlatformProjection`, `conveniencePlatformNavigation`, `convenienceReportingSummary`, `posSaleReceipt`, `posOperationOutcome`, `downloadExportArtifact`, plus generic list queries. Writes: named, idempotent, audited mutations such as `onboardConvenienceBusiness`, `configureBusinessBrand`, `openRegisterSession`, `createPosCart`, `addPosCartLine`, `completePosSale`, `refundPosSale`, `voidCompletedPosSale`, `configureCatalogItem`, `setRetailPrice`, `receivePurchaseOrder`, `approveInventoryCount`, `completePrepBatch`, `completeFuelTransaction`, `approveStoreDayReconciliation`, `generateDailyAccountingExport`, `recordOfflineReplayBatch`, `replayOutboxEvent`, `createBusinessApiKey`. Staff creation uses generic `createUser` and `createEmployee`.
- Integrations: `features/integrations/payment` (`manual_external`, `hmac_json_v1`), `app/api/webhooks/payment/[providerId]`, workers in `features/keystone/scripts`, assistant at `app/api/completion` with a read-only MCP endpoint at `app/api/mcp-transport/[transport]`.

Explain that `features/dashboard` is the reusable Keystone administration layer and `features/platform` is the product-specific operator experience. These directories show how the dashboard works and which server operations it calls.

The current product focus is POS, tills, sales history, staff, catalog, stock, purchasing, pricing and promotions, loyalty, restricted sales, prepared food, fuel, lottery, money services, payments, store-day reconciliation, exceptions, offline recovery, reports, and accounting exports. This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Convenience source checkout, and which revision/deployment is the target?
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

Design around POS, tills, catalog, stock, purchasing, pricing, loyalty, restricted sales, prepared food, fuel, lottery, money services, store-day reconciliation, and reports. Payment, fuel-controller, lottery, money-service, and accounting systems are recorded, not called; do not show them as live connections. Preserve the product's real workflow nouns and authority boundaries. Never rename Ecommerce products/orders into this vertical or borrow Ecommerce GraphQL roots without validating that they exist and are authorized here.

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
