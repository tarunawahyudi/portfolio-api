CREATE TYPE "public"."portfolio_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TABLE "portfolio_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portfolio_id" uuid NOT NULL,
	"user_id" uuid,
	"ip_address" varchar(45),
	"country" varchar,
	"region" varchar,
	"city" varchar,
	"latitude" double precision,
	"longitude" double precision,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "category" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "status" "portfolio_status" DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "visibility" "visibility" DEFAULT 'public' NOT NULL;--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "is_featured" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "project_url" varchar;--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "repo_url" varchar;--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "demo_url" text;--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "summary" varchar(500);--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "external_video_url" text;--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "self_hosted_video_url" text;--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "published_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "portfolio_views" ADD CONSTRAINT "portfolio_views_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_views" ADD CONSTRAINT "portfolio_views_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;