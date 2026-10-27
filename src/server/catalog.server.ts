import { and, asc, count, eq, type SQL, sql } from "drizzle-orm";
import type {
	CatalogueCounts,
	Genre,
	Page,
	Resource,
	ResourceSearch,
} from "@/lib/catalog";
import {
	type ResourceKind,
	resourceKindIds,
	resourceKinds,
} from "@/lib/resource-kinds";
import { db } from "./db/client.server";
import { resources } from "./db/schema";

/** Catalogue reads. The server functions in catalog.functions.ts are the only callers. */

export const PAGE_SIZE = 24;

export interface ResourceListing extends Page<Resource> {
	/** Genres used by this kind's entries, for its genre filter. */
	genres: Genre[];
}

/**
 * One page of a kind's entries. Only the filters the kind offers apply.
 * Order: easiest level first, then newest, then title, so leveled kinds read
 * beginner→advanced and films newest first. A page past the end is clamped.
 */
export async function findResources(
	kind: ResourceKind,
	search: ResourceSearch,
): Promise<ResourceListing> {
	const offered: readonly string[] =
		resourceKinds.find((entry) => entry.id === kind)?.filters ?? [];
	const filters: SQL[] = [eq(resources.kind, kind)];
	if (search.language && offered.includes("language"))
		filters.push(eq(resources.language, search.language));
	if (search.level && offered.includes("level"))
		filters.push(eq(resources.level, search.level));
	if (search.genre && offered.includes("genre"))
		filters.push(eq(resources.genre, search.genre));
	const where = and(...filters);

	const [[{ total }], genreRows] = await Promise.all([
		db().select({ total: count() }).from(resources).where(where),
		db()
			.selectDistinct({ genre: resources.genre })
			.from(resources)
			.where(and(eq(resources.kind, kind), sql`${resources.genre} is not null`))
			.orderBy(asc(resources.genre)),
	]);

	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const page = Math.min(search.page ?? 1, totalPages);

	const rows = await db()
		.select()
		.from(resources)
		.where(where)
		.orderBy(
			sql`${resources.level} asc nulls last`,
			sql`${resources.releaseYear} desc nulls last`,
			asc(resources.title),
		)
		.limit(PAGE_SIZE)
		.offset((page - 1) * PAGE_SIZE);

	return {
		items: rows.map((row) => ({
			id: row.id,
			kind: row.kind,
			title: row.title,
			creator: row.creator,
			description: { en: row.descriptionEn, es: row.descriptionEs },
			language: row.language,
			level: row.level,
			country: row.country,
			genre: row.genre,
			releaseYear: row.releaseYear,
			url: row.url,
		})),
		page,
		totalPages,
		totalCount: total,
		genres: genreRows.flatMap((row) => (row.genre ? [row.genre] : [])),
	};
}

/** Entries per kind; kinds with none are 0, so new kinds show as empty rather than missing. */
export async function countCatalogue(): Promise<CatalogueCounts> {
	const rows = await db()
		.select({ kind: resources.kind, total: count() })
		.from(resources)
		.groupBy(resources.kind);
	const counts = Object.fromEntries(
		resourceKindIds.map((kind) => [kind, 0]),
	) as CatalogueCounts;
	for (const row of rows) counts[row.kind] = row.total;
	return counts;
}
