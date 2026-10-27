---
name: openfront-sportsbook-custom-storefront
description: Plan and build a custom Openfront Sportsbook storefront by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Sportsbook custom storefront

Use this skill to adapt the built-in Sportsbook storefront or create a separately deployed client. Start from this product's current source, not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Source repository: `https://github.com/openshiporg/openfront-sportsbook`. Confirm the exact checkout path and revision the user wants to target.
- Built-in Sportsbook customer experience, screens, data loaders, and UI composition: `features/storefront` (`sportsbook/screens` for the board, sports index, and bet slip; `customer/<area>/screens` for auth, bets, wallet, limits, responsible-play, promotions, disputes, profile, security; `customer/lib/customer-api.ts` for the client and readable error copy; `customer/components` for the layout, brand, and closed states; `lib/data/brand.ts` and `lib/data/catalog-route.ts` for server-side brand and published-catalog lookups).
- Thin customer-facing route entry points at the app root: `app/page.tsx`, `app/sports/**`, `app/events/[event]`, `app/betslip`, `app/promotions`, and `app/account/**`. Styles live in `app/sportsbook.css` plus `features/storefront/**`.
- Customer API: REST routes under `app/api/sandbox/sportsbook/**` backed by `features/sportsbook/customer/**` (auth, registration, catalog, wagering, combination-wagering, cashout, funding, statements, responsible-play, limit-enforcement, verification, promotions, privacy-export, account). The storefront does not call GraphQL for customer data.
- Server contract behind it: `features/keystone/models/**` (especially `Customer.ts` and the wagering, finance, and safer-play lists), `features/keystone/mutations/sportsbook.ts` (`acceptStraightWager`, reachable only through the customer boundary), `features/sportsbook/domain/**` (acceptance gates, combinations, cash-out economics, ledger), and `features/sportsbook/api/sandbox-policy.ts`.

Explain that `features/storefront` is the behavioral reference for routes, states, API calls, cookies, idempotency keys, and provider handoffs. It should guide what is preserved or changed.

The current product focus is the sports board (sports filter, live and favourites views, search), published sport, competition, and event pages, the bet slip (structures, stake, price-change consent, quote countdown, placement, receipt), bet history with cash-out, wallet (deposit, withdraw, holds, bonuses, statements), player limits, breaks and self-exclusion, promotions, support and disputes, profile with identity verification and privacy requests, and device and closure management. This list is orientation, not proof that every flow is safe or complete. Every customer API route returns `SANDBOX_DISABLED` unless `SPORTSBOOK_SANDBOX=true` (and, in production, an isolated `.local` origin and sandbox database), and every provider behind it is a sandbox adapter.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Sportsbook source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in storefront or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which customer journeys, routes, content, brand, devices, accessibility, safer-play messaging, and closed-state behavior are required?
5. What visual references, interaction direction, responsive targets, and deployment constraints matter?
6. Which non-production host with sandbox mode enabled, schema export, onboarded test tenant, and test customer identities are available?

Restate the brief, inspect the supplied source, identify presentation-only changes versus backend-contract work, and ask for confirmation before broad implementation.

## Required source inspection

Before proposing code:

1. Enumerate the actual app routes for this product at the app root (`/`, `/sports/**`, `/events/**`, `/betslip`, `/promotions`, `/account/**`).
2. Trace the built-in screen components and every data loader and customer API call they make.
3. Enumerate the customer API routes and methods used by those call sites, and the server functions each route calls.
4. Read the models, access rules, and resolvers behind them, including which customer lists are omitted from GraphQL.
5. Record actor (customer cookie `openfront_customer`), tenant and brand resolution (`resolveSandboxTenant`, `getStorefrontDisplayBrand`), inputs, outputs, idempotency key and `CustomerCommand` replay, quote expiry, acceptance gate and rejection codes (for example `KYC_REQUIRED`, `GEO_REQUIRED`, `SELF_EXCLUDED`, `LIMIT_EXCEEDED`, `STALE_PRICE`, `INSUFFICIENT_FUNDS`, `QUOTE_EXPIRED`), rate limits, same-origin checks, and error states for each required operation.
6. Inspect provider adapters (`features/sportsbook/adapters/**`, `features/keystone/utils/paymentProviderAdapter.ts`), sandbox webhooks, cookies, and runtime configuration (`SPORTSBOOK_SANDBOX`, `SANDBOX_PUBLIC_ORIGIN`, `SANDBOX_TENANT_SLUG`, `CUSTOMER_IDENTITY_SECRET`, `MAX_PRICE_AGE_MS`) touched by the requested flow.
7. Produce a capability matrix: verified, presentation-only, needs backend contract, blocked, or absent.

Do not claim the skill already knows a deployed contract. It knows where and how to discover the exact calls. A schema-valid request or an HTTP 200 is not proof of safe access.

## Built-in versus separate client

### Adapt the built-in client

- Keep route files thin.
- Put product UI and orchestration in the existing feature slice.
- Reuse current session, transport, design tokens, loading/error and closed states, and customer API calls where they are safe.
- Do not duplicate price, acceptance, limit, exposure, cash-out, balance, bonus, or authorization logic in components.

### Build a separate client

- Use a trusted, environment-pinned origin. The customer API checks the request origin against `SANDBOX_PUBLIC_ORIGIN` and `sec-fetch-site`, so a cross-origin browser client needs a same-origin BFF or a backend change.
- Keep secrets and session cookies server-side or HTTP-only; never expose an arbitrary proxy or accept browser-selected tenant IDs, player IDs, provider IDs, or endpoint URLs.
- Send a fresh idempotency key for each command and reuse it only for retries of the same command.
- Re-quote when a quote expires or a price changes; never place against a cached price.
- Runtime-validate responses and minor-unit money strings, and fail closed when a route is absent or returns `SANDBOX_DISABLED`.
- Test signed-out, wrong-customer, self-excluded, limit-reached, unverified, stale-price, expired-quote, duplicate, timeout, and provider-failure behavior against disposable data.

## Product-specific boundary

Design around the board, published-only catalog, quote-then-place bet slip with readable rejection codes, bet history and cash-out, wallet, safer-play controls, promotions, disputes, and account security. Preserve the product's real workflow nouns and authority boundaries. Never imply that betting is open when the API reports it closed, that a wager is accepted before the server returns an accepted decision, that funds are available beyond the server balance, or that sandbox verification is real identity verification. Keep limits, breaks, and self-exclusion easy to reach. Do not borrow Ecommerce roots (products, carts, checkout) without validating that they exist and are authorized here.

For consequential actions, require one bounded server command that validates customer, tenant, related-record ownership, state transition, transaction/concurrency, idempotency, provider behavior, and audit evidence. If it does not exist (for example any non-sandbox customer API), request the backend contract and show the feature as unavailable.

## Handoff

Report:

- built-in or separate mode;
- source path/repository and revision inspected;
- routes and built-in screens reviewed;
- customer API routes and named server functions used;
- requested changes and what was preserved;
- capability matrix and backend blockers;
- implemented files and tests;
- responsive/accessibility evidence;
- auth, origin, tenant, secret, sandbox-mode, provider, migration, deployment, and rollback notes.

Never present a source path, generated schema, HTTP 200, or attractive empty state as proof that the storefront workflow is operational.
