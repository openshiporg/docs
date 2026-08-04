# Openfront / Openship documentation coverage matrix

**Inventory refreshed:** 2026-07-23  
**Docs repository:** <https://github.com/openshiporg/docs>  
**Evidence mode:** direct current-source inventory plus local docs build/browser checks and live URL probes; product runtimes were not started or changed.

## Evidence and status rules

This matrix treats the current working copies as implementation evidence, including clearly identified uncommitted source. A model, route, generated schema, migration, README statement, or prior HTTP 200 is not by itself a production-readiness claim.

Evidence precedence:

1. current product source, checked-in/working-tree migrations, tests, and repo-local documentation;
2. the latest dated fleet/parity audit that independently inspected the relevant gate;
3. older foundation audits as historical evidence only when a later audit has not contradicted them;
4. marketing/catalog copy only for product identity and discovery, never capability or readiness.

Internal audit vocabulary (not for public product presentation):

- **Canonical reference** — architecture baseline used during evidence review.
- **Maintained preview** — substantial maintained product source exists, with release/security/runtime evidence still incomplete or not independently current.
- **Schema foundation** — domain graph and policy work exists while product UI, onboarding, integrations, or runtime proof is incomplete.
- **Experimental** — useful source exists, but its boundary or readiness is narrow.

Public pages do not show these classifications. They use product names, capabilities, and plain factual limitations.

The latest fleet conformance audit (2026-07-16 live section) did not promote any audited product to production-ready. The 2026-07-12 foundation audit records earlier bounded passes, but its broader conclusions are superseded where the later audit found unresolved migration, security, concurrency, build, or runtime gates.

## Current public information architecture

The site is Next.js 16 + React 19 + Fumadocs. `content/docs` is one searchable collection split into Openfront and Openship virtual sources by `lib/source.ts`.

| Public area | Current shape before this plan | Coverage issue |
|---|---|---|
| Openfront ecommerce | 25 MDX pages | Broadest docs, but some setup/deployment/API statements require a fresh source-verification pass. |
| Openfront Restaurant | 16 MDX pages | Best current vertical template; needs family-wide status/security context. |
| Grocery, Gym, Hospital, Hotel, Dealership | One page each | Visible navigation entries are aspirational “Coming Soon” stubs despite substantial source. |
| Construction, Convenience, Airline, Law Firm | No public docs | New schema-foundation builds are absent. |
| Other maintained Openfront repos | No public docs | Analytics, Barbershop, Coffee Shop, Financial, Marketplace, Real Estate, Rental, Salon, Scheduling, Social, UIKit, and CRM are undiscoverable. |
| Openship | 21 MDX pages | Concept coverage exists; stale Openfront wording and old scoped links remain. |
| Navigation/search | Hard-coded seven Openfront sections | Search indexes all MDX, but homepage/mobile switcher/root colors do not represent the maintained family. |

## Maintained Openfront family

The public Openfront family contains 19 products. Product repositories remained read-only for this documentation task. Analytics, CRM, Financial, Scheduling, and Social were explicitly removed from the public Openfront catalog and documentation because they are internal or are not products being shipped as Openfront verticals. The coverage checker compares only the public product set with documentation roots.

