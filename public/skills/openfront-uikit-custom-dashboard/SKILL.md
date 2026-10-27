---
name: openfront-uikit-custom-dashboard
description: Plan and build a custom Openfront UIKit operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront UIKit custom operator dashboard

Use this skill to adapt the built-in UIKit operator dashboard or create a separately deployed client. Start from this product's current source—not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Source repository: https://github.com/openshiporg/openfront-uikit. Ask which revision or local checkout is the target, and inspect that exact code.
- Generic Keystone dashboard shell, list/item screens, authentication helpers, and admin client: `features/dashboard`.
- UIKit-specific operator navigation, screens, server actions, projections, and workflows mounted into that shell: `features/platform`.
- Thin route entry points: `app/dashboard`, especially `app/dashboard/(admin)/platform/**`. Current platform routes: `orders`, `orders/[id]`, `store`, `catalog`, `catalog/new`, `catalog/[id]`, `components`, `design-systems`, `studio`, `studio/[id]`, `releases`, `quality`, `access`, `payments`, `refunds`, `payment-providers`, `api-keys`, `audit`; `settings` redirects to `store` and `registry` redirects to `catalog`.
- Platform slices: `orders`, `commerce`, `store-settings`, `catalog`, `registry-components`, `design-systems`, `studio`, `releases`, `quality`, `access`, `payments`, `refunds`, `payment-providers`, `api-keys`, `audit`, `onboarding`, plus shared `components`, `lib`, and `utils`. Navigation is in `features/platform/lib/navigation.ts`; GraphQL reads go through `features/platform/lib/uikitOperationsClient.ts`.
- Server contract: `features/keystone/models/**`, `features/keystone/access.ts`, `features/keystone/mutations/**` (custom roots are declared in `mutations/index.ts`), `features/keystone/queries/**`, `features/keystone/lib/**`, and `schema.graphql`.
- Models: `User`, `Role`, `BrandSettings`, `KitProduct`, `DesignSystem`, `DesignToken`, `ComponentRelease`, `ComponentFile`, `ComponentValidation`, `ReviewWorkflow`, `ChangelogEntry`, `PackageExport`, `AccessibilityAudit`, `CompatibilityTarget`, `Screenshot`, `UsageExample`, `IntegrationRecipe`, `Order`, `OrderItem`, `Payment`, `PaymentEvent`, `PaymentProvider`, `PaymentSession`, `Refund`, `KitAccess`, `RegistryApiKey`, `AuditEvent`, `OutboxEvent`, `RequestRateLimit`. One studio per deployment; there is no organization or store tenant.
- Operator queries: `uikitOperations`, `uikitOperatorAccess`, `uikitProductEditor`, `uikitDesignSystemEditor`, `uikitBrandSettings`, `componentDraftAuthoringContext`, `componentDraftReviewContext`.
- Operator mutations: `createComponentDraft`, `saveComponentDraft`, `validateComponentDraft`, `submitComponentReleaseForReview`, `decideComponentReview`, `publishComponentRelease`, `deprecateComponentRelease`, `createUIKitProduct`, `updateUIKitProduct`, `createUIKitDesignSystem`, `updateUIKitDesignSystem`, `createUIKitDesignToken`, `updateUIKitDesignToken`, `updateUIKitBrandSettings`, `settleKitOrderOffline`, `refundKitPayment`, `reconcileKitRefund`, `revokeKitAccess`, `revokeStorefrontRegistryApiKey`, `runUIKitOnboarding`.

Explain that `features/dashboard` is the reusable Keystone administration layer and `features/platform` is the product-specific operator experience. These directories show how the dashboard works and which server operations it calls.

The current product focus is orders, store identity, catalog/design systems/components, studio, releases, quality, entitlements, payments/refunds, payment providers, API keys, and audit/outbox. Draft validation runs only on macOS hosts (`sandbox-exec` plus a Playwright Chromium shell), and no outbox worker delivers `OutboxEvent` rows. This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact UIKit source checkout, and which revision/deployment is the target?
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

Design around orders, store identity, catalog/design systems/components, studio, releases, quality, entitlements, payments/refunds, payment providers, API keys, and audit/outbox. Preserve the product's real workflow nouns and authority boundaries. Never rename Ecommerce products/orders into this vertical or borrow Ecommerce GraphQL roots without validating that they exist and are authorized here.

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
