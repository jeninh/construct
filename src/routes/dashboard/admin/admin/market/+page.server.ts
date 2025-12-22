import { db } from '$lib/server/db/index.js';
import { marketItem } from '$lib/server/db/schema.js';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function load({ locals }) {
	if (!locals.user) {
		throw error(500);
	}
	if (!locals.user.hasAdmin) {
		throw error(403, { message: 'oi get out' });
	}

	const marketItems = await db
		.select()
		.from(marketItem)
		.where(eq(marketItem.deleted, false));

	return {
		marketItems
	};
}
