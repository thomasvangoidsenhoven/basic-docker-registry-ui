import { writable, derived, get } from 'svelte/store';
import { RegistryClient, type RegistryCredentials } from '$lib/registry-client';

const STORAGE_KEY = 'registry-credentials';

function createCredentialsStore() {
	const { subscribe, set } = writable<RegistryCredentials | null>(null);

	return {
		subscribe,
		set: (credentials: RegistryCredentials | null) => {
			if (credentials) {
				sessionStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
			} else {
				sessionStorage.removeItem(STORAGE_KEY);
			}
			set(credentials);
		},
		init: () => {
			if (typeof window === 'undefined') return;
			const stored = sessionStorage.getItem(STORAGE_KEY);
			if (stored) {
				try {
					set(JSON.parse(stored));
				} catch {
					sessionStorage.removeItem(STORAGE_KEY);
				}
			}
		},
		clear: () => {
			sessionStorage.removeItem(STORAGE_KEY);
			set(null);
		}
	};
}

export const credentials = createCredentialsStore();

export const isLoggedIn = derived(credentials, ($credentials) => $credentials !== null);

export function getClient(): RegistryClient | null {
	const creds = get(credentials);
	if (!creds) return null;
	return new RegistryClient(creds);
}
