---
name: openfront-travel-agent-custom-storefront
description: Plan and build a custom Openfront Travel Agent storefront by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in pages or creating a safe separate client.
---

# Openfront Travel Agent custom storefront

Use this skill to adapt the built-in Travel Agent storefront or create a separately deployed client. Start from this product's current source, not E-commerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Repository: <https://github.com/openshiporg/openfront-travel-agent> (private; the user needs access). There is no hosted app and no demo. Payments are Stripe test mode in development.
- The storefront is a plain placeholder with the starter's default look, waiting for a design. It exists to make the whole loop work, so treat the markup as a behavior reference only.
- Thin route entry points: `app/(storefront)/**`, with the shared `layout.tsx`. Screens: `features/storefront/screens`. Interactive components: `features/storefront/components`. Server actions: `features/storefront/actions.ts`. GraphQL client for the public operations: `features/storefront/lib/graphql.ts` (no session, no cookie).
- Server contract: `features/keystone/mutations/travel.ts` (public operations at the end of the file), `features/keystone/mutations/index.ts`, `features/keystone/access.ts`, and `schema.graphql`.
- Provider boundary: `features/integrations/payment/stripe.ts` and `features/keystone/utils/paymentProviderAdapter.ts`. The invoice page loads Stripe.js from `js.stripe.com` in `PayInvoice.tsx`.

Explain that `features/storefront` is the behavioral reference for routes, states, GraphQL calls, tokens, and the payment handoff. It guides what is kept or changed.

Current routes: `/`, `/destinations`, `/destinations/[slug]`, `/inquiry` (`?destination=`), `/proposal/[token]`, `/itinerary/[token]`, `/invoice/[token]`, `/lookup`. The proposal, itinerary, and invoice pages are reached only by a private link from an advisor and are not indexed.

Public operations: queries `publicDestinations`, `publicDestination`, `viewProposal`, `viewItinerary`, `viewInvoice`, `lookupBooking`; mutations `submitInquiry`, `acceptProposal`, `payInvoice`, `confirmInvoicePayment`. All return a JSON scalar.

Key models behind them: `Destination`, `Inquiry`, `Proposal`, `ProposalOption`, `ProposalItem`, `TripComponent`, `ItineraryDay`, `ItineraryItem`, `ClientInvoice`, `ClientInvoiceLine`, `PaymentSession`, `Payment`.

Rules to preserve:

- Raw lists (trips, invoices, travelers, payments) return nothing to a signed-out caller. Public data comes only from the operations above.
- Link tokens are long and random. Only their SHA-256 hash is stored, and the raw token is shown once to the advisor. A short or unknown token returns "not found".
- `acceptProposal` stores an immutable snapshot with a hash, creates one component per item, and is safe to repeat.
- `lookupBooking` needs the client's email and a code beginning `TR-` or `INV-`. It returns status data only.
- `payInvoice` creates a Stripe payment intent and a keyed payment session. `confirmInvoicePayment` asks Stripe for the intent, checks status, amount, and currency, then records the payment once. Do not trust the redirect alone. There is no webhook route.
- The card form starts only when the publishable key begins `pk_test_`.
- Copy is labels, states, and errors only.

This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Travel Agent source checkout, and which revision is the target?
2. Do they want to adapt the built-in pages or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which client journeys, routes, content, brand, devices, accessibility, and payment states are required?
5. What visual references, interaction direction, responsive targets, and deployment constraints matter?
6. Which non-production host, schema export, test data, and test identities are available?

Restate the brief, inspect the supplied source, identify presentation-only changes versus backend-contract work, and ask for confirmation before broad implementation.

## Required source inspection

Before proposing code:

1. Enumerate the actual app routes for this product.
2. Trace the built-in screen components and every data loader or server action they call.
3. Enumerate GraphQL documents and operation names used by those call sites.
4. Read `schema.graphql`, model access, field access, and the custom query and mutation resolvers.
5. Record actor, scope, inputs, outputs, lifecycle authority, idempotency, and error states for each required operation.
6. Inspect provider adapters, cookies and tokens, and runtime configuration touched by the requested flow.
7. Produce a capability matrix: verified, presentation-only, needs backend contract, blocked, or absent.

Do not claim the skill already knows a deployed contract. It knows where and how to discover the exact calls. Generated CRUD or a schema-valid document is not proof of safe access.

## Built-in versus separate client

### Adapt the built-in client

- Keep route files thin and put UI in `features/storefront`.
- Reuse the server actions and the public GraphQL client.
- Do not move proposal acceptance, payment confirmation, or lookup rules into components.

### Build a separate client

- Use a trusted, environment-pinned endpoint and the named public operations only.
- Keep tokens out of logs, analytics, and referrer headers.
- Never expose an arbitrary GraphQL proxy or accept browser-selected operations or fields.
- Pin the schema and validate the JSON returned by each operation.
- Test unknown tokens, wrong email, repeated acceptance, repeated payment confirmation, and a failed or cancelled payment against disposable data and Stripe test mode.

## Product-specific boundary

Design around destinations, inquiries, proposals, itineraries, invoices, and booking lookup. Keep the real nouns: trip code, invoice number, option, planning fee. Do not add a cart, a catalog, or an account area that the product does not have.

For consequential actions (accepting a proposal, paying an invoice), use the existing server operation. If a needed one does not exist, ask for the backend contract and show the feature as unavailable.

## Handoff

Report:

- built-in or separate mode;
- source path and revision inspected;
- routes and screens reviewed;
- schema hash and named operations used;
- requested changes and what was preserved;
- capability matrix and backend blockers;
- implemented files and tests;
- responsive and accessibility evidence;
- token, secret, provider, and rollback notes.

Never present a source path, a generated schema, an HTTP 200, or an attractive empty state as proof that a client journey works.
