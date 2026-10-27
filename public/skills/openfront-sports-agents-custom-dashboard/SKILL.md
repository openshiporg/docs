---
name: openfront-sports-agents-custom-dashboard
description: Plan and build a custom Openfront Sports Agents operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Sports Agents custom operator dashboard

Use this skill to adapt the built-in Sports Agents dashboard or create a separately deployed client. Start from this product's current source, not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Source repository: `https://github.com/openshiporg/openfront-sports-agents`. Confirm the exact checkout path and revision the user wants to target.
- Generic Keystone dashboard shell, list/item/create screens, authentication screens and actions, AI chat sidebar, and admin client: `features/dashboard`. This shell is shared with Openfront E-commerce and is expected to stay identical to it.
- Product-specific operator experience: **none yet.** The current source has no `features/platform` folder and no `app/dashboard/(admin)/platform/**` routes.
- Thin route entry points: `app/dashboard/(admin)/page.tsx` (home), `app/dashboard/(admin)/[listKey]/**` (generic model pages), and `app/dashboard/{init,signin,signup,reset,no-access}`. The route guard is `proxy.ts` calling `features/dashboard/middleware.ts`.
- Server contract: `features/keystone/models/**` (`User.ts`, `Role.ts`, `Todo.ts`, `TodoImage.ts`), `features/keystone/access.ts`, `features/keystone/mutations/**` (only `redirectToInit`), `features/keystone/index.ts` (auth, session, `my_images` S3 storage), and `schema.graphql`. There is no `docs/schema-map.md`.
- AI and MCP: `app/api/completion/route.ts`, `app/api/completion/scopedMcpFetch.ts`, `app/api/mcp-transport/[transport]/route.ts`.

Explain that `features/dashboard` is the reusable Keystone administration layer. In other Openfront products, `features/platform` holds the product-specific operator pages; in Sports Agents that layer has not been built.

Say plainly that the repository is currently close to the next-keystone-starter template. The models are `User`, `Role`, and the example `Todo` and `TodoImage`. There are no athlete, client, agent, contract, deal, or other sports-agents models, and the README is still the starter's. Do not describe sports-agents features as existing. Any sports-agents dashboard needs backend models, access rules, and migrations first.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Sports Agents source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in dashboard, add a new `features/platform` slice, or create an independently deployed client?
3. What do they dislike about the current generic experience, what must stay, and what should change?
4. Which operator jobs, records, screens, actions, and roles do they need? Which of those need new Keystone models and permission flags, since none exist for sports-agents work today?
5. What visual references, interaction direction, responsive targets, and deployment constraints matter?
6. Which non-production host, schema export, test data, and test identities are available?

Restate the brief, inspect the supplied source, separate presentation-only changes from backend-contract work (which will be most of it for sports-agents features), and ask for confirmation before broad implementation.

## Required source inspection

Before proposing code:

1. Enumerate the actual dashboard routes under `app/dashboard`. Confirm whether a `platform` folder has been added since this skill was written.
2. Trace the built-in screens in `features/dashboard/screens` and every server action they call in `features/dashboard/actions` (`getAdminMetaAction`, `getListItemsAction`, `getItemAction`, `item-actions`, `auth`, `ai-chat`).
3. Enumerate GraphQL documents and operation names: `KsFetchAdminMeta`, `KsFetchItem`, `GetListItems`, `AuthenticatedUser`, generated `create<List>`/`update<List>`/`delete<List>`, and the Keystone auth mutations.
4. Read `schema.graphql`, list access, field access (for example `User.password` is never readable, `User.role` needs `canManagePeople`), the filter rules in `access.ts`, and `redirectToInit`.
5. Record actor, role flag, inputs, outputs, ownership (`assignedTo`, self-only user rules), and error states for each required operation.
6. Inspect S3 storage, SMTP reset mail, OpenRouter keys (shared vs local mode), the MCP tools and their cookie forwarding, and runtime configuration touched by the requested flow.
7. Produce a capability matrix: verified, presentation-only, needs backend contract, blocked, or absent. Mark every sports-agents record and workflow as absent unless it is in the inspected source.

Do not claim the skill already knows a deployed contract. It knows where and how to discover the exact calls. Generated CRUD or a schema-valid document is not proof of safe access.

## Built-in versus separate client

### Adapt the built-in client

- Keep route files thin.
- Put new product UI and orchestration in a new `features/platform/<slice>` and mount it under `app/dashboard/(admin)/platform/<route>`, matching other Openfront products.
- Reuse current session, transport, design tokens, loading/error states, and server actions where they are safe.
- Do not change `features/dashboard` unless the user accepts diverging from the shared Openfront shell.
- Do not duplicate access, ownership, or lifecycle decisions in components. Put them in Keystone access rules or bounded custom mutations.

### Build a separate client

- Use a trusted, environment-pinned endpoint and checked named operations.
- Keep privileged credentials server-side behind a BFF when needed.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, relationships, or endpoint URLs. Note that the built-in MCP endpoint does accept model-chosen operations and fields; do not copy that pattern into a client.
- Pin the exact schema, generate strict types, runtime-validate JSON/custom scalars, and fail closed when a required contract is absent.
- Test anonymous, wrong-user, missing-role-flag, stale, duplicate, and timeout behavior against disposable data.

## Product-specific boundary

The only real workflow nouns today are users, roles and their seven flags, and the example todos. There is no tenant model; one deployment is one group of users. Never present a placeholder or example model as a sports-agents record, never invent athlete, contract, or deal data, and never show a sports-agents page as working until its models, access rules, and migrations exist. Do not borrow Ecommerce or other vertical GraphQL roots without validating that they exist here.

Treat the AI chat and MCP tools as acting with the signed-in user's full permissions, with no confirmation step or audit log. Do not route consequential actions through them.

For consequential actions, require one bounded server projection or command that validates actor, role flag, related-record ownership, state transition, transaction/concurrency, idempotency, and audit evidence. If it does not exist, request the backend contract and show the feature as unavailable.

## Handoff

Report:

- built-in or separate mode;
- source path/repository and revision inspected;
- routes and built-in screens reviewed;
- schema hash and named operations used;
- requested changes and what was preserved;
- capability matrix and backend blockers (including new models, flags, and migrations needed);
- implemented files and tests;
- responsive/accessibility evidence;
- auth, permission, secret, provider, migration, deployment, and rollback notes.

Never present a source path, generated schema, HTTP 200, or attractive empty state as proof that the operator dashboard workflow is operational.
