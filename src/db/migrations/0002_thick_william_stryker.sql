ALTER TABLE "password_resets" RENAME COLUMN "token" TO "token_hash";--> statement-breakpoint
ALTER TABLE "password_resets" DROP CONSTRAINT "password_resets_token_unique";--> statement-breakpoint
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_token_hash_unique" UNIQUE("token_hash");