# Openfront / Openship / Marketplace documentation coverage audit

Workspace: Docs (`/Users/junaid/Code/docs`)  
Final source-refresh verification: 2026-07-23  
Historical baseline audit: 2026-06-21

## Final source-refresh report — 2026-07-23

This refresh inspected the current working-tree routes, model registrations, access helpers, controlled GraphQL operations, integration registries, onboarding source, migration directories, package scripts, and deployment configuration for all 23 `openfront*` repositories under `/Users/junaid/Code/openfronts`, non-Git CRM at `/Users/junaid/Code/gtme/openfront-crm`, Openship at `/Users/junaid/Code/openship`, external Storefront at `/Users/junaid/Code/storefront`, and product/catalog source in `/Users/junaid/Code/os.org`.

Implementation repositories were read-only. Their working trees can be newer than their public origins, so the public docs separate inspected local-source behavior from URL availability. Pharmacy intentionally has no advertised repository, product, or demo URL because its public origin does not represent the implementation documented here. At the owner's direction, Analytics, CRM, Financial, Scheduling, and Social are excluded from the public Openfront product family and their public pages were removed.

### Product functionality and limitation coverage

`data/openfront-products.json` is the shared 19-product source for homepage cards, product config, desktop/mobile navigation, colors, and coverage checks. `scripts/check-product-coverage.mjs` now rejects missing products, public maturity labels, positive unsupported compliance claims, product docs below 500 words, or product docs that omit architecture/schema, operator surfaces, workflow/lifecycle, GraphQL commands/projections, tenancy/ownership, onboarding/setup, integrations/providers, deployment, or limitations.

| Product | MDX pages | Words | Required functionality/limitation topics |
|---|---:|---:|---|
| Ecommerce | 25 | 7,504 | Pass |
| Restaurant | 18 | 8,154 | Pass |
| Airline | 3 | 1,487 | Pass |
| Barbershop | 3 | 738 | Pass |
| Coffee Shop | 3 | 772 | Pass |
| Construction | 3 | 1,620 | Pass |
| Convenience | 3 | 1,520 | Pass |
| Dealership | 3 | 799 | Pass |
| Grocery | 3 | 1,236 | Pass |
| Gym | 3 | 1,068 | Pass |
| Hospital | 3 | 768 | Pass |
| Hotel | 3 | 1,190 | Pass |
| Law Firm | 3 | 1,695 | Pass |
| Marketplace | 7 | 2,982 | Pass |
| Pharmacy | 7 | 4,058 | Pass |
| Real Estate | 3 | 760 | Pass |
| Rental | 3 | 1,050 | Pass |
| Salon | 3 | 958 | Pass |
| UIKit | 3 | 759 | Pass |

This is aggregate source-doc coverage, not a claim that every workflow is operational. Each product page names concrete missing adapters, incomplete boundaries, single-tenant assumptions, manual settlement, worker/setup requirements, or regulated-domain limitations found in source. Marketplace and Pharmacy have separate architecture, setup, integration-boundary, and limitation guides because their risk boundaries need more depth.

### Local verification

All commands ran against the uncommitted working tree:

- `npm test`: passed. Exactly 19 public products agree across the manifest, product roots, homepage/navigation/config consumers, local repository inventory, public copy, coverage matrix, and all 38 product-specific dashboard/storefront skills. All internal links resolve across 118 MDX files.
- `npm run check:external`: passed with redirects enabled. All 57 retained site, repository, product, source-path, image, and synthetic Openship demo API checks reached final HTTP 200 responses. URL response is not capability, deployment, security, payment, compliance, clinical-safety, or operational proof.
- `npm run types:check`: passed with `fumadocs-mdx`, `next typegen`, and `tsc --noEmit`.
- An isolated Next.js 16.1.6 production build passed with the product-specific client guides; 255 static pages were generated. Webpack was used for the isolated copy because Turbopack rejects a `node_modules` symlink outside the copied filesystem root; the source workspace's earlier native Turbopack build had already passed.
- `npm run check:routes` passed against that production build. It fetched 243 generated routes, five legacy redirects, and 97 discovered internal links/assets with no local 404, broken anchor, missing asset, visible error state, or HTTP error.
- `git diff --check`: passed.
- Public-copy scans found no forbidden maturity/status labels or positive HIPAA/PCI/SOC 2/GDPR compliance claims.
- Agent-browser verified the inline copy/view/hide skill controls and responsive overflow behavior for Ecommerce, Restaurant, Construction, Marketplace, and Pharmacy dashboard/storefront guides. It confirmed source orientation precedes the user interview, conventional products distinguish `features/dashboard` from `features/platform`, storefront skills inspect `features/storefront`, products without that layer say so, Marketplace does not invent Keystone/GraphQL layers, and products without advertised source do not guess a repository.

