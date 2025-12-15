CREATE TYPE "public"."t2_review_action" AS ENUM('approve', 'reject');--> statement-breakpoint
CREATE TABLE "t2_review" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"projectId" integer NOT NULL,
	"feedback" text,
	"notes" text,
	"action" "t2_review_action" NOT NULL,
	"currencyMultiplier" real DEFAULT 1 NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "t2_review" ADD CONSTRAINT "t2_review_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t2_review" ADD CONSTRAINT "t2_review_projectId_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;