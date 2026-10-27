import {
	type CatalogueCounts,
	type Genre,
	genres,
	type Movie,
	type MovieSearch,
	type Page,
	type Podcast,
	type PodcastSearch,
} from "@/lib/catalog";
import { movies } from "./data/movies";
import { podcasts } from "./data/podcasts";

/**
 * Catalogue reads. The data lives in the repository today; these functions are
 * the only place that knows that, so moving to a database changes their bodies
 * and nothing else.
 */

export const MOVIES_PAGE_SIZE = 24;

export function findPodcasts(search: PodcastSearch): Podcast[] {
	return podcasts.filter(
		(podcast) =>
			(!search.language || podcast.language === search.language) &&
			(!search.level || podcast.level === search.level),
	);
}

/** Genres that at least one film has, in catalogue order, so the filter never offers an empty result. */
export function findMovies(
	search: MovieSearch,
): Page<Movie> & { genres: Genre[] } {
	const matching = movies
		.filter(
			(movie) =>
				(!search.language || movie.audioLanguage === search.language) &&
				(!search.genre || movie.genre === search.genre),
		)
		.sort(
			(a, b) => b.releaseYear - a.releaseYear || a.title.localeCompare(b.title),
		);

	const totalPages = Math.max(1, Math.ceil(matching.length / MOVIES_PAGE_SIZE));
	const page = Math.min(search.page ?? 1, totalPages);
	const start = (page - 1) * MOVIES_PAGE_SIZE;

	return {
		items: matching.slice(start, start + MOVIES_PAGE_SIZE),
		page,
		totalPages,
		totalCount: matching.length,
		genres: genres.filter((genre) =>
			movies.some((movie) => movie.genre === genre),
		),
	};
}

export function countCatalogue(): CatalogueCounts {
	return { podcasts: podcasts.length, movies: movies.length };
}
