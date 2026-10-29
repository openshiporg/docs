# E-commerce copy/adapt source map and parity checklist

Companion to [SKILL.md](SKILL.md). Start with its QUICKSTART, not schema archaeology. This file is a source-navigation and acceptance checklist, not authorization to edit/start a donor, deploy, run payments, repair a backend, or launch an auditor session.

## Provenance and limits

Static verification: **2026-10-10**. Read-only canonical root: `/Users/junaid/Code/openfronts/openfront`; HEAD `2b7181aa50ff6f27dadacc2ded2b145a2de68c1f` with modified and untracked storefront/backend files. Use the **working-tree files** only with a recorded hash and a target compatibility check. Do not pretend HEAD contains the uncommitted search/privacy/rewards/repeat-order/payment-link work. The generated local `schema.graphql` does not yet list some source-stage roots such as `searchStorefront`, `createActiveCart`, `setActiveCartAddresses` and `quoteActiveCartShipping`; that is an evidenced seam, not permission to generate a schema or migrate the donor.

Read-only external root: `/Users/junaid/Code/external-storefront` (a collection of app folders, not itself a Git repository). Verified Next.js donor: `e-commerce/storefront/emil-storefront/app`. Its read-only client is useful for the external endpoint, country preference, DTO/media boundary and safe unavailable states; it is **not** proof of complete customer/commerce parity. Its `API_CONTRACT.md` and the collection's `BUILTIN_PARITY_AUDIT.md` describe the older `6662469` snapshot. Do not use those reports to override current source or claim current live safety.

[Machine-readable source inventory](source-inventory.json) records **287 canonical files** (34 thin route/loading/layout files, the complete 247-file storefront slice including tests, and six shared dependency files), plus four external-client anchor hashes. It includes every storefront module/component file, not just attractive screens. Hashes are provenance, not test or deployment evidence. There are no private `.env`, logs, screenshots, credentials, databases or installed dependencies in this inventory. At the next app build, refresh the inventory in the app's handoff if the donor differs; do not silently rewrite this canonical snapshot or another installed skill.

Key working-tree SHA-256 anchors:

| Canonical relative file | SHA-256 |
| --- | --- |
| `features/storefront/lib/data/products.ts` | `e3c5a2b1e5f4d1135c395bba7247f9ce539b99a474aca7a7d0498b65684d42ec` |
| `features/storefront/lib/data/cart.ts` | `5beb4740d2b4c0a0e856c9819c79b691b5ccc840827a8e280837106afc2ce2c3` |
| `features/storefront/lib/data/cookies.ts` | `46ac40e7f5aa83e12fe5612bdb5d0cf1f6a4eb57faaf31738de1a8ca3224aa67` |
| `lib/graphql/product-projection.ts` | `4da429a9547880a7159025aee60507d3c042f41d5eb68b248c932351e7e25cac` |

No build, live GraphQL request, account/cart mutation or provider test was performed for this documentation update. GitHub source links in SKILL.md returned HTTP 200; local paths and hashes are the source-specific evidence.

## Complete route → composition parity matrix

Conventions: `R = app/(storefront)/[countryCode]`, `F = features/storefront`; paths below are relative to the canonical root. Route groups and parallel slots do not appear in URLs. `C` below means country code. A target can have a different URL convention only with an explicit source-to-target mapping/redirect that preserves customer access and regional semantics.

For **every row**, record target route/component path, copied operation/action, status, safety reason and evidence in the app handoff. Allowed statuses: `implemented`, `partial`, `missing`, `disabled-unsafe`, `not-supported-by-host`, `not-applicable-with-evidence`. An unavailable screen is accounted for, **not** implemented functional parity. Do not omit pages just because the brief mentions home/product only; explicitly agree exclusions or retain safe unavailable access.

