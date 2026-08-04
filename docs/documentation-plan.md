# Openfront documentation implementation plan

**Plan date:** 2026-07-18  
**Branch:** current `main`; all changes remain uncommitted.

## Objective

Make the Docs repository the coherent public documentation source for Openfront and Openship. Present Openfront as an open-source platform family for every vertical while keeping every capability, setup, security, runtime, and limitation statement traceable to current source.

## Architecture decisions

- Keep ecommerce and Restaurant as canonical detailed roots.
- Give every maintained product a searchable vertical overview at `/docs/openfront/{vertical}`. Single-page product guides may link back to shared family pages rather than duplicating setup and deployment instructions.
- Keep maturity classifications and audit verdicts in internal evidence files. Public pages use straightforward product names, capabilities, and plain factual limitations.
- Treat directly inspected current source as authority. Use dated audits as secondary historical evidence, not as a substitute for current routes, models, operations, integrations, onboarding, migrations, scripts, and deployment configuration.
- Link only verified product discovery pages under <https://openship.org/products>; do not convert catalog availability or marketing labels into capability or release claims.
- Preserve Openship as its own product source and repair its existing correctness/link defects after Openfront family coverage is coherent.

## Ordered tasks

### Phase 1 — evidence and information architecture

- [x] Inventory current docs routes, source loading, root metadata, navigation switchers, homepage, search and LLM exports.
- [x] Inventory all 23 Openfront repositories plus the non-Git CRM workspace.
- [x] Inspect current source directly, then use the 2026-07-12 through 2026-07-16 audits only to locate claims that needed re-verification.
- [x] Write `docs/documentation-coverage-matrix.md`.
- [x] Keep shared guidance inside the relevant product documentation instead of a standalone guide.

**Acceptance:** Every maintained repo appears once in the internal matrix; public pages do not expose maturity labels or audit taxonomy.

### Phase 2 — shared Openfront truth

- [x] Document ownership and marketplace boundaries in the relevant product pages.
- [x] Document canonical architecture and vertical-difference rules.
- [x] Document safe local setup without claiming every repo currently boots.
- [x] Document schema/workflow conventions and public-contract boundaries.
- [x] Document onboarding implementation states and verification rule.
- [x] Document integration/adapter boundaries.
- [x] Document security and production-hardening gates.
- [x] Document deployment prerequisites, migration discipline and rollback expectations.
- [x] Keep the dated evidence matrix internal and publish product-specific technical limitations in context.

**Acceptance:** The eight requested coverage dimensions are discoverable in navigation and search; canonical ecommerce/Restaurant patterns remain consistent.

### Phase 3 — vertical coverage

- [x] Replace Grocery, Gym, Hospital, Hotel and Dealership “Coming Soon” stubs with source-backed overviews.
- [x] Add product pages for Barbershop, Coffee Shop, Real Estate, Salon, Marketplace, Rental, UIKit, and the other public Openfront products.
- [x] Add detailed source-backed pages for Construction, Convenience, Airline and Law Firm.
- [x] Cross-link cataloged verticals to verified Openship product-discovery pages.

**Acceptance:** Every public Openfront product has documentation covering overview, architecture difference, setup/onboarding, schema/workflow, integrations, security, deployment, and concrete current limitations.

### Phase 4 — navigation, search and correctness

- [x] Expand the mobile section switcher and make the long product list scroll safely at small heights.
- [x] Expand root color mapping and homepage discovery with simple product names and capabilities.
- [x] Refresh `product-config.tsx` copy, remove the HIPAA claim and fix the Ethos URL.
- [x] Fix the product-page GitHub source URL.
- [x] Repair known old scoped links and Openship copy/paste wording.
- [x] Add a deterministic internal-link checker and package script.

**Acceptance:** Every new page is reachable from navigation; search/LLM endpoints include it automatically through the existing source collection; no known internal docs link points to an absent route.

### Phase 5 — verification and review

- [x] Run MDX generation/typecheck.
- [x] Run the production docs build.
- [x] Run the internal-link checker and inspect external-link samples.
- [x] Start the docs site without changing product repos.
- [x] Verify representative desktop/mobile widths, navigation, H1 rendering, overflow, and visible error states in a real browser.
- [x] Review the final diff for fabricated claims, status drift, unrelated edits and accidental product-repo changes.
- [x] Confirm Git state remains on the original branch with all docs changes uncommitted.

**Acceptance:** Build, typecheck, links and responsive browser checks pass; only the docs repo changed; owner dirty work remains intact; no commit exists.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Concurrent product work makes documentation stale | Date internal evidence, link to source, and state limitations in the relevant workflow. |
| Older “all pass” audit conflicts with current source | Use directly inspected source as authority and keep dated audit conclusions historical. |
| Many product roots overwhelm navigation | Keep the product switcher compact, title-only, deliberately ordered, and scrollable at small heights. |
| Repeated setup/deployment text drifts | Centralize family rules; vertical pages document only differences and blockers. |
| Catalog copy overstates products | Use os.org for discovery links only, never readiness evidence. |
| Existing dirty docs are overwritten | Add new files and make targeted edits only; do not remove or rewrite the existing untracked audit. |