| Product / repository | Source-backed boundary | Public coverage before | Internal audit classification | Principal documentation gap |
|---|---|---:|---|---|
| Ecommerce — `openshiporg/openfront` | Multi-region catalog, cart/checkout, orders, inventory, payments, shipping, returns/claims, B2B, OAuth/apps | Detailed | Canonical reference | Add family status/security context; recheck stale setup and launch language. |
| Restaurant — `openshiporg/openfront-restaurant` | Menu, ordering, POS, service floor, KDS, inventory, staff, reporting | Detailed | Canonical reference | Keep canonical architecture consistent; qualify payment/security/runtime statements. |
| Airline — `openshiporg/openfront-airline` | Carrier-scoped airline retailing and passenger service: network/inventory, offers, bookings, fulfillment, airport service, disruption, narrow lifecycle operations and provider boundaries | Missing | Maintained preview | Purpose-built traveler/operator surfaces, serialized inventory consumption, vault integration, live adapters/webhooks and production operations remain deployment work; no safety-critical aviation claim. |
| Barbershop — `openshiporg/openfront-barbershop` | Services, barbers, booking, queue, POS/manual payment, customers and reports | Missing | Maintained preview | Booking/queue workflow, payment scope, onboarding, concurrency/security status. |
| Coffee Shop — local `openfront-coffee-shop`, origin `openshiporg/openfront-coffeeshop` | Menu, pickup ordering, POS, kitchen display, inventory/recipes, loyalty and reports | Missing | Maintained preview | Clarify generated-write boundaries and payment/provider/runtime gaps. |
| Construction — `openshiporg/openfront-construction` | Company/project-scoped construction operations: portfolio/workspaces, bids, estimates, budgets, contracts, changes, execution, field/safety, billing, lifecycle mutations and controlled agents | Missing | Maintained preview | Project workspaces now exist; client/subcontractor portals, onboarding, files, accounting, payments and notification workers remain. |
| Convenience — `openshiporg/openfront-convenience` | Business/store convenience operations: onboarding, purpose-built POS/inventory/purchasing/loyalty/compliance/food/fuel/reconciliation screens, tenders/refunds, cash, API keys and worker operations | Missing | Maintained preview | Payment capture/webhooks, fuel-controller adapters and release-specific operational verification remain. |
| Dealership — `openshiporg/openfront-dealership` | Vehicles, leads, deals, finance intake, test drives, trade-ins and service | Stub | Maintained preview | Replace aspirations with implemented routes/models and clearly separate lead capture from lender/payment processing. |
| Grocery — `openshiporg/openfront-grocery` | Grocery catalog, lots, carts/orders, pickup/delivery, substitutions, purchasing, subscriptions and payments | Stub | Maintained preview | Replace stub; document narrow public projections, fulfillment and provider/security status. |
| Gym — `openshiporg/openfront-gym` | Memberships, classes, instructors, booking/waitlist, check-in/kiosk, billing and member portal | Stub | Maintained preview | Replace stub; document capacity/payment/runtime caveats. |
| Hospital — `openshiporg/openfront-hospital` | Appointments, intake, patients, clinicians, clinical records and communications | Stub | Experimental | Replace stub; no HIPAA, clinical safety, certification, or production PHI claim. |
| Hotel — `openshiporg/openfront-hotel` | Rooms/rates, booking, guest access, front desk, channels, housekeeping, maintenance and payments | Stub | Maintained preview | Replace stub; document guest ownership, channel/payment adapter and concurrency status. |
| Law Firm — `openshiporg/openfront-law-firm` | Firm-scoped legal operations: onboarding, purpose-built intake/contact/matter/document/billing/accounting/portal/governance workspaces, conflicts/ethical walls, exact portal sharing, provider boundaries, API/OAuth, retention and controlled agents | Missing | Maintained preview | Public intake and client portal UI plus real storage, signature, payment, email, court and calendar adapters remain deployment work. |
| Marketplace — local `openfront-marketplace`, origin `openshiporg/marketplace` | Conversational marketplace/MCP gateway with curated store egress, store-bound cart/session capabilities and merchant-origin checkout | Missing | Experimental | Openfront ecommerce is the only enabled adapter; multi-vertical conformance, fixture E2E, health/capability metadata and deployment controls remain. |
| Real Estate — local `openfront-real-estate`, origin `openshiporg/openfront-realestate` | Brokerage listings, leads, saved searches, showings, offers/deals, disclosures, milestones, settlement records and reporting | Missing | Maintained preview | Explain external settlement boundary and feed/credential/lifecycle gaps. |
| Rental — `openshiporg/openfront-rental` | Accommodation listings, quotes, reservations, guest trips, host operations, channels and payments | Missing | Experimental | Document accommodation cutover honestly; latest audit found migration/tenancy/runtime gaps. |
| Salon — `openshiporg/openfront-salon` | Services/stylists, booking, schedules/resources, checkout, memberships, commissions and waitlist | Missing | Maintained preview | Booking/payment/onboarding status and unresolved integrity/runtime gates. |
| UIKit — `openshiporg/openfront-uikit` | Component-kit catalog, releases/files, registry access, orders, payments and entitlements | Missing | Experimental | Clarify registry/payment boundaries and unresolved settlement/runtime gates. |
| Pharmacy — local `openfront-pharmacy`, origin `openshiporg/openfront-pharmacy` | Pharmacist-controlled prescriptions, reviews, dispensing, refills/transfers, lot/expiry inventory, recalls, cold-chain evidence, patient-safe views, OTC commerce, orders and fulfillment | Missing | Maintained preview | No licensure or compliance certification; eRx/wholesaler/insurance/tax adapters fail closed, payment webhook ingress and production workers remain, and consequential work requires authorized humans. |

