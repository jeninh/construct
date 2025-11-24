import {
	integer,
	pgTable,
	text,
	real,
	boolean,
	serial,
	timestamp
} from 'drizzle-orm/pg-core';

// TODO: convert enums to pgEnum

export const user = pgTable('user', {
	id: serial().primaryKey(), // User ID
	idvId: text().notNull().unique(), // IDV ID
	slackId: text().notNull().unique(), // Slack ID
	profilePicture: text().notNull(), // Profile pic URL
	name: text().notNull(), // Username on Slack

	hackatimeTrust: text({ enum: ['green', 'blue', 'yellow', 'red'] })
		.notNull()
		.default('blue'), // Hackatime trust
	// TODO: implement this properly everywhere

	trust: text({ enum: ['green', 'blue', 'yellow', 'red'] })
		.notNull()
		.default('blue'), // User trust, used if hackatime trust can't be used

	hasSessionAuditLogs: boolean().notNull().default(false), // Has access to session audit logs
	hasProjectAuditLogs: boolean().notNull().default(false), // Has access to project audit logs

	hasT1Review: boolean().notNull().default(false), // Has access to t1 review
	hasT2Review: boolean().notNull().default(false), // Has access to t2 review

	createdAt: timestamp().notNull().defaultNow(), // Account creation timestamp
	lastLoginAt: timestamp().notNull().defaultNow() // Last login timestamp
});

export const session = pgTable('session', {
	id: serial().primaryKey(),
	token: text().notNull(),
	userId: integer()
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp().notNull()
});

export const project = pgTable('project', {
	id: serial().primaryKey(),
	userId: integer()
		.notNull()
		.references(() => user.id),

	name: text(),
	description: text(),
	url: text(),

	status: text({
		enum: [
			'building',
			'submitted',
			't1_approved',
			't2_approved',
			'finalized',
			'rejected',
			'rejected_locked'
		] // rejected == can still re-ship, rejected_locked == can't re-ship
	})
		.notNull()
		.default('building'),
	deleted: boolean().notNull().default(false), // Projects aren't actually deleted, just marked as deleted (I cba to deal with foreign key delete issues for audit logs)

	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow()
});

// TODO: implement this
export const projectAuditLog = pgTable('project_audit_log', {
	id: serial().primaryKey(),
	userId: integer()
		.notNull()
		.references(() => user.id), // Project owner
	actionUserId: integer()
		.notNull()
		.references(() => user.id), // User who carried out the action (can be different to userId if it was done by an admin)
	projectId: integer()
		.notNull()
		.references(() => project.id),
	type: text({ enum: ['create', 'update', 'delete'] }).notNull(),

	name: text(),
	description: text(),
	url: text(),

	timestamp: timestamp().notNull().defaultNow()
});

// T1 review: approve/reject
// TODO: implement this
export const t1Review = pgTable('t1_review', {
	id: serial().primaryKey(),
	userId: integer()
		.notNull()
		.references(() => user.id),
	projectId: integer()
		.notNull()
		.references(() => project.id),

	feedback: text(),
	notes: text(),
	action: text({ enum: ['approve', 'reject', 'reject_lock'] }).notNull(),

	timestamp: timestamp().notNull().defaultNow()
});

// TODO: implement this
export const t2Review = pgTable('t2_review', {
	id: serial().primaryKey(),
	userId: integer()
		.notNull()
		.references(() => user.id),
	projectId: integer()
		.notNull()
		.references(() => project.id),

	feedback: text(),
	notes: text(),
	multiplier: real().notNull().default(1.0),

	timestamp: timestamp().notNull().defaultNow()
});

export const devlog = pgTable('devlog', {
	id: serial().primaryKey(),
	userId: integer().references(() => user.id),
	projectId: integer()
		.notNull()
		.references(() => project.id),

	description: text().notNull(),
	timeSpent: integer().notNull(), // Time spent in mins
	image: text().notNull(),
	model: text(),

	deleted: boolean().notNull().default(false), // Works the same as project deletion
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow()
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Project = typeof project.$inferSelect;

export type ProjectAuditLog = typeof projectAuditLog.$inferSelect;

export type T1Review = typeof t1Review.$inferSelect;
export type T2Review = typeof t2Review.$inferSelect;