| Customer surface / URL | Exact route under R | Screen/composition under F | Parity requirement |
| --- | --- | --- | --- |
| Home `/C` | `(main)/page.tsx` | `screens/HomePage.tsx`; `modules/home` | Real store identity/copy, hero, collection/featured product rails and navigable product cards |
| Global shell | `(main)/layout.tsx` | `screens/MainLayout.tsx`, `screens/StorefrontServer.tsx`; `modules/layout` | Desktop/mobile nav, footer, logo/brand, region selection, cart entry/preview/mismatch, provider/hydration boundary |
| Store `/C/store` | `(main)/store/page.tsx` | `screens/StorePage.tsx`; `modules/store`, `search` | Search, category/collection/tag/availability facets, sort, count-backed page flow; preserve query params and reset page when filters change |
| Nested categories `/C/categories/...` | `(main)/categories/[...category]/page.tsx` | `screens/CategoryPage.tsx`; `modules/categories/templates/index.tsx` | Parent/child hierarchy, category title/description, product results, correct nested links, pagination/not-found |
| Collection `/C/collections/handle` | `(main)/collections/[handle]/page.tsx` | `screens/CollectionPage.tsx`; `modules/collections/templates/index.tsx` | Collection identity, products/sort/pagination, empty and unknown handle |
| Product `/C/products/handle` | `(main)/products/[handle]/page.tsx` | `screens/ProductPage.tsx`; `modules/products` | Ordered gallery, document description/tabs, options → exact variant, selected price/availability, desktop/mobile actions, related products, metadata/not-found |
| Cart `/C/cart` | `(main)/cart/page.tsx` | `screens/CartPage.tsx`; `modules/cart` | Persistent caller-bound cart, item variants/quantity/remove, summary/totals, sign-in prompt, missing/stale/denied/outage states and cleanup |
| Checkout `/C/checkout` | `(checkout)/checkout/page.tsx` | `screens/CheckoutPage.tsx`; `modules/checkout` | Address/customer/guest decision, saved/billing/country address, discounts/gift tender, shipping quote/selection, payment wrapper/selection, review/completion; unsafe flows disabled |
| Checkout shell/404 | `(checkout)/layout.tsx`, `(checkout)/not-found.tsx` | `CheckoutLayout`, `CheckoutNotFound` in `screens/CheckoutPage.tsx` | Checkout-specific nav/back/cart link, responsive summary, accessible not-found |
| Payment-link entry | `(checkout)/checkout/payment-link/route.ts` | `handlers/payment-link.ts` | Capability exchange/clean redirect only if externally supported; no local backend-proof minting |
| Account shell | `(main)/account/layout.tsx` | `AccountPageLayout` in `screens/AccountDashboardPage.tsx`; `modules/account/templates/account-layout.tsx` | Preserve authenticated dashboard vs login slot selection and protected nav; no account data prefetched into anonymous HTML |
| Login/register `/C/account` | `(main)/account/@login/page.tsx` | `screens/LoginPage.tsx`; `modules/account/components/login`, `register` | Existing server actions, generic failures, secure cookie, logout/invalidation; password reset only when actually supported |
| Account overview `/C/account` | `(main)/account/@dashboard/page.tsx` | `screens/AccountDashboardPage.tsx`; `modules/account/components/overview` | Real customer overview/order activity, signed-out/denied/empty |
| Profile `/C/account/profile` | `(main)/account/@dashboard/profile/page.tsx` | `screens/AccountProfilePage.tsx`; profile components | Name/email/phone/password/billing changes and their validation/error states; no cross-owner edits |
| Addresses `/C/account/addresses` | `(main)/account/@dashboard/addresses/page.tsx` | `screens/AccountAddressesPage.tsx`; address-book/address-card components | Add/edit/delete saved addresses, empty state, ownership validation |
| Orders `/C/account/orders` | `(main)/account/@dashboard/orders/page.tsx` | `screens/AccountOrdersPage.tsx`; order-overview/modern-order-list/order-card | Owner-scoped history, pagination, no-orders and denied/error |
| Order detail `/C/account/orders/details/id` | `(main)/account/@dashboard/orders/details/[id]/page.tsx` | `screens/AccountOrderDetailsPage.tsx`; `modules/order/templates/order-details-template.tsx` | Order lines/options, authoritative status/totals, payment/shipping/fulfillment/help, inaccessible order |
| Confirmation `/C/order/confirmed/id` | `(main)/order/confirmed/[id]/page.tsx` | `screens/OrderConfirmedPage.tsx`; `modules/order/templates/order-completed-template.tsx` | Server-confirmed completion only, pending/denied/missing, guest proof exchange, fulfillment/digital entitlements when supported |
| Paid invoices `/C/account/invoices` | `(main)/account/@dashboard/invoices/page.tsx` | `screens/AccountInvoicesPage.tsx`; invoices-template/invoices-tab | Owner-scoped invoice list and empty/error states |
| Invoicing/business account `/C/account/invoicing` | `(main)/account/@dashboard/invoicing/page.tsx` | `screens/AccountInvoicingPage.tsx`; invoicing-template/invoicing-tab | Business-account request/status, eligible unpaid lines, invoice payment/provider states; tenant/role-gated |
| Checkout-link dashboard | `(main)/account/@dashboard/checkout-link/page.tsx` | Route-local composition/actions (not a screen export) | Account/cart handoff; current route has unsafe fallback assumptions—do not copy its bypass behavior |
| Checkout-link login | `(main)/account/@login/checkout-link/page.tsx` | Route-local login entry | Protected handoff preserving intended destination without trusting a bare cart ID |
| Privacy `/C/account/privacy` | `(main)/account/@dashboard/privacy/page.tsx` | `screens/AccountPrivacyPage.tsx`; `modules/account/components/privacy`, `lib/data/privacy.ts` | Source-stage export/deletion workflow; irreversible mutations need separate authorization and verified host contracts |
| Repeat orders `/C/account/repeat-orders` | `(main)/account/@dashboard/repeat-orders/page.tsx` | `screens/AccountRepeatOrdersPage.tsx`; `modules/account/components/repeat-orders.tsx`, `lib/data/repeat-orders.ts` | Source-stage owner-scoped plans/actions, unavailable/empty/error, no accidental recurring purchase |
| Rewards `/C/account/rewards` | `(main)/account/@dashboard/rewards/page.tsx` | `loyalty/RewardsPage.tsx`, `RewardsClient.tsx`, `actions.ts` | Source-stage owner-scoped balances/redemption, backend amount/eligibility, unavailable when unsupported |
| Content/policies `/C/content/slug` | `(main)/content/[slug]/page.tsx` | `screens/PolicyPage.tsx`, `lib/data/store-policy-copy.ts`, `lib/data/store.ts` | Configured store policy copy only; unsupported slug → not-found, supported but unpublished policy → honest unpublished notice, no fabricated legal guarantees |
| Loading routes | `(main)/loading.tsx`; `cart/loading.tsx`, `store/loading.tsx`, `categories/[...category]/loading.tsx`, `collections/[handle]/loading.tsx`, `products/[handle]/loading.tsx`, `order/confirmed/[id]/loading.tsx` (the latter seven under `(main)`) | `modules/skeletons` | Preserve loading boundaries, not blank flashes or fake product/order records |

