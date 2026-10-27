import {
	char,
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { genres, levels, resourceLanguages } from "@/lib/catalog";
import { resourceKindIds } from "@/lib/resource-kinds";

/** Enum values come from the shared constants, so the URL schemas, the registry and the database agree. */
export const resourceKind = pgEnum("resource_kind", resourceKindIds);
export const resourceLanguage = pgEnum("resource_language", resourceLanguages);
export const level = pgEnum("level", levels);
export const genre = pgEnum("genre", genres);

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
		url: text("url").notNull(),
		...timestamps,
	},
	(table) => [index("resources_kind_idx").on(table.kind)],
);

// Superseded by `resources`; dropped by the next migration once no deployment reads them.

export const podcasts = pgTable("podcasts", {
	/** URL-safe slug, stable across environments so seeds and links can name it. */
	id: text("id").primaryKey(),
	title: text("title").notNull(),
	descriptionEn: text("description_en").notNull(),
	descriptionEs: text("description_es").notNull(),
	language: resourceLanguage("language").notNull(),
	level: level("level").notNull(),
	/** ISO 3166-1 alpha-2; null when the hosts come from several countries. */
	country: char("country", { length: 2 }),
	url: text("url").notNull(),
	...timestamps,
});

export const movies = pgTable("movies", {
	id: text("id").primaryKey(),
	title: text("title").notNull(),
	descriptionEn: text("description_en").notNull(),
	descriptionEs: text("description_es").notNull(),
	audioLanguage: resourceLanguage("audio_language").notNull(),
	country: char("country", { length: 2 }).notNull(),
	genre: genre("genre").notNull(),
	releaseYear: integer("release_year").notNull(),
	url: text("url").notNull(),
	...timestamps,
});
