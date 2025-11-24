CREATE TABLE "devlog" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"projectId" integer NOT NULL,
	"description" text NOT NULL,
	"timeSpent" integer NOT NULL,
	"image" text NOT NULL,
	"model" text,
	"deleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"name" text,
	"description" text,
	"url" text,
	"status" text DEFAULT 'building' NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"actionUserId" integer NOT NULL,
	"projectId" integer NOT NULL,
	"type" text NOT NULL,
	"name" text,
	"description" text,
	"url" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"userId" integer NOT NULL,
	"expiresAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "t1_review" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"projectId" integer NOT NULL,
	"feedback" text,
	"notes" text,
	"action" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "t2_review" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"projectId" integer NOT NULL,
	"feedback" text,
	"notes" text,
	"multiplier" real DEFAULT 1 NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"idvId" text NOT NULL,
	"slackId" text NOT NULL,
	"profilePicture" text NOT NULL,
	"name" text NOT NULL,
	"hackatimeTrust" text DEFAULT 'blue' NOT NULL,
	"trust" text DEFAULT 'blue' NOT NULL,
	"hasSessionAuditLogs" boolean DEFAULT false NOT NULL,
	"hasProjectAuditLogs" boolean DEFAULT false NOT NULL,
	"hasT1Review" boolean DEFAULT false NOT NULL,
	"hasT2Review" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"lastLoginAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_idvId_unique" UNIQUE("idvId"),
	CONSTRAINT "user_slackId_unique" UNIQUE("slackId")
);
--> statement-breakpoint
ALTER TABLE "devlog" ADD CONSTRAINT "devlog_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devlog" ADD CONSTRAINT "devlog_projectId_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_audit_log" ADD CONSTRAINT "project_audit_log_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_audit_log" ADD CONSTRAINT "project_audit_log_actionUserId_user_id_fk" FOREIGN KEY ("actionUserId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_audit_log" ADD CONSTRAINT "project_audit_log_projectId_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t1_review" ADD CONSTRAINT "t1_review_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t1_review" ADD CONSTRAINT "t1_review_projectId_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t2_review" ADD CONSTRAINT "t2_review_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t2_review" ADD CONSTRAINT "t2_review_projectId_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;