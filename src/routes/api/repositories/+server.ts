import { json } from '@sveltejs/kit';
import { getRegistryClient } from '$lib/server/registry-client';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const client = getRegistryClient();
		const repositories = await client.listRepositories();

		// Get tag counts for each repository
		const repositoriesWithCounts = await Promise.all(
			repositories.map(async (name) => {
				try {
					const tags = await client.listTags(name);
					return { name, tagCount: tags.length };
				} catch {
					return { name, tagCount: 0 };
				}
			})
		);

		return json({ repositories: repositoriesWithCounts });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to fetch repositories';
		return json({ error: message }, { status: 500 });
	}
};
