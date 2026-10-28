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
import { movies } from "./seed/movies";
import { podcasts } from "./seed/podcasts";

/** One seed file per kind that has entries; kinds without a file start empty. */
const seeds: Partial<Record<ResourceKind, SeedEntry[]>> = { podcasts, movies };

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const rows = Object.entries(seeds).flatMap(([kind, entries]) =>
	(entries ?? []).map(({ description, ...entry }) => ({
		creator: null,
		level: null,
		country: null,
		genre: null,
		releaseYear: null,
		...entry,
		kind: kind as ResourceKind,
		descriptionEn: description.en,
		descriptionEs: description.es,
	})),
);

/**
 * On conflict, overwrite every column with the incoming row's value except the
 * key and the creation time. Drizzle's `set` is keyed by property name
 * (`descriptionEn`), so derive it from the table rather than listing SQL names.
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
			: sql.raw(`excluded."${column.name}"`),
	]),
);

await db()
	.insert(resources)
	.values(rows)
	.onConflictDoUpdate({ target: resources.id, set });

console.log(`Seeded ${rows.length} resources.`);
await closeDb();
