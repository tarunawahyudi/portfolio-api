ALTER TABLE "certificates" ALTER COLUMN "display" SET DEFAULT '{"type":"default","value":"award"}'::jsonb;--> statement-breakpoint
ALTER TABLE "certificates" ALTER COLUMN "display" SET NOT NULL;