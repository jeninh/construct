import { db } from '$lib/server/db/index.js';
import { marketItem } from '$lib/server/db/schema.js';
import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';

export async function load({ locals }) {
	if (!locals.user) {
		throw error(500);
	}

	const marketItems = await db
		.select({
			id: marketItem.id,
			name: marketItem.name,
			description: marketItem.description,
			image: marketItem.image,
			minPrice: marketItem.minPrice,
			maxPrice: marketItem.maxPrice,
			minShopScore: marketItem.minShopScore,
			maxShopScore: marketItem.maxShopScore,
			minRequiredShopScore: marketItem.minRequiredShopScore
		})
		.from(marketItem)
		.where(
			and(
				eq(marketItem.deleted, false),
				locals.user.hasAdmin ? undefined : eq(marketItem.isPublic, true)
			)
		)
		.orderBy(marketItem.maxPrice);

	const shopScore = Number(locals.user?.shopScore || 0);
	const marketItemsWithPrice = marketItems
		.map((item) => {
			const max = Number(item.maxPrice || 0);
			const min = Number(item.minPrice || 0);
			const diff = Math.max(0, max - min);

			const minShop = Number(item.minShopScore || 0);
			const maxShop = Number(item.maxShopScore || 0);
			let discountPercent = 0;
			if (maxShop > minShop) {
				discountPercent = (shopScore - minShop) / (maxShop - minShop);
				discountPercent = Math.max(0, Math.min(1, discountPercent));
			} else {
				discountPercent = 0;
			}

			const discountAmount = diff * discountPercent;
			const rawPrice = Math.ceil(max - discountAmount);
			const computedPrice = Math.max(rawPrice, min);
			return { ...item, computedPrice };
		})
		.filter((item) => {
			if (locals.user?.hasAdmin) return true;
			const minReq = Number(item.minRequiredShopScore || 0);
			return shopScore >= minReq;
		})
		.sort((a, b) => a.computedPrice - b.computedPrice);

	return {
		marketItems: marketItemsWithPrice
	};
}