ESLint remains unverified because this workspace has no ESLint dependency, flat configuration, or lint script. No unrelated lint migration was added.

### Live deployment reconciliation

A separate redirect-following probe compared all 118 current source-backed docs routes with `https://docs.openship.org` on 2026-07-23:

- 62 routes returned HTTP 200.
- 56 routes returned HTTP 404.
- Only 7 of 19 product indexes are live: Ecommerce, Restaurant, Dealership, Grocery, Gym, Hospital, and Hotel.
- The 12 product indexes still returning 404 are Airline, Barbershop, Coffee Shop, Construction, Convenience, Law Firm, Marketplace, Pharmacy, Real Estate, Rental, Salon, and UIKit.
- The other 44 live 404s are the 36 new product-specific dashboard/storefront guides; Marketplace `architecture-workflows`, `getting-started`, `integrations-boundaries`, and `limitations`; plus the same four child paths under Pharmacy.
- The seven reachable live product pages referenced 25 same-origin script/style/image assets; all 25 returned HTTP 200. Assets for the 12 unreachable product pages cannot be validated on the deployment because those pages do not exist there yet.
- No tested live route redirected. This is distinct from the advertised-external check, where redirects such as canonical trailing slashes were followed to final HTTP 200 responses.

Every one of the 56 current live 404 paths maps to an existing local MDX route and passed the local production-build crawl; none was an incorrect local href that should be renamed to match the stale deployment. The source routes are reconciled locally, but **the deployment is not fixed**. Publishing this working tree through the owner's normal release workflow is still required before those paths can be expected to resolve on `docs.openship.org`.

The repository remains uncommitted. No commit, push, branch, checkout, reset, stash, rebase, merge, or implementation-repository modification was performed.

## Historical baseline — 2026-06-21

The remaining sections preserve the original pre-refresh audit and are not the final state. Current results are in the 2026-07-23 report above.

### Scope and sources inspected

Docs workspace is the dedicated documentation brain for the Openfront / Openship / Marketplace ecosystem. Its local repo is `/Users/junaid/Code/docs`, but its responsibility is cross-repo public-doc coverage and coordination. Per-vertical workspaces should focus on building and auditing their products; they should not carry the final public-docs burden.

Docs should understand enough of each implementation workspace to document it accurately:

- Openfront ecommerce baseline.
- Openfront Restaurant mature vertical template.
- All Openfront verticals under `/Users/junaid/Code/openfronts/openfront-*`.
- Openship order-routing platform.
- Openfront Marketplace / conversational commerce layer.
- OpenSource Builders where relevant to the Openfront/Openship ecosystem and public docs.

`os.org` remains in Default for now.

Primary sources inspected:

- Docs repo: `/Users/junaid/Code/docs`
  - `content/docs/openfront/**`
  - `content/docs/openship/**`
  - `lib/source.ts`
  - `components/product-config.tsx`
  - `components/DocsSectionSwitcher.tsx`
  - `app/(home)/page.tsx`
  - `app/(home)/ethos/page.tsx`
- Orchestration source: `/Users/junaid/Code/vibeghost/vibeghost-v4.5/docs/openfront-workspace-orchestration.md`
- Canonical implementation sources:
  - `/Users/junaid/Code/openfronts/openfront`
  - `/Users/junaid/Code/openfronts/openfront-restaurant`
  - `/Users/junaid/Code/openship`
  - `/Users/junaid/Code/openfronts/openfront-marketplace`
  - `/Users/junaid/Code/opensource.builders`
- Repo-local notes worth promoting:
  - `/Users/junaid/Code/openfronts/openfront-analytics/docs`
  - `/Users/junaid/Code/openfronts/openfront-restaurant/docs`
  - `/Users/junaid/Code/openfronts/openfront-marketplace/docs/progress.md`
  - `/Users/junaid/Code/opensource.builders/docs`
  - `/Users/junaid/Code/opensource.builders/build.md`
  - `/Users/junaid/Code/opensource.builders/features/keystone/REDESIGN_PLAN.md`

