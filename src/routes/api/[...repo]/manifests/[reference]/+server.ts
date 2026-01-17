import { json } from '@sveltejs/kit';
import { getRegistryClient } from '$lib/server/registry-client';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const repository = params.repo;
	const reference = params.reference;

	if (!repository || !reference) {
		return json({ error: 'Repository and reference are required' }, { status: 400 });
	}

	try {
		const client = getRegistryClient();
		const manifest = await client.getManifest(repository, reference);
		const config = await client.getImageConfig(repository, manifest.config.digest);

		return json({
			manifest,
			config
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to fetch manifest';
		return json({ error: message }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	const repository = params.repo;
	const reference = params.reference;

	if (!repository || !reference) {
		return json({ error: 'Repository and reference are required' }, { status: 400 });
	}

	try {
		const client = getRegistryClient();

		// If reference is a tag, get its digest first
		let digest = reference;
		if (!reference.startsWith('sha256:')) {
			digest = await client.getTagDigest(repository, reference);
		}

		await client.deleteManifest(repository, digest);

		return json({ success: true });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to delete manifest';
		return json({ error: message }, { status: 500 });
	}
};