## 2026-07-20 family refresh

A new repository appeared after the 2026-07-18 inventory and several existing working trees gained customer/operator routes and bounded operations.

- [x] Re-inventory all 23 `/Users/junaid/Code/openfronts/openfront*` repositories, CRM, Openship, and current product-catalog routes from direct source.
- [x] Add `data/openfront-products.json` as the public product manifest and derive homepage cards, product configuration, mobile section navigation, and tab colors from it.
- [x] Add Openfront Pharmacy to every discovery and coverage surface.
- [x] Write Pharmacy overview, architecture/workflows, getting started, integrations/boundaries, and limitations guides with pharmacist authority, dispensing, recall, cold-chain evidence, and non-certification boundaries.
- [x] Expand Marketplace into overview, architecture/workflows, getting started, integrations/boundaries, and limitations guides; retain merchant-owned checkout and Openfront-only current adapter truth.
- [x] Refresh public vertical pages against current routes, model relationships, named operations, integrations, onboarding, runtime scripts, tenancy, and limitations.
- [x] Remove public audit/maturity wording and replace it with direct capability and limitation language.
- [x] Add a product coverage checker that compares the manifest, docs roots, navigation consumers, required deep guides, public copy, coverage matrix, and—when present—the sibling implementation inventory.
- [x] Run typecheck, tests, build, links, product coverage, advertised-URL checks, and responsive browser checks; record exact results below.

## Presentation correction

On 2026-07-18, public maturity taxonomy was removed at the owner's direction. The homepage, product configuration, navigation, metadata, and product landing pages now use straightforward names and capabilities. The public family status page was removed; classifications remain only in internal evidence files.

## Verification record

Completed 2026-07-18:

- `npm run types:check` passed.
- `npm run build` passed and generated 191 static pages after removing the public family status page.
- `npm run check:links` passed across 86 MDX files.
- Search returned the new Construction page and section results.
- Headless Chromium checks passed for the homepage, Financial, Restaurant, Airline and Hospital at 1440x900, 768x1024, 390x844 and 320x700 with no maturity taxonomy, horizontal overflow, failed responses, page errors, or application console warnings/errors. Financial showed the agentic operations/orchestration framing. The mobile product switcher stayed within the viewport and navigated from Airline to Law Firm.
- Public GitHub links used by the new pages returned HTTP 200. Four local origins that returned 404 without credentials were not published as source links.
- `os.org` links were added as requested; their availability could not be checked from this environment because `os.org:443` was unreachable during verification.
- Final Git state remained on `main` at the starting commit with all changes uncommitted.

Completed 2026-07-23 after the final source refresh:

- `npm test` passed after the owner scope correction. Exactly 19 public products agree across the shared manifest, docs roots, homepage/navigation/config consumers, public-copy rules, coverage matrix, sibling source inventory, and 38 product-specific dashboard/storefront skills. Product docs meet the enforced substantive functionality/limitation topics; all internal links resolve across 118 MDX files.
- `npm run check:external` passed with redirects enabled: 57 retained site/repository/product/source-path/image/demo checks reached final HTTP 200 responses.
- `npm run types:check` passed (`fumadocs-mdx`, `next typegen`, and `tsc --noEmit`).
- An isolated Next.js 16.1.6 production build passed with the product-specific client guides and generated 255 static pages. The isolated copy used webpack because Turbopack rejects an out-of-root `node_modules` symlink.
- `npm run check:routes` passed against that build: 243 generated routes, five legacy redirects, and 97 discovered internal links/assets had no local 404, broken anchor, missing asset, or visible error state.
- `git diff --check` and public maturity/unsupported-compliance scans passed.
- Agent-browser verified copy/view/hide interactions and responsive overflow for representative Ecommerce, Restaurant, Construction, Marketplace, and Pharmacy client-skill pages. All 38 skills orient the LLM to the product source before interviewing the user.
- A separate live probe found deployment drift: only 62 of 118 current source-backed docs routes and 7 of 19 public product indexes return HTTP 200 from `docs.openship.org`; 56 routes still return 404. All 56 exist and pass locally, so publishing—not local path renaming—is required. See `docs/progress/openfront-openship-marketplace-coverage-audit.md` for the exact split.
- The repository has no ESLint dependency, flat config, or `lint` script. No unrelated lint stack was added.
- Source repositories were not modified. No commit, push, branch, checkout, reset, stash, rebase, merge, or other history operation was run.
