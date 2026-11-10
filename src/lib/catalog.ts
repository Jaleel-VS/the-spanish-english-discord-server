import { z } from "zod";
import type { ResourceFilter, ResourceKind } from "./resource-kinds";

/** Which language a resource is in. `both` means it mixes Spanish and English. */
export const resourceLanguages = ["es", "en", "both"] as const;
export type ResourceLanguage = (typeof resourceLanguages)[number];

export const levels = ["beginner", "intermediate", "advanced"] as const;
export type Level = (typeof levels)[number];

/** Film genres (the `genre` filter on the movies page). */
export const genres = ["drama", "fantasy", "sci-fi", "thriller"] as const;
export type Genre = (typeof genres)[number];

/** What an entry is about. An entry may have several; the list is fixed so filters stay meaningful. */
export const topics = [
	"lessons",
	"grammar",
	"pronunciation",
	"conversation",
	"stories",
	"culture",
	"history",
	"science",
	"news",
	"cooking",
	"travel",
	"vlogs",
	"interviews",
] as const;
export type Topic = (typeof topics)[number];

/** Whether something was made for learners or for native speakers. */
export const audiences = ["learners", "native"] as const;
export type Audience = (typeof audiences)[number];

/**
 * Accent regions, the `region` filter. Derived from an entry's country, so
 * entries only store the ISO code. Countries not listed fall under `other`.
 */
export const regionCountries = {
	spain: ["ES"],
	"mexico-central-america": ["MX", "GT", "HN", "SV", "NI", "CR", "PA"],
	caribbean: ["CU", "DO", "PR"],
	andes: ["CO", "VE", "EC", "PE", "BO", "CL"],
	"river-plate": ["AR", "UY", "PY"],
	us: ["US"],
	"uk-ireland": ["GB", "IE"],
	other: [],
} as const satisfies Record<string, readonly string[]>;
export type Region = keyof typeof regionCountries;
export const regions = Object.keys(regionCountries) as [Region, ...Region[]];
/** Every country in a named region; anything else (or no country) is `other`. */
export const namedRegionCountries: readonly string[] =
	Object.values(regionCountries).flat();

export function regionOf(country: string | null): Region {
	const region = regions.find((r) =>
		(regionCountries[r] as readonly string[]).includes(country ?? ""),
	);
	return region ?? "other";
}

/** Copy written for each site language. */
export interface Localized {
	en: string;
	es: string;
}

/**
 * One entry of any kind. Fields that only some kinds use (level, genre,
 * release year, creator, audience) are null for the others.
 */
export interface Resource {
	id: string;
	kind: ResourceKind;
	title: string;
	/** Author, artist, host or channel owner, where it adds something to the title. */
	creator: string | null;
	description: Localized;
	language: ResourceLanguage;
	level: Level | null;
	/** ISO 3166-1 alpha-2 code, named in the visitor's language; null for several countries. */
	country: string | null;
	genre: Genre | null;
	releaseYear: number | null;
	topics: Topic[];
	audience: Audience | null;
	/** Square artwork or avatar from the entry's platform, when there is one. */
	imageUrl: string | null;
	url: string;
}

export interface Page<T> {
	items: T[];
	page: number;
	totalPages: number;
	totalCount: number;
}

/** For each filter a kind offers: how many entries each option would show, given the other filters. */
export type Facets = Partial<Record<ResourceFilter, Record<string, number>>>;

/** One page of a kind's page, with its option counts and the kind's unfiltered size. */
export interface ResourceListing extends Page<Resource> {
	facets: Facets;
	kindCount: number;
}

/** Number of entries per resource kind, for the resources page and the home page band. */
export type CatalogueCounts = Record<ResourceKind, number>;

const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
	z.enum(values).optional().catch(undefined);

/**
 * URL search params of a resource kind's page. Parsed leniently (`catch`)
 * because they come from hand-edited URLs: a bad value is dropped, not a 500.
 * A kind ignores the filters it does not offer.
 */
export const resourceSearchSchema = z.object({
	q: z
		.string()
		.max(100)
		.optional()
		.transform((value) => value?.trim() || undefined)
		.catch(undefined),
	language: optionalEnum(resourceLanguages),
	level: optionalEnum(levels),
	region: optionalEnum(regions),
	topic: optionalEnum(topics),
	audience: optionalEnum(audiences),
	genre: optionalEnum(genres),
	page: z.coerce.number().int().min(1).max(10_000).optional().catch(undefined),
});
export type ResourceSearch = z.output<typeof resourceSearchSchema>;