## Openship and ecosystem coverage

| Product | Source-backed boundary | Current docs | Gap |
|---|---|---:|---|
| Openship — `openshiporg/openship` | Shop/channel adapters, product matching, order routing and fulfillment coordination | Detailed | Fix stale Openfront copy, old links, and copied payment/shipping guides not backed by Openship’s current boundary. |
| Openfront Marketplace | Open marketplace interoperability layer | Missing | Link from family architecture/integrations and clearly state current adapter/security limits. |
| Openship product catalog | Product discovery pages | External | Link only verified `https://openship.org/products` pages; do not use catalog copy or HTTP availability as implementation evidence. |
| External Storefront | Separate composable storefront source at `/Users/junaid/Code/storefront` | One Openfront Ecommerce guide | Current contracts/apps exist for Ecommerce, Restaurant, and Hotel only; keep Storefront's public SDK/GraphQL and merchant-owned checkout boundary distinct from unsupported verticals. |
| OpenSource Builders | Separate open-source discovery product | Separate repo/site | Cross-link only where it explains discovery/open alternatives; do not fold it into Openfront product docs without a product-routing decision. |

## 2026-07-23 direct-source refresh evidence

This refresh did not rely on the older audit tables alone. It enumerated current route files under each repo's `app`, current registrations under `features/keystone/models/index.ts`, current custom schema/operations under `features/keystone/mutations`, integration registries, onboarding source, migration directories, and `package.json` scripts. All implementation repos were read-only. Most Openfront working trees contain substantial uncommitted product work, so the inspected working tree—not only `HEAD` or the public origin—is the capability evidence for this update.

