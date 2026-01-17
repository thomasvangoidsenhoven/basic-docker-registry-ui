import { getRegistryClient } from '$lib/server/registry-client';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const repository = params.repo;
	const tag = params.tag;

	if (!repository || !tag) {
		throw error(400, 'Repository and tag are required');
	}

	const client = getRegistryClient();

	try {
		const manifest = await client.getManifest(repository, tag);
		const config = await client.getImageConfig(repository, manifest.config.digest);

		return {
			repository,
			tag,
			manifest,
			config
		};
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Failed to fetch image details';
		throw error(404, message);
	}
}
