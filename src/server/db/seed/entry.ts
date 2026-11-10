import type { Resource } from "@/lib/catalog";

type Optional =
	| "creator"
	| "level"
	| "country"
	| "genre"
	| "releaseYear"
	| "topics"
	| "audience"
	| "imageUrl";

/**
 * A seed row: the kind comes from the file it is in, and kind-specific fields
 * may be left out. `imageUrl` is looked up at seed time when left out (see
 * images.ts); `appleId` is a podcast's Apple Podcasts id when its `url` points
 * to the show's own site, used only for that lookup.
 */
export type SeedEntry = Omit<Resource, "kind" | Optional> &
	Partial<Pick<Resource, Optional>> & { appleId?: string };
