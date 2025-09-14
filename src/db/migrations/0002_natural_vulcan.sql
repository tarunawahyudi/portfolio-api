CREATE TYPE "public"."article_status" AS ENUM('draft', 'published', 'deleted');--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "status" "article_status" DEFAULT 'draft';