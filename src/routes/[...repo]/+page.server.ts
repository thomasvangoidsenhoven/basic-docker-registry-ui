import { getRegistryClient } from '$lib/server/registry-client';
import { error } from '@sveltejs/kit';
import type { Tag } from '$lib/types/registry';

export async function load({ params }) {
	const repository = params.repo;

	if (!repository) {
		throw error(400, 'Repository name is required');
	}

	const client = getRegistryClient();

	let tags: Tag[] = [];
	let loadError: string | null = null;

	try {
		const tagNames = await client.listTags(repository);

		// Get details for each tag
		tags = await Promise.all(
			tagNames.map(async (name) => {
				try {
					const manifest = await client.getManifest(repository, name);
					const config = await client.getImageConfig(repository, manifest.config.digest);

					return {
						name,
						digest: manifest.digest,
						size: manifest.totalSize,
						createdAt: config.created
					};
				} catch {
					return {
						name,
						digest: '',
						size: undefined,
						createdAt: undefined
					};
				}
			})
		);

		// Sort tags: 'latest' first, then alphabetically
		tags.sort((a, b) => {
			if (a.name === 'latest') return -1;
			if (b.name === 'latest') return 1;
			return a.name.localeCompare(b.name);
		});
	} catch (e) {
		loadError = e instanceof Error ? e.message : 'Failed to fetch tags';
	}

	return {
		repository,
		tags,
		error: loadError
	};
}
