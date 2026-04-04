# The Spanish-English Discord Server

Landing page for a Spanish-English language exchange community. Bilingual (EN/ES) with real-time language switching.

## Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 6](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`)
- [TanStack Router](https://tanstack.com/router) (file-based routing) + [React Query](https://tanstack.com/query)
- [i18next](https://www.i18next.com/) / [react-i18next](https://react.i18next.com/) (EN/ES)
- [Aceternity UI](https://ui.aceternity.com/) components (via [shadcn](https://ui.shadcn.com/) registry)
- [Motion](https://motion.dev/) (animations)
- [Biome](https://biomejs.dev/) (linting + formatting)
- [Vercel](https://vercel.com/) (deployment)

## Setup

```bash
pnpm install
pnpm dev
```

**Optional:** Set `GEMINI_API_KEY` in `.env.local` for AI features.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server on port 3000 |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |
| `pnpm check` | Lint + format check (Biome) |
| `pnpm check:fix` | Auto-fix lint + format issues |

## Backend

This frontend is powered by a Rust backend: [spa-eng-discord-website-backend-rs](https://github.com/Jaleel-VS/spa-eng-discord-website-backend-rs)

## TODO

- [ ] Flesh out movies section — filters for genre, language, country, level; pagination; search (blocked on [backend](https://github.com/Jaleel-VS/spa-eng-discord-website-backend-rs) support)
- [ ] Light mode / dark mode toggle (needs full `dark:` variant pass on all components)
- [ ] [Floating Navbar](https://ui.aceternity.com/components/floating-navbar) (hide on scroll down, reveal on scroll up)
- [ ] Resource sub-pages: videos, books, courses, conversation, music
- [ ] [Moving Border](https://ui.aceternity.com/components/moving-border) or [Sparkles](https://ui.aceternity.com/components/sparkles) on CTA button
- [ ] Community testimonials section ([Infinite Moving Cards](https://ui.aceternity.com/components/infinite-moving-cards))
- [ ] Guidelines page
- [ ] New to Discord onboarding page
- [ ] Support/FAQ page
- [ ] SEO meta tags and [Open Graph](https://ogp.me/)
- [ ] Analytics integration
