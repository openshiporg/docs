---
name: openfront-restaurant-custom-dashboard
description: Plan and build a custom Openfront Restaurant operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Restaurant custom operator dashboard

Use this skill to adapt the built-in Restaurant operator dashboard or create a separately deployed client. Start from this product's current source—not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Repository: <https://github.com/openshiporg/openfront-restaurant>
- Generic Keystone dashboard shell, list/item screens, authentication helpers, and admin client: `features/dashboard`.
- Restaurant-specific operator navigation, screens, server actions, projections, and workflows mounted into that shell: `features/platform`.
- Thin route entry points: `app/dashboard`, especially `app/dashboard/(admin)/platform/**`. Each route file only re-exports a screen from `features/platform/<slice>/screens`.
- Platform slices: `orders`, `kds`, `pos` (including the floor map and payment screen), `service-floor`, `reports`, `operations`, `reservations`, `waitlist`, `store-settings`, `payments` (receipts, refund/checkout recovery, notifications, campaigns, manager-approval components), `reconciliation`, `menu`, `inventory`, `tables`, `staff`, `customers` (privacy), `discounts`, `gift-cards`, `payment-providers`, `api-keys`, plus `onboarding` (a dialog in the sidebar, not a route) and shared `lib`/`components`/`context`.
- Navigation: `features/platform/lib/navigation.ts`. Sidebar visibility: `features/dashboard/lib/sidebarAccess.ts`.
- Server contract: `features/keystone/models/**`, `features/keystone/access.ts`, `features/keystone/mutations/**` (custom roots registered in `mutations/index.ts`), `features/keystone/utils/**` (service state, kitchen ticket sync, inventory ledger, manager approval, idempotency), and `schema.graphql`.

Explain that `features/dashboard` is the reusable Keystone administration layer and `features/platform` is the product-specific operator experience. These directories show how the dashboard works and which server operations it calls.

Current routes under `/dashboard/platform`: `orders` (`/[id]`, `/[id]/fulfill`), `kds`, `pos` (`/tables`, `/[orderId]/payment`), `service-floor`, `reports` (`/sales`, `/menu-performance`, `/labor`), `operations`, `reservations`, `waitlist`, `store-settings`, `receipts`, `reconciliation`, `menu`, `menu-categories`, `menu-items`, `menu-modifiers`, `ingredients`, `inventory/purchase-orders`, `inventory/recipes`, `inventory/waste`, `tables`, `time-clock`, `users`, `staff/schedule`, `staff/tips`, `discounts`, `gift-cards`, `privacy`, `payment-providers`, `api-keys`. Generic list pages are `/dashboard/<list-key>`. `/dashboard/reports/sales` and `/dashboard/reports/menu-performance` duplicate the platform report screens.

Tenancy: one restaurant per deployment. `StoreSettings` is a singleton. There is no organization, restaurant group, or location model; `InventoryLocation` is only an ingredient storage location. Authorization comes from the user's `Role` flags (`canAccessDashboard`, `canRead*`/`canManage*` for Orders, Payments, Products, Cart, Inventory, Users, Roles, Kitchen, Tables, Staff, Vendors, GiftCards, Discounts, plus `canManagePeople`, `canSeeOtherPeople`, `canEditOtherPeople`, `canManageSettings`, `canManageOnboarding`). API keys (`of_` bearer tokens) are intersected with scopes such as `read_orders`, `write_menu`, `write_payments`.

