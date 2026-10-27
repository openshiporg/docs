---
name: openfront-pharmacy-custom-storefront
description: Plan and build a custom Openfront Pharmacy storefront by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Pharmacy custom storefront

Use this skill to adapt the built-in Pharmacy storefront or create a separately deployed client. Start from this product's current source—not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Repository: https://github.com/openshiporg/openfront-pharmacy. Confirm the checkout path and revision the user wants changed.
- Built-in Pharmacy customer experience in `features/storefront`: `screens` (HomePage, StorePage, ProductPage, CartPage, CheckoutPage, OrderStatusPage, PrescriptionServicesPage, AccountOverviewPage, AccountProfilePage, CustomerOrderPage, LoginPage, ResetPasswordPage, PrivacyPage), `components` (CheckoutForm, StripeCardStep, LocationPicker, PrescriptionRequestForm, OrderStatusClient, and others), and `lib/data` (store, cart, checkout, orders, account, prescriptions, requests, user, cookies).
- Thin route entry points under `app/(storefront)/(main)/`: `/`, `/products`, `/products/[handle]`, `/cart`, `/checkout`, `/order-status`, `/prescriptions`, `/privacy`, and `/account` with `@login` (sign in, register, `/account/reset`) and `@dashboard` (overview, `/account/profile`, `/account/orders/details/[id]`) slots.
- Server contract: `features/keystone/models/**`, `features/keystone/access.ts`, `features/keystone/mutations/index.ts`, `schema.graphql`, and `docs/schema-map.md`.
- Provider boundaries: `features/integrations/payment` (stripe, paypal, manual), `app/api/payment-webhooks/[providerId]`, and the exact server actions called by the built-in client.

Explain that `features/storefront` is the behavioral reference for routes, states, GraphQL calls, cookies/tokens, and provider handoffs. It should guide what is preserved or changed.

The current product focus is a host-resolved tenant (`publicPharmacyTenant`), a location picker stored in a cookie, the OTC catalog (`publicPharmacyCatalog`, `publicPharmacyCategories`; only products with `prescriptionRequirement` `none`), a token-scoped guest cart (`createPharmacyCart`, `addPharmacyCartItem`, `updatePharmacyCartItem`, `pharmacyCart`), checkout with pickup or delivery and pay-at-pickup or Stripe card (`activePharmacyPaymentProviders`, `initiatePharmacyPaymentSession`, `submitPharmacyOrder`), order status by number and email or guest token (`lookupPharmacyOrder`, `guestPharmacyOrder`), customer accounts (`registerPharmacyCustomer`, `pharmacyCustomerAccount`, `pharmacyCustomerOrderDetails`, `updateActiveUser`), patient-portal prescriptions and refill requests (`pharmacyPatientPortal`, `requestPrescriptionRefill`), and online registration, transfer, and new-prescription requests (`submitPharmacyPrescriptionRequest`, `pharmacyCustomerPrescriptionRequests`). The storefront has no PayPal approval step. This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Is the target the public repository (https://github.com/openshiporg/openfront-pharmacy) or a fork/local checkout, and which revision/deployment is it?
2. Do they want to adapt the built-in storefront or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which customer journeys, routes, content, brand, devices, accessibility, and commerce/booking states are required?
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

Design around the location-scoped OTC catalog, cart and checkout, order lookup, customer accounts, refill requests, online prescription requests, and pharmacist-controlled handoffs. Preserve the product's real workflow nouns and authority boundaries. Never rename Ecommerce products/orders into this vertical or borrow Ecommerce GraphQL roots without validating that they exist and are authorized here.

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

Never present a source path, generated schema, HTTP 200, or attractive empty state as proof that the storefront workflow is operational.
