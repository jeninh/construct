CREATE TYPE "public"."legion_action" AS ENUM('mark_for_printing', 'unmark_for_printing', 'print', 'reject', 'already_printed');--> statement-breakpoint
CREATE TABLE "legion_review" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"projectId" integer NOT NULL,
	"feedback" text,
	"notes" text,
	"filamentUsed" real,
	"action" "legion_action" NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "legion_review" ADD CONSTRAINT "legion_review_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legion_review" ADD CONSTRAINT "legion_review_projectId_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;