| Product | Current source inspected directly | Evidence used in public docs |
|---|---|---|
| Ecommerce | `openfront/app/dashboard/(admin)/platform`, `app/(storefront)`, `features/keystone/mutations/index.ts`, provider and onboarding source | Product/order/inventory/payment/shipping/returns/B2B operator and storefront routes plus bounded commerce operations |
| Restaurant | `openfront-restaurant/app/dashboard/(admin)/platform`, `app/(storefront)`, `features/keystone/mutations/index.ts`, integrations | Storefront ordering/account; menu, POS, floor, KDS, inventory, staff and report workspaces; named cart/order/payment/floor/kitchen operations |
| Airline | `openfront-airline/app` traveler/airport/operator routes, `features/platform`, model/mutation indexes, onboarding, migrations and package scripts | Traveler trip/offer/booking surfaces plus purpose-built network, inventory, offer, booking, ticketing, airport-service, disruption, control and task operations; live provider/operational proof remains explicitly absent |
| Barbershop | `openfront-barbershop/app/(storefront)`, platform routes, models, mutations, payment webhook route | Services/booking plus booking/customer/POS/queue/staff/report workspaces and named notes/no-show/sale/commission/payment operations |
| Coffee Shop | `openfront-coffee-shop/app/(storefront)`, platform/KDS routes, models, mutation index, payment route | Menu/checkout/confirmation plus menu/order/POS/KDS/report work; bounded menu/order/loyalty reads and the remaining generated-write limitation |
| Construction | `openfront-construction/app/dashboard/(admin)/platform/projects`, `features/platform/*`, models and lifecycle mutations | Portfolio and project workspaces plus named project, bid, cost, contract, field, safety, billing and agent commands |
| Convenience | `openfront-convenience/app/dashboard/(admin)/platform`, `features/platform`, models/mutations | Purpose-built POS, inventory, pricing, purchasing, restricted sales, loyalty, food, fuel, reconciliation, reports and their transaction operations |
| Dealership | `openfront-dealership/app/(storefront)`, platform routes, API intake routes, models/mutations | Vehicle/intake customer routes; CRM/deal/finance/service/delivery/inventory workspaces and lifecycle commands |
| Grocery | `openfront-grocery/app/(storefront)`, platform routes, payment webhook, models/mutations | Customer cart/list/subscription/pickup/order paths and operator inventory/purchasing/fulfillment/delivery operations |
| Gym | `openfront-gym/app/(storefront)`, member/kiosk routes, platform routes, Stripe APIs, models/mutations | Membership/class/trainer/member/kiosk workflows and bounded booking/check-in/billing operations |
| Hospital | `openfront-hospital` public booking/intake routes, platform registration/inpatient/clinical/claims routes, models/mutations | Patient entry and operator clinical workflows with explicit non-certification and authorized-clinician boundaries |
| Hotel | `openfront-hotel/app/(storefront)`, platform routes, payment/channel routes, models/mutations | Room/booking/guest routes; reservation/front-desk/folio/night-audit/housekeeping/channel work and bounded booking/access operations |
| Law Firm | `openfront-law-firm/app/dashboard/(admin)/platform`, models/mutations, OAuth/API/provider/agent source | Purpose-built legal operator workspaces and controlled firm/matter/trust/portal/provider/agent operations; no public portal/intake claim |
| Marketplace | `openfront-marketplace/features/marketplace/server`, MCP tools/Openfront adapter, browser storage, config, tests and package scripts | Curated public-HTTPS store registry, pinned egress, discovery-only model tools, store/cart capabilities, merchant checkout and Openfront-only adapter |
| Pharmacy | `openfront-pharmacy` storefront/platform routes, all model/mutation registrations, integration registries, onboarding, migrations and current evidence | Pharmacist-controlled prescription/dispensing/recall/cold-chain work, bounded projections/operations, fail-closed providers and non-certification caveats |
| Real Estate | `openfront-real-estate/app/(storefront)`, platform routes, models/mutations | Listing/search/lead/showing/offer customer and brokerage operations with settlement kept external |
| Rental | `openfront-rental` stay/quote/trip/agreement routes, host platform routes, models/mutations, manual payment and webhook source | Professional short-term accommodation workflows, host tenancy and manual settlement boundary, kept distinct from Hotel |
| Salon | `openfront-salon/app/(storefront)`, platform routes, model index, payment webhook and absence of a product custom schema | Customer and salon workspaces plus an explicit limitation that generated writes are not yet consolidated into named GraphQL operations |
| UIKit | `openfront-uikit/app/(storefront)`, registry route, platform routes, models/mutations/payment source | Kit/release/review/checkout/access/registry workflows and artifact/payment integrity boundaries |
| Openship | `openship/app`, `features`, current models, adapter handlers and package scripts | Separate user-scoped shop/channel/match/order/fulfillment product; Shopify/Openfront-only compiled adapters, custom-execution egress and credential-field limitations documented; copied Openfront payment/shipping docs removed |
| External Storefront | `/Users/junaid/Code/storefront/apps`, `packages/storefront`, GraphQL contracts and architecture docs | Composable storefront runtime/SDK documented only for implemented Ecommerce, Restaurant, and Hotel contracts; invented repository URL removed |

Source and advertised URL check on 2026-07-23: the redirect-following advertised-link check received final HTTP 200 responses for retained site/repository/product destinations, external images, and realistic synthetic Openship demo API POSTs. UIKit's unauthenticated GitHub URL returned 404, so it is not advertised. Pharmacy's origin exposes only the committed baseline while the docs describe newer working-tree source; no Pharmacy repository, product, or demo URL is advertised. These checks establish URL existence only, not workflow quality, deployment state, settlement, security, compliance, or certification.

A separate live docs probe found that 62 of 118 current source-backed paths return HTTP 200 from `docs.openship.org`; 56 return 404, including 12 of the 19 public product indexes and all 36 new product-specific dashboard/storefront guides. Every missing live path exists and passes the local production crawl. The source tree is reconciled, but deployment is not fixed until the owner publishes it. Exact paths are recorded in `docs/progress/openfront-openship-marketplace-coverage-audit.md`.

## Required coverage model

Each maintained product page must answer, at minimum:

1. what the product is and who owns its source/data/relationships;
2. how it follows or differs from canonical ecommerce/Restaurant architecture;
3. what can be set up from current source and what has not been independently run;
4. principal schema aggregates and an end-to-end workflow;
5. concrete onboarding behavior and missing prerequisites;
6. integration boundaries and adapters, without equating configuration records with execution;
7. security/tenancy/PII/payment caveats from the latest evidence;
8. deployment prerequisites and unverified gates;
9. explicit current limitations and source-evidence date.

Detailed shared pages should carry family-wide architecture, setup, onboarding, integration, security, and deployment rules so vertical pages can focus on real differences instead of copying boilerplate.
