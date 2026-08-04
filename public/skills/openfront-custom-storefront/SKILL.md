---
name: openfront-custom-storefront
description: Discover, plan, and build a custom Openfront storefront by interviewing the user, inspecting the target product's built-in storefront and GraphQL contract, then adapting the built-in client or creating an independent client while keeping business truth in Openfront.
---

# Openfront custom storefront

Help the user adapt an Openfront product's built-in storefront or create a separately deployed customer client. Presentation, content, information architecture, and interaction can be completely custom. Product, price, availability, cart, booking, payment, order, and fulfillment authority remain with the target Openfront product.

The target product's current source, deployed GraphQL schema, and observed access behavior are authoritative. Never assume Ecommerce operations apply to Restaurant, Hotel, or another vertical.

## Scope of this skill

This is a **discovery, implementation-planning, and safety-gating skill**, not a complete implementation specification for every Openfront deployment. It is sufficient to build a verified read-only Ecommerce catalog and to plan built-in presentation changes. At canonical Ecommerce commit `6662469`, the current cart and checkout roots are not safe enough for an independently deployed full-commerce storefront. Keep those capabilities unavailable until the ownership, parent-binding, idempotency, amount, and transaction blockers documented below are repaired and tested on the target host.

A capable agent must still inspect the exact target revision. Do not advertise a complete storefront merely because catalog pages render or the canonical operations validate against a schema.

## Source orientation to explain first

Before asking implementation questions, briefly orient the user to the source:

