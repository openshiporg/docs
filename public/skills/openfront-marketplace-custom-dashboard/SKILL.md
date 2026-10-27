---
name: openfront-marketplace-custom-dashboard
description: Plan and build a custom Openfront Marketplace operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Marketplace custom operator dashboard

Use this skill to adapt Marketplace's current conversational UI or create a separate client without inventing Keystone dashboard/storefront layers. Start from this product's current source—not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Repository: <https://github.com/openshiporg/marketplace>
- Marketplace is not a Keystone vertical. It has no database, no models, no mutations, no migrations, and no `schema.graphql`. A local checkout may contain empty `features/keystone`, `features/platform`, `features/dashboard`, `app/dashboard`, and `migrations` folders; they hold no files and nothing uses them. There are no `/dashboard` routes.
- Routes: `/` (chat, `app/page.tsx`), `/ethos`, `POST /api/completion`, `GET|POST /api/mcp-transport/[transport]` (clients use `/api/mcp-transport/http`), `POST /api/ai-models`, and `GET /api/marketplace/catalog` (bundled mock data only).
- Main UI slice: `features/marketplace/**` (chat, store editor, cart dropdown, AI settings, setup dialog, Stripe/PayPal payment UI).
- Store registry: `marketplace.config.json`, parsed by `app/api/mcp-transport/types/store-config.ts`. Store IDs come from `lib/source-identity.ts` (`source-v2-<platform>-<encoded baseUrl>`).
- MCP tools: `app/api/mcp-transport/tools/{store,product,cart,region}-tools.ts` — `getAvailableStores`, `getAvailableCountries`, `getAvailableRegions`, `discoverProducts`, `discoverRestaurantMenus`, `getProduct`, `getOrCreateCart`, `createCart` (deprecated), `viewCart`, `getCart`, `addToCart`, `updateCartItem`, `removeCartItem`, `setShippingAddress`, `setShippingMethod`, `setRestaurantFulfillment`, `validateCartForCheckout`, `getCheckoutLink`, `getAvailablePaymentMethods`, `initiatePaymentSession`, `completeCart`, `loginUser`, `authenticateUser`. `tools/graphql-tools.ts` exists but is not exposed.
- Adapters (the "mutations" this product sends): `app/api/mcp-transport/adapters/openfront` (named operations such as `SearchProducts`, `GetProduct`, `CreateActiveCart`, `UpdateActiveCart`, `AddShippingMethod`, `InitiatePaymentSession`, `CompleteActiveCart`, `GetStore`) and `adapters/openfront-restaurant` (`Marketplace*` operations such as `MarketplaceRestaurantMenu`, `MarketplaceCreateRestaurantCart`, `MarketplaceUpdateRestaurantFulfillment`, `MarketplaceCompleteRestaurantCart`). `shopify`, `bigcommerce`, and `woocommerce` have no adapter.
- Boundaries in `lib/**`: outbound fetch rules (`remote-endpoint.ts`), request limits (`request-budgets.ts`), model tool allowlist and output filter (`marketplace-ai-boundary.ts`), MCP UI action rules (`mcp-action-policy.ts`), browser storage (`cart-storage.ts`, `session-storage.ts`, `marketplace-storage.ts`, `chat-thread-storage.ts`, `marketplace-profile.ts`), and request headers (`mcp-client-headers.ts`).
- Environment: `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `OPENROUTER_MAX_TOKENS`, `MARKETPLACE_DISABLE_LOCAL_AI`, `MARKETPLACE_CUSTOM_AI_ORIGINS`. Tests live in `tests/*.test.ts`.

Explain this difference before asking what to customize. Do not invent a Keystone dashboard, storefront GraphQL API, or database-backed workflow for Marketplace.

The current product focus is curated store configuration, adapter capabilities, egress controls, MCP tools, conversational completion, carts/sessions, and operational diagnostics. This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Marketplace source checkout, and which revision/deployment is the target?
2. There is no built-in operator dashboard today. Do they want to add operator screens to this app or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which operator jobs, screens, actions, roles, approvals, and scope are required?
5. What visual references, interaction direction, responsive targets, and deployment constraints matter?
6. Which non-production host, schema export, test data, and test identities are available?

Restate the brief, inspect the supplied source, identify presentation-only changes versus backend-contract work, and ask for confirmation before broad implementation.

## Required source inspection

Before proposing code:

1. Enumerate the actual app and API routes.
2. Trace the conversational UI, completion transport, MCP tools, store registry, adapters, egress policy, carts, and session handoff.
3. Record every adapter/tool contract, capability check, browser/server boundary, and merchant checkout handoff.
4. Inspect tests, configuration validation, request limits, redirect/DNS controls, and storage behavior.
5. Produce a capability matrix: verified, presentation-only, needs a server/adapter contract, blocked, or absent.

Do not claim the skill already knows a deployed contract. It knows where and how to discover the exact calls. Generated CRUD or a schema-valid document is not proof of safe access.

## Built-in versus separate client

### Adapt the built-in client

- Keep route files thin.
- Put product UI and orchestration in the existing feature slice.
- Reuse current session, transport, design tokens, loading/error states, and named server operations where they are safe.
- Do not duplicate price, availability, lifecycle, payment, clinical/legal, or authorization decisions in components.

### Build a separate client

- Use a trusted, environment-pinned endpoint and checked named operations.
- Keep privileged credentials and opaque capabilities server-side behind a BFF when needed.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, relationships, provider IDs, or endpoint URLs.
- Pin the exact schema, generate strict types, runtime-validate JSON/custom scalars, and fail closed when a required contract is absent.
- Test anonymous, wrong-user, wrong-tenant/store/organization, stale, duplicate, timeout, and provider-failure behavior against disposable data.

## Product-specific boundary

Design around curated store configuration, adapter capabilities, egress controls, MCP tools, conversational completion, carts/sessions, and operational diagnostics. Preserve the product's real workflow nouns and authority boundaries. Never rename Ecommerce products/orders into this vertical or borrow Ecommerce GraphQL roots without validating that they exist and are authorized here.

For consequential actions, require one bounded server projection or command that validates actor, scope, related-record ownership, state transition, transaction/concurrency, idempotency, provider behavior, and audit evidence. If it does not exist, request the backend contract and show the feature as unavailable.

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

Never present a source path, generated schema, HTTP 200, or attractive empty state as proof that the operator dashboard workflow is operational.
