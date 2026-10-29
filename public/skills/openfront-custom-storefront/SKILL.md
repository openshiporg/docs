---
name: openfront-custom-storefront
description: Build or redesign an Openfront E-commerce external Next.js storefront by copying and adapting the canonical built-in routes, feature slices, components, GraphQL operations, and customer flows first. Preserve backend contracts and safety gates; reserve schema-first discovery for unknown verticals or evidenced incompatibilities.
---

# Openfront custom storefront

## QUICKSTART — copy/adapt the working E-commerce storefront, then redesign

**Existing Openfront E-commerce + external Next.js is COPY/ADAPT-FIRST by default.** Do not spend hours reverse-engineering GraphQL, inventing a client architecture, or rewriting working operations to change a storefront's appearance. Copy the existing customer experience, preserve its data contracts and backend business authority, and redesign JSX/CSS/classes/layout/branding. Copy-first is not permission to copy unsafe behavior.

1. **Confirm the target, not a new research project.** Use the known merchant/product, target app path, backend revision/origin, visual brief, and demo-versus-production scope. Ask only missing questions once. Existing implementation authorization means proceed; do not request approval again for every UI batch.
2. **Read the donors; write only to the authorized target app.** Canonical built-in: `/Users/junaid/Code/openfronts/openfront` (read-only). Existing external clients: `/Users/junaid/Code/external-storefront` (read-only), specifically `e-commerce/storefront/emil-storefront/app` for a Next.js App Router/server-only public client. Reuse the target's existing external transport/session boundary when present; do not replace it merely to match a directory diagram.

   ```bash
   CANON=/Users/junaid/Code/openfronts/openfront
   EXTERNAL=/Users/junaid/Code/external-storefront/e-commerce/storefront/emil-storefront/app
   TARGET=/absolute/path/to/owner-authorized-next-app  # replace; NOT either donor
   # Resolve symlinks and verify TARGET is outside both read-only donor roots.
   # Do not execute copy commands until this placeholder is replaced/approved.
   git -C "$CANON" rev-parse HEAD
   git -C "$CANON" status --short -- features/storefront 'app/(storefront)' lib/graphql schema.graphql
   git -C "$TARGET" status --short  # if the target is a Git worktree
   find "$CANON/app/(storefront)" -type f ! -name .DS_Store | sort
   find "$CANON/features/storefront" -type f ! -name .DS_Store | sort
   shasum -a 256 "$CANON/features/storefront/lib/data/products.ts" \
     "$CANON/lib/graphql/product-projection.ts" "$EXTERNAL/lib/openfront/client.ts"
   ```

   Read file contents with your file-reading tool. Record HEAD **and working-tree hashes**: the verified donor at this skill update had HEAD `2b7181aa50ff6f27dadacc2ded2b145a2de68c1f` plus modified/untracked storefront code. HEAD alone does not describe it. Source-stage routes/roots are not proof of deployed support. See [verified source map, provenance, and parity checklist](SOURCE_MAP.md).
