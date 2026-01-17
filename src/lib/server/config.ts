import { env } from '$env/dynamic/private';

export interface RegistryConfig {
	url: string;
	username: string;
	password: string;
}

export function getRegistryConfig(): RegistryConfig {
	const url = env.REGISTRY_URL || 'http://localhost:5050';
	const username = env.REGISTRY_USER || '';
	const password = env.REGISTRY_PASSWORD || '';

	return { url, username, password };
}

export function isConfigured(): boolean {
	const config = getRegistryConfig();
	return Boolean(config.url && config.username && config.password);
}
