---
name: openfront-sports-agents-custom-storefront
description: Plan and build a custom Openfront Sports Agents public site or client portal by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Sports Agents custom public site

Use this skill to adapt the built-in Sports Agents public site or create a separately deployed client. Start from this product's current source, not E-commerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Repository: private; the user must supply a local checkout. There is no hosted app or demo.
- The built-in public site is a plain placeholder with no design. Screens and composition: `features/storefront/screens`. Every data call: `features/storefront/lib/data.ts`.
- Thin route entry points: `app/page.tsx`, `app/athletes/[id]`, `app/invoice`, `app/invoice/[id]`, `app/invoice/[id]/confirmation`.
- Server contract: `features/keystone/mutations/portal.ts` (all public and portal operations), `features/keystone/lib/invoiceProof.ts` (signed guest proof), `features/keystone/lib/invoiceReceipt.ts` (the one receipt path), `features/keystone/mutations/handlePaymentProviderWebhook.ts`, `features/keystone/models/**`, `features/keystone/access.ts`, and `schema.graphql`.
- Provider boundary: `features/integrations/payment/stripe.ts` behind `features/keystone/utils/paymentProviderAdapter.ts`. The browser uses Stripe.js with `NEXT_PUBLIC_STRIPE_KEY`; the server holds `STRIPE_SECRET_KEY`. Webhook route: `app/api/integrations/payment/[providerCode]/webhook`.

Explain that `features/storefront` is the behavioral reference for routes, states, GraphQL calls, the proof handoff, and the Stripe handoff. It should guide what is preserved or changed.

Current routes: `/` (published athletes), `/athletes/[id]` (athlete and brand inquiry form), `/invoice` (lookup by email and invoice number), `/invoice/[id]?proof=` (invoice and card form), `/invoice/[id]/confirmation?proof=` (confirmation code).

Key operations: queries `agencyName`, `agencyRoster`, `agencyAthlete`, `lookupInvoice`, `guestInvoice`, `myAthleteSummary`, `myDeliverables`, `myInvoices`; mutations `submitInquiry`, `payCommissionInvoice`, `confirmCommissionPayment`. The built-in screens use none of the three `my*` portal queries.

Key models: `Athlete` (public only when `isPublic` and status `client`), `Contact`, `Interaction`, `Task` (created by an inquiry), `CommissionInvoice`, `CommissionInvoiceLine`, `Payment`, `PaymentProvider`.

Rules to preserve: raw lists are not public, so the site uses only the custom operations. Public athlete data is limited to name, sport, league, position, image, and team. `lookupInvoice` returns the same error for a wrong email and a wrong number, and returns a proof signed with `SESSION_SECRET` for one invoice and two hours. Invoice operations accept the proof or the signed-in owner only. Payment is reserved on the server, confirmed with Stripe, and checked for amount and currency before the receipt posts. The payment status is `unknown` when money was taken but the invoice could not take it. Development uses Stripe test keys only.

Known gaps to say out loud: no design, no sign-in or account area on the site, no portal screens, no refund flow, and the webhook has not been run against a live signing secret.

This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Sports Agents source checkout, and which revision is the target?
2. Do they want to adapt the built-in public site or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which visitor journeys, routes, content, brand, devices, accessibility, and payment states are required?
5. What visual references, interaction direction, responsive targets, and deployment constraints matter?
6. Which non-production host, schema export, test data, and test identities are available?

Restate the brief, inspect the supplied source, identify presentation-only changes versus backend-contract work, and ask for confirmation before broad implementation.

## Required source inspection

Before proposing code:

1. Enumerate the actual app routes for this product.
2. Trace the built-in screen components and every data loader/server action they call.
3. Enumerate GraphQL documents and operation names used by those call sites.
4. Read `schema.graphql`, model access, field access, and custom query/mutation resolvers.
5. Record actor, tenant/store/organization scope, inputs, outputs, lifecycle authority, idempotency, and error states for each required operation.
6. Inspect provider adapters, webhooks, workers, uploads, cookies/tokens, and runtime configuration touched by the requested flow.
7. Produce a capability matrix: verified, presentation-only, needs backend contract, blocked, or absent.

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

Design around published athletes, brand inquiries, invoice lookup, and invoice card payment. Preserve the product's real workflow nouns and authority boundaries. Never rename E-commerce products/orders into this vertical or borrow E-commerce GraphQL roots without validating that they exist and are authorized here.

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

Never present a source path, generated schema, HTTP 200, or attractive empty state as proof that the storefront workflow is operational.
