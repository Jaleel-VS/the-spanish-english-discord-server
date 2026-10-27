import { and, asc, count, desc, eq, type SQL } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import type {
	CatalogueCounts,
	Genre,
	Movie,
	MovieSearch,
	Page,
	Podcast,
	PodcastSearch,
} from "@/lib/catalog";
import type { ResourceKind } from "@/lib/resource-kinds";
import { db } from "./db/client.server";
import { movies, podcasts } from "./db/schema";

/** Catalogue reads. The server functions in catalog.functions.ts are the only callers. */

export const MOVIES_PAGE_SIZE = 24;

/** Podcasts matching the filters, easiest first (enum order), then by title. */
export async function findPodcasts(search: PodcastSearch): Promise<Podcast[]> {
	const filters: SQL[] = [];
	if (search.language) filters.push(eq(podcasts.language, search.language));
	if (search.level) filters.push(eq(podcasts.level, search.level));

	const rows = await db()
		.select()
		.from(podcasts)
		.where(and(...filters))
		.orderBy(asc(podcasts.level), asc(podcasts.title));

	return rows.map((row) => ({
		id: row.id,
		title: row.title,
		description: { en: row.descriptionEn, es: row.descriptionEs },
		language: row.language,
		level: row.level,
		country: row.country,
		url: row.url,
	}));
}

/**
 * One page of films matching the filters, newest first, plus the genres that
 * at least one film has (so the filter never offers an empty result).
 * A page past the end is clamped to the last page.
 */
export async function findMovies(
	search: MovieSearch,
): Promise<Page<Movie> & { genres: Genre[] }> {
	const filters: SQL[] = [];
	if (search.language) filters.push(eq(movies.audioLanguage, search.language));
	if (search.genre) filters.push(eq(movies.genre, search.genre));
	const where = and(...filters);

	const [[{ total }], genreRows] = await Promise.all([
		db().select({ total: count() }).from(movies).where(where),
		db()
			.selectDistinct({ genre: movies.genre })
			.from(movies)
			.orderBy(asc(movies.genre)),
	]);

	const totalPages = Math.max(1, Math.ceil(total / MOVIES_PAGE_SIZE));
	const page = Math.min(search.page ?? 1, totalPages);

	const rows = await db()
		.select()
		.from(movies)
		.where(where)
		.orderBy(desc(movies.releaseYear), asc(movies.title))
		.limit(MOVIES_PAGE_SIZE)
		.offset((page - 1) * MOVIES_PAGE_SIZE);

	return {
		items: rows.map((row) => ({
			id: row.id,
			title: row.title,
			description: { en: row.descriptionEn, es: row.descriptionEs },
			audioLanguage: row.audioLanguage,
			country: row.country,
			genre: row.genre,
			releaseYear: row.releaseYear,
			url: row.url,
		})),
		page,
		totalPages,
		totalCount: total,
		genres: genreRows.map((row) => row.genre),
	};
}

/** The table behind each resource kind; a new kind will not compile until it is listed here. */
const kindTables = { podcasts, movies } satisfies Record<ResourceKind, PgTable>;

export async function countCatalogue(): Promise<CatalogueCounts> {
	const counts = await Promise.all(
		Object.entries(kindTables).map(async ([kind, table]) => {
			const [{ total }] = await db().select({ total: count() }).from(table);
			return [kind, total] as const;
		}),
	);
	return Object.fromEntries(counts) as CatalogueCounts;
}
