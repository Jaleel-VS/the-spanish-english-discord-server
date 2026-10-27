import { z } from "zod";

/** Which language a resource is in. `both` means it mixes Spanish and English. */
export const resourceLanguages = ["es", "en", "both"] as const;
export type ResourceLanguage = (typeof resourceLanguages)[number];

export const levels = ["beginner", "intermediate", "advanced"] as const;
export type Level = (typeof levels)[number];

export const genres = ["drama", "fantasy", "sci-fi", "thriller"] as const;
export type Genre = (typeof genres)[number];

/** Copy written for each site language. */
export interface Localized {
	en: string;
	es: string;
}

export interface Podcast {
	id: string;
	title: string;
	description: Localized;
	language: ResourceLanguage;
	level: Level;
	/** ISO 3166-1 alpha-2 code, named in the visitor's language; null when hosts are from several countries. */
	country: string | null;
	url: string;
}

export interface Movie {
	id: string;
	title: string;
	description: Localized;
	audioLanguage: ResourceLanguage;
	/** ISO 3166-1 alpha-2 code. */
	country: string;
	genre: Genre;
	releaseYear: number;
	url: string;
}

export interface Page<T> {
	items: T[];
	page: number;
	totalPages: number;
	totalCount: number;
}

export interface CatalogueCounts {
	podcasts: number;
	movies: number;
}

/**
 * URL search params of the podcasts page. Parsed leniently (`catch`) because
 * they come from hand-edited URLs: a bad value is dropped, not a 500.
 */
export const podcastSearchSchema = z.object({
	language: z.enum(resourceLanguages).optional().catch(undefined),
	level: z.enum(levels).optional().catch(undefined),
});
export type PodcastSearch = z.output<typeof podcastSearchSchema>;

export const movieSearchSchema = z.object({
	language: z.enum(resourceLanguages).optional().catch(undefined),
	genre: z.enum(genres).optional().catch(undefined),
	page: z.coerce.number().int().min(1).max(10_000).optional().catch(undefined),
});
export type MovieSearch = z.output<typeof movieSearchSchema>;
