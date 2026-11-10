import {
	and,
	asc,
	count,
	eq,
	ilike,
	inArray,
	isNull,
	not,
	or,
	type SQL,
	sql,
} from "drizzle-orm";
import {
	type CatalogueCounts,
	namedRegionCountries,
	type Region,
	type Resource,
	type ResourceListing,
	type ResourceSearch,
	regionCountries,
	regionOf,
} from "@/lib/catalog";
import {
	findResourceKind,
	type ResourceFilter,
	type ResourceKind,
	resourceKindIds,
} from "@/lib/resource-kinds";
import { db } from "./db/client.server";
import { resources } from "./db/schema";

/** Catalogue reads. The server functions in catalog.functions.ts are the only callers. */

export const PAGE_SIZE = 24;

function regionCondition(region: Region): SQL {
	if (region === "other") {
		return or(
			isNull(resources.country),
			not(inArray(resources.country, [...namedRegionCountries])),
		) as SQL;
	}
	return inArray(resources.country, [...regionCountries[region]]);
}

/** The SQL condition for one active filter. */
function condition(
	filter: ResourceFilter,
	search: ResourceSearch,
): SQL | undefined {
	switch (filter) {
		case "language":
			return search.language && eq(resources.language, search.language);
		case "level":
			return search.level && eq(resources.level, search.level);
		case "genre":
			return search.genre && eq(resources.genre, search.genre);
		case "audience":
			return search.audience && eq(resources.audience, search.audience);
		case "topic":
			return (
				search.topic &&
				sql`${resources.topics} @> array[${search.topic}]::text[]`
			);
		case "region":
			return search.region && regionCondition(search.region);
	}
}

function searchCondition(q: string | undefined): SQL | undefined {
	if (!q) return undefined;
	const pattern = `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
	return or(
		ilike(resources.title, pattern),
		ilike(resources.creator, pattern),
		ilike(resources.descriptionEn, pattern),
		ilike(resources.descriptionEs, pattern),
	);
}

/** Option counts for one filter, under every other active filter. */
async function facet(
	filter: ResourceFilter,
	base: (SQL | undefined)[],
): Promise<Record<string, number>> {
	const where = and(...base);
	const tally = (rows: { value: string | null; total: number }[]) => {
		const counts: Record<string, number> = {};
		for (const row of rows)
			if (row.value) counts[row.value] = (counts[row.value] ?? 0) + row.total;
		return counts;
	};
	switch (filter) {
		case "topic": {
			const rows = await db()
				.select({
					value: sql<string>`unnest(${resources.topics})`,
					total: count(),
				})
				.from(resources)
				.where(where)
				.groupBy(sql`1`);
			return tally(rows);
		}
		case "region": {
			const rows = await db()
				.select({ value: resources.country, total: count() })
				.from(resources)
				.where(where)
				.groupBy(resources.country);
			return tally(
				rows.map((row) => ({ value: regionOf(row.value), total: row.total })),
			);
		}
		default: {
			const column = {
				language: resources.language,
				level: resources.level,
				genre: resources.genre,
				audience: resources.audience,
			}[filter];
			const rows = await db()
				.select({ value: column, total: count() })
				.from(resources)
				.where(where)
				.groupBy(column);
			return tally(rows);
		}
	}
}

/**
 * One page of a kind's entries with the kind's filters and the search applied,
 * plus option counts for each of its filters. Order: easiest level first, then
 * newest, then title. A page past the end is clamped to the last page.
 */
export async function findResources(
	kind: ResourceKind,
	search: ResourceSearch,
): Promise<ResourceListing> {
	const offered: readonly ResourceFilter[] =
		findResourceKind(kind)?.filters ?? [];
	const fixed = [eq(resources.kind, kind), searchCondition(search.q)];
	const active = Object.fromEntries(
		offered.map((filter) => [filter, condition(filter, search)]),
	);
	const where = and(...fixed, ...Object.values(active));

	const [[{ total }], [{ kindCount }], facetEntries] = await Promise.all([
		db().select({ total: count() }).from(resources).where(where),
		db()
			.select({ kindCount: count() })
			.from(resources)
			.where(eq(resources.kind, kind)),
		Promise.all(
			offered.map(async (filter) => {
				const others = offered
					.filter((other) => other !== filter)
					.map((other) => active[other]);
				return [filter, await facet(filter, [...fixed, ...others])] as const;
			}),
		),
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
			topics: row.topics as Resource["topics"],
			audience: row.audience,
			imageUrl: row.imageUrl,
			url: row.url,
		})),
		page,
		totalPages,
		totalCount: total,
		kindCount,
		facets: Object.fromEntries(facetEntries),
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
