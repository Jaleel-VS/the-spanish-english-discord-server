CREATE TYPE "public"."resource_kind" AS ENUM('podcasts', 'youtube', 'movies', 'books', 'workbooks', 'musicians');--> statement-breakpoint
CREATE TABLE "resources" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" "resource_kind" NOT NULL,
	"title" text NOT NULL,
	"creator" text,
	"description_en" text NOT NULL,
	"description_es" text NOT NULL,
	"language" "resource_language" NOT NULL,
	"level" "level",
	"country" char(2),
	"genre" "genre",
	"release_year" integer,
	"url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "resources_kind_idx" ON "resources" USING btree ("kind");--> statement-breakpoint
INSERT INTO "resources" ("id", "kind", "title", "description_en", "description_es", "language", "level", "country", "url", "created_at", "updated_at")
SELECT "id", 'podcasts', "title", "description_en", "description_es", "language", "level", "country", "url", "created_at", "updated_at" FROM "podcasts"
ON CONFLICT ("id") DO NOTHING;--> statement-breakpoint
INSERT INTO "resources" ("id", "kind", "title", "description_en", "description_es", "language", "country", "genre", "release_year", "url", "created_at", "updated_at")
SELECT "id", 'movies', "title", "description_en", "description_es", "audio_language", "country", "genre", "release_year", "url", "created_at", "updated_at" FROM "movies"
ON CONFLICT ("id") DO NOTHING;
