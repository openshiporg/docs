---
name: openfront-custom-dashboard
description: Discover, plan, and build a custom Openfront operator dashboard by interviewing the user, inspecting the target product's built-in dashboard and GraphQL contract, then adapting the built-in client or creating a separately deployed client without moving server-owned authority into the UI.
---

# Openfront custom operator dashboard

Help the user adapt an Openfront product's built-in operator dashboard or create a separately deployed operator client. The interface and workflows can be fully custom. Authentication, authorization, record scope, business invariants, provider calls, and audit evidence remain server responsibilities.

The target product's current source, deployed GraphQL schema, and observed access behavior are authoritative. Never assume Ecommerce operations apply to Restaurant or another vertical.

## Scope of this skill

This is a **discovery, implementation-planning, and safety-gating skill**, not a complete implementation specification for every Openfront deployment. It is sufficient to locate and adapt bounded built-in presentation and to start a verified read-only operator client. At canonical Ecommerce commit `6662469`, it is not sufficient to expose a complete independently deployed operational dashboard without adding the bounded context, lifecycle, provider, and multi-record commands documented below.

Do not advertise a full operator dashboard merely because generated CRUD validates, a table renders, or a host-owner credential can reach global data.

## Source orientation to explain first

Before asking implementation questions, briefly orient the user to the source:

