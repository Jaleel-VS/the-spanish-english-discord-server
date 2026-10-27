import { z } from "zod";
import type { ResourceKind } from "./resource-kinds";

/** Which language a resource is in. `both` means it mixes Spanish and English. */
export const resourceLanguages = ["es", "en", "both"] as const;
export type ResourceLanguage = (typeof resourceLanguages)[number];

export const levels = ["beginner", "intermediate", "advanced"] as const;
export type Level = (typeof levels)[number];

/** Film genres (the `genre` filter on the movies page). */
export const genres = ["drama", "fantasy", "sci-fi", "thriller"] as const;
export type Genre = (typeof genres)[number];

/** Copy written for each site language. */
export interface Localized {
	en: string;
	es: string;
}

/**
 * One entry of any kind. Fields that only some kinds use (level, genre,
 * release year, creator) are null for the others.
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
	url: string;
}

export interface Page<T> {
	items: T[];
	page: number;
	totalPages: number;
	totalCount: number;
}

/** Number of entries per resource kind, for the resources page and the home page band. */
export type CatalogueCounts = Record<ResourceKind, number>;

/**
 * URL search params of a resource kind's page. Parsed leniently (`catch`)
 * because they come from hand-edited URLs: a bad value is dropped, not a 500.
 * A kind ignores the filters it does not offer.
 */
export const resourceSearchSchema = z.object({
	language: z.enum(resourceLanguages).optional().catch(undefined),
	level: z.enum(levels).optional().catch(undefined),
	genre: z.enum(genres).optional().catch(undefined),
	page: z.coerce.number().int().min(1).max(10_000).optional().catch(undefined),
});
export type ResourceSearch = z.output<typeof resourceSearchSchema>;
