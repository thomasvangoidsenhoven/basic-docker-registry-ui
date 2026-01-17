import { getRegistryClient } from '$lib/server/registry-client';
import type { Repository } from '$lib/types/registry';

export async function load() {
	const client = getRegistryClient();

	let repositories: Repository[] = [];
	let error: string | null = null;

	try {
		const repoNames = await client.listRepositories();

		// Get tag counts for each repository
		repositories = await Promise.all(
			repoNames.map(async (name) => {
				try {
					const tags = await client.listTags(name);
					return { name, tagCount: tags.length };
				} catch {
					return { name, tagCount: 0 };
				}
			})
		);
	} catch (e) {
		error = e instanceof Error ? e.message : 'Failed to fetch repositories';
	}

	return {
		repositories,
		error
	};
}