- Repository: <https://github.com/openshiporg/openfront>
- Generic Keystone dashboard shell, list/item screens, authentication helpers, and admin client: [`features/dashboard`](https://github.com/openshiporg/openfront/tree/master/features/dashboard)
- Ecommerce-specific operator navigation, screens, server actions, projections, and workflows mounted into that dashboard: [`features/platform`](https://github.com/openshiporg/openfront/tree/master/features/platform)
- Thin route entry points that mount the platform slices: [`app/dashboard`](https://github.com/openshiporg/openfront/tree/master/app/dashboard)
- GraphQL schema, models, access, and named operations: [`features/keystone`](https://github.com/openshiporg/openfront/tree/master/features/keystone) and [`schema.graphql`](https://github.com/openshiporg/openfront/blob/master/schema.graphql)

Explain that `features/dashboard` is the reusable Keystone administration layer, while `features/platform` contains the Ecommerce-specific operator experience. If the user is concerned about how a custom dashboard should behave, these directories show the current UI composition and the server operations it relies on. They are reference source, not permission to copy private server code into an external client.

## Then interview the user

After that orientation, ask one concise set of questions, skipping anything the user already answered:

1. Which Openfront product is this for, and where is its codebase? Ask for the repository/path and revision if they are not available in the current workspace.
2. Do they want to change the built-in dashboard or build an independently deployed dashboard?
3. What do they dislike about the built-in dashboard? What must stay unchanged?
4. Which operator jobs, screens, and actions must the custom dashboard support?
5. Who will use it, and what roles, tenant/store scope, or approval boundaries apply?
6. What visual direction, reference products, responsive targets, accessibility needs, and deployment constraints matter?
7. Which non-production host, GraphQL endpoint, schema export, and test identities are available?

After the answers:

1. restate the requested changes as a short brief;
2. inspect the **specified product codebase** read-only before proposing implementation;
3. compare the request with its built-in routes, feature slices, GraphQL call sites, schema, resolvers, access rules, authentication, and provider boundaries;
4. identify what can be presentation-only, what needs a new server contract, and what is unsafe or absent;
5. propose the smallest implementation plan and ask for confirmation before broad changes.

If the user wants to adapt the built-in dashboard, work in that product's existing route and feature-slice conventions. If they want a separate dashboard, inspect the built-in implementation as the behavioral reference but connect through verified server contracts rather than copying private server code.

## Non-negotiable rules

1. **Respect the chosen boundary.** A built-in customization may use that product's existing feature modules and server actions through their intended boundaries. A separate app uses the hosted API only and must not import Keystone context, Prisma, models, migrations, dashboard server actions, `context.sudo()`, database clients, or backend secrets.
2. **Keep operator credentials server-side.** The browser receives an opaque local session cookie, never an Openfront session token, API key, OAuth access/refresh token, client secret, provider credential, or lifecycle signing secret.
3. **Permission and data scope are separate.** A role/scope can allow an operation while still failing to constrain store, organization, or tenant data. Require a server-owned scope root; a client `where` filter is not authorization.
4. **Prefer bounded projections and commands.** Explicit generated CRUD can support a proven low-risk single-record task. Payments, refunds, fulfillment, inventory, order lifecycle, returns, claims, credentials, staff, apps, and multi-record changes require named backend commands.
5. **Never spread form data into generated inputs.** Map an allowlist of fields. Do not let browser input choose GraphQL fields, relationships, status authority, tenant IDs, provider IDs without validation, or arbitrary URLs.
6. **No arbitrary GraphQL proxy.** Browser routes invoke compiled named operations. Do not accept raw GraphQL, root names, selected fields, filters, endpoint URLs, or credentials from the browser.
7. **Schema first.** Pin the exact target schema, generate types, validate every document in CI, and fail readiness when required capabilities change.
8. **Prove access negatively.** Test anonymous, customer, read-only operator, write operator, owner, revoked credential, and wrong-record behavior. For multi-tenant hosts, test wrong tenant, revoked membership, and suspended tenant.
9. **No fabricated operations data.** Never invent rows, totals, counts, statuses, audit events, provider success, or placeholder uploads to complete a screen.
10. **No blind write retries.** Use documented idempotency and conflict contracts. Reconcile timeouts before another payment, label, fulfillment, refund, or lifecycle action.
11. **JSON is untrusted.** Runtime-validate custom scalars, provider payloads, metadata, reports, and persisted integration responses.
12. **Stop at missing backend authority.** If the host has only an unsafe multi-write sequence or broad global CRUD, create a backend contract request and render the feature unavailable.

## Required inputs

Obtain these before UI implementation:

```dotenv
OPENFRONT_ORIGIN=https://merchant.example
OPENFRONT_GRAPHQL_ENDPOINT=https://merchant.example/api/graphql
OPENFRONT_OPERATOR_AUTH=first-party-session|api-key|oauth
```

Also require:

- a non-production Openfront host;
- exact host/vertical revision and schema export or permitted introspection;
- operator identity model and role/permission vocabulary;
- store/organization/tenant model, if any;
- least-privilege test credentials through a secret manager;
- required screens and write workflows;
- provider, upload, webhook/lifecycle, and reporting requirements;
- browser/accessibility targets and deployment origin.

Reject endpoint URLs that are not trusted HTTPS, contain credentials/fragments, or come from request input. Permit plain HTTP only for explicit loopback development.

## Choose the mode

```text
Do you control and deploy the Openfront repository?
├─ yes, UI-only change
│  -> Prefer a built-in feature slice and thin app/dashboard route.
├─ yes, new business invariant
│  -> Add a bounded Keystone projection/command first, then consume it.
└─ no, or independent deployment required
   -> Build an external BFF app against the hosted GraphQL contract.
```

For a built-in implementation, keep routes under `app/dashboard/**` thin and put business UI/actions in the target product's `features/platform/<domain>/**`. For an external implementation, use the BFF and contract rules below.

## Inspect the built-in dashboard without coupling to it

When canonical source is available, inspect it read-only:

- route wrappers: `app/dashboard/(admin)/**`;
- shell/auth layouts: `app/dashboard/**/layout.tsx` and auth routes;
- shared dashboard client: `features/dashboard/lib/keystoneClient.ts`;
- session actions/cookies: `features/dashboard/actions/auth.ts` and `features/dashboard/lib/cookies.ts`;
- generic list/item/create machinery: `features/dashboard/screens/**`, actions, and hooks;
- task-oriented slices: `features/platform/**`;
- navigation: `features/platform/lib/navigation.ts`;
- custom GraphQL roots: `features/keystone/mutations/index.ts` and resolver files;
- model access: `features/keystone/models/**` and `features/keystone/access.ts`;
- auth/API key/OAuth code: `features/keystone/index.ts`, `models/ApiKey.ts`, `models/OAuthApp.ts`, `models/OAuthToken.ts`, and `app/api/oauth/**`;
- generated contract: `schema.graphql`.

Use built-in actions as workflow evidence only. They can rely on same-origin cookies, dynamic admin metadata, or source assumptions that are not portable.

### Built-in Ecommerce dashboard map and conventions

Read these before adding or reproducing a platform slice:

- `features/platform/BUILDER.md` and `features/platform/PLATFORM.md` for the repository's slice and route conventions;
- `features/platform/orders/INTEGRATION_TEST.md` for intended order verification context, while confirming whether any executable test implements it;
- `features/dashboard/screens/**` for generic list/item/create behavior;
- `features/dashboard/actions/**`, `hooks/useQueryFactory.ts`, and `lib/queryKeys.ts` for metadata, query, response, and cache conventions;
- `features/platform/lib/navigation.ts` for product navigation and visibility;
- `features/platform/<domain>/**` for task-oriented screens and actions.

Use generic dashboard screens for ordinary Keystone list/item administration only after access and field exposure are proven. Use a task-oriented `features/platform/<domain>` slice for business workflows, multi-record changes, provider calls, special states, or purpose-built projections. Keep `app/dashboard/(admin)/platform/**` wrappers thin. Treat dynamic selected-field strings, broad `Record<string, unknown>` writes, placeholder success, and multi-step server actions as source behavior to replace—not patterns to copy automatically.

### Current repository verification reality

At canonical commit `6662469` the Ecommerce repository has no Jest/Vitest, Playwright, Cypress, contract-test, or meaningful application-test suite; no `test`, `typecheck`, `codegen`, `test:contract`, or `test:e2e` package scripts; and `next.config.ts` sets `typescript.ignoreBuildErrors: true`. Both `dev` and `build` apply database migrations. Before broad built-in customization, add an independent non-migrating typecheck plus focused unit, permission/access, contract, and browser tests. Never report the existing production build alone as type or workflow proof.

## Phase 0: schema, identity, and scope discovery

Before building a shell:

1. Save `graphql/openfront.schema.graphql`.
2. Record schema hash, host revision, endpoint, auth mode, and verification date.
3. Inventory query/mutation roots and sensitive fields.
4. Authenticate with the weakest intended credential.
5. query the operator context and explicit permissions.
6. identify the server-owned store/organization/tenant root—or record that the host is single-instance/global.
7. execute read/write/denied probes per domain.
8. produce screen and credential matrices.

Minimal root probe:

```graphql
query OpenfrontOperatorCapabilityProbe {
  __schema {
    queryType { fields { name } }
    mutationType { fields { name } }
  }
}
```

If production introspection is disabled, obtain an exported schema. Never develop from a schema belonging to another Openfront vertical or revision.

### Screen matrix

| Screen | Read projection | Command | Server scope root | Permission/scope | Status/evidence |
| --- | --- | --- | --- | --- | --- |
| Products | target operation | status/update command | store/host | product read/write | verified/blocked |
| Orders | target operation | fulfillment/cancel command | store/host | order read/write | verified/blocked |
| Users | bounded PII projection | bounded staff/customer command | organization/host | user read/write | verified/blocked |

### Credential matrix

| Credential | Stored where | Sent where | Browser visibility | Rotation/revocation |
| --- | --- | --- | --- | --- |
| Openfront session | encrypted server store or secure host-only cookie | GraphQL host only | never | logout/expiry |
| API key | secret manager | GraphQL host only | never | owner rotation/revoke |
| OAuth tokens | encrypted server store | host token/API endpoints | never | refresh/revoke policy |

Every page, worker, and webhook consumer must map to these matrices.

### Canonical Ecommerce access defects to record

At commit `6662469`, explicitly verify and plan around these defects rather than relying on role labels:

| Area | Current concern |
| --- | --- |
| Order rule | `rules.canManageOrders` in `features/keystone/access.ts` checks the product-management permission rather than the order-management permission |
| Read versus manage | Several order models require manage-order permission for query access, so nominal read-order capability may fail |
| Data scope | Roles/scopes are host-global booleans; there is no organization/membership/store ownership graph |
| API key/OAuth context | Credential sessions carry scopes but do not provide the same `User.role` data as a first-party user session |
| Custom roots | Some resolvers use `context.sudo()` without an explicit bounded permission and record-scope check |
| UI hiding | Navigation and field-mode hiding are not API authorization or redaction |

Require target-revision probes for every intended credential/root/field. A client-side filter or hidden menu cannot repair these defects.

## Required external-app structure

A finished dashboard contains equivalents of:

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
src/openfront/auth/*
src/openfront/scope/*
src/features/<domain>/*
app|routes/*
contract-tests/*
e2e/*
```

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

Use strict custom scalar handling and runtime validation:

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

## Authentication decision

### First-party session BFF

Use this for a custom dashboard controlled by the same operator/host owner when the host supports password sessions.

1. Accept credentials only at the external server boundary over HTTPS.
2. Rate-limit and validate the request.
3. Call `authenticateUserWithPassword` server-to-server.
4. Store the returned token in an encrypted server store or host-only `httpOnly`, `Secure`, intentional-`SameSite` cookie.
5. Forward it request-locally to Openfront.
6. Load operator context before domain data.
7. On logout, call `endSession` and always clear local state.

Do not use first-party password collection for a third-party app.

### API key

Use only a host-owner-provisioned, least-privilege key for one approved server purpose. Inject it through a secret manager and never return it to the browser.

Record owner, purpose, exact scopes, host/store scope, expiry, IP/proxy assumptions, rotation date, revocation path, and last-use monitoring.

**Canonical hard stop:** at Openfront commit `6662469`, API-key creation validates scope presence but does not prove requested scopes are a subset of the issuer's authority or bind the key to a tenant. Authentication scans active keys and performs bcrypt comparisons; creation generates clear key material in browser code; forwarded-IP restrictions lack a documented trusted-proxy boundary; and API-key sessions do not expose a dedicated credential-context root. Do not expose delegated API-key issuance. A trusted full host owner may provision a narrowly scoped server key only after live access probes.

### OAuth

Use OAuth only after the target host passes a security review for actor identity, consent, scope intersection, token binding, refresh rotation, revocation, and tenant enforcement.

**Canonical hard stop:** do not use the OAuth implementation from commit `6662469` for an external operator dashboard. Its authorization flow is not bound to an authenticated consenting operator, generated grants can lack a user, client secrets/tokens are stored in broadly modeled fields, and refresh handling lacks the required confidential-client and rotation guarantees. Treat OAuth as unavailable until the host repairs it and passes customer/non-operator, over-scope, replay, refresh, revoked-user, and wrong-tenant tests.

## BFF and transport contract

Expose task routes such as:

```text
POST /api/openfront/session/login
POST /api/openfront/session/logout
GET  /api/openfront/operator-context
GET  /api/openfront/products
PATCH /api/openfront/products/:id/status
GET  /api/openfront/orders
POST /api/openfront/orders/:id/fulfill
```

Never expose `/api/graphql-proxy` accepting arbitrary browser documents.

Every BFF request must:

- validate origin/CSRF policy, content type, body size, route params, and input schema;
- load a server-only request-local credential;
- call exactly one compiled operation or one documented idempotent command;
- derive/validate actor and data scope server-side;
- return allowlisted output and stable safe errors;
- redact authorization, cookies, PII, secrets, provider JSON, and mutation inputs from telemetry;
- disable automatic mutation retry.

The GraphQL transport must inspect `errors` on HTTP 200, fail writes closed on partial data, apply a timeout, attach safe correlation metadata, and distinguish unauthenticated, denied, not-found, validation, conflict, provider-unavailable, timeout, and unknown-outcome states.

## Canonical Ecommerce snapshot: schema-compatible examples

The examples below validate against canonical Ecommerce `schema.graphql` at commit `6662469`. They prove syntax only. Use them only for that Ecommerce contract. For Restaurant or any other product, derive operations from that product's current schema, resolvers, access rules, and built-in call sites; never rename or reuse these operations by analogy. Validate every operation against the target schema and run least-privilege access tests.

### Operator context

The current schema-valid `authenticatedItem.role` query below is a **first-party user-session probe only**. It is not a portable API-key/OAuth capability contract: scope-backed sessions may not populate role data, and `Role` query access itself requires role permissions that product/order credentials may not have.

```graphql
query ExternalOperatorContext {
  authenticatedItem {
    ... on User {
      id
      name
      email
      role {
        id
        name
        canAccessDashboard
        canReadProducts
        canManageProducts
        canReadOrders
        canManageOrders
        canReadFulfillments
        canManageFulfillments
        canReadUsers
        canManageUsers
        canReadApps
        canManageApps
        canManageKeys
      }
    }
  }
}
```

Do not render first-party domain data until the applicable identity/capability probe succeeds. A role is not a tenant. The canonical snapshot has no organization/membership graph, so treat it as a single-host/global-admin system unless the target vertical adds and enforces a scope model.

For a separately deployed dashboard, require a purpose-built projection equivalent to:

```text
query ExternalOperatorCapabilityContext {
  operatorContext {
    actor
    credentialKind
    permissions
    scopes
    dataScope
    expiresAt
    capabilities
  }
}
```

The field above is a **requested backend contract**, not a root present in the canonical schema. It must derive actor, credential kind, effective permissions/scopes, server-owned data scope, expiry, and task capabilities without exposing role internals.

### Product list and one low-risk write

```graphql
query ExternalOperatorProducts(
  $where: ProductWhereInput!
  $take: Int!
  $skip: Int!
  $orderBy: [ProductOrderByInput!]
) {
  products(where: $where, take: $take, skip: $skip, orderBy: $orderBy) {
    id
    title
    handle
    subtitle
    status
    thumbnail
    updatedAt
    productVariants {
      id
      title
      sku
      inventoryQuantity
      manageInventory
      allowBackorder
    }
  }
  productsCount(where: $where)
}

mutation ExternalSetProductStatus($id: ID!, $status: ProductStatusType) {
  updateProduct(where: { id: $id }, data: { status: $status }) {
    id
    title
    status
    updatedAt
  }
}
```

Use bounded page sizes and allowlisted filters/sorts. Explicitly map `{ status }`; never send an arbitrary `ProductUpdateInput` object from the browser. The generated mutation has no expected-version argument. If lost updates or transition rules matter, add a backend compare-and-swap command with `expectedUpdatedAt` and an idempotency key.

Product creation spans product, variants, options, prices, media, inventory, and relationships. Do not reproduce that as a browser `Promise.all`. Require a host command when atomicity matters.

### Order list and detail

```graphql
query ExternalOperatorOrders(
  $where: OrderWhereInput!
  $take: Int!
  $skip: Int!
  $orderBy: [OrderOrderByInput!]
) {
  orders(where: $where, take: $take, skip: $skip, orderBy: $orderBy) {
    id
    displayId
    status
    email
    total
    fulfillmentStatus
    createdAt
    updatedAt
    lineItems {
      id title quantity sku thumbnail variantTitle formattedUnitPrice formattedTotal
    }
  }
  ordersCount(where: $where)
}

query ExternalOperatorOrder($id: ID!) {
  order(where: { id: $id }) {
    id
    displayId
    status
    email
    subtotal
    shipping
    discount
    tax
    total
    fulfillmentStatus
    createdAt
    updatedAt
    shippingAddress {
      id firstName lastName company address1 address2 city province postalCode phone
      country { id name iso2 }
    }
    lineItems {
      id title quantity sku thumbnail variantTitle formattedUnitPrice formattedTotal
    }
    fulfillments {
      id
      createdAt
      canceledAt
      shippedAt
      fulfillmentItems { id quantity lineItem { id title quantity } }
      shippingLabels { id status trackingNumber trackingUrl carrier service }
    }
    payments {
      id status amount currencyCode amountRefunded capturedAt canceledAt
    }
    events { id type time createdAt }
  }
}
```

Order/customer/address/payment data is sensitive. Select only fields required by the screen, limit search/filter inputs, apply server-owned scope, and redact exports. The default example intentionally omits `paymentLink`, shipping `labelUrl`, `paymentDetails`, `productData`, `variantData`, and event `data`. Request any such capability-bearing URL or runtime JSON only through a restricted purpose-built projection for one documented screen, then runtime-validate and redact it.

Do not implement cancellation, refund, capture, fulfillment, return, or claim as a generic `updateOrder` plus related writes. Those require bounded commands with actor checks, transition rules, transaction/locks, idempotency, provider reconciliation, and evidence.

### Store configuration read

```graphql
query ExternalOperatorStoreConfiguration {
  stores(take: 1) {
    id
    name
    defaultCurrencyCode
    homepageTitle
    homepageDescription
    logoIcon
    logoColor
  }
  regions(orderBy: [{ createdAt: desc }]) {
    id
    code
    name
    taxRate
    automaticTaxes
    currency { id code symbol noDivisionCurrency }
    countries { id iso2 iso3 name displayName }
  }
}
```

Treat provider credentials, API/OAuth tokens, password/reset state, order secrets, customer tokens, raw payment data, and private integration metadata as forbidden selections. UI field-mode hiding is not API redaction; verify field-level access.

## Canonical Ecommerce domain inventory

Before estimating an external dashboard, inventory each requested domain from its current platform slice through its exact GraphQL roots and access rules. Use this starting map, then verify the target revision:

| Domain | Built-in source to trace | External posture at `6662469` |
| --- | --- | --- |
| Products, variants, media | `features/platform/products/**`, categories, collections, price lists | Explicit reads and narrowly mapped low-risk writes only; aggregate creation/update needs one bounded command |
| Orders | `features/platform/orders/**`, `order-management-system/**` | Read projection only until lifecycle commands are bounded |
| Inventory | `features/platform/inventory/**`, `importInventory` | Bounded adjustment/import command with quantity invariants and evidence |
| Fulfillment and labels | order fulfillment actions; `getRatesForOrder`, `validateShippingAddress`, `createProviderShippingLabel`, `cancelShippingLabel`, `trackShipment` | Evaluate each named root; generated fulfillment CRUD is not a safe external workflow |
| Payments and invoices | order/payment actions, `features/platform/invoices/**`, invoice custom roots | Restricted projection plus provider-aware capture/refund/invoice commands only |
| Returns and claims | `features/platform/claims/**` and related models/actions | Block until transactional lifecycle commands and ownership checks exist |
| Discounts and gift cards | `features/platform/discounts/**`, `gift-cards/**` | Prove ledger, relationship, and transition behavior before writes |
| Business accounts | `features/platform/business-account-requests/**` and storefront account data | Bounded account/approval commands with PII scope |
| Store, regions, countries, currencies | corresponding `features/platform/**` slices | Host-owner configuration unless an enforced scope model exists |
| Payment/shipping providers | provider slices plus `features/integrations/**` | Host-owner; never expose credentials or broad provider JSON |
| Users and roles | `features/platform/users/**`, `features/keystone/models/User.ts`, `Role.ts` | Bounded PII/staff commands; current role/access defects apply |
| API keys and apps/OAuth | `features/platform/api-keys/**`, `apps/**`, OAuth routes/models | Host-owner; delegated key issuance and canonical OAuth remain blocked |
| Analytics | `features/platform/analytics/**`, `getAnalytics` | Permissioned bounded projection; inspect any `sudo()` aggregation |
| Onboarding/system | `features/platform/onboarding/**`, `system/**` | Built-in host administration, not routine external operation |

For every requested write, name the current root and classify it as bounded, generated-limited, host-owner, blocked, or absent. If blocked, define a target backend command with actor, effective permission, server scope, allowed input, related-record checks, expected version, idempotency, transaction/reconciliation, safe output, and audit evidence. At minimum, assess product aggregate create/update, inventory adjustment, order transition/cancel, fulfillment create/cancel, label purchase/cancel, payment capture/refund, return/claim lifecycle, staff role assignment, API-key issuance, and analytics projection.

Current built-in counterexamples must not be preserved as success: `features/platform/orders/actions/orders.ts` includes `sendPaymentLinkEmail`, which can log that it would send and return success without delivery. Find and replace any equivalent placeholder path before calling a workflow operational.

## Screen classification

For every planned screen, use one classification:

- **bounded** — purpose-built projection/command with actor, scope, invariants, and narrow output;
- **generated-limited** — explicit generated operation approved for a named low-risk task after access tests;
- **host-owner** — credential/provider/system setup restricted to the trusted host owner;
- **blocked** — schema/UI exists but lacks safe authority, transaction, scope, or provider guarantees;
- **absent** — no target capability exists.

Common posture:

| Domain | Safe default posture |
| --- | --- |
| Products/categories/collections | explicit reads; low-risk mapped writes; aggregate creation needs a command |
| Orders | bounded read preferred; lifecycle writes require commands |
| Inventory/stock | command with quantity invariants and evidence |
| Fulfillment/labels | provider command with idempotency and reconciliation |
| Payments/refunds | redacted read projection and provider command only |
| Returns/claims | transactional lifecycle command only |
| Users/roles | bounded PII/staff operations; never broad browser CRUD |
| Discounts/gift cards/prices | prove access and ledger/transition behavior |
| Store/regions/providers | host-owner unless target scope model says otherwise |
| API keys/OAuth/apps | host-owner; current canonical issuance/OAuth blockers apply |
| Analytics | bounded permissioned projection; never a broad `sudo()` JSON report |
| Onboarding/system | built-in host administration, not routine external operation |

## UI contracts

### Shell

Load identity, credential kind/expiry, role, server data scope, and capabilities before navigation or counts. Distinguish signed-out, no dashboard role, denied capability, unavailable host, expired credential, and schema mismatch.

On actor/scope change, cancel in-flight requests and clear all previous-scope cache entries before rendering new data.

### Tables

Every table needs:

- explicit compiled columns;
- server pagination/filter/sort with bounded limits;
- validated URL state that cannot choose GraphQL fields/operators;
- stable opaque IDs;
- loading, empty, initial error, refetch error, denied, and stale states;
- accessible labels, keyboard operation, and a responsive action path;
- clear time zone, currency, and freshness treatment.

### Forms

1. Load the server projection and freshness/version data.
2. Map to a local validated form model.
3. Map only approved fields to the mutation/command.
4. Distinguish validation, denied, conflict, provider, timeout, and unknown outcome.
5. Refetch authoritative list/detail state after success or reconciliation.

Never make payment, fulfillment, inventory, or order success optimistic.

### Uploads

Prefer a bounded host-signed upload flow that constrains actor, scope, content type, size, checksum, key, and expiry. If GraphQL multipart is explicitly supported, proxy one compiled mutation through the BFF. Never expose storage credentials or accept browser-selected buckets/keys. If no bounded upload contract exists, uploads are unavailable—not a text URL fallback.

## Cache, concurrency, and idempotency

- Key operator cache by host, schema, actor, server scope, capability, operation, and variables.
- Never share data across credentials or scopes.
- Do not cache secrets, raw provider payloads, or one-time values.
- `updatedAt` is informational unless the mutation atomically checks an expected version.
- Create one idempotency key per user intent and persist it until resolved.
- Retry only operations that accept/document the key.
- After timeout, query command state by idempotency/correlation; do not create a new intent.
- Do not claim “audit logged” unless the backend writes immutable evidence for that exact operation.

## Backend contract request

When a safe operation is missing, hand the Openfront maintainer:

```markdown
## Backend contract request: [operation]

### Actor and scope
- Caller: [role/app]
- Permission/scope: [exact]
- Store/organization/tenant rule: [server-derived]

### Input
- Dedicated input: [fields and validation]
- Related-record ownership checks: [rules]
- Expected version/idempotency key: [behavior]

### Invariants
- Records touched: [list]
- Transaction/isolation/locks: [details]
- Provider call and reconciliation: [details]

### Output and errors
- Safe projection: [allowlisted fields]
- Errors: validation / denied / not found / conflict / provider / unknown

### Evidence and tests
- Audit/event/outbox evidence: [record]
- Authorized, denied, wrong-scope, duplicate, concurrent, and provider-failure tests
```

Do not hide a backend gap in a component or BFF multi-write sequence.

## Implementation sequence

### 1. Read-only shell

- Validate environment/schema and generate types.
- Implement BFF transport and safe errors.
- Authenticate and load operator context.
- Add capability-driven navigation.
- Implement one explicit list/detail slice with all states.

### 2. Low-risk mapped writes

- Add allowlisted form input and a proven generated-limited or bounded mutation.
- Add refetch, denied, validation, stale/conflict, and timeout UI.
- Prove read-only credentials cannot write.

### 3. Operational commands

- Add only host commands that enforce actor, scope, record ownership, transitions, transaction/locks, idempotency, provider behavior, and evidence.
- Add pending lockout and unknown-outcome reconciliation.
- Negative-test wrong records and duplicate intents.

### 4. Production proof

- Validate pinned and live schemas.
- Run unit, contract, integration, browser/accessibility, redaction, and build gates.
- Verify secret storage/rotation, CSP, CORS/BFF policy, health/readiness, metrics, alerts, incident handling, and rollback.

## Minimum tests

- Anonymous and customer identities cannot load operator context or domain rows.
- Read-only operators cannot write.
- Every intended permission/scope can access only its approved roots/fields.
- Wrong IDs do not disclose inaccessible records.
- A multi-tenant target rejects omitted, altered, inaccessible, revoked, and suspended scope cases server-side.
- Browser URL/filter input cannot select GraphQL fields or inject operators/documents.
- A stale/concurrent write conflicts or follows the explicitly accepted last-write policy.
- Duplicate provider commands create at most one payment/refund/label/fulfillment effect.
- Timeouts reconcile before retry.
- No credential, token, customer token, order secret, provider data, password state, or unnecessary PII appears in browser storage, HTML, URL/history, logs, traces, errors, or screenshots.
- OAuth remains disabled until actor/scope/refresh/tenant security gates pass.
- Delegated API-key issuance remains disabled until scope-subset and data-scope enforcement pass.

Mutating tests run only against an explicitly disposable host with unique records and an opt-in flag.

## Acceptance gates

Do not call the dashboard ready until:

1. The exact target schema is pinned and every document validates.
2. Every screen is classified and maps to actor, server scope, permission, projection, and command.
3. Operator credentials never reach browser JavaScript.
4. The shell fails closed before verified operator context/capabilities load.
5. Single-host versus tenant behavior is explicit; client filters are never presented as authorization.
6. OAuth is disabled on the canonical unsafe implementation or the target repair is proven.
7. API keys are owner-provisioned/least-privilege or scope-subset and data-scope issuance is proven.
8. Sensitive workflows use one bounded server command, not client multi-write CRUD.
9. Runtime validators cover JSON/unknown scalars and sensitive selections are redacted.
10. Conflict, duplicate, provider-down, denied, schema-drift, timeout, and unknown-outcome behavior is tested.
11. No placeholder/fabricated record or success remains.
12. Typecheck, tests, contract tests, browser tests, and production build pass against the recorded host/schema.
13. Deployment, secret lifecycle, observability, incident, and rollback notes are complete.

## Final handoff

Report:

- external/built-in mode;
- host origin and GraphQL path, without credentials;
- schema hash/revision/date;
- auth mode and credential lifecycle;
- server data-scope model;
- screen and credential matrices;
- implemented named operations and runtime validators;
- contract/access/concurrency/provider/browser test evidence;
- explicit backend blockers and safe UI behavior;
- deployment, cache, observability, incident, and rollback notes.

Never describe a schema-valid operation, generated CRUD field, dashboard route, HTTP 200, or hidden navigation item as proof of secure operator capability.
