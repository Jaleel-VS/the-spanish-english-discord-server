/**
 * Upserts the catalogue in ./seed into the database: `pnpm db:seed`.
 * Rows are matched by id, so re-running updates entries and never duplicates
 * them. Rows that exist only in the database are left alone.
 */
import { existsSync } from "node:fs";
import { sql } from "drizzle-orm";
import { closeDb, db } from "./client.server";
import { movies, podcasts } from "./schema";
import { movies as movieSeed } from "./seed/movies";
import { podcasts as podcastSeed } from "./seed/podcasts";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

/** On conflict, take every column from the incoming row. */
function excludedColumns(columns: string[]) {
	return Object.fromEntries(
		columns.map((column) => [column, sql.raw(`excluded.${column}`)]),
	);
}

await db().transaction(async (tx) => {
	await tx
		.insert(podcasts)
		.values(
			podcastSeed.map(({ description, ...podcast }) => ({
				...podcast,
				descriptionEn: description.en,
				descriptionEs: description.es,
			})),
		)
		.onConflictDoUpdate({
			target: podcasts.id,
			set: {
				...excludedColumns([
					"title",
					"description_en",
					"description_es",
					"language",
					"level",
					"country",
					"url",
				]),
				updatedAt: sql`now()`,
			},
		});

	await tx
		.insert(movies)
		.values(
			movieSeed.map(({ description, ...movie }) => ({
				...movie,
				descriptionEn: description.en,
				descriptionEs: description.es,
			})),
		)
		.onConflictDoUpdate({
			target: movies.id,
			set: {
				...excludedColumns([
					"title",
					"description_en",
					"description_es",
					"audio_language",
					"country",
					"genre",
					"release_year",
					"url",
				]),
				updatedAt: sql`now()`,
			},
		});
});

console.log(
	`Seeded ${podcastSeed.length} podcasts and ${movieSeed.length} movies.`,
);
await closeDb();
