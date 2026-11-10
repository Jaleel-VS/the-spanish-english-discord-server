/**
 * Upserts the catalogue in ./seed into the database: `pnpm db:seed`.
 * Rows are matched by id, so re-running updates entries and never duplicates
 * them. Rows that exist only in the database are left alone.
 */
import { existsSync } from "node:fs";
import { getTableColumns, sql } from "drizzle-orm";
import type { ResourceKind } from "@/lib/resource-kinds";
import { closeDb, db } from "./client.server";
import { resources } from "./schema";
import type { SeedEntry } from "./seed/entry";
import { lookUpImage } from "./seed/images";
import { movies } from "./seed/movies";
import { podcasts } from "./seed/podcasts";
import { youtube } from "./seed/youtube";

/** One seed file per kind that has entries; kinds without a file start empty. */
const seeds: Partial<Record<ResourceKind, SeedEntry[]>> = {
	podcasts,
	youtube,
	movies,
};

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const entries = Object.entries(seeds).flatMap(([kind, list]) =>
	(list ?? []).map((entry) => ({ kind: kind as ResourceKind, entry })),
);

const rows = await Promise.all(
	entries.map(async ({ kind, entry: { description, appleId, ...entry } }) => ({
		creator: null,
		level: null,
		country: null,
		genre: null,
		releaseYear: null,
		topics: [],
		audience: null,
		...entry,
		imageUrl: entry.imageUrl ?? (await lookUpImage(entry.url, appleId)),
		kind,
		descriptionEn: description.en,
		descriptionEs: description.es,
	})),
);
const missing = rows.filter((row) => !row.imageUrl).map((row) => row.id);
if (missing.length) console.log(`No picture for: ${missing.join(", ")}`);

/**
 * On conflict, overwrite every column with the incoming row's value except the
 * key and the creation time, and keep a stored picture when this run's lookup
 * failed. Drizzle's `set` is keyed by property name (`descriptionEn`), so
 * derive it from the table rather than listing SQL names.
 */
const {
	id: _id,
	createdAt: _createdAt,
	...columns
} = getTableColumns(resources);
const set = Object.fromEntries(
	Object.entries(columns).map(([property, column]) => [
		property,
		property === "updatedAt"
			? sql`now()`
			: property === "imageUrl"
				? sql.raw(
						`coalesce(excluded."${column.name}", "resources"."${column.name}")`,
					)
				: sql.raw(`excluded."${column.name}"`),
	]),
);

await db()
	.insert(resources)
	.values(rows)
	.onConflictDoUpdate({ target: resources.id, set });

console.log(`Seeded ${rows.length} resources.`);
await closeDb();
