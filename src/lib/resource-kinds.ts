import type { photoCredits } from "./credits";

type PhotoSlug = (typeof photoCredits)[number]["slug"];

/**
 * Every kind of resource the site lists, in display order. The resources page,
 * the home page band and the footer are all built from this list.
 *
 * Adding a kind (YouTube channels, books, …):
 * 1. a table in src/server/db/schema.ts, then `pnpm db:generate` and `pnpm db:migrate`;
 * 2. its count in `countCatalogue` (src/server/catalog.server.ts) and its seed file;
 * 3. a route at `to` (copy src/routes/resources/podcasts.tsx);
 * 4. an entry here with a picture from src/lib/credits.ts;
 * 5. its copy under `kinds.<id>` in src/locales/{en,es}/resources.json.
 * TypeScript flags each place that is missing once step 4 is done.
 */
export const resourceKinds = [
	{ id: "podcasts", to: "/resources/podcasts", image: "radio" },
	{ id: "movies", to: "/resources/movies", image: "cinema" },
] as const satisfies readonly {
	id: string;
	to: `/resources/${string}`;
	image: PhotoSlug;
}[];

export type ResourceKind = (typeof resourceKinds)[number]["id"];