The table accounts for all 34 current route/layout/loading files. Check the JSON inventory for exact fully expanded paths; do not invent a dedicated `/search` route or flatten `[...category]` to `[handle]` inadvertently.

## Every component family is in scope

All paths in this table are beneath `F/modules`. Component names denote directories unless a `.tsx` file is specified. Follow each copied component's imports; adapting JSX is not permission to lose state/controls. The JSON lists every file, including icons, shared primitives and focused tests.

| Family (inventory file count) | Components/templates to account for |
| --- | --- |
| `home` (4) | hero, featured-products/product-rail, dots-shader (keep/adapt/explicitly exclude decorative motion with reduced-motion support) |
| `layout` (10) | nav/footer/layout templates; cart-button, cart-dropdown, cart-mismatch-banner, country-select, logo, side-menu, openfront-cta (branding subject to owner policy) |
| `store` (5), `categories` (1), `collections` (1) | pagination, refinement-list/sort-products, store/paginated-products templates, taxonomy templates; current store routes use `F/search` rather than the old hook stub |
| `products` (18) | image-gallery, product-actions/index/mobile-actions/option-select/add-to-cart helper+test, product-preview/price, product-price, product-tabs/accordion, related-products, thumbnail, product-onboarding-cta; product template, product-actions-wrapper, product-info/DocumentRenderer |
| `cart` (9) | cart-cookie-cleanup, item, cart-item-select, empty-cart-message, sign-in-prompt; items/preview/summary/main templates |
| `checkout` (20) | address-select, addresses, billing-address, country-select, shipping-address, shipping; discount-code, gift-card/actions, error-message, submit-button; payment-container, payment-wrapper/stripe-wrapper, payment, payment-button, payment-test, review; checkout-form/summary templates |
| `account` (31) | account-info/nav, login/register, overview, order-overview/modern-order-list/order-card; address-book/address-card add/edit; profile name/email/password/phone/billing-address; invoices-tab, invoicing-tab request/actions/payment-dialog/wrapper/Stripe/button; transfer-request-form, privacy, repeat-orders; account/login/invoices/invoicing templates |
| `order` (14) | order-details/summary, items/item, payment-details, shipping-details, fulfillment-card, help, digital-downloads, onboarding-cta, transfer-actions/transfer-image; completed/detail templates |
| `common` (34) | cart-totals, line-item-options/unit-price/price, delete-button; input/native-select/radio/checkbox/filter-radio-group, modal/divider, interactive/localized links/link-status; all icons and focus/label behavior |
| `skeletons` (15) | button/card/cart-item/cart-totals/code/line-item and order skeleton components; cart-page/order-confirmed/product-grid/related-product templates |

