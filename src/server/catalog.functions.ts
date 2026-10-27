import { createServerFn } from "@tanstack/react-start";
import { movieSearchSchema, podcastSearchSchema } from "@/lib/catalog";
import { countCatalogue, findMovies, findPodcasts } from "./catalog.server";

export const listPodcasts = createServerFn({ method: "GET" })
	.validator(podcastSearchSchema)
	.handler(({ data }) => findPodcasts(data));

export const listMovies = createServerFn({ method: "GET" })
	.validator(movieSearchSchema)
	.handler(({ data }) => findMovies(data));

export const getCatalogueCounts = createServerFn({ method: "GET" }).handler(
	() => countCatalogue(),
);
