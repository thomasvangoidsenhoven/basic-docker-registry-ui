import { getRegistryConfig } from '$lib/server/config';
import { getRegistryClient } from '$lib/server/registry-client';

export async function load() {
	const config = getRegistryConfig();
	const client = getRegistryClient();

	let connected = false;
	try {
		connected = await client.checkConnection();
	} catch {
		connected = false;
	}

	return {
		registryUrl: config.url,
		connected
	};
}
