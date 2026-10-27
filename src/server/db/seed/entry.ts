import type { Resource } from "@/lib/catalog";

/** A seed row: the kind comes from the file it is in, and kind-specific fields may be left out. */
export type SeedEntry = Omit<
	Resource,
	"kind" | "creator" | "level" | "country" | "genre" | "releaseYear"
> &
	Partial<
		Pick<Resource, "creator" | "level" | "country" | "genre" | "releaseYear">
	>;
