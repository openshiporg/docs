---
name: openfront-social-custom-dashboard
description: Plan and build a custom Openfront Social creator studio or operator dashboard by explaining the source architecture, interviewing the user, inspecting the current product code and contract, then adapting the built-in client or creating a safe separate client.
---

# Openfront Social custom creator and operator dashboard

Use this skill to adapt the built-in Social dashboard (creator studio plus people-manager pages) or create a separately deployed client. Start from this product's current source, not Ecommerce conventions, screenshots, or another vertical's schema.

## Source orientation to explain first

Before asking implementation questions, briefly tell the user where the current behavior lives:

- Source repository: `https://github.com/openshiporg/openfront-social`. Confirm the exact checkout path and revision before relying on it.
- Generic Keystone dashboard shell, list/item screens, authentication helpers, first-user init, and admin client: `features/dashboard`.
- Social-specific creator and operator navigation, screens, server actions, and workflows mounted into that shell: `features/platform` (slices `items`, `collections`, `site`, `publications`, `destinations`, `activity`, `your-data`, `creators`, `privacy-requests`, `onboarding`; shared helpers in `features/platform/lib`, including `navigation.ts` and `studio-actions.ts`).
- Thin route entry points: `app/dashboard`, especially `app/dashboard/(admin)/platform/**` (`/platform/library`, `/platform/site`, `/platform/site/collections`, `/platform/history`, `/platform/destinations`, `/platform/activity`, `/platform/your-data`, `/platform/users`, `/platform/users/privacy-requests`) and `app/dashboard/(admin)/onboarding`. Legacy `/dashboard/studio/*` routes only redirect.
- Server contract: `features/keystone/models/**` (User, Role, PersonalSite, Collection, Item, MediaAsset, Publication, PublishJob, ConnectedAccount, SocialEvent), `features/keystone/access.ts` (`rules.own*`), `features/keystone/mutations/**` (`studio-command.ts`, `studio-read.ts`, `personalPublishing.ts`, `publishing-fence.ts`, `privacy-queue.ts`, `creators.ts`), `schema.graphql`, and `docs/schema-map.md`.

Explain that `features/dashboard` is the reusable Keystone administration layer and `features/platform` is the product-specific experience. Every creator write goes through the single `studioCommand(command, input)` mutation, which locks the owner's site, checks the reviewed version fence (`publishingVersion`, `contentVersion`, `publishGeneration`, status), writes, and appends a `SocialEvent`. Reads come from `studioLibrary`, `studioCollection`, `studioRecord`, `studioHistory`, `creatorDirectory`, `privacyRequestQueue`, and `socialPrivateExport`.

The current product focus is a creator's own site profile, collections and visibility, item drafting and the draft/published/archived lifecycle, immutable publication snapshots, destination consent records (nothing is ever sent externally), the activity log, data export, privacy requests, and people-manager creator and privacy review. This list is orientation, not proof that every flow is complete.

## Then interview the user

After the source orientation, ask one concise set of questions and skip anything already answered:

1. Where is the exact Social source checkout, and which revision/deployment is the target?
2. Do they want to adapt the built-in dashboard or create an independently deployed client?
3. What do they dislike about the current experience, what must stay, and what should change?
4. Which creator and people-manager jobs, screens, actions, and roles are required?
5. What visual references, interaction direction, responsive targets, and deployment constraints matter?
6. Which non-production host, schema export, test data, and test identities are available?

Restate the brief, inspect the supplied source, identify presentation-only changes versus backend-contract work, and ask for confirmation before broad implementation.

## Required source inspection

Before proposing code:

1. Enumerate the actual app routes for this product.
2. Trace the built-in screen components and every data loader/server action they call.
3. Enumerate GraphQL documents and operation names used by those call sites, including each `studioCommand` command name and its allowed input keys in `features/platform/lib/studio-actions.ts`.
4. Read `schema.graphql`, model access, field access, and custom query/mutation resolvers.
5. Record actor, owner scope, inputs, outputs, lifecycle authority, version fences, idempotency, and error codes (`VALIDATION`, `UNCONFIRMED`, conflicts) for each required operation.
6. Inspect S3 image uploads (`creator-media.ts`, `/media/[id]`), SMTP reset, export (`/api/creator-export`), the disabled MCP route, cookies/sessions, and runtime configuration touched by the requested flow.
7. Produce a capability matrix: verified, presentation-only, needs backend contract, blocked, or absent.

Do not claim the skill already knows a deployed contract. It knows where and how to discover the exact calls. Generated CRUD or a schema-valid document is not proof of safe access; generic create/update/delete on creator lists is closed by design.

## Built-in versus separate client

### Adapt the built-in client

- Keep route files thin.
- Put product UI and orchestration in the existing feature slice.
- Reuse current session, transport, design tokens, loading/error states, and `studioCommand` server actions.
- Always send the version values the user reviewed; never refetch and resend fresh versions to bypass a conflict.
- Do not duplicate visibility, publish lifecycle, consent, or authorization decisions in components.

### Build a separate client

- Use a trusted, environment-pinned endpoint and checked named operations.
- Keep session cookies and any privileged calls server-side behind a BFF when needed.
- Never expose an arbitrary GraphQL proxy or accept browser-selected fields, operations, relationships, or endpoint URLs.
- Pin the exact schema, generate strict types, runtime-validate JSON results (`studio*`, `creatorDirectory`, `privacyRequestQueue` return JSON), and fail closed when a required contract is absent.
- Test anonymous, wrong-owner, non-studio role, stale-version, duplicate, and timeout behavior against disposable data.

## Product-specific boundary

Design around creators, personal sites, collections, items, publications, destinations, activity, exports, privacy requests, and creators directory. Preserve the product's real workflow nouns and owner-scoped authority. Never rename Ecommerce products/orders into this vertical or borrow Ecommerce GraphQL roots.

Never present an external destination or publication as delivered: there is no dispatcher, and external intents end as `not_configured`. For any new consequential action, require one bounded server command that validates actor, ownership, state transition, version fence, transaction, idempotency, and `SocialEvent` evidence. If it does not exist, request the backend contract and show the feature as unavailable.

## Handoff

Report:

- built-in or separate mode;
- source path/repository and revision inspected;
- routes and built-in screens reviewed;
- schema hash and named operations/commands used;
- requested changes and what was preserved;
- capability matrix and backend blockers;
- implemented files and tests;
- responsive/accessibility evidence;
- auth, ownership, secret, storage, migration, deployment, and rollback notes.

Never present a source path, generated schema, HTTP 200, or attractive empty state as proof that the dashboard workflow is operational.
