import { db } from '$lib/server/db/index.js';
import { devlog, project } from '$lib/server/db/schema.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq, and, or, sql } from 'drizzle-orm';
import type { Actions } from './$types';
import { sendSlackDM } from '$lib/server/slack.js';
import { isValidUrl } from '$lib/utils';

export async function load({ params, locals }) {
	const id: number = parseInt(params.id);

	if (!locals.user) {
		throw error(500);
	}

	const [queriedProject] = await db
		.select({
			id: project.id,
			name: project.name,
			description: project.description,
			url: project.url,
			createdAt: project.createdAt,
			status: project.status,
			timeSpent: sql<number>`COALESCE(SUM(${devlog.timeSpent}), 0)`,
			devlogCount: sql<number>`COALESCE(COUNT(${devlog.id}), 0)`
		})
		.from(project)
		.leftJoin(devlog, and(eq(project.id, devlog.projectId), eq(devlog.deleted, false)))
		.where(
			and(
				eq(project.id, id),
				eq(project.userId, locals.user.id),
				eq(project.deleted, false),
				or(eq(project.status, 'building'), eq(project.status, 'rejected'))
			)
		)
		.groupBy(
			project.id,
			project.name,
			project.description,
			project.url,
			project.createdAt,
			project.status
		)
		.limit(1);

	if (!queriedProject) {
		throw error(404);
	}

	return {
		project: queriedProject
	};
}

export const actions = {
	default: async ({ locals, params, request }) => {
		if (!locals.user) {
			throw error(500);
		}

		const id: number = parseInt(params.id);

		const data = await request.formData();
		const url = data.get('url');

		const [queriedProject] = await db
			.select({
				id: project.id,
				name: project.name,
				description: project.description,
				url: project.url,
				timeSpent: sql<number>`COALESCE(SUM(${devlog.timeSpent}), 0)`,
				devlogCount: sql<number>`COALESCE(COUNT(${devlog.id}), 0)`
			})
			.from(project)
			.leftJoin(devlog, and(eq(project.id, devlog.projectId), eq(devlog.deleted, false)))
			.where(
				and(
					eq(project.id, id),
					eq(project.userId, locals.user.id),
					eq(project.deleted, false),
					or(eq(project.status, 'building'), eq(project.status, 'rejected'))
				)
			)
			.groupBy(project.id, project.description, project.url)
			.limit(1);

		if (!queriedProject) {
			return error(404, { message: 'project not found' });
		}

		// Make sure it has at least 2h
		if (queriedProject.timeSpent < 120) {
			return error(400, { message: 'minimum 2h needed to ship' });
		}

		if (queriedProject.description == '') {
			return error(400, { message: 'project must have a description and Printables url' });
		}

		if (!(!url || (url.toString().trim().length < 8000 && isValidUrl(url.toString().trim())))) {
			return fail(400, {
				fields: { url },
				invalid_url: true
			});
		}

		await db
			.update(project)
			.set({
				url: url?.toString(),
				status: 'submitted'
			})
			.where(
				and(
					eq(project.id, queriedProject.id),
					eq(project.userId, locals.user.id),
					eq(project.deleted, false)
				)
			);

		await sendSlackDM(
			locals.user.slackId,
			`Hiya :wave: Your project <https://construct.hackclub.com/dashboard/projects/${queriedProject.id}|${queriedProject.name}> has been shipped and is now under review. We'll take a look and get back to you soon! :rocket:`
		);

		return redirect(303, '/dashboard/projects');
	}
} satisfies Actions;
