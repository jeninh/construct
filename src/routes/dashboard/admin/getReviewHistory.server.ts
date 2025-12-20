import { db } from '$lib/server/db';
import { legionReview, t1Review, user } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function getReviewHistory(id: number) {
	const t1Reviews = await db
		.select({
			user: {
				id: user.id,
				name: user.name
			},
			action: t1Review.action,
			notes: t1Review.notes,
			feedback: t1Review.feedback,
			timestamp: t1Review.timestamp
		})
		.from(t1Review)
		.innerJoin(user, eq(user.id, t1Review.userId))
		.where(eq(t1Review.projectId, id))
		.orderBy(asc(t1Review.timestamp));

	const legionReviews = await db
		.select({
			user: {
				id: user.id,
				name: user.name
			},
			action: legionReview.action,
			filamentUsed: legionReview.filamentUsed,
			notes: legionReview.notes,
			feedback: legionReview.feedback,
			timestamp: legionReview.timestamp
		})
		.from(legionReview)
		.innerJoin(user, eq(user.id, legionReview.userId))
		.where(eq(legionReview.projectId, id))
		.orderBy(asc(legionReview.timestamp));

	return {
		t1Reviews,
		legionReviews
	};
}
