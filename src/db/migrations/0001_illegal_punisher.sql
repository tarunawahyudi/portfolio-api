CREATE TABLE "login_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"attempt_time" timestamp with time zone DEFAULT now() NOT NULL,
	"success" boolean NOT NULL,
	"ip_address" varchar(50),
	"user_agent" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "current_hashed_refresh_token" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "failed_attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "lock_until" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "login_attempts" ADD CONSTRAINT "login_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;