Also account for all 21 `F/screens` files, `F/search` (2), `F/loyalty` (3), `F/handlers/payment-link.ts`, and the 59 data/state/type/util files. Do not copy tests into runtime public assets. Keep/adapt relevant tests when behavior changes; classify decorative/admin onboarding CTAs explicitly rather than advertising them as commerce requirements.

## Operations/hooks — reuse the active call chain

There is no canonical standalone operation-documents folder for this slice. Inline `gql`/template strings and projection constants are the operation documents. Preserve names/selections/variables/return shapes; map them to the target server boundary without a wholesale rewrite.

| Behavior | Exact source and active donor examples |
| --- | --- |
| Product list/detail/price | `F/lib/data/products.ts` → `lib/graphql/product-projection.ts` → `bounded-projection.ts`; constants `GET_PRODUCTS`, `GET_PRODUCT_BY_HANDLE`, `RETRIEVE_PRICED_PRODUCT_BY_ID`, `GET_PRODUCTS_SORTED_BY_PRICE`, child option/image/variant/price reads; retain page/row/request budgets and complete relation reads |
| Current search/filter/sort | `F/screens/StorePage.tsx` → `F/modules/store/templates/index.tsx` → `F/search/SearchResults.tsx`; `query SearchStorefront($input: JSON!) { searchStorefront(input: $input) }`; `SearchFilters.tsx` owns URL filter controls; runtime-validate JSON/facets and require deployed root support |
| Catalog context | `F/lib/data/store.ts`, `regions.ts`, `categories.ts`, `collections.ts`, `products-client.ts`; home/taxonomy templates preserve region and hierarchy |
| Cart state/actions | `F/lib/data/cart.ts`: `retrieveCart` discriminated state, `createCart` → `CreateActiveCart`, `getOrSetCart`, `addToCart`, `updateLineItem`, `deleteLineItem`, `updateRegion`, discounts/gift card, `setAddresses`, `placeOrder`; `cart-read-state.ts`, `cart-client.ts`; copy only the action actually imported by the active component |
| Address/shipping/payment | `cart.ts` `SetActiveCartAddresses`, `fulfillment.ts` shipping list/quote/choice, `payment.ts` provider/initiation, cart payment session selection/completion; preserve shippingQuoteId and selected paymentSessionId when the active call chain supplies them |
| Customer session | `F/lib/data/user.ts`: `getUser`, `signUp`, `login`, `signOut`, profile/password/address actions; `cookies.ts` `getAuthHeaders`, secure auth/cart cookie operations. Preserve `authenticateUserWithPassword`, `endSession`, `updateActiveUser` etc. as used; no guessed reset flow |
| Orders/invoices | `F/lib/data/orders.ts`: `GetCustomerOrder`, `GetCustomerOrders` (JSON, no selection sets); `business-accounts.ts` plus `modules/account/components/invoicing-tab/invoice-actions.ts`; keep customer-only selections and ownership |
| Source-stage extensions | `F/lib/data/digital.ts`, `privacy.ts`, `repeat-orders.ts`; `F/loyalty/actions.ts`, `RewardsPage.tsx`; only enable supported and verified host contracts |
| Hooks/state | `F/lib/hooks/use-cart.tsx`, `use-products.tsx`, `use-collections.tsx`, `use-user.tsx`, `use-orders.tsx`, `use-payment.tsx`, `use-shipping.tsx`; `F/lib/query-keys.ts`, `lib/providers/query-client-provider.tsx`, `screens/StorefrontServer.tsx`, `lib/data.ts`; preserve request-local identity and correct invalidation |