## Current docs site structure

The docs repo is a Next.js + Fumadocs app. `source.config.ts` loads all MDX from `content/docs`. `lib/source.ts` splits the tree into virtual sources:

- Openfront docs: `/docs/openfront/**` backed by `content/docs/openfront/**`
- Openship docs: `/docs/openship/**` backed by `content/docs/openship/**`

There is not currently a separate Fumadocs product source for Openfront Marketplace or OpenSource Builders. Marketplace content would fit under `content/docs/openfront/marketplace` unless a separate top-level product route is desired. OpenSource Builders should probably remain a separate product/site unless it is being referenced from ecosystem/marketplace docs.

The public docs tree currently contains:

| Area | Folder | MDX pages | Status |
|---|---:|---:|---|
| Openfront ecommerce | `content/docs/openfront/ecommerce` | 25 | Covered, but needs stale-link cleanup and source verification pass |
| Openfront restaurant | `content/docs/openfront/restaurant` | 16 | Covered and currently the best vertical/current-state template |
| Openfront grocery | `content/docs/openfront/grocery` | 1 | Stub only; stale relative to repo |
| Openfront gym | `content/docs/openfront/gym` | 1 | Stub only; stale relative to repo |
| Openfront hospital | `content/docs/openfront/hospital` | 1 | Stub only; stale relative to repo |
| Openfront hotel | `content/docs/openfront/hotel` | 1 | Stub only; stale relative to repo |
| Openfront dealership | `content/docs/openfront/dealership` | 1 | Stub only; stale relative to repo |
| Openfront marketplace | none | 0 | Missing from public docs |
| Openship ecommerce/order routing | `content/docs/openship/ecommerce` | 21 | Covered, but has Openfront copy/paste remnants and stale links |
| OpenSource Builders | none | 0 | Not in docs repo; has separate repo docs/README |

## Openfront coverage matrix

