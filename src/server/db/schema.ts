import {
	char,
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { audiences, genres, levels, resourceLanguages } from "@/lib/catalog";
import { resourceKindIds } from "@/lib/resource-kinds";

/** Enum values come from the shared constants, so the URL schemas, the registry and the database agree. */
export const resourceKind = pgEnum("resource_kind", resourceKindIds);
export const resourceLanguage = pgEnum("resource_language", resourceLanguages);
export const level = pgEnum("level", levels);
export const genre = pgEnum("genre", genres);
export const audience = pgEnum("audience", audiences);

const timestamps = {
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
};

/** Every catalogue entry, whatever its kind. Kind-specific columns are nullable. */
export const resources = pgTable(
	"resources",
	{
		/** URL-safe slug, unique across kinds and stable across environments. */
		id: text("id").primaryKey(),
		kind: resourceKind("kind").notNull(),
		title: text("title").notNull(),
		creator: text("creator"),
		descriptionEn: text("description_en").notNull(),
		descriptionEs: text("description_es").notNull(),
		language: resourceLanguage("language").notNull(),
		level: level("level"),
		/** ISO 3166-1 alpha-2; null when several countries are involved. */
		country: char("country", { length: 2 }),
		genre: genre("genre"),
		releaseYear: integer("release_year"),
		/** Values from `topics` in src/lib/catalog.ts; validated by the seed's types. */
		topics: text("topics").array().notNull().default([]),
		audience: audience("audience"),
		imageUrl: text("image_url"),
		url: text("url").notNull(),
		...timestamps,
	},
	(table) => [
		index("resources_kind_idx").on(table.kind),
		index("resources_topics_idx").using("gin", table.topics),
	],
);
