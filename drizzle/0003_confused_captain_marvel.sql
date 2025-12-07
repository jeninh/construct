ALTER TABLE "project" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "status" SET DEFAULT 'building'::text;--> statement-breakpoint
DROP TYPE "public"."status";--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('building', 'submitted', 't1_approved', 'printing', 'printed', 't2_approved', 'finalized', 'rejected', 'rejected_locked');--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "status" SET DEFAULT 'building'::"public"."status";--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "status" SET DATA TYPE "public"."status" USING "status"::"public"."status";