| Repo | Public docs folder | Public docs status | Implementation evidence observed | Docs gap |
|---|---|---|---|---|
| `openfront` | `openfront/ecommerce` | Covered: 25 pages | Mature canonical ecommerce repo with 88 Keystone models, broad platform/storefront slices, checkout/storefront/dashboard/OAuth/API routes | Needs link cleanup and periodic source verification against current repo |
| `openfront-restaurant` | `openfront/restaurant` | Covered: 16 pages | Mature restaurant repo with 43 Keystone models, POS, KDS, service floor, staff, reports, menu, inventory, payments, reservations, waitlist | Keep as current-state style template; verify after major implementation changes |
| `openfront-grocery` | `openfront/grocery` | Stub only | 37 models, storefront cart/checkout/products/deals/lists/subscriptions/account, dashboard customers/delivery/fulfillment/inventory/merchandising/orders/pickup/purchasing/subscriptions/suppliers | Replace Coming Soon with current-state docs: storefront, inventory, fulfillment, delivery/pickup, purchasing, subscriptions |
| `openfront-gym` | `openfront/gym` | Stub only | 24 models, class/member/instructor/membership/check-in/billing/reporting routes, Stripe APIs, member portal/account routes | Replace Coming Soon with docs for memberships, classes, scheduling, check-in/kiosk, billing, member portal, reports |
| `openfront-hotel` | `openfront/hotel` | Stub only | 26 models, rooms/bookings/account/amenities/contact/location storefront routes, dashboard reservations/front desk/rooms/rate plans/channels/housekeeping/maintenance/payments | Replace Coming Soon with booking flow, rooms/rates, front desk, channel sync, housekeeping/maintenance, payments |
| `openfront-dealership` | `openfront/dealership` | Stub only | 22 models, inventory/details/compare/contact/financing/service/test-drive/trade-in storefront/API routes, dashboard CRM/deals/finance/service/test-drives/trade-ins/vehicles | Replace Coming Soon with vehicle inventory, CRM/leads, deal desk, finance, test drives, trade-ins, service |
| `openfront-hospital` | `openfront/hospital` | Stub only | 12 models, appointment booking, intake access route, dashboard appointments/communications/intake/patients/reports/schedules | Replace Coming Soon with appointments, patient intake, provider schedules, communications, reports; be careful with compliance claims |
| `openfront-salon` | Missing | Missing | 40 models, services/stylists/team/book/appointments/gift-cards/reviews/gallery storefront, dashboard appointments/checkout/commissions/resources/schedules/waitlist | Add folder and docs for booking, services/stylists, checkout, schedules/resources, commissions, gift cards/waitlist |
| `openfront-barbershop` | Missing | Missing | 17 models, appointment/barbers/book/services storefront, dashboard booking/customers/POS/queue/reports/services/staff | Add folder and docs for services/barbers, booking, walk-in queue, POS, customers, reports |
| `openfront-rental` | Missing | Missing | 14 models, rentals/requested/agreements/bookings routes, dashboard inventory/availability/reservations/agreements/payments/reports/customers | Add folder and docs for rental catalog, availability, reservation request, agreements, payments, reports |
| `openfront-real-estate` | Missing | Missing | 11 models, listing detail storefront, dashboard leads/listings/pipeline/showings/reports | Add folder and docs for listings, leads, pipeline, showings, reporting |
| `openfront-coffee-shop` | Missing | Missing | 15 models, menu/checkout/order-confirmed storefront, dashboard menu/orders/POS/reports, loyalty/menu/order/payment models | Add folder and docs for menu ordering, checkout, POS, loyalty, inventory, reports |
| `openfront-analytics` | Missing public docs; repo-local docs exist | Missing from public docs | 19 models, analytics routes for realtime, events, reports, sessions, sources, settings, public share routes; `openfront-analytics/docs` has 26 repo-local notes | Promote/consolidate repo-local docs into public current-state docs; likely high value because source material already exists |
| `openfront-financial` | Missing | Missing | 21 models, trading/funding/markets/orders/settings/watchlist storefront, dashboard accounts/advisory/orders/portfolio/reporting/transfers, public/storefront API routes | Add folder only after product/compliance positioning is clarified; avoid overclaiming regulated workflows |
| `openfront-social` | Missing | Missing | 12 models, discovery/listing routes and product-specific README with current direction | Add early product-direction/current-status docs if this becomes public-facing |
| `openfront-uikit` | Missing | Missing | 13 models, kits/checkout/token/registry access routes, dashboard access/catalog/orders/payments | Add docs when UIKit is meant to be consumed as productized component kit |
| `openfront-marketplace` | Missing public docs | Missing | Stateless Next.js conversational commerce app and MCP gateway; no Keystone/Prisma DB; routes for chat, ethos, completion API, MCP transport; Openfront adapter implemented; Shopify/WooCommerce/BigCommerce only placeholders | Add marketplace docs from repo README + `docs/progress.md`: architecture, adapter protocol, store curation, privacy/data-flow, Openfront-only current support, security gaps, run/setup |

## Openship coverage matrix

| Repo | Public docs folder | Public docs status | Implementation evidence observed | Docs gap |
|---|---|---|---|---|
| `/Users/junaid/Code/openship` | `content/docs/openship/ecommerce` | Covered: 21 pages | 18 Keystone models; platform slices for API keys, shops, channels, matches, orders; dashboard routes for shops/channels/matches/orders/API keys; handler routes for shop/channel order and tracking flows | Keep as one ecommerce/order-routing docs area, but clean stale Openfront wording, fix broken links, verify integration guides against current adapter interfaces |

Openship docs currently include good conceptual coverage for shops, channels, product matching, dashboard overview, schema visualizer, deployment, API reference, and shop/channel integration guides. Several payment/shipping guide files also exist under Openship but appear copied from Openfront and are not listed in `how-to-guides/meta.json`; they should either be rewritten for Openship or removed from the public tree.

## Marketplace and OpenSource Builders coverage matrix

| Repo | Public docs status | Implementation/docs evidence observed | Recommended docs treatment |
|---|---|---|---|
| `/Users/junaid/Code/openfronts/openfront-marketplace` | Missing from docs repo | Product-specific README; `docs/progress.md`; stateless Next.js app; `app/page.tsx`, `app/ethos/page.tsx`, `/api/completion`, `/api/mcp-transport/[transport]`; `features/marketplace`; Openfront GraphQL adapter; MCP UI cart/login/payment flows; local browser storage for carts/sessions/API config | Add `content/docs/openfront/marketplace` if marketplace is part of Openfront public docs. First pages should be current-state, adapter protocol, privacy/data-flow, store config/curation, checkout flow, and known gaps. Avoid claiming mature multi-platform support until non-Openfront adapters exist. |
| `/Users/junaid/Code/opensource.builders` | Not in docs repo | Product-specific README; `docs/multi-proprietary-implementation-notes.md`; `build.md`; `CONTRIBUTING_TO_OSB.md`; Keystone models for proprietary/open-source apps and capabilities; public routes for alternatives, OS alternatives, capabilities, categories, compare, ethos, llms; dashboard routes | Keep as separate product unless docs repo intentionally adds a third product source. Reference from ecosystem docs where useful: open-source alternatives directory, skill builder, multi-proprietary app mapping, Openfront/Openship discovery context. |

