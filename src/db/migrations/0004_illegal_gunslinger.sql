ALTER TABLE "certificates" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "display" jsonb DEFAULT '{"type":"default"}'::jsonb;