`lib/data.ts` is a separate simplified prefetch layer; it is not interchangeable with `lib/data/products.ts`. `useSearchProducts` still contains a search placeholder; do not use it instead of the current `SearchResults` route flow. Older `cart.ts` exports include malformed/alternate documents; do not blindly copy every export as a working operation. `orders.ts` transfer helpers still log and return success without a real mutation: **disable transfers**, do not port simulated success or log tokens.

## External Next.js donor — useful seams, not a substitute for built-in parity

Under `/Users/junaid/Code/external-storefront/e-commerce/storefront/emil-storefront/app`:

- `lib/openfront/client.ts`: `server-only`, `OPENFRONT_BASE_URL`, `/api/graphql`, 10s timeout, `cache: no-store`, HTTP/GraphQL error handling. Keep the established equivalent in an existing target. Harden configured origin checks (trusted HTTPS, explicit loopback HTTP only, reject credentials/fragments/redirects) and error redaction locally; this donor accepts broader URLs and raw upstream errors, so it is not automatically a production-hardened transport.
- `lib/openfront/catalog.ts`, `types.ts`, `presentation.ts`: existing operation strings, public DTO/image mapping and country pricing; transplant only compatible pieces. This catalog fetches a bounded 100-product snapshot, not complete count-backed catalog pagination. Do not treat client-only filtering/paging of that snapshot as full search/catalog parity. Its media allowlist includes a donor-specific CDN hostname; configure the merchant's approved hosts instead.
- `lib/preferences.ts`, `app/api/preferences/region/route.ts`, `components/site/region-menu.tsx`: public country preference only, not a customer/session proxy.
- `components/catalog/product-configurator.tsx`, `product-image.tsx`, `catalog-explorer.tsx`, `paginated-product-grid.tsx`: external presentation adapters; compare gallery/options/filter/page behavior against the canonical slice rather than assuming equivalence from filenames.
- `components/site/commerce-paused.tsx`, `commerce-dialog.tsx`, and `app/{cart,checkout,account}/page.tsx`: honest disabled-demo UX. Keep it until safe wiring is proven; do not turn these placeholders into fake carts/orders.
- `app/categories/[...category]/page.tsx`, `app/collections/[handle]/page.tsx`, `app/products/[handle]/page.tsx`, `app/store/page.tsx`, `app/order/confirmed/[id]/page.tsx`, account catch-all/loading/error/not-found: route/state examples, not automatic equivalence to canonical country/parallel routes.
- `graphql/openfront.schema.graphql`, `package.json`, `tsconfig.json`, `next.config.ts`, `app/globals.css`, `.env.example`: reuse compatible configuration; keep existing dependencies/aliases. Do not copy `.env.local`, `node_modules`, `.next`, logs, generated build artifacts or branding/media without review.

## Seam checklist — smallest adaptation, never weaker authority

