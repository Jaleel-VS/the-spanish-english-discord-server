import type { photoCredits } from "./credits";

type PhotoSlug = (typeof photoCredits)[number]["slug"];

/** Filters a kind's page can offer; each maps to a column of the `resources` table. */
export type ResourceFilter = "language" | "level" | "genre";

/**
 * Every kind of resource the site lists, in display order. The `resources`
 * table's `kind` enum, the /resources/$kind pages, the resources page, the
 * home page band and the footer are all built from this list.
 *
 * Adding a kind (say, "apps"):
 * 1. add an entry here with a picture from src/lib/credits.ts;
 * 2. add its copy under `kinds.<id>` in src/locales/{en,es}/resources.json;
 * 3. run `pnpm db:generate` and `pnpm db:migrate` (the enum gains a value);
 * 4. optionally add entries in src/server/db/seed/<id>.ts and run `pnpm db:seed`.
 * TypeScript flags any copy that is missing after step 1.
 */
export const resourceKinds = [
	{ id: "podcasts", image: "radio", filters: ["language", "level"] },
	{ id: "youtube", image: "television", filters: ["language", "level"] },
	{ id: "movies", image: "cinema", filters: ["language", "genre"] },
	{ id: "books", image: "library", filters: ["language", "level"] },
	{ id: "workbooks", image: "classroom", filters: ["language", "level"] },
	{ id: "musicians", image: "musicians", filters: ["language"] },
] as const satisfies readonly {
	id: string;
	image: PhotoSlug;
	filters: readonly ResourceFilter[];
}[];

export type ResourceKind = (typeof resourceKinds)[number]["id"];
export type ResourceKindConfig = (typeof resourceKinds)[number];

export const resourceKindIds = resourceKinds.map((kind) => kind.id) as [
	ResourceKind,
	...ResourceKind[],
];

export function findResourceKind(id: string): ResourceKindConfig | undefined {
	return resourceKinds.find((kind) => kind.id === id);
}