## Stale starter docs / README matrix

Many vertical repos have real product routes/models but still carry the starter README. Public docs should not blindly copy these READMEs; use implementation files and audit notes instead.

| Repo | README state | Public docs implication |
|---|---|---|
| `openfront` | Product-specific | Good canonical source, but verify current links/commands/features |
| `openfront-restaurant` | Product-specific | Good mature vertical source and style template |
| `openship` | Product-specific | Good source, but docs repo has Openfront copy/paste remnants |
| `openfront-marketplace` | Product-specific | Good direction source, but README overstates multi-platform support versus current Openfront-only adapter |
| `openfront-social` | Product-specific | Useful early product-direction source |
| `opensource.builders` | Product-specific | Useful source for OSB docs if/when included |
| `openfront-analytics` | Starter-stale | Use repo-local `docs/` and implementation, not README |
| `openfront-barbershop` | Starter-stale | Use routes/models/features, not README |
| `openfront-coffee-shop` | Starter-stale | Use routes/models/features, not README |
| `openfront-dealership` | Starter-stale | Use routes/models/features, not README |
| `openfront-financial` | Starter-stale | Use routes/models/features, not README; be careful with regulated claims |
| `openfront-grocery` | Starter-stale | Use routes/models/features, not README |
| `openfront-gym` | Starter-stale | Use routes/models/features, not README |
| `openfront-hospital` | Starter-stale | Use routes/models/features, not README; avoid unverified HIPAA claims |
| `openfront-hotel` | Starter-stale | Use routes/models/features, not README |
| `openfront-real-estate` | Starter-stale | Use routes/models/features, not README |
| `openfront-rental` | Starter-stale | Use routes/models/features, not README |
| `openfront-salon` | Starter-stale | Use routes/models/features, not README |
| `openfront-uikit` | Starter-stale | Use routes/models/features, not README |

## Product config, navigation, and ethos findings

| File | Finding | Risk / action |
|---|---|---|
| `lib/source.ts` | Correctly splits `openfront` and `openship` docs into separate Fumadocs sources. | Marketplace can be added under `openfront/marketplace` without new route plumbing. A separate OSB product would need a source split and route/layout updates. |
| `components/DocsSectionSwitcher.tsx` | Hard-codes Openfront sections: ecommerce, restaurant, grocery, hotel, dealership, hospital, gym. | Missing verticals and marketplace will not appear in the mobile section switcher until added. Stubs appear as if they are real sections. |
| `components/product-config.tsx` | `openfrontCards` only includes ecommerce, restaurant, grocery, gym, hospital, hotel, dealership. `ethosCards` points to `/docs/openfront/ethos`. | Missing product cards for many verticals. `/docs/openfront/ethos` does not exist; actual ethos page is `/ethos`. This config may be unused, but the href is stale if surfaced. |
| `app/(home)/page.tsx` | Home page links Openship ecommerce and the same seven Openfront areas. Ethos card links `/ethos`. | Home page hides missing verticals/marketplace, but promotes several stub verticals as docs destinations. |
| `app/(home)/ethos/page.tsx` | Ethos exists as a non-Fumadocs page at `/ethos`; copy frames the open-source marketplace/merchant-independence vision. | If ethos is intended as docs content, add `content/docs/openfront/ethos` or align product config href to `/ethos`. |

## Stale and broken-link findings

### Broken / stale internal docs paths

The docs app now routes product docs under `/docs/openfront/...` and `/docs/openship/...`, but several pages still link to old unscoped paths.

Openfront pages with old `/docs/ecommerce/...` links:

- `content/docs/openfront/ecommerce/dashboard/index.mdx`
  - `/docs/ecommerce/dashboard/custom`
  - `/docs/ecommerce/products`
- `content/docs/openfront/ecommerce/payment-providers.mdx`
  - `/docs/ecommerce/how-to-guides/custom-payment-provider`
  - `/docs/ecommerce/how-to-guides/create-payment-integration`
