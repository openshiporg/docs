---
name: openfront-coffee-shop-custom-dashboard
description: Plan and build a custom Openfront Coffee Shop operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Coffee Shop custom operator dashboard

Use this skill to adapt the built-in Coffee Shop operator dashboard or create a separately deployed client. Start from this product's current source—not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Repository: <https://github.com/openshiporg/openfront-coffeeshop>
- Generic Keystone dashboard shell, list/item screens, authentication helpers, onboarding host, and admin client: `features/dashboard`.
- Coffee Shop-specific operator navigation (`features/platform/lib/navigation.ts`), screens, server actions, and workflows mounted into that shell: `features/platform`. Slices: `orders`, `menu`, `pos`, `reports`, `register`, `inventory`, `suppliers`, `recipes`, `coffee-operations`, `loyalty`, `catering`, `subscriptions`, `kds`, `store-settings`, and `onboarding`.
- Thin route entry points: `app/dashboard/(admin)/platform/**`. Current routes: `/dashboard/platform/orders`, `/menu`, `/pos`, `/reports`, `/register` and `/register/[id]`, `/inventory` and `/inventory/[id]`, `/suppliers` and `/suppliers/[id]`, `/recipes` and `/recipes/[id]`, `/coffee-operations`, `/loyalty` and `/loyalty/[id]`, `/catering` and `/catering/[id]`, `/subscriptions` and `/subscriptions/[id]`, `/kds`, `/store-settings`. Generic list pages are `/dashboard/[listKey]`.
- Server contract: `features/keystone/models/**`, `features/keystone/access.ts`, `features/keystone/mutations/**` (wired in `mutations/index.ts`, projection types in `mutations/coffeeBoundarySchema.ts`), `schema.graphql`, and `docs/schema-map.md`.
- Models: `StoreSetting` (singleton, one store per deployment, USD only), `MenuCategory`, `MenuItem`, `MenuItemImage`, `MenuItemModifier`, `CafeOrder`, `OrderItem`, `PosOrder`, `Payment`, `PaymentEvent`, `PaymentProvider`, `RegisterShift`, `CashMovement`, `InventoryItem`, `InventoryLot`, `StockMovement`, `Supplier`, `PurchaseOrder`, `Recipe`, `Ingredient`, `PrepBatch`, `PrepBatchConsumption`, `WasteLog`, `StaffShift`, `LoyaltyAccount`, `LoyaltyEvent`, `Subscription`, `CateringOrder`, `User`, `Role`, and the system-only `CoffeeDomainEvent` and `CoffeeOutboxDelivery`.
- Staff projections: `getCoffeeOrderQueue`, `getCoffeeKdsBoard`, `getCoffeeKdsRecoveryScope`, `getCoffeeMenuManager`, `getCoffeeMenuInventoryOptions`, `getCoffeePosRegister`, `quoteCafeOrder`, `getCoffeeReports`, `getCoffeeOperations`.
- Staff commands: `acceptCafePickupOrder`, `updateCafeOrderStatus`, `updateCafeOrderItemStatus`, `recordCafePayment`, `refundCafePayment`, `updatePosOrderStatus`, `createCafePickupOrder` (POS with a register shift), `applyCafeLoyalty`, `adjustCoffeeLoyaltyAccount`, menu commands (`createCoffeeMenuCategory`, `createCoffeeMenuItem`, `updateCoffeeMenuItem`, `createCoffeeMenuModifier`, `updateCoffeeMenuModifier`, `updateCoffeeModifierStock`), register commands (`openRegisterShift`, `recordRegisterCashMovement`, `closeRegisterShift`), stock commands (`createCoffeePurchaseOrder`, `receiveCoffeePurchaseOrder`, `cancelCoffeePurchaseOrder`, `completeCoffeePrepBatch`, `recordCoffeeWaste`, `recordCoffeeStockCount`), `scheduleCoffeeStaffShift`, `updateCoffeeStaffShiftStatus`, `updateCateringOrderStatus`, `updateSubscriptionStatus`, and `runCoffeeOnboarding`. Suppliers, inventory item metadata, recipes, ingredients, catering facts, subscription creation, store settings, and the Stripe enable switch still use generated Keystone CRUD from the platform pages.

Explain that `features/dashboard` is the reusable Keystone administration layer and `features/platform` is the product-specific operator experience. These directories show how the dashboard works and which server operations it calls.

The current product focus is orders, menu, POS and register, KDS, inventory, suppliers, recipes, prep and waste, staff shifts, rewards, catering, subscriptions (records only, no billing), store settings, and analytics. Payment defaults to pay at pickup or at the counter; Stripe Checkout is optional and off by default; the PayPal adapter is not wired into any flow; the MCP transport route returns 404. This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Coffee Shop source checkout, and which revision/deployment is the target?
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

Design around orders, menu, POS and register, KDS, inventory, suppliers, recipes, prep, staff shifts, rewards, catering, subscriptions, and analytics. Preserve the product's real workflow nouns and authority boundaries. Never rename Ecommerce products/orders into this vertical or borrow Ecommerce GraphQL roots without validating that they exist and are authorized here.

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
