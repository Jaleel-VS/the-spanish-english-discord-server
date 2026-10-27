# The Spanish-English Discord Server

Website for the [Spanish-English Learning Server](https://discord.gg/spanish-english), a Discord community where Spanish and English speakers help each other learn. The site works in English and Spanish, renders on the server, and contains its own backend.

## Stack

- [TanStack Start](https://tanstack.com/start) (React 19, TanStack Router file routes, server functions, SSR) on [Vite 8](https://vite.dev/)
- [Nitro](https://nitro.build/) for the server build; it targets Vercel automatically when built there
- [Tailwind CSS v4](https://tailwindcss.com/), with design tokens in `src/styles.css`
- [i18next](https://www.i18next.com/) / [react-i18next](https://react.i18next.com/), with type-checked keys
- [Zod](https://zod.dev/) for search-param and server-function validation
- [Neon](https://neon.com/) Postgres (through the Vercel Marketplace) with [Drizzle ORM](https://orm.drizzle.team/) and `node-postgres`
- [Biome](https://biomejs.dev/) for linting and formatting

## Setup

```bash
pnpm install
vercel link                    # once, to the-spanish-english-discord-server
vercel env pull .env.local     # DATABASE_URL and DATABASE_URL_UNPOOLED from the Neon integration
pnpm dev                       # http://localhost:3000
```

The pages that read the catalogue need `DATABASE_URL`. Everything else works without it.

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server with hot reload |
| `pnpm build` | Production build into `.output/` |
| `pnpm start` | Run the production build (`node .output/server/index.mjs`) |
| `pnpm typecheck` | TypeScript, including translation keys |
| `pnpm check` / `pnpm check:fix` | Biome lint and format |
| `pnpm db:generate` | Write a SQL migration into `drizzle/` from changes to `src/server/db/schema.ts` |
| `pnpm db:migrate` | Apply pending migrations (uses the direct, unpooled connection) |
| `pnpm db:seed` | Upsert the catalogue in `src/server/db/seed/` into the database |
| `pnpm db:studio` | Browse the database in Drizzle Studio |

## How it is put together

```
src/
  routes/            file routes: /, /resources (every kind), /resources/podcasts, /resources/movies;
                     __root.tsx is the HTML shell
  components/        site header and footer, home sections, resource-page parts
  server/
    *.functions.ts   server functions (the backend's public surface, called from loaders)
    *.server.ts      server-only logic behind them
    db/              Drizzle schema, pooled client, seed script and seed data
  lib/               client-safe types, Zod schemas, constants, image credits
  i18n/              i18next setup and language detection
  locales/{en,es}/   copy, one JSON file per namespace
```

**Backend.** Everything that used to live in the separate Rust API now runs inside this app as [server functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions):

- `listPodcasts` and `listMovies` filter (and, for films, paginate) the catalogue. Their inputs are the same Zod schemas the routes use to validate URL search params.
- `getCommunity` reads the live member and online counts from Discord's public invite endpoint. It caches them for five minutes per server instance, so visitors never reach Discord's rate limit. If Discord has never answered, it returns `null` and the page leaves the numbers out.

The catalogue lives in Neon Postgres: one database, connected to the Vercel project for production, preview and development. `src/server/db/client.server.ts` creates one connection pool per server instance on first use; `attachDatabasePool` from `@vercel/functions` lets Vercel Fluid compute close idle connections before an instance suspends, which is the connection pattern [Neon recommends for Vercel](https://neon.com/docs/guides/vercel-connection-methods). `src/server/catalog.server.ts` holds the queries.

**Schema changes.** Edit `src/server/db/schema.ts`, run `pnpm db:generate`, review the SQL it writes into `drizzle/`, commit it, then run `pnpm db:migrate`. The enum types come from the constants in `src/lib/catalog.ts`, so a new language, level or genre is added in one place, and then migrated.

**Languages.** On the server, the language comes from the `language` cookie, then the browser's `Accept-Language` header, then English. Every request gets its own i18next instance, so concurrent requests in different languages never share state. The language switch sets the cookie and re-runs the route loaders, with no page reload. Catalogue entries carry their descriptions in both languages, and country names come from ISO codes through `Intl.DisplayNames`.

**Design.** The design is an editorial, two-colour print layout: paper, the deep blue of the Union flag, and the yellow of the Spanish flag. It uses one typeface (Bricolage Grotesque), five type sizes, one 12-column grid, and a vertical axis at column 6. The site follows the system's light or dark setting. Entrance animations only start after an inline script adds `html.js`, so every element stays visible without JavaScript. They also respect `prefers-reduced-motion`. Filters are ordinary links, so they work before hydration.

## Adding a resource

Add an entry to `src/server/db/seed/podcasts.ts` or `src/server/db/seed/movies.ts`, then run `pnpm db:seed`. TypeScript checks the shape. Write descriptions in both languages and use ISO country codes. The seed matches rows by id, so running it again updates entries instead of duplicating them, and it never deletes anything. A new film genre goes in `genres` in `src/lib/catalog.ts`, with its label in `locales/*/resources.json`, followed by `pnpm db:generate` and `pnpm db:migrate`.

## Adding a kind of resource

The resources page, the home page band and the footer are built from `resourceKinds` in `src/lib/resource-kinds.ts`. To add YouTube channels, books or anything else:

1. Add a table to `src/server/db/schema.ts`, run `pnpm db:generate`, review the SQL and run `pnpm db:migrate`.
2. Add its table to `kindTables` in `src/server/catalog.server.ts`, and a seed file and a query (`findPodcasts` is the model).
3. Add a route, for example `src/routes/resources/youtube.tsx`, copying `podcasts.tsx` and its server function in `catalog.functions.ts`.
4. Add an entry to `resourceKinds` with an archival picture listed in `src/lib/credits.ts`.
5. Add its copy under `kinds.<id>` in `src/locales/{en,es}/resources.json`.

After step 4, TypeScript reports every remaining place that still needs the new kind.

## Deploying

The Vercel project deploys `main`. Nitro detects Vercel during the build and writes Vercel's Build Output, so no `vercel.json` is needed. Node 24 is pinned in `package.json` `engines`. Migrations are not run during the build: apply them with `pnpm db:migrate` before merging a change that needs them. Preview deployments use the same database as production.

## Credits

The splash illustration is by Belle, for the server. The archival photographs come from Wikimedia Commons; their sources and licences are listed in `src/lib/credits.ts` and credited in the site footer.
