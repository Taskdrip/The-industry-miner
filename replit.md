# The Industry Miner

An online course platform with a browsable course catalog, course detail pages, a jewellery masterclass page, and an admin panel — backed by a PostgreSQL database.

## Run & Operate

- Fresh import: run `pnpm install --frozen-lockfile`, then `pnpm --filter @workspace/db run push` to create the development database schema. The new database starts empty; courses and testimonials are not seeded automatically.
- Workflows: `artifacts/api-server: API Server` (port 8080) and `artifacts/industry-miner: web` (port 23279) — both managed by Replit
- `pnpm run typecheck` — full typecheck across all packages
- `PORT=23279 BASE_PATH=/ pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — auto-provisioned by Replit; `SESSION_SECRET` — set in Replit Secrets

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/industry-miner/src/pages/home.tsx` — public landing page and Website Studio entry point
- `artifacts/industry-miner/src/pages/website-studio.tsx` — searchable niche template library and saved websites
- `artifacts/industry-miner/src/pages/website-editor.tsx` — draft editor, live preview, save, and publish actions
- `artifacts/industry-miner/src/pages/public-website.tsx` — published sites, PWA manifest, install prompt, and service-worker registration
- `artifacts/api-server/src/routes/websites.ts` — template, website lifecycle, public-site, and manifest endpoints
- `lib/db/src/schema/websites.ts` — owner-scoped website drafts and published snapshots
- `lib/api-spec/openapi.yaml` — source of truth for generated API client and validation schemas
- `artifacts/industry-miner/src/index.css` — shared app and website-studio styles

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

The Industry Miner combines expert-led business learning and resources with a Website Studio. Signed-in users can browse niche starter sites, install one, edit pages and design settings, save drafts, and publish an installable PWA.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Website drafts and published snapshots are stored separately; publishing makes the saved draft public.
- Public PWA pages register `artifacts/industry-miner/public/service-worker.js`; it caches the app shell and only public website and manifest API responses.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
