CREATE TYPE "public"."audience" AS ENUM('learners', 'native');--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "topics" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "audience" "audience";--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "image_url" text;--> statement-breakpoint
CREATE INDEX "resources_topics_idx" ON "resources" USING gin ("topics");