- `content/docs/openfront/ecommerce/shipping-providers.mdx`
  - `/docs/ecommerce/how-to-guides/custom-shipping-provider`
  - `/docs/ecommerce/how-to-guides/create-shipping-integration`
- `content/docs/openfront/ecommerce/storefront/index.mdx`
  - `/docs/ecommerce/storefront/custom`

Openship pages with old `/docs/how-to-guides/...` links:

- `content/docs/openship/ecommerce/channels.mdx`
  - `/docs/how-to-guides/create-custom-channel`
- `content/docs/openship/ecommerce/shops.mdx`
  - `/docs/how-to-guides/create-custom-shop`
- `content/docs/openship/ecommerce/what-is-openship.mdx`
  - `/docs/how-to-guides/create-custom-channel`

### Openfront wording inside Openship docs

These should be corrected or fact-checked:

- `content/docs/openship/ecommerce/dashboard/meta.json` says “Admin dashboard for managing your Openfront platform”.
- `content/docs/openship/ecommerce/dashboard/custom.mdx` describes an Openfront dashboard and points at Openfront dashboard concepts.
- `content/docs/openship/ecommerce/getting-started.mdx` frontmatter says “Getting Started with Openfront”.
- `content/docs/openship/ecommerce/products.mdx` frontmatter says “Managing products and inventory in Openfront”.
- `content/docs/openship/ecommerce/how-to-guides/create-payment-integration.mdx`, `create-shipping-integration.mdx`, `custom-payment-provider.mdx`, and `custom-shipping-provider.mdx` appear copied from Openfront and are not currently listed in Openship how-to meta.

## Recommended public docs structure

Use restaurant docs as the style baseline: current-state, plain-language, honest about rough edges, and tied to actual implemented routes/models/workflows.

### Openfront vertical folder template

For each vertical under `content/docs/openfront/{vertical}`:

```text
content/docs/openfront/{vertical}/
  meta.json
  index.mdx                 # what ships today, what is partial, what is missing
  getting-started.mdx        # clone/install/env/migrate/seed/admin/demo path
  storefront/index.mdx       # customer/guest/member/patient-facing flow, if applicable
  operations/*.mdx           # vertical-specific day-to-day workflows
  payments.mdx               # payment/provider status when implemented
  reports.mdx                # analytics/reporting surfaces
  data-model.mdx             # key Keystone models and relationships, not raw schema dump
  integrations.mdx           # external adapters/webhooks/platform links, if applicable
  ai-assistant.mdx           # only when MCP/assistant support is actually wired
```

Do not force every vertical into identical page names. Use the vertical’s real workflow nouns:

- Grocery: inventory, departments/products, delivery/pickup, fulfillment, purchasing/suppliers, subscriptions/lists.
- Gym: memberships, classes/schedule, instructors, check-in/kiosk, billing, member portal, reports.
- Hotel: rooms/rate plans, booking/reservations, front desk, guests, channel sync, housekeeping, maintenance.
- Dealership: vehicles/inventory, CRM/leads, deals/finance, test drives, trade-ins, service.
- Salon/barbershop: services, staff/stylists/barbers, booking, checkout/POS, schedules/resources, queue/waitlist, commissions.
- Rental: catalog, availability, reservations, agreements, payments, customers, reports.
- Analytics: tracking, realtime, events, sessions, sources, goals, reports, sharing.

### Openfront Marketplace docs structure

If marketplace lives inside Openfront docs, add `content/docs/openfront/marketplace`:

```text
content/docs/openfront/marketplace/
  meta.json
  index.mdx                 # what the marketplace is and current implementation status
  getting-started.mdx        # run/deploy/configure stores and AI provider keys
  architecture.mdx           # stateless app, MCP transport, completion endpoint, adapter registry
  adapter-protocol.mdx       # PlatformAdapter contract, required operations, capability discovery
  store-curation.mdx         # curated store config, verification, health/capability status
  checkout-and-payments.mdx  # delegated cart/payment/checkout flow and ownership boundaries
  privacy-and-security.mdx   # transient data flow, localStorage tokens, SSRF/XSS/MCP UI risks
  known-gaps.mdx             # Openfront-only adapter today, placeholders, hardening/test gaps
```

The first marketplace docs should be explicit that:

