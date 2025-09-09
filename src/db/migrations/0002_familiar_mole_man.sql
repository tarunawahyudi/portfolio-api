ALTER TABLE "login_attempts" ADD COLUMN "device" varchar(50);--> statement-breakpoint
ALTER TABLE "login_attempts" ADD COLUMN "browser" varchar(50);--> statement-breakpoint
ALTER TABLE "login_attempts" ADD COLUMN "os" varchar(50);--> statement-breakpoint
ALTER TABLE "login_attempts" ADD COLUMN "cpu" varchar(50);--> statement-breakpoint
ALTER TABLE "login_attempts" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();