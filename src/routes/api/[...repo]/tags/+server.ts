import { json } from '@sveltejs/kit';
import { getRegistryClient } from '$lib/server/registry-client';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const repository = params.repo;

	if (!repository) {
		return json({ error: 'Repository name is required' }, { status: 400 });
	}

	try {
		const client = getRegistryClient();
		const tagNames = await client.listTags(repository);

		// Get details for each tag
		const tags = await Promise.all(
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

		return json({ tags });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to fetch tags';
		return json({ error: message }, { status: 500 });
	}
};
