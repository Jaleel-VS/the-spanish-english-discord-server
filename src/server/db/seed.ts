/**
 * Upserts the catalogue in ./seed into the database: `pnpm db:seed`.
 * Rows are matched by id, so re-running updates entries and never duplicates
 * them. Rows that exist only in the database are left alone.
 */
import { existsSync } from "node:fs";
import { sql } from "drizzle-orm";
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

const updatable = [
	"kind",
	"title",
	"creator",
	"description_en",
	"description_es",
	"language",
	"level",
	"country",
	"genre",
	"release_year",
	"url",
];

await db()
	.insert(resources)
	.values(rows)
	.onConflictDoUpdate({
		target: resources.id,
		set: {
			...Object.fromEntries(
				updatable.map((column) => [column, sql.raw(`excluded.${column}`)]),
			),
			updatedAt: sql`now()`,
		},
	});

console.log(`Seeded ${rows.length} resources.`);
await closeDb();
