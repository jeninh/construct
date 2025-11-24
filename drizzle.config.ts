import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_HOST) throw new Error('DATABASE_HOST is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		host: process.env.DATABASE_HOST,
		port: 5432,
		user: 'postgres',
		ssl: false,
		database: 'postgres'
	},
	verbose: true,
	strict: true
});
