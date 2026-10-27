---
name: openfront-sports-agents-custom-storefront
description: Plan and build a custom Openfront Sports Agents storefront or public site by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adding a built-in client or creating a safe separate client.
---

# Openfront Sports Agents custom storefront

Use this skill to plan a customer-facing or public client for Sports Agents. Start from this product's current source, not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Source repository: `https://github.com/openshiporg/openfront-sports-agents`. Confirm the exact checkout path and revision the user wants to target.
- Built-in customer experience: **none yet.** The current source has no `features/storefront` folder and no `app/(storefront)` routes. `app/page.tsx` is the starter's welcome page with links to `/dashboard` and `/api/graphql`.
- Server contract: `features/keystone/models/**` (`User.ts`, `Role.ts`, `Todo.ts`, `TodoImage.ts`), `features/keystone/access.ts`, `features/keystone/mutations/**` (only `redirectToInit`), `features/keystone/index.ts` (auth, stateless session cookie, `my_images` S3 storage), and `schema.graphql`.
- GraphQL endpoint: `pages/api/graphql.ts` serves `/api/graphql` with GraphQL Yoga.
- Account-related actions that exist: `features/dashboard/actions/auth.ts` (sign-in, optional sign-up gated by `PUBLIC_SIGNUPS_ALLOWED`, password reset). These are dashboard flows, not customer accounts.

Explain that in other Openfront products `features/storefront` is the behavioral reference for routes, states, GraphQL calls, and cookies. In Sports Agents there is no such reference, so a storefront has to be designed from the schema and access rules up.

Say plainly that the repository is currently close to the next-keystone-starter template. There are no public sports-agents records (athletes, agents, services, events, or similar), and every Keystone list requires a signed-in user, so anonymous visitors can read nothing. Do not describe a sports-agents storefront as existing.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Sports Agents source checkout, and which revision/deployment is the target?
2. Do they want a storefront inside this app (a new `features/storefront` slice and `app/(storefront)` routes) or an independently deployed client?
3. Who are the visitors, what should they see or do, and what must never be public?
4. Which public records, customer accounts, forms, and journeys are required? Which need new Keystone models, public access rules, and migrations, since none exist today?
5. What brand, visual references, interaction direction, devices, accessibility, and deployment constraints matter?
6. Which non-production host, schema export, test data, and test identities are available?

Restate the brief, inspect the supplied source, separate presentation-only work from backend-contract work (which will be most of it), and ask for confirmation before broad implementation.

## Required source inspection

Before proposing code:

1. Enumerate the actual app routes. Confirm whether storefront routes or a `features/storefront` folder have been added since this skill was written.
2. Trace any existing public pages and the server actions they call.
3. Enumerate GraphQL operations a public client could call today (`redirectToInit`, `authenticatedItem`, Keystone auth mutations, and `createUser` only when `PUBLIC_SIGNUPS_ALLOWED=true`).
4. Read `schema.graphql`, list access, field access, and filter rules in `access.ts`. Confirm which lists, if any, allow anonymous reads.
5. Record actor, guest vs signed-in scope, inputs, outputs, ownership, and error states for each required operation.
6. Inspect the session cookie, S3 image URL signing, SMTP reset mail, and runtime configuration touched by the requested flow.
7. Produce a capability matrix: verified, presentation-only, needs backend contract, blocked, or absent. Mark every sports-agents public record and journey as absent unless it is in the inspected source.

Do not claim the skill already knows a deployed contract. It knows where and how to discover the exact calls. Generated CRUD or a schema-valid document is not proof of safe access.

## Built-in versus separate client

### Add a built-in client

- Keep route files thin under a new `app/(storefront)` group.
- Put UI and data loading in a new `features/storefront` slice, following the layout used by other Openfront products.
- Make sure `proxy.ts` still only guards `/dashboard` routes.
- Add public read access in Keystone with narrow filters and field access. Do not widen existing `User`, `Role`, or `Todo` access to make pages work.

### Build a separate client

- Use a trusted, environment-pinned endpoint and checked named operations.
- Keep privileged credentials server-side behind a BFF when needed. Never use a dashboard admin session to fetch public content.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, relationships, or endpoint URLs.
- Pin the exact schema, generate strict types, runtime-validate JSON/custom scalars, and fail closed when a required contract is absent.
- Test anonymous, wrong-user, stale, duplicate, and timeout behavior against disposable data.

## Product-specific boundary

There is no customer model, no public data, and no tenant model. Sign-up creates a `User` with no role, which is a dashboard account with no access, not a customer profile. Never present example `Todo` records as public content, never invent athlete, agent, client, or service listings, testimonials, or results, and never show a page as working until its models, public access rules, and migrations exist. Do not borrow Ecommerce cart, product, or checkout roots; they do not exist here.

For consequential actions (inquiries, bookings, payments, document uploads), require one bounded server command that validates actor, scope, ownership, state transition, abuse limits, idempotency, and audit evidence. If it does not exist, request the backend contract and show the feature as unavailable.

## Handoff

Report:

- built-in or separate mode;
- source path/repository and revision inspected;
- routes and screens reviewed;
- schema hash and named operations used;
- requested changes and what was preserved;
- capability matrix and backend blockers (including new models, public access rules, and migrations needed);
- implemented files and tests;
- responsive/accessibility evidence;
- auth, scope, secret, provider, migration, deployment, and rollback notes.

Never present a source path, generated schema, HTTP 200, or attractive empty state as proof that the storefront workflow is operational.
