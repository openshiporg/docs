---
name: openfront-law-firm-custom-storefront
description: Plan and build a custom Openfront Law Firm storefront by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Law Firm custom storefront

Use this skill to adapt the built-in Law Firm public site, customer consultation account, and client portal, or to build a separate client. Start from this product's current source—not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Repository: <https://github.com/openshiporg/openfront-law-firm>
- Storefront slice: `features/storefront` (`screens/`, `actions/` for account, reset, and consultation requests, `lib/` for consultation data, attorneys, and `storefront-settings.ts`, `content.ts`, `navigation.ts`).
- Client portal: `features/storefront/portal` (`screens/`, `actions.ts`) and `features/portal`; server helpers in `features/keystone/lib/portal-auth.ts` and `features/keystone/mutations/portalWorkflows.ts`.
- Thin route files at the top of `app/` (no route group): `/`, `/practice-areas`, `/practice-areas/[slug]`, `/attorneys`, `/attorneys/[slug]`, `/about`, `/contact`, `/privacy`, `/disclaimer`, `/accessibility`, `/consultation`, `/consultation/received`, `/consultation/payment/[id]` (legacy redirect to the appointment), `/account`, `/account/signin`, `/account/signup`, `/account/reset`, `/account/appointments/[id]`, `/portal`, `/portal/accept`, `/portal/signin`, `/portal/share/[shareId]`.
- Server contract: `features/keystone/models/**` (notably `PracticeArea`, `AttorneyProfile`, `PublicSitePolicy`, `Consultation`, `Intake`, `PortalAccount`, `PortalMatterAccess`, `PortalShare`, `PortalSession`), `features/keystone/mutations/customerConsultations.ts`, and `schema.graphql`.

Customer operations: queries `consultationCatalog`, `consultationCatalogPage`, `consultationService`, `consultationAvailability`, `customerConsultations`, `customerConsultationPage`, `customerConsultation`, `portalSharedResource`; mutations `registerConsultationAccount`, `bookClientConsultation`, `cancelOwnConsultation`, `acceptPortalInvitation`, plus Keystone's `authenticateUserWithPassword`, `sendUserPasswordResetLink`, and `redeemUserPasswordResetToken`.

Gates in current source: the public site serves exactly one active firm; accounts need a published privacy notice and booking needs a published first-contact notice (`PublicSitePolicy`); anonymous intake is off (`PUBLIC_INTAKE_ENABLED = false`); booking hours are fixed weekdays 9:00 to 17:00; consultation fees are displayed but not collected; portal clients see only explicitly shared documents, invoices, and threads.

Explain that features beyond these (payments, anonymous intake, portal uploads) need new bounded backend contracts before presentation work can start. This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Law Firm source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in storefront or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which customer journeys, routes, content, brand, devices, accessibility, and commerce/booking states are required?
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

Design around the public firm site, consultation booking, customer accounts, and the client portal. Preserve the product's real workflow nouns and authority boundaries. Never rename Ecommerce products/orders into this vertical or borrow Ecommerce GraphQL roots without validating that they exist and are authorized here.

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
