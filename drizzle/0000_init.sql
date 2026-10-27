CREATE TYPE "public"."genre" AS ENUM('drama', 'fantasy', 'sci-fi', 'thriller');--> statement-breakpoint
CREATE TYPE "public"."level" AS ENUM('beginner', 'intermediate', 'advanced');--> statement-breakpoint
CREATE TYPE "public"."resource_language" AS ENUM('es', 'en', 'both');--> statement-breakpoint
CREATE TABLE "movies" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description_en" text NOT NULL,
	"description_es" text NOT NULL,
	"audio_language" "resource_language" NOT NULL,
	"country" char(2) NOT NULL,
	"genre" "genre" NOT NULL,
	"release_year" integer NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "podcasts" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description_en" text NOT NULL,
	"description_es" text NOT NULL,
	"language" "resource_language" NOT NULL,
	"level" "level" NOT NULL,
	"country" char(2),
	"url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
