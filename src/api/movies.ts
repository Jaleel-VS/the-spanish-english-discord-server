import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { API_BASE_URL } from "./podcasts";

export interface Movie {
	id: string;
	title: string;
	description: string;
	posterUrl: string;
	audioLanguage: "en" | "es" | "both";
	country: string;
	genre: string;
	releaseYear: number;
	url: string;
	archived: boolean;
	createdAt: string;
	updatedAt: string;
}

const MOVIES_API_BASE_URL = `${API_BASE_URL}/movies`;

export const moviesListQuerySchema = z.object({
	page: z.coerce.number().int().min(1).max(10_000).default(1),
	pageSize: z.coerce.number().int().min(1).max(100).default(20),
	audioLanguage: z.enum(["en", "es", "both"]).optional(),
	genre: z.string().max(50).optional(),
	country: z.string().max(100).optional(),
	search: z.string().max(500).optional(),
	includeArchived: z.boolean().optional(),
});

export type MoviesQueryParams = z.infer<typeof moviesListQuerySchema>;

export type Pagination = {
	totalCount: number;
	totalPages: number;
	currentPage: number;
};

export type MoviesResponse = {
	items: Movie[];
	pagination: Pagination;
};


const moviesRouteSearchDefaultsInput = {
	page: 1,
	pageSize: 20,
	search: "",
	includeArchived: false,
} as const;

export const moviesRouteSearchSchema = z.preprocess(
	(raw) => {
		const base = { ...moviesRouteSearchDefaultsInput };
		const wide = raw && typeof raw === "object" && !Array.isArray(raw)
			? ({ ...base, ...(raw as Record<string, unknown>) } as Record<
					string,
					unknown
				>)
			: ({ ...base } as Record<string, unknown>);
		return wide;
	},
	z.object({
		page: z.coerce.number().int().min(1).max(10_000).catch(1),
		pageSize: z.coerce.number().int().min(1).max(100).catch(20),
		search: z.string().max(500).catch(""),
		audioLanguage: z
			.enum(["en", "es", "both"])
			.optional()
			.catch(undefined),
		genre: z
			.string()
			.max(50)
			.optional()
			.transform((v) => (v?.trim() ? v.trim() : undefined)),
		country: z
			.string()
			.max(100)
			.optional()
			.transform((v) => (v?.trim() ? v.trim() : undefined)),
		includeArchived: z
			.union([
				z.boolean(),
				z.literal("true"),
				z.literal("false"),
				z.literal(""),
				z.null(),
				z.undefined(),
			])
			.transform((v) => v === true || v === "true"),
	}),
);

export type MoviesRouteSearch = z.output<typeof moviesRouteSearchSchema>;


export function parseMoviesRouteSearch(raw: unknown): MoviesRouteSearch {
	return moviesRouteSearchSchema.parse(raw ?? {});
}

export function moviesRouteSearchDefaults(): MoviesRouteSearch {
	return parseMoviesRouteSearch({});
}

export function moviesRouteSearchToApi(s: MoviesRouteSearch): MoviesQueryParams {
	const trimmed = (s.search ?? "").trim();
	const base: MoviesQueryParams = {
		page: s.page ?? 1,
		pageSize: s.pageSize ?? 20,
	};
	if (trimmed) base.search = trimmed;
	if (s.audioLanguage) base.audioLanguage = s.audioLanguage;
	if (s.genre) base.genre = s.genre;
	if (s.country) base.country = s.country;
	if (s.includeArchived) base.includeArchived = true;
	return base;
}

async function fetchMovies(params?: MoviesQueryParams): Promise<MoviesResponse> {
	const parsed = moviesListQuerySchema.parse(
		params ?? { page: 1, pageSize: 20 },
	);
	const url = new URL(MOVIES_API_BASE_URL);

	Object.entries(parsed).forEach(([key, value]) => {
		if (value === undefined || value === null) return;
		url.searchParams.set(key, String(value));
	});

	const response = await fetch(url.toString());
	if (!response.ok) {
		throw new Error("Failed to fetch movies");
	}
	const data = await response.json();
	return { items: data.items, pagination: data.pagination };
}

export const moviesQueryOptions = (params: MoviesQueryParams) =>
	queryOptions({
		queryKey: ["movies", params],
		queryFn: () => fetchMovies(params),
	});
