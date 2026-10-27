# The Spanish-English Discord Server

Website for the [Spanish-English Learning Server](https://discord.gg/spanish-english), a Discord community where Spanish and English speakers help each other learn. The site works in English and Spanish, renders on the server, and contains its own backend.

## Stack

- [TanStack Start](https://tanstack.com/start) (React 19, TanStack Router file routes, server functions, SSR) on [Vite 8](https://vite.dev/)
- [Nitro](https://nitro.build/) for the server build; it targets Vercel automatically when built there
- [Tailwind CSS v4](https://tailwindcss.com/), with design tokens in `src/styles.css`
- [i18next](https://www.i18next.com/) / [react-i18next](https://react.i18next.com/), with type-checked keys
- [Zod](https://zod.dev/) for search-param and server-function validation
- [Biome](https://biomejs.dev/) for linting and formatting

## Setup

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

No environment variables are needed.

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server with hot reload |
| `pnpm build` | Production build into `.output/` |
| `pnpm start` | Run the production build (`node .output/server/index.mjs`) |
| `pnpm typecheck` | TypeScript, including translation keys |
| `pnpm check` / `pnpm check:fix` | Biome lint and format |

## How it is put together

```
src/
  routes/            file routes: /, /resources/podcasts, /resources/movies (/resources redirects to the
                     home page's resources section); __root.tsx is the HTML shell
  components/        site header and footer, home sections, resource-page parts
  server/
    *.functions.ts   server functions (the backend's public surface, called from loaders)
    *.server.ts      server-only logic behind them
    data/            the podcast and film catalogue
  lib/               client-safe types, Zod schemas, constants, image credits
  i18n/              i18next setup and language detection
  locales/{en,es}/   copy, one JSON file per namespace
```

**Backend.** Everything that used to live in the separate Rust API now runs inside this app as [server functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions):

- `listPodcasts` and `listMovies` filter (and, for films, paginate) the catalogue. Their inputs are the same Zod schemas the routes use to validate URL search params.
- `getCommunity` reads the live member and online counts from Discord's public invite endpoint. It caches them for five minutes per server instance, so visitors never reach Discord's rate limit. If Discord has never answered, it returns `null` and the page leaves the numbers out.

The catalogue lives in `src/server/data/*.ts`. `src/server/catalog.server.ts` is the only code that reads it, so moving to a database means rewriting those function bodies and nothing else.

**Languages.** On the server, the language comes from the `language` cookie, then the browser's `Accept-Language` header, then English. Every request gets its own i18next instance, so concurrent requests in different languages never share state. The language switch sets the cookie and re-runs the route loaders, with no page reload. Catalogue entries carry their descriptions in both languages, and country names come from ISO codes through `Intl.DisplayNames`.

**Design.** The design is an editorial, two-colour print layout: paper, the deep blue of the Union flag, and the yellow of the Spanish flag. It uses one typeface (Bricolage Grotesque), five type sizes, one 12-column grid, and a vertical axis at column 6. The site follows the system's light or dark setting. Entrance animations only start after an inline script adds `html.js`, so every element stays visible without JavaScript. They also respect `prefers-reduced-motion`. Filters are ordinary links, so they work before hydration.

## Adding a resource

Add an entry to `src/server/data/podcasts.ts` or `src/server/data/movies.ts`. TypeScript checks the shape. Write descriptions in both languages and use ISO country codes. A new film genre goes in `genres` in `src/lib/catalog.ts`, with its label in `locales/*/resources.json`.

## Deploying

The Vercel project deploys `main`. Nitro detects Vercel during the build and writes Vercel's Build Output, so no `vercel.json` is needed. Node 24 is pinned in `package.json` `engines`.

## Credits

The splash illustration is by Belle, for the server. The archival photographs come from Wikimedia Commons; their sources and licences are listed in `src/lib/credits.ts` and credited in the site footer.
