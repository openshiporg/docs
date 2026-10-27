---
name: openfront-analytics-custom-dashboard
description: Plan and build a custom Openfront Analytics operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Analytics custom operator dashboard

Use this skill to adapt the built-in Analytics operator dashboard or create a separately deployed client. Start from this product's current source, not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Source repository: `https://github.com/openshiporg/analytics`. Confirm the exact checkout path and revision the user wants to target.
- Generic Keystone dashboard shell, list/item screens, authentication helpers, onboarding mount, AI chat client, and admin client: `features/dashboard`. This shell is shared with Openfront E-commerce and is expected to stay identical to it.
- Analytics-specific operator navigation, screens, server actions, and workflows mounted into that shell: `features/platform` (`lib/navigation.ts`, `sites`, `shared-links`, `store-settings`, `api-keys`, `onboarding`, `components`). The site dashboard UI lives in `features/platform/sites/components/dashboard` (`SiteDashboard`, `TrafficChart`, `FunnelChart`, `RealtimeView`, `PeriodPicker`, `state.ts`) and is also reused by the public site. Data loaders are in `features/platform/sites/lib/data.ts`; server actions in `features/platform/sites/actions/index.ts`.
- Thin route entry points: `app/dashboard/(admin)/platform/**` (`sites`, `sites/[siteId]` with `realtime`, `sessions`, `sessions/[sessionId]`, `goals`, `funnels`, `events`, `performance`, `settings`; `shared-links`; `store-settings`; `api-keys`). Generic model pages: `app/dashboard/(admin)/[listKey]/**`.
- Server contract: `features/keystone/models/**` (`Site`, `AnalyticsSession`, `AnalyticsEvent`, `Goal`, `Funnel`, `FunnelStep`, `Segment`, `SharedLink`, `StoreSettings`, `User`, `Role`, `ApiKey`), `features/keystone/access.ts`, `features/keystone/utils/apiKeyPolicy.ts`, `features/keystone/mutations/**` (`analyticsReports.ts`, `publicDashboards.ts`, `importSiteSessions.ts`, `deleteVisitorData.ts`, `deleteSiteWithData.ts`, `ensureOnboardingRecord.ts`), the report engine `features/keystone/lib/analytics/engine.ts`, the collector `features/keystone/lib/analytics/collector.ts`, shared helpers `features/lib/analytics/**` (dimensions, filters, periods), and `schema.graphql`.

Explain that `features/dashboard` is the reusable Keystone administration layer and `features/platform` is the product-specific operator experience. These directories show how the dashboard works and which server operations it calls.

The current product focus is per-site analytics: the sites index (`siteSummaries`), overview totals and time series (`siteOverview`), dimension breakdowns (`siteBreakdown`), realtime (`siteRealtime`), visit lists and timelines (`siteSessions`, `siteSession`), goals (`siteGoals`), funnels (`siteFunnel`), custom event properties (`siteEventProperties`), Core Web Vitals (`siteVitals`), filters and saved segments, the install snippet, public visibility and shared links, visitor-data deletion (`deleteVisitorData`), site deletion (`deleteSiteWithData`), store settings, API keys, and onboarding demo data (`ensureOnboardingRecord`, `importSiteSessions`). This list is orientation, not proof that every flow is complete; for example goals, funnels, and segments cannot be edited on the platform pages, and region and city are not filled in for live traffic.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Analytics source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in dashboard or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which operator jobs, reports, actions, roles (for example read-only analysts versus site managers), and permission flags are required?
5. What visual references, chart and table direction, responsive targets, and deployment constraints matter?
6. Which non-production host, schema export, test data (for example the onboarding demo sites), and test identities are available?

Restate the brief, inspect the supplied source, identify presentation-only changes versus backend-contract work, and ask for confirmation before broad implementation.

## Required source inspection

Before proposing code:

1. Enumerate the actual app routes for this product under `app/dashboard/(admin)/platform`.
2. Trace the built-in screen components and every data loader/server action they call.
3. Enumerate GraphQL documents and operation names used by those call sites (the custom report queries above, plus Keystone CRUD such as `createSite`, `updateSite`, `createGoal`, `createFunnel`, `createFunnelSteps`, `createSegment`, `createSharedLink`, `updateSharedLink`, `updateStoreSettings`, and `ApiKey` operations).
4. Read `schema.graphql`, list access (`canReadSites`, `canManageSites`, `canManageSharedLinks`, `canManageSettings`), field access (`Site.isPublic`, `SharedLink.slug`, `ApiKey.tokenSecret`), and custom query/mutation resolvers.
5. Record actor, permission flag, inputs, outputs, period and filter semantics (site timezone, `parseFilters` limits), pagination limits, idempotency (`eventKey`, import keys), and error states for each required operation. Report results are untyped `JSON`; record the actual shapes from the engine.
6. Inspect the tracker (`public/assets/script.js`), `/api/track`, API key authentication (`features/keystone/utils/requestAuthentication.ts`), the MCP route, `/api/completion`, cookies/tokens, and runtime configuration touched by the requested flow.
7. Produce a capability matrix: verified, presentation-only, needs backend contract, blocked, or absent.

Do not claim the skill already knows a deployed contract. It knows where and how to discover the exact calls. Generated CRUD or a schema-valid document is not proof of safe access.

## Built-in versus separate client

### Adapt the built-in client

- Keep route files thin.
- Put product UI and orchestration in the existing feature slice.
- Reuse current session, transport, design tokens, loading/error states, and named server operations where they are safe.
- Remember that `SiteDashboard` and its primitives are also rendered by the public site; changes there affect `/sites/[slug]` and `/share/[slug]`.
- Do not change `features/dashboard` unless the user accepts diverging from the shared Openfront shell.
- Do not recompute metrics, bounce, conversion, funnel, or vitals logic in components; read them from the report queries.

### Build a separate client

- Use a trusted, environment-pinned endpoint and checked named operations.
- Keep privileged credentials server-side behind a BFF. API keys (`of_...` bearer tokens with `read_analytics`, `write_sites`, or `write_shared_links`) must never reach the browser.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, relationships, site ids outside the user's scope, or endpoint URLs.
- Pin the exact schema, generate strict types, runtime-validate the `JSON` report results, and fail closed when a required contract is absent.
- Test anonymous, missing-permission, wrong-scope API key, revoked/expired key, IP-restricted key, stale, duplicate, and timeout behavior against disposable data.

## Product-specific boundary

Design around sites, periods in the site's timezone, filters and segments, goals, funnels, realtime, visits, events, performance, public visibility, and shared links. Preserve the product's real workflow nouns and privacy boundaries: visitors are daily-rotating hashes, the IP is never stored, and there is no cross-day identity. Never show numbers the instance has not recorded, invent benchmarks, or imply per-site ownership or teams that the schema does not have (every site is visible to every `canReadSites` user). Destructive actions (`deleteSiteWithData`, `deleteVisitorData`) need explicit confirmation. Do not borrow Ecommerce GraphQL roots or the inherited MCP commerce tools; they do not exist in this schema.

For consequential actions, require one bounded server projection or command that validates actor, permission, related-record ownership (for example funnel steps using goals from the same site), transaction, idempotency, and error states. If it does not exist (for example editing a funnel's steps in place, data export, or retention), request the backend contract and show the feature as unavailable.

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
- auth, permission, API key, secret, migration, deployment, and rollback notes.

Never present a source path, generated schema, HTTP 200, or attractive empty chart as proof that the operator dashboard workflow is operational.
