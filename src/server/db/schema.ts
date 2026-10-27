import {
	char,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { genres, levels, resourceLanguages } from "@/lib/catalog";

/** Enum values come from the shared catalogue constants, so the URL schemas and the database agree. */
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