Models: `User`, `Role`, `ApiKey`, `Address`, `StoreSettings`, `Floor`, `Section`, `Table`, `Reservation`, `WaitlistEntry`, `MenuCategory`, `MenuItem`, `MenuItemImage`, `MenuItemModifier`, `RestaurantOrder`, `OrderItem`, `OrderCourse`, `OrderAdjustment`, `ManagerApproval`, `KitchenStation`, `PrepStation`, `KitchenTicket`, `KitchenTicketEvent`, `KitchenMessage`, `Cart`, `CartItem`, `PaymentCollection`, `PaymentSession`, `PaymentProvider`, `Payment`, `Refund`, `Receipt`, `PaymentWebhookEvent`, `IdempotencyKey`, `Discount`, `DiscountRule`, `GiftCard`, `GiftCardTransaction`, `Vendor`, `InventoryLocation`, `Ingredient`, `Recipe`, `StockMovement`, `PurchaseOrder`, `WasteLog`, `Shift`, `TimeEntry`, `TipPool`, `AuditEvent`. Business days, cash movements, settlements, notifications, campaigns, privacy requests, and time corrections are stored as `AuditEvent` rows. `RestaurantOrder`, `OrderItem`, `Payment`, `KitchenTicket`, and `GiftCard` block generic create/update; change them only through custom operations.

Key operator operations: `createPOSOrder`, `transitionRestaurantOrder`, `addServiceFloorItem`, `updateServiceFloorItem`, `updateServiceFloorCheckStatus`, `updateServiceFloorTableStatus`, `fireCourse`, `recallCourse`, `transferTable`, `combineTables`, `setRestaurantTableCapacity`, `deleteUnusedRestaurantTable`, `splitCheckByItem`, `splitCheckByGuest`, `splitCheckBySeat`, `recombineEqualChecks`, `mergeChecks`, `restaurantCheckAllocation`, `voidOrderItem`, `compOrderItem`, `voidOrder`, `requestManagerApproval`, `approveManagerApproval`, `syncKitchenTickets`, `updateKitchenTicketStatus`, `fulfillKitchenTicketItem`, `processPayment`, `reconcilePayment`, `capturePayment`, `getPaymentStatus`, `lookupGiftCard`, `redeemGiftCard`, `issueGiftCard`, `setGiftCardStatus`, `refundPayment`, `reconcileRefund`, `retryVerifiedRefundWebhookEvent`, `unplacedCheckoutAttempts`, `recoverCheckoutPayment`, `cancelCheckoutPaymentSession`, `restaurantBusinessDays`, `restaurantBusinessDay`, `openRestaurantBusinessDay`, `recordRestaurantCashMovement`, `closeRestaurantBusinessDay`, `recordRestaurantSettlement`, `createWaitlistGuest`, `updateWaitlistStatus`, `upsertReservation`, `updateReservationStatus`, `upsertShift`, `updateShiftStatus`, `restaurantAttendance`, `recordRestaurantAttendance`, `requestRestaurantTimeCorrection`, `approveRestaurantTimeCorrection`, `previewRestaurantTipPool`, `createTipPoolLedger`, `updateTipPoolStatus`, `adjustInventory`, `recordWaste`, `reverseWaste`, `countIngredientStock`, `transferRestaurantStock`, `transitionPurchaseOrder`, `receivePurchaseOrder`, `restaurantPurchaseEvidence`, `recordRestaurantPurchaseInvoice`, `recordRestaurantPurchaseCredit`, `restaurantIngredientLots`, `setRestaurantLotHold`, `reconcileOrderInventory`, `restaurantOperationsRecovery`, `retryRestaurantOperations`, `reviewLegacyRestaurantRecipes`, `restaurantNotifications`, `sendRestaurantNotification`, `acknowledgeRestaurantNotification`, `previewRestaurantCampaign`, `createRestaurantCampaign`, `dispatchRestaurantCampaign`, `restaurantPrivacyRequests`, `resolveRestaurantPrivacyRequest`, `ensureRestaurantOnboardingRecord`. Verify each against the inspected revision.

The current product focus is menus, POS, service floor, kitchen/KDS, inventory and purchasing, staff time and tips, waitlist and reservations, payments, refunds and daily close, and reporting. This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Restaurant source checkout, and which revision/deployment is the target?
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

Design around menus, POS, service floor, kitchen/KDS, inventory, staff, waitlist, payments, and reporting. Preserve the product's real workflow nouns and authority boundaries. Never rename Ecommerce products/orders into this vertical or borrow Ecommerce GraphQL roots without validating that they exist and are authorized here.

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
