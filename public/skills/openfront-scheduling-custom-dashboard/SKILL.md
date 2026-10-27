---
name: openfront-scheduling-custom-dashboard
description: Plan and build a custom Openfront Scheduling operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Scheduling custom operator dashboard

Use this skill to adapt the built-in Scheduling operator dashboard or create a separately deployed client. Start from this product's current source—not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Source repository: https://github.com/openshiporg/openfront-scheduling (default branch `main`). Ask which checkout path and revision is the target.
- Generic Keystone dashboard shell, list/item screens, authentication helpers, and admin client: `features/dashboard`.
- Scheduling-specific operator navigation, screens, server actions, projections, and workflows mounted into that shell: `features/platform`.
- Thin route entry points: `app/dashboard`, especially `app/dashboard/(admin)/platform/**`. Current slices: `scheduling` (overview), `bookings`, `event-types`, `availability`, `clients`, `payments`, `team`, `resources`, `routing-forms`, `workflows`, `store-settings`, `integrations`, `webhooks`, `embeds`, `api-keys`, `data-jobs`, `analytics`, and `onboarding`. Navigation is in `features/platform/lib/navigation.ts`; legacy `/platform/scheduling/*` sub-routes redirect.
- Scheduling engines and outbox workers: `features/keystone/lib/**` (availability, host assignment, routing, workflows, payment transitions, `schedulingOutboxWorker.ts`). Provider adapters: `features/integrations/**`.
- A list-by-list schema map with workflows: `docs/schema-map.md`.
- Server contract: `features/keystone/models/**`, `features/keystone/access.ts`, `features/keystone/mutations/**`, and `schema.graphql`.

Explain that `features/dashboard` is the reusable Keystone administration layer and `features/platform` is the product-specific operator experience. These directories show how the dashboard works and which server operations it calls.

The current product focus is team-scoped event types, schedules and availability overrides, bookings and their lifecycle (`transitionBooking`: confirm, decline, cancel, no_show, complete, reschedule), clients, booking payments (capture, refund, retry), team members and invitations, resources and managed templates, routing forms, workflows and reminders, calendar/conferencing/payment connections, webhooks, embeds, API keys and OAuth clients, data jobs, and analytics. This list is orientation, not proof that every flow is safe or complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Scheduling source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in dashboard or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which operator jobs, screens, actions, roles, approvals, and scope are required?
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
- Do not duplicate price, availability, host assignment, lifecycle, payment, or authorization decisions in components.

### Build a separate client

- Use a trusted, environment-pinned endpoint and checked named operations.
- Keep privileged credentials and opaque capabilities server-side behind a BFF when needed.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, relationships, provider IDs, or endpoint URLs.
- Pin the exact schema, generate strict types, runtime-validate JSON/custom scalars, and fail closed when a required contract is absent.
- Test anonymous, wrong-user, wrong-tenant/store/organization, stale, duplicate, timeout, and provider-failure behavior against disposable data.

## Product-specific boundary

Design around teams, members (owner/admin/host/viewer), event types, schedules, bookings, payments, routing forms, workflows, integrations, and embeds. Tenancy is the `Team`: list access is scoped by active `Member` rows through `teamOwnedListAccess`, and command-only lists (`Booking`, `Member`, `Resource`, `PaymentBooking`, `ApiKey`, and others) change only through named, idempotent mutations. Preserve the product's real workflow nouns and authority boundaries. Never rename Ecommerce products/orders into bookings or borrow Ecommerce GraphQL roots without validating that they exist and are authorized here.

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