3. **Follow this exact file map; copy behavior, not screenshots.** In the table, `F = features/storefront`, `R = app/(storefront)/[countryCode]`; all source paths are relative to `CANON`.

   | Flow | Route → screen | Copy/adapt implementation and operations |
   | --- | --- | --- |
   | Shell/home | `R/(main)/layout.tsx`, `page.tsx` → `F/screens/MainLayout.tsx`, `HomePage.tsx` | `F/modules/layout`, `modules/home`, `modules/common`, `modules/skeletons`; `lib/data/store.ts`, `regions.ts`, `categories.ts`, `collections.ts` |
   | Catalog/taxonomy/search | `R/(main)/store/page.tsx`, `categories/[...category]/page.tsx`, `collections/[handle]/page.tsx` → `StorePage.tsx`, `CategoryPage.tsx`, `CollectionPage.tsx` | `F/modules/store`, `modules/categories`, `modules/collections`, **`F/search/SearchResults.tsx`, `SearchFilters.tsx`**; `F/lib/data/products.ts` plus **`lib/graphql/product-projection.ts`, `bounded-projection.ts`** |
   | Product/variants/gallery | `R/(main)/products/[handle]/page.tsx` → `F/screens/ProductPage.tsx` | `F/modules/products` (gallery, option-select, desktop/mobile actions, pricing, tabs, related products); `F/lib/util`, `types`, existing product projection operations |
   | Cart | `R/(main)/cart/page.tsx` → `F/screens/CartPage.tsx` | `F/modules/cart`, layout cart-button/dropdown/mismatch; `F/lib/data/cart.ts`, `cart-client.ts`, `cart-read-state.ts`, `cookies.ts`, `lib/hooks/use-cart.tsx` |
   | Safe checkout | `R/(checkout)/checkout/page.tsx`, `R/(checkout)/layout.tsx` → `F/screens/CheckoutPage.tsx` | `F/modules/checkout`; `F/lib/data/cart.ts` actions, `payment.ts`, `shipping.ts`, `fulfillment.ts`; preserve addresses → shipping quote/selection → payment selection/confirmation → completion/reconciliation |
   | Account/orders | `R/(main)/account/layout.tsx`, `account/@login`, `account/@dashboard`, `order/confirmed/[id]/page.tsx` → account/login/order screens | `F/modules/account`, `modules/order`; `F/lib/data/user.ts`, `orders.ts`, `business-accounts.ts`, cookie/session forwarding, owner-checked reads |
   | Client state/dependencies | `F/screens/StorefrontServer.tsx` | `F/lib/data.ts`, `lib/hooks`, `lib/providers/query-client-provider.tsx`, `lib/query-keys.ts`, `lib/config.ts`, `lib/getBaseUrl.ts`; imported `components/ui`, `lib/utils.ts`, `lib/currency.ts`, styles as needed |

4. **Extract once, adapt deliberately.** These are examples for a later authorized app build, NOT commands to run against a donor or a concurrent implementation. Refuse a target inside either read-only donor. Inspect the import graph and destination before copying. A local extraction directory is not runtime wiring and must stay out of deployment/public assets.

   ```bash
   # Staging inside the authorized app; no source writes, deletes, secrets, or dependencies.
   DONOR="$TARGET/.openfront-donor"
   mkdir -p "$DONOR/features" "$DONOR/app" "$DONOR/lib/graphql"
   rsync -a --ignore-existing --exclude=.DS_Store \
     "$CANON/features/storefront/" "$DONOR/features/storefront/"
   rsync -a --ignore-existing --exclude=.DS_Store \
     "$CANON/app/(storefront)/" "$DONOR/app/(storefront)/"
   cp -n "$CANON/lib/graphql/product-projection.ts" \
     "$CANON/lib/graphql/bounded-projection.ts" "$DONOR/lib/graphql/"

   # Example: adopt one canonical UI component into an EXISTING app's chosen path.
   mkdir -p "$TARGET/components/product"
   cp -n "$DONOR/features/storefront/modules/products/components/image-gallery/index.tsx" \
     "$TARGET/components/product/openfront-image-gallery.tsx"
   # Adapt its UI imports/JSX/classes to the existing app; keep gallery behavior.
   ```

   For a target without these slices, copy the reviewed `features/storefront` slice and thin routes from staging into the equivalent app paths, preserving imports initially. For an existing target, transplant the relevant components/actions into its established paths and keep its proven transport. Never blindly overlay duplicate `/` or country/account routes. If a standalone scaffold is genuinely missing, the existing `EXTERNAL` app can be copied into an **empty** authorized destination with `rsync -a` excluding `node_modules`, `.next`, `.git`, `.env*`, `*.tsbuildinfo`, and local logs; separately copy only `.env.example`. This is a public-client scaffold, **not full cart/account parity**.