- [ ] Route aliases/import graph: copy the referenced UI primitives from `components/ui` or adapt to target equivalents. Built-in Radix-based components and the external Base UI app differ; do not force a wholesale primitive/library upgrade. Keep accessible labels/focus/keyboard interactions.
- [ ] Product projection dependencies: copy the two pure `lib/graphql` helpers with their budgets; `lib/currency.ts`/`lib/utils.ts` as actually imported. Preserve server-calculated money and currency/minor-unit rules; no fallback fabricated USD or inventory.
- [ ] Endpoint: current `F/lib/getBaseUrl.ts` imports `features/keystone/lib/internal-origin.ts`; external code instead uses trusted configured backend origin. Do not resolve the endpoint to the external app itself or accept browser/request-supplied endpoint URLs.
- [ ] Cookie/session: current `cookies.ts` imports backend `token-crypto`; external app must **not** mint/verify those backend signatures with a copied secret. Preserve authentication server-side and store/forward only backend-issued opaque proof with the documented cart binding. Validate upstream Set-Cookie/JSON behavior for the actual host. Do not forward all unrelated browser cookies.
- [ ] Current source-stage `createActiveCart` sets proof through its backend response path. Verify the deployed issuance mechanism and safe BFF persistence before calling it externally; never replace a signed proof with a raw ID just to get the UI working.
- [ ] `cart.ts` imports backend `parseCartCreate`: adapt its caller-side validation/variables to the known command shape without importing backend models/security. Backend validation/ownership remains authoritative. Keep unsupported cart disabled.
- [ ] Private prefetch: `MainLayout` enables user/cart prefetch; gate it off until private safety is proven. Disable hidden calls as well as visible buttons. Public pages must never hydrate session/cart secrets.
- [ ] Links/middleware: `proxy.ts` composes more than the customer router; do not copy dashboard auth into the external client. Adapt country routing from `F/middleware.ts`, but do not reuse fabricated region fallback or accept a bare cart ID as authority. Payment-link handler also imports backend signing/proof utilities: use a supported server exchange, or disable it.
- [ ] Checkout-link route caveat: dashboard route-local actions can proceed and set a cart cookie even after connection errors; never port this fallback. Owner/capability failure must deny access.
- [ ] Logout: donor `signOut` clears cookies inside its successful upstream path; external adaptation must expire local session/cart cookies and private caches even if upstream logout fails.
- [ ] Confirmation: donor `placeOrder` can put `secretKey` in a redirect URL; exchange any unavoidable emailed capability server-side, then redirect to a clean URL. Never keep guest/cart/order secrets in analytics, public caches, logs or durable browser history.
- [ ] Payment: copy provider wrappers/flow only when safe; expose only approved publishable fields, never raw provider JSON/secrets. Backend verifies session-parent, amount/currency, capture/status, inventory and idempotent completion/reconciliation. Preserve duplicate-submit and unknown-outcome states.
- [ ] Runtime JSON/error boundaries: validate cart/search/order/completion/private extension JSON and public projections. Replace raw upstream error displays with safe codes/messages; empty, denied and outage are different states. No simulated success, blind mutation retries or broad CRUD bypass.
- [ ] Enablement: tests for Customer A/B, wrong cart/line/order/address/payment-parent, expired/replayed proof, unsupported country/publication, duplicate/ambiguous checkout, provider down/wrong amount and no secret leakage must pass on an explicitly authorized disposable host before corresponding private/write capabilities ship. Source-stage guards/tests alone do not prove that deployed host.

## Finite build and independent parity audit

1. Copy/adapt in three coherent batches: shell/discovery; product; private/commerce presentation with safe-disabled gates. Track donor → destination → operation → state mapping while coding, not by repeatedly researching the entire schema.
2. Run one bounded **target-only** typecheck/build pass and a final live smoke check. Inspect scripts first; no donor migrations/servers/builds. Run focused existing tests when logic/security changes. Fix concrete failures and rerun only the failed gate. No Playwright screenshots after every change or repetitive lint/test sweeps.
3. Auditor checklist: every route row and every inventory file/component family has a target mapping or explicit justified exclusion; no accidental pagination/hierarchy/gallery/locale/search loss; responsive/reduced-motion/keyboard, image errors, metadata, loading/empty/not-found/denied/outage/pending/unknown states checked; disabled controls make no hidden writes. Do not infer coverage from a screenshot, route count or README.
4. Independent Pi auditor compares actual code and fixes **authorized** accidental gaps in the app without replacing the design or weakening safety. Backend/contract changes, new sessions and real payment/account mutations require separate authorization. If no auditor is available, hand off the matrix honestly; do not invent an audit result.
5. Production is a distinct gate: safe demo/catalog can ship with unavailable commerce; full-commerce readiness requires host/provider/ownership/reconciliation evidence, operational notes and rollback. Record commands/results and what was not run.
6. For recurring friction, record exact source/target paths and the smallest correction; improve this skill/linked map with permission after shipping the app batch. No documentation loop, unlinked proposal or silent installed-copy synchronization.
