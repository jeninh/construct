import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_HOST) throw new Error('DATABASE_HOST is not set');

const pool = new Pool({
	host: process.env.DATABASE_HOST,
	port: 5432,
	user: 'postgres',
	ssl: false,
	database: 'postgres'
});

export const db = drizzle(pool, { schema });
