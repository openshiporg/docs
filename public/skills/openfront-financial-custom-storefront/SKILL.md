---
name: openfront-financial-custom-storefront
description: Plan and build a custom Openfront Financial client portal by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Financial custom storefront (client portal)

Use this skill to adapt the built-in Financial client portal or create a separately deployed client. Start from this product's current source, not Ecommerce conventions, screenshots, or another vertical's schema. There is no cart, checkout, or payment in this product; the "storefront" is an investor portal.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Source repository: `https://github.com/openshiporg/openfront-financial`. Confirm the exact checkout path and revision the user wants to target.
- Built-in Financial customer experience, screens, components, data loaders, and session helpers: `features/storefront` (`screens`, `components`, `lib/data` with `markets.ts`, `trading.ts`, `orders.ts`, `portfolio.ts`, `funding.ts`, `watchlists.ts`, `activity.ts`, `statements.ts`, `account.ts`, `user.ts`, `brand.ts`, `cookies.ts`; disclosure text in `lib/brand.ts`).
- Thin customer-facing route entry points: `app/(storefront)/page.tsx`, `app/(storefront)/markets/**`, `app/(storefront)/(customer)/**` (portfolio, trade, orders, funding, watchlist, activity, statements; the group layout swaps in the sign-in form when signed out), and `app/(storefront)/account` (login and dashboard parallel slots).
- Server contract: `features/keystone/models/**`, `features/keystone/access.ts`, `features/keystone/mutations/index.ts`, `features/keystone/lib/financialLifecycle.ts`, `features/keystone/lib/financialQueries.ts`, `features/keystone/lib/publicStorefrontSettings.ts`, and `schema.graphql`.
- Other public endpoints: `app/api/public/trades/route.ts` (public trade feed for enabled public profiles).

Explain that `features/storefront` is the behavioral reference for routes, states, GraphQL calls, cookies, and disclosures. It should guide what is preserved or changed.

The current product focus is the public market board and quotes (`publicMarketQuotes`, `publicMarketQuote`), asset detail with price history, store identity and disclosure (`publicFinancialIdentity`), sign-in and optional sign-up (`PUBLIC_SIGNUPS_ALLOWED`), trading (`placeFinancialOrder`, market and limit), order history and detail with cancel (`ownedOrders`, `cancelFinancialOrder`), portfolio (`ownedPortfolio`), funding (`requestFinancialTransfer`, `ownedTransfers`), linked banks with simulated micro-deposit verification (`linkOwnedBankAccount`, `verifyOwnedBankAccount`, `setActiveUserPrimaryBankAccount`, `deactivateOwnedBankAccount`), watchlists (`changeOwnedWatchlistSymbol`), activity (`ownedLedgerEntries`), statements, dividends, and tax lots (`ownedStatements`), and profile and password. This list is orientation, not proof that every flow is safe or complete. Orders fill by local simulation, transfers wait for an operator, and no money moves.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Financial source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in portal or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which customer journeys, routes, content, brand, devices, accessibility, and signed-out behavior are required?
5. Should sign-up be open (`PUBLIC_SIGNUPS_ALLOWED`), and how will customers be onboarded to accounts?
6. What visual references, interaction direction, responsive targets, and deployment constraints matter?
7. Which non-production host, schema export, test data, and test identities are available?

Restate the brief, inspect the supplied source, identify presentation-only changes versus backend-contract work, and ask for confirmation before broad implementation.

## Required source inspection

Before proposing code:

1. Enumerate the actual app routes for this product under `app/(storefront)`.
2. Trace the built-in screen components and every data loader and server action they call.
3. Enumerate GraphQL documents and operation names used by those call sites (`StorefrontMarketQuotes`, `StorefrontMarketQuote`, `StorefrontPriceHistory`, `StorefrontPortfolio`, `StorefrontPlaceOrder`, `StorefrontOrders`, `StorefrontOrderDetail`, `StorefrontCancelOrder`, `StorefrontFunding`, `StorefrontRequestTransfer`, `StorefrontLinkBankAccount`, `StorefrontVerifyBankAccount`, `StorefrontWatchlists`, `ChangeWatchlistSymbol`, `StorefrontActivity`, `StorefrontStatements`, `StorefrontSignIn`, `StorefrontSignUp`, `StorefrontSignOut`, and the account mutations).
4. Read `schema.graphql`, list access (reads filtered to the session user; generic writes mostly disabled), field access, and the custom query and mutation resolvers.
5. Record actor, owner scope, inputs, outputs, decimal string formats, idempotency key, order refusal reasons (approval policy, KYC and risk-profile status, margin, excluded symbols, maximum position size), and error states for each required operation.
6. Inspect the session cookie (`keystonejs-session`, set server-side, 12-hour expiry), `NEXT_PUBLIC_BACKEND_URL`, the unconfigured-store state, and runtime configuration touched by the requested flow.
7. Produce a capability matrix: verified, presentation-only, needs backend contract, blocked, or absent.

Do not claim the skill already knows a deployed contract. It knows where and how to discover the exact calls. Generated CRUD or a schema-valid document is not proof of safe access.

## Built-in versus separate client

### Adapt the built-in client

- Keep route files thin.
- Put product UI and orchestration in the existing feature slice.
- Reuse current session, transport, design tokens, loading/error states, and named server operations where they are safe.
- Do not duplicate balance, valuation, order-eligibility, approval, or authorization logic in components.

### Build a separate client

- Use a trusted, environment-pinned endpoint and checked named operations.
- Keep the session token server-side behind a BFF when needed; never expose it to browser scripts.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, relationships, account IDs you have not checked, or endpoint URLs.
- Pin the exact schema, generate strict types, runtime-validate JSON/custom scalars and decimal strings, and fail closed when a required contract is absent.
- Generate a stable idempotency key per order or transfer intent and reuse it on retry.
- Test anonymous, wrong-user, stale, duplicate, timeout, and refused-order behavior against disposable data.

## Product-specific boundary

Design around recorded balances with stated coverage, paper orders, operator-settled transfers, and owner-scoped records. Preserve the product's real workflow nouns and authority boundaries. Keep the disclosure "Paper trading only. Orders are not sent to an exchange and no real money moves. Quotes may be delayed. Not investment advice." visible. Never present quotes as live, orders as executed at a broker, transfers as moved money, banks as verified by a bank, or recommendations and public trades as advice or performance claims, and never invent returns, testimonials, or track records. Do not borrow Ecommerce GraphQL roots (carts, checkout, payment sessions) without validating that they exist and are authorized here.

For consequential actions, require one bounded server command that validates actor, owner scope, related-record ownership, state transition, approval policy, transaction/concurrency, idempotency, and audit and ledger evidence. If it does not exist (for example self-service brokerage account opening, customer transfer cancellation, or generating statement documents), request the backend contract and show the feature as unavailable.

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