- Repository: <https://github.com/openshiporg/openfront>
- Built-in Ecommerce storefront routes, screens, modules, data loaders, sessions, and UI composition: [`features/storefront`](https://github.com/openshiporg/openfront/tree/master/features/storefront)
- Thin storefront route entry points: [`app/(storefront)`](https://github.com/openshiporg/openfront/tree/master/app/%28storefront%29)
- GraphQL schema, models, access, and named operations used by the storefront: [`features/keystone`](https://github.com/openshiporg/openfront/tree/master/features/keystone) and [`schema.graphql`](https://github.com/openshiporg/openfront/blob/master/schema.graphql)

Explain that `features/storefront` is where the built-in customer experience and most of its data-call composition live. If the user is uncertain how a custom storefront should behave, inspect this code to understand the existing routes, states, GraphQL calls, session/cart handling, and provider handoffs before deciding what to preserve or replace.

## Then interview the user

After that orientation, ask one concise set of questions, skipping anything the user already answered:

1. Which Openfront product is this for, and where is its codebase? Ask for the repository/path and revision if they are not available in the current workspace.
2. Do they want to adapt the built-in storefront or build an independently deployed storefront?
3. What do they dislike about the built-in storefront? What should stay unchanged?
4. Which customer journeys and routes must the custom storefront support?
5. What visual direction, references, brand/content requirements, device targets, motion, and accessibility needs matter?
6. Which countries, currencies, customer/guest modes, payments, shipping/fulfillment or booking flows are required?
7. Which non-production host, GraphQL endpoint, schema export, test catalog, and test identities are available?

After the answers:

1. restate the desired changes as a short brief;
2. inspect the **specified product codebase** read-only before proposing implementation;
3. trace its built-in storefront routes, screens/modules, GraphQL call sites, schema, resolvers, access rules, cookies/sessions, media, and provider boundaries;
4. identify reusable presentation code, backend-owned behavior, missing contracts, and unsafe assumptions;
5. propose the smallest implementation plan and ask for confirmation before broad changes.

If the user wants to adapt the built-in storefront, work in that product's existing storefront routes and feature slices. If they want a separate storefront, inspect the built-in storefront as the behavioral reference and use only verified external contracts.

## Non-negotiable rules

1. **Respect the chosen boundary.** A built-in customization may use that product's intended storefront modules and server data layer, but must not move backend authority into browser code. A separate client uses the configured GraphQL endpoint and must not import Keystone models, Prisma, migrations, `features/keystone`, generated admin clients, or backend environment variables.
2. **Openfront owns commerce truth.** Prices, currency, discounts, tax, shipping, inventory, totals, payment state, order state, fulfillment, and eligibility come from server responses.
3. **Never fabricate records.** Loading and empty states must not contain fake products, prices, reviews, availability, orders, or success.
4. **Schema first.** Export or introspect the exact target schema, pin it in the client repository, generate types, and validate every checked operation in CI.
5. **Access tests are part of the contract.** GraphQL validation proves shape only. Prove anonymous, Customer A, Customer B, expired-session, wrong-cart, wrong-line, and wrong-order behavior against a disposable host.
6. **Keep credentials out of browser JavaScript.** Prefer a same-origin backend-for-frontend (BFF) with host-only `httpOnly` cookies. Never put a Keystone session, customer token, provider secret, API key, or guest order secret in `localStorage`.
7. **No arbitrary GraphQL proxy.** Browser routes call compiled, named operations with allowlisted variables. They do not submit arbitrary documents, fields, filters, or endpoint URLs.
8. **Do not retry writes blindly.** Reconcile cart, payment, and checkout after an ambiguous timeout. Retry only when the host contract documents idempotency for the same intent.
9. **Missing capability means unavailable.** Add a bounded backend projection/command or show an explicit unavailable state. Do not bypass the gap with `sudo`, raw database access, operator credentials, or broad CRUD.
10. **Treat JSON scalars as untrusted.** Generated TypeScript cannot validate runtime `JSON`; parse it with Zod, Valibot, or an equivalent boundary schema.

## Required inputs for an external client

Obtain these before building an independently deployed UI:

```dotenv
OPENFRONT_ORIGIN=https://merchant.example
OPENFRONT_GRAPHQL_ENDPOINT=https://merchant.example/api/graphql
OPENFRONT_DEFAULT_COUNTRY=us
```

Also ask for:

- a non-production host and safe test catalog;
- the exact Openfront/vertical revision;
- a schema export or permission to introspect;
- supported countries, payment providers, shipping providers, and customer-auth mode;
- CORS policy and allowed storefront origin;
- test identities supplied through a secret manager, not source or prompts;
- the requested routes, design direction, and accessibility/browser targets.

Reject production endpoint URLs that are not trusted HTTPS, contain credentials or fragments, or can be overridden by request input. Permit plain HTTP only for explicit loopback development.

## Inspect the built-in client without coupling to it

Inspect the target product's current built-in client read-only:

- routes: `app/(storefront)/**`;
- page composition: `features/storefront/screens/**`;
- customer modules: `features/storefront/modules/**`;
- GraphQL call sites: `features/storefront/lib/data/**`;
- endpoint resolution: `features/storefront/lib/getBaseUrl.ts` and `config.ts`;
- cookie/session behavior: `features/storefront/lib/data/cookies.ts`;
- custom roots: `features/keystone/mutations/index.ts` and its resolver files;
- generated contract: `schema.graphql`;
- access rules: `features/keystone/models/**` and `features/keystone/access.ts`;
- provider adapters: `features/integrations/payment/**` and `features/integrations/shipping/**`.

Use source call sites as workflow evidence only. Built-in helpers can drift from the generated schema or rely on same-origin/server privileges that an external client does not have.

### Built-in Ecommerce route and source map

Use this map before editing or reproducing a flow:

| Customer area | Thin routes | Composition and UI | Data/actions |
| --- | --- | --- | --- |
| Home and catalog | `app/(storefront)/[countryCode]/(main)/page.tsx`, `store/**`, `categories/**`, `collections/**` | `features/storefront/screens/HomePage.tsx`, `StorePage.tsx`, `modules/home/**`, `modules/store/**` | `lib/data/products*.ts`, `categories.ts`, `collections.ts`, `regions.ts`, `store.ts` |
| Product detail | `products/[handle]/page.tsx` | `screens/ProductPage.tsx`, `modules/products/**` | `lib/data/products*.ts`, price utilities |
| Cart | `cart/page.tsx` | `screens/CartPage.tsx`, `modules/cart/**` | `lib/data/cart.ts`, `cart-client.ts`, `hooks/use-cart.tsx` |
| Checkout | `(checkout)/checkout/page.tsx` and checkout layout | `screens/CheckoutPage.tsx`, `modules/checkout/**` | `lib/data/cart.ts`, `payment.ts`, `shipping.ts`, `fulfillment.ts` |
| Account and addresses | account parallel routes under `@dashboard` and `@login` | account screens, `modules/account/**` | `lib/data/user.ts`, `cookies.ts`, user/address custom roots |
| Orders and invoices | account order/invoice routes and `order/confirmed/[id]` | order/invoice screens and modules | `lib/data/orders.ts`, `business-accounts.ts`, order/invoice custom roots |

Also inspect `features/storefront/middleware.ts`, `lib/hooks/**`, and `lib/query-keys.ts` for country routing, client state, cache keys, and invalidation. Preserve the parallel account-route structure when adapting the built-in client. Do not assume every exported helper is current workflow authority: `lib/data/cart.ts` contains stale or alternate helpers, and `lib/data/orders.ts` contains placeholder transfer functions that log and return success without performing a mutation.

### Current repository verification reality

At canonical commit `6662469` the Ecommerce repository has no Jest/Vitest, Playwright, Cypress, contract-test, or meaningful application-test suite; no `test`, `typecheck`, `codegen`, `test:contract`, or `test:e2e` package scripts; and `next.config.ts` sets `typescript.ignoreBuildErrors: true`. Both `dev` and `build` apply database migrations. Before broad built-in customization, add an independent non-migrating typecheck plus focused unit, access/contract, and browser tests. Never report the existing production build alone as type or workflow proof.

## Phase 0: contract discovery

Do this before choosing components or layouts.

1. Save the target schema as `graphql/openfront.schema.graphql`.
2. Record the schema hash, host revision, endpoint origin, introspection mode, and verification date.
3. Inventory query and mutation root fields.
4. Validate anonymous catalog reads.
5. Validate customer authentication and session forwarding.
6. Run cross-customer/cart/order negative probes.
7. Produce a capability matrix for every intended route.

A minimal root probe is:

```graphql
query OpenfrontCapabilityProbe {
  __schema {
    queryType { fields { name } }
    mutationType { fields { name } }
  }
}
```

If production introspection is disabled, obtain an exported schema from the host. Do not infer a contract from screenshots or docs for another revision.

Use this matrix:

| Capability | Operation | Actor | Cache class | Runtime validation | Status/evidence |
| --- | --- | --- | --- | --- | --- |
| Store identity | target field | anonymous | public | typed | verified/blocked |
| Region/currency | target field | anonymous | public | typed | verified/blocked |
| Product list/detail | target field | anonymous | public | typed | verified/blocked |
| Active cart | target field | guest/customer | private | JSON/typed | verified/blocked |
| Customer account | target field | customer | private | typed | verified/blocked |
| Checkout/order | target command | guest/customer | private | JSON/typed | verified/blocked |

Every planned page must map to a verified row. “The operation exists” is not evidence of ownership, publication filtering, transactional behavior, or provider readiness.

## Required client structure

A finished client must contain equivalents of:

```text
.env.example
README.md
graphql/openfront.schema.graphql
codegen.ts
src/graphql/operations/*.graphql
src/graphql/generated/*
src/openfront/env.*
src/openfront/transport.*
src/openfront/errors.*
src/openfront/session.*
src/openfront/cart-session.*
src/features/<domain>/*
app|routes/*
contract-tests/*
e2e/*
```

Routes stay thin. Feature slices own presentation-specific orchestration. Openfront owns business invariants.

Provide scripts equivalent to:

```text
schema:check
codegen
typecheck
test
test:contract
test:e2e
build
```

## Transport and code generation

Use named operations and generated result/variable types. Configure strict scalar handling so unknown custom scalars do not silently become `any`.

A typical GraphQL Code Generator configuration:

```ts
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./graphql/openfront.schema.graphql",
  documents: ["src/**/*.graphql"],
  ignoreNoDocuments: false,
  generates: {
    "./src/graphql/generated/": {
      preset: "client",
      presetConfig: { fragmentMasking: false },
      config: {
        strictScalars: true,
        defaultScalarType: "unknown",
        scalars: { DateTime: "string", JSON: "unknown", Upload: "File" },
      },
    },
  },
};

export default config;
```

The transport must:

- enforce an allowlisted endpoint and a timeout;
- send `operationName`, document, and variables;
- inspect GraphQL `errors` even when HTTP is 200;
- fail mutations closed on partial errors;
- distinguish timeout, network, unauthenticated, denied, not-found, validation, provider, and unknown-outcome failures;
- accept credentials request-locally, never through a module-global mutable client;
- redact authorization, cookies, passwords, addresses, cart/order secrets, and provider payloads from logs;
- disable automatic mutation retries.

## Authentication and BFF boundary

For a browser storefront, expose task routes rather than a generic proxy:

```text
POST /api/openfront/session/login
POST /api/openfront/session/logout
GET  /api/openfront/session
GET  /api/openfront/catalog
POST /api/openfront/cart/lines
PATCH /api/openfront/cart/lines/:lineId
POST /api/openfront/checkout/complete
```

Each state-changing route must:

1. verify same-origin/CSRF policy;
2. cap and validate the body;
3. read the customer/cart binding from a host-only `httpOnly` cookie;
4. execute one compiled operation;
5. map errors to stable, non-sensitive local codes;
6. return only allowlisted fields;
7. log safe operation/correlation metadata, never inputs or credentials.

On login, store the returned session token server-side or in a secure host-only cookie and do not return it to browser JavaScript. On logout, expire the local cookie even when host logout fails.

A cart ID and guest order secret are credentials. Keep cart bindings server-side when possible; never put either value in analytics, public cache tags, or durable URLs. If an emailed link must carry a capability, exchange it server-side and redirect to a clean URL.

## Current Ecommerce blocker register

At canonical commit `6662469`, treat these roots as implementation evidence—not approved external contracts:

| Root/path | Current blocker |
| --- | --- |
| `activeCart` / `mutations/activeCart.ts` | Reads an arbitrary cart by caller-supplied ID under `sudo()` |
| `updateActiveCart` / `mutations/updateActiveCart.ts` | Writes an arbitrary cart with broad `CartUpdateInput`, including sensitive relationships |
| `updateActiveCartLineItem` | Does not prove the supplied line belongs to the supplied cart |
| `activeCartShippingOptions` | Reads cart state by arbitrary ID |
| `addActiveCartShippingMethod` | Does not prove ownership or fully validate region, return/admin status, and eligibility |
| `createActiveCartPaymentSessions` and `initiatePaymentSession` | Do not bind the cart to the caller; provider state is reached under `sudo()` |
| `completeActiveCart` | Lacks a complete caller-binding, durable idempotency, amount/currency binding, and atomic order/payment/inventory boundary |
| Checkout address update in `features/storefront/lib/data/cart.ts` | Can connect broad user/address/region relationships through the unsafe cart update root |

The current completion implementation can select the first payment session rather than necessarily the completed session, and order construction spans multiple writes. A safe external checkout needs bounded server roots that bind actor/cart capability, constrain fields and related records, check line parents and shipping eligibility, preserve one idempotency intent, verify provider amount/currency, transact or durably reconcile effects, and return a runtime-validated projection.

Request purpose-built equivalents of `storefrontCart`, `storefrontCreateCart`, `storefrontAddCartLine`, `storefrontSetCartLineQuantity`, `storefrontSetCheckoutAddresses`, `storefrontSelectShippingOption`, `storefrontInitiatePayment`, `storefrontCompleteCheckout`, and `storefrontCheckoutStatus` rather than exposing broad CRUD.

## Canonical Ecommerce snapshot: schema-compatible examples

The examples below validate against canonical Ecommerce `schema.graphql` at commit `6662469`. They are **orientation only for that Ecommerce contract**, not a promise that another deployment has the same schema or safe access policy. For Restaurant, Hotel, or another product, derive every operation from that product's current schema, resolvers, access rules, and built-in call sites; never reuse Ecommerce roots by analogy. Validate all operations against the target schema and run negative access tests before use.

### Bootstrap and catalog

```graphql
query ExternalStorefrontBootstrap($countryCode: String!, $limit: Int!, $offset: Int!) {
  stores(take: 1) {
    id
    name
    defaultCurrencyCode
    homepageTitle
    homepageDescription
    logoIcon
    logoColor
  }
  region: activeCartRegion(countryCode: $countryCode) {
    id
    name
    taxRate
    currency { id code symbol noDivisionCurrency }
    countries { id name displayName iso2 }
  }
  catalog: getProductsSortedByPrice(
    countryCode: $countryCode
    limit: $limit
    offset: $offset
    priceOrder: "asc"
  ) {
    count
    products {
      id
      title
      handle
      thumbnail
      productVariants {
        id
        title
        manageInventory
        allowBackorder
        inventoryQuantity
        prices {
          id
          amount
          currency { id code symbol noDivisionCurrency }
          calculatedPrice { calculatedAmount originalAmount currencyCode }
        }
      }
    }
  }
}
```

The canonical snapshot exposes generated `stores` and `product` roots rather than purpose-built `publicStore` or `publicProductDetail` roots. Anonymous Product access filters non-managers to `status: published`, but an external release must prove that behavior on the deployed host. Request bounded public projections when the generated selection exposes too much or does not encode region/publication semantics.

### Product detail

```graphql
query ExternalProduct($handle: String!, $regionId: ID!) {
  product(where: { handle: $handle }) {
    id
    title
    subtitle
    handle
    status
    thumbnail
    description { document }
    productImages(orderBy: [{ order: asc }]) {
      id
      imagePath
      altText
      order
      image { url width height }
    }
    productOptions {
      id
      title
      productOptionValues { id value }
    }
    productVariants {
      id
      title
      sku
      inventoryQuantity
      manageInventory
      allowBackorder
      productOptionValues { id value productOption { id title } }
      prices(where: { region: { id: { equals: $regionId } } }) {
        id
        amount
        currency { id code symbol noDivisionCurrency }
        calculatedPrice { calculatedAmount originalAmount currencyCode }
      }
    }
  }
}
```

Render `null` as not-found. Never create a fallback product. Treat document JSON as structured data, not trusted HTML. Resolve relative media only against the configured Openfront origin; allowlist any absolute CDN origin.

### Cart shape and commands

In the canonical snapshot, `activeCart`, `getCustomerOrders`, `getCustomerOrder`, and `completeActiveCart` return the GraphQL `JSON` scalar. They **must not have selection sets** and require runtime schemas.

```graphql
query ExternalCart($cartId: ID!) {
  activeCart(cartId: $cartId)
}

mutation ExternalCreateCart($regionId: ID!) {
  createCart(data: { region: { connect: { id: $regionId } } }) {
    id
    region { id }
  }
}

mutation ExternalAddCartLine($cartId: ID!, $variantId: ID!, $quantity: Int!) {
  updateActiveCart(
    cartId: $cartId
    data: {
      lineItems: {
        create: [{ productVariant: { connect: { id: $variantId } }, quantity: $quantity }]
      }
    }
  ) { id }
}

mutation ExternalSetCartLineQuantity($cartId: ID!, $lineId: ID!, $quantity: Int!) {
  updateActiveCartLineItem(cartId: $cartId, lineId: $lineId, quantity: $quantity) { id }
}
```

**Canonical security hard stop:** at commit `6662469`, `activeCart`, `updateActiveCart`, and `updateActiveCartLineItem` use `sudo()` and do not bind the cart/line to the caller. Do not ship an external cart against that implementation. The host must first add ownership/capability checks, parent-check line IDs, narrow writable input, and cross-cart tests. Schema compatibility is not approval.

### Shipping, payment, and completion

The built-in flow currently traces through this sequence; do not skip a step when auditing a target revision:

1. resolve country, region, currency, and catalog;
2. create or recover the caller-bound cart;
3. add/update/remove lines and refetch server totals;
4. bind validated customer/guest identity and checkout addresses;
5. query `activeCartShippingOptions`, then select one eligible option;
6. query `activeCartPaymentProviders`;
7. call `createActiveCartPaymentSessions` to create missing provider sessions; it does not select one;
8. either select an existing session with `setActiveCartPaymentSession`, or call `initiatePaymentSession`, which can create and select the provider-backed session;
9. expose only provider-approved browser fields and perform provider-specific browser confirmation where required;
10. call an ownership-checked, idempotent completion command;
11. reconcile an ambiguous completion from authoritative checkout status;
12. load the resulting order through an owner- or capability-checked order root.

```graphql
query ExternalCartShippingOptions($cartId: ID!) {
  activeCartShippingOptions(cartId: $cartId) { id name amount priceType }
}

mutation ExternalChooseShipping($cartId: ID!, $shippingMethodId: ID!) {
  addActiveCartShippingMethod(cartId: $cartId, shippingMethodId: $shippingMethodId) { id }
}

query ExternalPaymentProviders($regionId: ID!) {
  activeCartPaymentProviders(regionId: $regionId) {
    id
    name
    code
    isInstalled
  }
}

mutation ExternalCreatePaymentSessions($cartId: ID!) {
  createActiveCartPaymentSessions(cartId: $cartId) {
    id
    paymentCollection {
      id
      paymentSessions {
        id
        amount
        isSelected
        isInitiated
        paymentProvider { id code isInstalled }
      }
    }
  }
}

mutation ExternalInitiatePayment($cartId: ID!, $paymentProviderId: String!) {
  initiatePaymentSession(cartId: $cartId, paymentProviderId: $paymentProviderId) {
    id
    data
    amount
    isInitiated
  }
}

mutation ExternalCompleteCheckout($cartId: ID!, $paymentSessionId: ID) {
  completeActiveCart(cartId: $cartId, paymentSessionId: $paymentSessionId)
}
```

Payment-session `data` is provider JSON. Do not return it wholesale to the browser. Map only provider-approved publishable fields. The browser never decides capture success. Completion must be one server-authorized intent with ownership, amount/currency verification, inventory safety, idempotency, and reconciliation.

**Canonical security hard stop:** the same snapshot's completion path loads arbitrary carts through `sudo()` and lacks a complete external ownership/idempotency boundary. Require a repaired host command and negative/duplicate tests before enabling checkout.

### Customer session and orders

```graphql
mutation ExternalCustomerSignIn($email: String!, $password: String!) {
  authenticateUserWithPassword(email: $email, password: $password) {
    ... on UserAuthenticationWithPasswordSuccess {
      sessionToken
      item { id email name activeCartId }
    }
    ... on UserAuthenticationWithPasswordFailure { message }
  }
}

query ExternalCurrentCustomer {
  authenticatedItem {
    ... on User {
      id
      email
      name
      firstName
      lastName
      phone
      activeCartId
      addresses {
        id firstName lastName address1 address2 city province postalCode phone
        country { id iso2 name }
      }
    }
  }
}

query ExternalCustomerOrders($limit: Int, $offset: Int) {
  getCustomerOrders(limit: $limit, offset: $offset)
}

query ExternalCustomerOrder($orderId: ID!, $secretKey: String) {
  getCustomerOrder(orderId: $orderId, secretKey: $secretKey)
}
```

Keep login, registration, password reset, and order lookups behind rate-limited BFF routes. Return generic auth/reset errors where enumeration is possible. Do not expose broad `users` or `orders` to customer sessions.

Before implementing accounts, inventory and verify the exact current roots and call sites for `createUser`, `authenticateUserWithPassword`, `endSession`, `updateActiveUser`, `updateActiveUserPassword`, `createActiveUserAddress`, `updateActiveUserAddress`, `deleteActiveUserAddress`, `getCustomerOrders`, and `getCustomerOrder`. Password reset is unavailable unless a target-revision contract and delivery path are verified.

The built-in guest path is not a clean anonymous capability contract: current source can create a password-backed `User` with a random password, sign it in, and associate addresses/cart with it. Treat that as behavioral evidence only. An external guest flow needs an explicit caller/cart/order capability model and must not silently manufacture customer accounts by analogy.

### Runtime JSON contracts

`activeCart`, `getCustomerOrders`, `getCustomerOrder`, and `completeActiveCart` return `JSON` in the canonical schema. Build validators from the target resolver's exact return selection—not from UI TypeScript assumptions. At minimum, model discriminated runtime schemas for cart identity/region, lines and quantities, server totals, addresses, shipping selection, payment collection/session status, checkout step, order identity/status/totals, and completion success/failure. Reject unknown critical status values and fail closed when required IDs, currency, amount, ownership evidence, or provider state are absent.

## Route and state contract

Implement only verified capabilities, but account for these common routes:

| Route | Required states |
| --- | --- |
| `/` | configured redirect, missing configuration |
| `/[countryCode]` | loading, empty catalog, unsupported country, outage, success |
| `/[countryCode]/store` | filters, pagination, empty, partial refetch failure, success |
| `/[countryCode]/products/[handle]` | loading, not-found/unpublished, unavailable, success |
| `/[countryCode]/cart` | missing token, invalid/expired token, empty, mutation error, success |
| `/[countryCode]/checkout` | signed-out/guest decision, address, shipping, payment, review, provider failure, unknown outcome |
| `/[countryCode]/order/confirmed/[id]` | denied, wrong/expired secret, pending, complete, fulfillment state |
| `/[countryCode]/account/**` | signed-out, profile, addresses, orders, no data, denied |

A custom design can change information architecture and visual language, but it cannot erase error, empty, denied, not-found, pending, or reconciliation states.

## Cache rules

- Public identity/catalog data may use bounded revalidation.
- Customer, cart, address, payment, checkout, and order data is private/no-store unless a reviewed session-keyed cache is used.
- Key private cache entries by host, schema version, actor/session, cart, operation, and variables.
- Clear customer/cart caches on login, logout, region change, ownership failure, and checkout completion.
- Never cache a stronger credential's response for a weaker actor.

## Implementation sequence

### 1. Read-only storefront

- Validate environment and schema.
- Build typed transport and runtime scalar parsing.
- Implement identity, supported country/region, catalog, product detail, media, empty/error/not-found states.
- Add contract tests for unpublished and region-mismatched products.

### 2. Customer session

- Add BFF login/logout and secure cookies.
- Add current-customer/account states.
- Prove Customer A cannot read Customer B data by changing IDs.

### 3. Cart

- Proceed only after the host has an ownership-checked cart projection and commands.
- Bind one opaque cart capability to the BFF session/cookie and country.
- Refetch server totals after every write; do not calculate authoritative totals locally.

### 4. Checkout

- Proceed only after bounded address, shipping, payment-session, completion, and order commands pass negative tests.
- Disable duplicate submit, preserve a single intent/idempotency key, and reconcile timeout by reading server state.
- Verify provider callbacks at the Openfront host, not in the storefront browser.

### 5. Production proof

- Run schema validation, codegen, typecheck, unit, contract, browser, and build gates.
- Verify responsive and keyboard behavior, metadata, image failures, console/network errors, CSP, CORS/BFF behavior, redaction, health, alerts, and rollback.

## Minimum contract tests

- Anonymous can read only intended published catalog fields.
- Draft/unpublished products are not disclosed.
- Unsupported countries do not receive fabricated USD/default pricing.
- Customer A cannot read or mutate Customer B's cart, line, address, order, or invoice.
- A line ID from another cart is rejected even with a valid current cart ID.
- Missing, malformed, expired, completed, and stolen cart capabilities fail closed.
- Quantities are bounded and server prices/totals change authoritatively.
- Payment initiation exposes only allowlisted browser fields.
- Duplicate/timeout checkout produces at most one order, payment effect, and inventory effect.
- Wrong/missing guest order secret is indistinguishable from an inaccessible order.
- No token, cart ID, order secret, address, or provider payload appears in logs, URL history, analytics, HTML, screenshots, or public caches.

Mutating tests run only against an explicitly disposable host with unique fixtures and opt-in environment flags.

## Acceptance gates

Do not call the storefront ready until:

1. The target schema is pinned and every checked document validates against it.
2. Every route has a capability row and explicit unavailable behavior for gaps.
3. Runtime validators cover every `JSON` or unknown-scalar boundary.
4. Cart and checkout ownership/idempotency blockers are repaired on the target host or those flows are disabled.
5. Customer/cart/order cross-owner negative tests pass.
6. No browser-visible operator/provider/server credential exists.
7. Prices, totals, availability, status, payment, and fulfillment are server-derived.
8. BFF origin/CSRF/body/rate-limit/redaction policies are tested.
9. Empty, not-found, denied, provider-down, schema-drift, timeout, and unknown-outcome states are real and accessible.
10. Typecheck, tests, contract tests, browser tests, and production build pass against the recorded schema/host.
11. Deployment, readiness, observability, incident, and rollback notes are complete.

## Final handoff

Report:

- host origin and GraphQL path, without credentials;
- schema hash/revision/date;
- routes and capability matrix;
- auth/cart cookie and BFF design;
- implemented named operations;
- runtime scalar validators;
- test commands and negative-test evidence;
- explicit backend blockers and safe UI behavior;
- deployment, cache, observability, and rollback notes.

Never describe a schema-valid example, HTTP 200, empty-state render, or built-in source file as production proof.