5. **Adapt only the external seam, then ship UI batches.** Keep operation names, documents/selections, variables, return shapes, country/pricing semantics, and invalidation until a concrete incompatibility is recorded. Operations live inline in `lib/data/*.ts`, `search/SearchResults.tsx`, and `lib/graphql/product-projection.ts`, not an invented `.graphql` directory. Resolve aliases, imported UI primitives, provider dependencies, Next version differences, media hosts, and endpoint/cookie boundaries locally. **Do not import `features/keystone`, mint backend cart proofs, or copy signing/provider secrets.** Current `cookies.ts`, `getBaseUrl.ts`, `cart.ts`, and payment-link handler have backend-only imports; they require a narrow external adapter. Use backend-issued proof/session material request-locally or keep the affected flow disabled. See the source-map seam checklist.
6. **Verify once at the end of coherent batches.** Batch shell/home/catalog; product/variants/gallery; cart/checkout/account states. Do not take Playwright screenshots after every edit, run repetitive lint/tests, or enumerate the entire GraphQL schema. Run one bounded target-only build/typecheck pass, fix its concrete errors, and do one final live smoke check (desktop/mobile, real read-only data, enabled flows only). Essential negative security checks remain release gates for private/write flows. Give an independent Pi parity auditor the source/target file map and safety evidence to compare and fix accidental gaps when authorized; do not create a new session automatically. A blocked checkout must not delay shipping safe catalog/UI parity.

## Decision tree — choose once, revisit only with evidence

```text
Same Openfront E-commerce product + existing/known Next.js client?
  YES → copy/adapt built-in routes, slices, operations and flows; redesign UI.
        Existing external transport works? Keep it; adapt only missing seams.
        Specific incompatibility? Record file/operation + error/revision;
        inspect ONLY that contract and make the smallest adapter/change.
  NO  → new/unknown vertical or no compatible donor contract?
        Use bounded schema-first discovery for that vertical, then reuse its
        built-in/sibling patterns. Never apply E-commerce mutations by analogy.
For BOTH → unsafe/unproven ownership/session/payment flow stays unavailable.
```

Different branding, layout, an external hostname, or preference for a cleaner client is **not** an incompatibility. Do not replace working GraphQL operations wholesale or invent a new client architecture for a redesign.

## Scope and authority

This is an **implementation skill**, with a copy/adapt default and capability-specific safety gates. Presentation may change completely; product, price, inventory, totals, tax, shipping, payment, order and fulfillment truth remain in Openfront. A complete customer-facing inventory is mandatory, even when unsafe capabilities are explicitly disabled. Use [SOURCE_MAP.md](SOURCE_MAP.md) to account for every built-in page/component family, including current source-stage extensions.

The old `6662469` security findings below are a historical warning, not the current checkout specification. Newer local source contains ownership/proof and checkout work, but dirty source, generated schema and deployed host can differ. Never declare the host safe from a source file, schema-valid operation, or HTTP 200. Enable private/write flows only with evidence for the exact target host; otherwise retain clearly labeled unavailable/demo states.

## Source orientation to explain first

Before asking implementation questions, briefly orient the user to the source:

- Repository: <https://github.com/openshiporg/openfront>
- Built-in Ecommerce storefront routes, screens, modules, data loaders, sessions, and UI composition: [`features/storefront`](https://github.com/openshiporg/openfront/tree/master/features/storefront)
- Thin storefront route entry points: [`app/(storefront)`](https://github.com/openshiporg/openfront/tree/master/app/%28storefront%29)
- GraphQL schema, models, access, and named operations used by the storefront: [`features/keystone`](https://github.com/openshiporg/openfront/tree/master/features/keystone) and [`schema.graphql`](https://github.com/openshiporg/openfront/blob/master/schema.graphql)

Explain briefly that the external storefront is a copy/adaptation of the customer feature slice with new presentation, not a backend reconstruction. These GitHub links are navigational; prefer the exact local target/donor revision and the linked source map. Read `features/keystone` or the schema only for an evidenced incompatibility or an enabled capability's safety gate, not as a mandatory whole-backend tour.

## Then interview the user

After that orientation, ask one concise set of questions, skipping anything the user already answered:

1. Which Openfront product is this for, and where is its codebase? Ask for the repository/path and revision if they are not available in the current workspace.
2. Do they want to adapt the built-in storefront or build an independently deployed storefront?
3. What do they dislike about the built-in storefront? What should stay unchanged?
4. Which customer journeys and routes must the custom storefront support?
5. What visual direction, references, brand/content requirements, device targets, motion, and accessibility needs matter?
6. Which countries, currencies, customer/guest modes, payments, shipping/fulfillment or booking flows are required?
7. Which non-production host, GraphQL endpoint, schema export, test catalog, and test identities are available?

After the answers, restate a short brief and use the QUICKSTART. Trace route → screen → component → existing action/operation for the batch being implemented. Record source-to-target paths, external seams and disabled capabilities; begin the approved work. Ask before expanding scope or changing backend contracts, not before every already-authorized UI change.

For built-in customization, edit only the authorized product checkout. For a separate client, copy/adapt the customer slice into the authorized external app; canonical source stays read-only. Preserve the client workflow and GraphQL contract without importing backend authority.

## Non-negotiable rules

1. **Respect the chosen boundary.** A built-in customization may use that product's intended storefront modules and server data layer, but must not move backend authority into browser code. A separate client uses the configured GraphQL endpoint and must not import Keystone models, Prisma, migrations, `features/keystone`, generated admin clients, or backend environment variables.
2. **Openfront owns commerce truth.** Prices, currency, discounts, tax, shipping, inventory, totals, payment state, order state, fulfillment, and eligibility come from server responses.
3. **Never fabricate records.** Loading and empty states must not contain fake products, prices, reviews, availability, orders, or success.
4. **Copy contracts first.** Preserve the existing named operations and result/variable types. Use a supplied/exported target schema to validate the operations actually used; reuse existing codegen if present. Schema-first root discovery is only for unknown/new verticals or evidenced incompatibilities. Do not make a new schema/codegen architecture a prerequisite for presentation work.
5. **Access tests are part of the contract.** GraphQL validation proves shape only. Prove anonymous, Customer A, Customer B, expired-session, wrong-cart, wrong-line, and wrong-order behavior against a disposable host.
6. **Keep credentials out of browser JavaScript.** Prefer a same-origin backend-for-frontend (BFF) with host-only `httpOnly` cookies. Never put a Keystone session, customer token, provider secret, API key, or guest order secret in `localStorage`.
7. **No arbitrary GraphQL proxy.** Browser routes call compiled, named operations with allowlisted variables. They do not submit arbitrary documents, fields, filters, or endpoint URLs.
8. **Do not retry writes blindly.** Reconcile cart, payment, and checkout after an ambiguous timeout. Retry only when the host contract documents idempotency for the same intent.
9. **Missing capability means unavailable.** Add a bounded backend projection/command or show an explicit unavailable state. Do not bypass the gap with `sudo`, raw database access, operator credentials, or broad CRUD.
10. **Treat JSON scalars as untrusted.** Generated TypeScript cannot validate runtime `JSON`; parse it with Zod, Valibot, or an equivalent boundary schema.

## Required inputs for an external client

Use the target's existing configuration names (the verified external client uses server-only `OPENFRONT_BASE_URL`); do not rename a working boundary. For a new external adapter, equivalent inputs are:

```dotenv
OPENFRONT_ORIGIN=https://merchant.example
OPENFRONT_GRAPHQL_ENDPOINT=https://merchant.example/api/graphql
OPENFRONT_DEFAULT_COUNTRY=us
```

Also ask for:

- a non-production host and safe test catalog;
- the exact Openfront/vertical revision;
- existing contract evidence/schema export; permission for a bounded compatibility check if necessary (not exhaustive introspection);
- supported countries, payment providers, shipping providers, and customer-auth mode;
- CORS policy and allowed storefront origin;
- test identities supplied through a secret manager, not source or prompts;
- the requested routes, design direction, and accessibility/browser targets.

Reject production endpoint URLs that are not trusted HTTPS, contain credentials or fragments, or can be overridden by request input. Permit plain HTTP only for explicit loopback development.

## Copy/adapt the customer client without coupling to the backend

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

Source call sites are the implementation donor: copy/adapt their customer workflow, documents, hooks and cache behavior rather than merely using them as research inspiration. Validate the active call chain, not every unused export. Same-origin privileges and backend-only imports are external seams, not permission to copy backend code; adapt narrowly and disable anything not safe.

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

This compact map is not exhaustive; the QUICKSTART and [SOURCE_MAP.md](SOURCE_MAP.md) include current search/projection helpers and all account/content extensions. Also inspect `features/storefront/middleware.ts`, `lib/hooks/**`, and `lib/query-keys.ts` for country routing, client state, cache keys, and invalidation. Preserve the parallel account-route structure when adapting the built-in client. Do not assume every exported helper is current workflow authority: `lib/data/cart.ts` contains stale or alternate helpers, and `lib/data/orders.ts` contains placeholder transfer functions that log and return success without performing a mutation.

### Bounded verification, not a test/research loop

Inspect the **target app's** scripts once. The verified canonical working tree now has focused `.test.ts` files; its package scripts still have no dedicated `test`, `typecheck`, or `codegen`. Its `dev` builds Keystone and migrates; its current `build` builds Keystone then Next. Do not run either in the read-only donor. An external UI build must not install/start Keystone, touch its database, or migrate it. The inspected external Emil client has `typecheck: tsc --noEmit` and `build: next build --webpack`; use the target's equivalent safe scripts once after implementation batches. A build alone is not ownership/payment proof, and disabling TypeScript errors is not acceptable verification.

## Exception path: bounded contract discovery

**Skip this as a default redesign phase.** Use only for a new/unknown vertical or a specific evidenced operation incompatibility. Existing E-commerce copy-first work validates used operations against existing contract evidence and proceeds with safe UI batches.

1. Obtain the target schema/export without changing the host; reuse the existing pinned schema path.
2. Record hash, host revision/origin, verification date, and the concrete incompatibility.
3. Inspect only needed root fields and the failing source operation/selection.
4. Validate anonymous catalog reads for intended publication/region scope.
5. Verify session forwarding only before enabling private capabilities.
6. Run the relevant cross-customer/cart/order negative probes on an authorized disposable host.
7. Record the smallest adapter or missing capability in the parity matrix; continue unaffected UI work.

For an unknown vertical only, a minimal root probe is (not a routine E-commerce task):

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

## Client structure — keep the existing one

Default: retain the target Next.js app structure, existing external transport, and copied customer feature slices/hooks/inline operation documents. Thin routes still compose features. Do not introduce the tree or scripts below into a working app merely for uniformity.

For a genuinely new client on the exception path, an optional structure is:

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

For that new contract architecture, optional CI scripts include (not a per-edit checklist):

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

Reuse existing named operation documents and result/variable types first. If the active donor uses unnamed inline operations, assign stable local names without changing the root, selection, variables or behavior. Validate runtime JSON even when TypeScript types exist. Preserve working codegen; do not replace inline source documents with a new generated-client architecture for a redesign.

Only if codegen is actually needed on the exception path, a typical GraphQL Code Generator configuration is:

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

Reuse the existing server-action/BFF boundary when it satisfies these controls. External adaptation may preserve server actions; it does not require a new REST layer. If route handlers are needed, these are illustrative task routes, not existing canonical files or mandatory new architecture:

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

## Historical E-commerce blocker register — `6662469`, not the latest specification

These findings describe the old snapshot only. The verified local source now includes `features/keystone/security/cart-access.ts`, proof handling and checkout recovery/commit work. Do not assume either that every old defect persists or that the deployed host has every repair. Use the current source/host seam checklist in [SOURCE_MAP.md](SOURCE_MAP.md). Unknown or unsafe external cart/checkout remains disabled until the target passes ownership, parent-binding, idempotency, amount/currency, inventory and reconciliation checks.

At canonical commit `6662469`, the recorded blockers were:

| Root/path | Historical blocker at `6662469` |
| --- | --- |
| `activeCart` / `mutations/activeCart.ts` | Reads an arbitrary cart by caller-supplied ID under `sudo()` |
| `updateActiveCart` / `mutations/updateActiveCart.ts` | Writes an arbitrary cart with broad `CartUpdateInput`, including sensitive relationships |
| `updateActiveCartLineItem` | Does not prove the supplied line belongs to the supplied cart |
| `activeCartShippingOptions` | Reads cart state by arbitrary ID |
| `addActiveCartShippingMethod` | Does not prove ownership or fully validate region, return/admin status, and eligibility |
| `createActiveCartPaymentSessions` and `initiatePaymentSession` | Do not bind the cart to the caller; provider state is reached under `sudo()` |
| `completeActiveCart` | Lacks a complete caller-binding, durable idempotency, amount/currency binding, and atomic order/payment/inventory boundary |
| Checkout address update in `features/storefront/lib/data/cart.ts` | Can connect broad user/address/region relationships through the unsafe cart update root |

That historical completion implementation could select the first payment session rather than necessarily the completed session, and order construction spanned multiple writes. A safe external checkout needs bounded server roots that bind actor/cart capability, constrain fields and related records, check line parents and shipping eligibility, preserve one idempotency intent, verify provider amount/currency, transact or durably reconcile effects, and return a runtime-validated projection.

Prefer the current bounded host commands already used by the built-in slice. The former suggested `storefront*` root names are not existing API requirements: do not invent/rename operations to satisfy a naming convention. If a necessary safety capability is truly absent, record it, disable that UI action, and request a narrowly scoped backend repair through separate authorization; never expose broad CRUD.

## Legacy schema-compatible examples — reference only, do not replace donor operations

The following examples were validated by the prior skill against `schema.graphql` at commit `6662469`; they were **not revalidated as current host contracts** in this documentation update. For current E-commerce builds, copy the active built-in operation documents from the QUICKSTART source paths instead. These old examples are not starter code and must not override current proof/address/shipping/completion flows. For an unknown vertical, use its own source and bounded discovery, never E-commerce roots by analogy.

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

The historical flow traces through this sequence. Preserve its essential authority boundaries, but copy the current built-in sequence (including shipping quotes and backend-issued proofs) instead of implementing from this old example:

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

Before enabling private account actions, follow the current `lib/data/user.ts`/`orders.ts` call chain and verify only its used authentication, profile/address and order roots. Copy/adapt those actions, not a newly researched account architecture. Password reset is unavailable unless a target-revision contract and delivery path are verified.

The old built-in guest path could create a password-backed `User` with a random password, sign it in, and associate addresses/cart with it. Do not recreate that historical behavior. Current `setAddresses` uses `setActiveCartAddresses`; preserve that command when the deployed contract supports it. External guest/cart proof must be backend-issued and caller-bound; never silently manufacture customer accounts or copy backend signing code.

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

## Implementation sequence — coherent UI batches

1. **Copy/adapt shell and discovery:** existing transport + home/nav/footer/country selection, catalog, nested categories, collections, search/filter/sort and count-backed pagination. Preserve publication/region scope, metadata, loading and failure states.
2. **Copy/adapt product experience:** ordered multi-image gallery, description/tabs, option-combination selection, selected regional price/availability, mobile actions and related products. Redesign presentation, not pricing/variant authority.
3. **Copy/adapt private/commerce presentation:** account/login/register/profile/addresses/orders and cart/checkout components with explicit safe-disabled states first. Reuse proven session/operation wiring; enable each capability only after its relevant safety checks. Refetch server totals; preserve backend-issued cart proof, shipping quote, provider handoff, selected payment session, duplicate-submit prevention and unknown-outcome reconciliation.
4. **One bounded final verification pass:** run the target's non-migrating build and independent typecheck once; run existing focused tests only for changed logic/controls. Fix concrete failures and rerun only the affected gate. No per-edit lint/test/screenshot treadmill or blanket canonical/fleet build.
5. **One final live smoke check:** home → catalog/taxonomy/search/sort/page → product/gallery/variants, mobile/nav/country, empty/not-found/outage and disabled states. Check keyboard/focus, image failures and console/network errors. For approved enabled private flows, check login/logout and ownership; never charge/place orders or mutate real accounts merely for a UI smoke test. Missing runtime access is reported as unverified, not silently passed.
6. **Independent Pi parity audit/fixes:** hand off the source/target revisions, full file inventory, parity matrix, bounded check results and safety blockers. The auditor compares actual source/components and fixes authorized accidental omissions; it cannot waive security gates. Do not launch sessions/schedules without explicit authorization.

A read-only/demo completion may ship catalog parity with clearly unavailable private/commerce routes. It must not be called a fully operational commerce storefront. Production proof additionally requires the relevant security/provider, deployment, cache, observability and rollback evidence; reuse existing evidence for unchanged contracts rather than rerunning every suite for CSS.

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

1. Source-to-target routes/components/operations are recorded; used documents validate against the supplied target contract. Existing schema/codegen evidence is reused, not rebuilt solely for a redesign.
2. Every route has a capability row and explicit unavailable behavior for gaps.
3. Runtime validators cover every `JSON` or unknown-scalar boundary.
4. Cart and checkout ownership/idempotency blockers are repaired on the target host or those flows are disabled.
5. Customer/cart/order cross-owner negative tests pass for enabled private/write capabilities; otherwise those capabilities remain disabled and the handoff explicitly limits readiness to read-only/demo.
6. No browser-visible operator/provider/server credential exists.
7. Prices, totals, availability, status, payment, and fulfillment are server-derived.
8. Applicable external origin/CSRF/body/rate-limit/redaction policies are tested before enabling the affected server routes/actions.
9. Empty, not-found, denied, provider-down, schema-drift, timeout, and unknown-outcome states are real and accessible.
10. One bounded target build/typecheck and final live smoke check are reported; relevant logic/security tests pass for enabled capabilities. Disabled/unverified flows are explicit. Full-commerce production release requires the negative/provider gates, not just a visual smoke check.
11. Deployment, readiness, observability, incident, and rollback notes are complete.

## Improve the skill when recurring friction is found

Claude/Pi sessions should make small, evidence-backed improvements to this canonical skill when authorized: record the exact failing donor/target path, revision, operation/seam, correction and changed instructions in the skill or its linked source map. Fix stale paths and repeatable extraction friction; do not create competing unlinked proposals or turn app shipping into documentation loops. Batch notes during implementation, ship the authorized app, then apply the smallest documentation correction. If canonical Docs write access is absent, report a concise patch for owner review rather than modifying installed copies.

Do not silently synchronize `~/.codex/skills/e-commerce-external-storefront/SKILL.md`, Reach Out's copied skill, or other installed copies. Report canonical Docs HEAD, working-tree file SHA-256/Git blob hash, changed companion paths and diff; request explicit controlled synchronization after owner/supervisor review. Include linked companions in any approved sync. Never imply an uncommitted update has a new commit revision.

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