- it is not a normal Openfront vertical app;
- it has no local Keystone/Prisma database today;
- product/order/customer state is delegated to connected stores;
- only the Openfront adapter is implemented right now;
- other platform names in UI/types are placeholders until adapters exist.

### Openship docs structure

Keep Openship under `content/docs/openship/ecommerce` unless product scope changes. Recommended top-level groups:

```text
Introduction: index, what-is-openship, comparisons, deployment
Core workflow: shops, channels, links, product-matching, orders
Dashboard: dashboard/index, API keys if documented
Integrations: create/integrate custom shops and channels
API: schema-visualizer, api-reference
```

Avoid copying Openfront payment/shipping docs into Openship unless the Openship repo exposes a real matching payment/shipping provider workflow.

### OpenSource Builders docs treatment

OpenSource Builders is a separate product/site. If it gets public docs inside this docs repo, prefer a separate source/product route instead of hiding it under Openfront:

```text
content/docs/opensource-builders/
  meta.json
  index.mdx
  getting-started.mdx
  alternatives-directory.mdx
  skill-builder.mdx
  data-model.mdx
  contributing-data.mdx
  multi-proprietary-mapping.mdx
```

If it remains separate, Openfront/Openship docs can still reference it from ecosystem/marketplace pages when explaining open-source alternatives, skill generation, or discovery flows.

## Runtime/local app documentation correction

Do not use or cite `/Users/junaid/code/autonomous` or old runtime-lab/night-run workflows. That folder/workflow is obsolete and should go away.

When docs need to describe running local apps, use the lightweight `dbhub-runtime` workflow instead:

- resolve repos under `/Users/junaid/code`;
- use Portless `.local` URLs, like `builders.local` currently does;
- use OrbStack/Docker Postgres container `vibe-postgres` with `runtime_*` databases when a runtime database is needed;
- store minimal state under `~/.local/state/vibe-runtime` only if needed.

## Conventions for adding docs

1. Public docs live in `/Users/junaid/Code/docs/content/docs`, not in implementation repos.
2. Compare against the real implementation repo before writing: models, feature slices, routes, README, repo-local notes, and any current audit output.
3. Prefer “what ships today” over aspirational platform marketing. Explicitly label partial/rough flows.
4. Treat starter READMEs as stale unless verified; many vertical repos still have `Next.js + KeystoneJS Starter` README copy.
5. Add `meta.json` with `root: true` for each new Openfront vertical folder and keep `pages` order deliberate.
6. If a new vertical/section should be discoverable in UI, update all relevant hard-coded surfaces:
   - `components/DocsSectionSwitcher.tsx`
   - `components/product-config.tsx` if used
   - `app/(home)/page.tsx` if the homepage should promote it
   - `app/docs/[product]/layout.tsx` color map if it needs a custom tab color
7. Use scoped links: `/docs/openfront/{vertical}/...` or `/docs/openship/ecommerce/...`.
8. Treat `/Users/junaid/Code/openfronts/openfront`, `/Users/junaid/Code/openfronts/openfront-restaurant`, `/Users/junaid/Code/openship`, `/Users/junaid/Code/openfronts/openfront-marketplace`, and `/Users/junaid/Code/opensource.builders` as canonical implementation references for their domains.
9. Implementation workspaces may produce compact audit facts, but Docs workspace should consolidate and maintain public docs.

## Recommended next tasks

1. **Fix the cheap correctness issues first.** Update old internal links, Openship copy/paste wording, and the ethos href mismatch.
2. **Turn visible stubs into honest current-state docs.** Start with grocery, gym, hotel, dealership, and hospital because they already appear in navigation/homepage but only have Coming Soon pages.
3. **Promote existing source material.** Use `openfront-analytics/docs` to create public analytics docs instead of starting from scratch.
4. **Add marketplace docs from existing progress notes.** Start with `content/docs/openfront/marketplace/index.mdx`, architecture, adapter protocol, and privacy/security pages.
5. **Add missing vertical shells deliberately.** Salon, barbershop, rental, real estate, coffee shop, financial, social, and uikit need public folders only when they are meant to be visible.
6. **Decide OpenSource Builders docs placement.** Either keep OSB docs in its own repo/site and only cross-link, or add a third Fumadocs product route/source.
7. **Create a reusable vertical docs template.** A short template will keep future vertical docs consistent without requiring implementation agents to write final docs.
8. **Add a lightweight docs health check.** A script or CI step should catch broken `/docs/...` links and obvious product-name copy/paste mistakes.
