import type {
	CatalogResponse,
	TagListResponse,
	Manifest,
	ManifestLayer,
	ImageConfig
} from '$lib/types/registry';

export interface RegistryCredentials {
	url: string;
	username: string;
	password: string;
}

const MANIFEST_V2_CONTENT_TYPE = 'application/vnd.docker.distribution.manifest.v2+json';
const MANIFEST_LIST_CONTENT_TYPE = 'application/vnd.docker.distribution.manifest.list.v2+json';
const OCI_MANIFEST_CONTENT_TYPE = 'application/vnd.oci.image.manifest.v1+json';
const OCI_INDEX_CONTENT_TYPE = 'application/vnd.oci.image.index.v1+json';

export class RegistryClient {
	private credentials: RegistryCredentials;

	constructor(credentials: RegistryCredentials) {
		this.credentials = credentials;
	}

	private getAuthHeader(): string {
		const credentials = btoa(`${this.credentials.username}:${this.credentials.password}`);
		return `Basic ${credentials}`;
	}

	private async fetch(path: string, options: RequestInit = {}): Promise<Response> {
		const url = `${this.credentials.url}${path}`;
		const headers = new Headers(options.headers);
		headers.set('Authorization', this.getAuthHeader());

		const response = await fetch(url, {
			...options,
			headers
		});

		return response;
	}

	async checkConnection(): Promise<boolean> {
		try {
			const response = await this.fetch('/v2/');
			return response.ok;
		} catch {
			return false;
		}
	}

	async listRepositories(): Promise<string[]> {
		const response = await this.fetch('/v2/_catalog');

		if (!response.ok) {
			throw new Error(`Failed to list repositories: ${response.statusText}`);
		}

		const data: CatalogResponse = await response.json();
		return data.repositories || [];
	}

	async listTags(repository: string): Promise<string[]> {
		const response = await this.fetch(`/v2/${repository}/tags/list`);

		if (!response.ok) {
			if (response.status === 404) {
				return [];
			}
			throw new Error(`Failed to list tags: ${response.statusText}`);
		}

		const data: TagListResponse = await response.json();
		return data.tags || [];
	}

	async getManifest(repository: string, reference: string): Promise<Manifest> {
		const response = await this.fetch(`/v2/${repository}/manifests/${reference}`, {
			headers: {
				Accept: [
					MANIFEST_V2_CONTENT_TYPE,
					OCI_MANIFEST_CONTENT_TYPE,
					MANIFEST_LIST_CONTENT_TYPE,
					OCI_INDEX_CONTENT_TYPE
				].join(', ')
			}
		});

		if (!response.ok) {
			throw new Error(`Failed to get manifest: ${response.statusText}`);
		}

		const digest = response.headers.get('Docker-Content-Digest') || '';
		const data = await response.json();

		// Handle manifest list (multi-arch images)
		if (
			data.mediaType === MANIFEST_LIST_CONTENT_TYPE ||
			data.mediaType === OCI_INDEX_CONTENT_TYPE
		) {
			// Get the first manifest from the list (typically amd64/linux)
			const manifests = data.manifests || [];
			if (manifests.length > 0) {
				const firstManifest = manifests[0];
				return this.getManifest(repository, firstManifest.digest);
			}
		}

		const totalSize = this.calculateTotalSize(data.layers || []);

		return {
			schemaVersion: data.schemaVersion,
			mediaType: data.mediaType,
			config: data.config,
			layers: data.layers || [],
			digest,
			totalSize
		};
	}

	private calculateTotalSize(layers: ManifestLayer[]): number {
		return layers.reduce((sum, layer) => sum + (layer.size || 0), 0);
	}

	async getImageConfig(repository: string, configDigest: string): Promise<ImageConfig> {
		const response = await this.fetch(`/v2/${repository}/blobs/${configDigest}`);

		if (!response.ok) {
			throw new Error(`Failed to get image config: ${response.statusText}`);
		}

		return response.json();
	}

	async deleteManifest(repository: string, digest: string): Promise<void> {
		const response = await this.fetch(`/v2/${repository}/manifests/${digest}`, {
			method: 'DELETE'
		});

		if (!response.ok) {
			throw new Error(`Failed to delete manifest: ${response.statusText}`);
		}
	}

	async getTagDigest(repository: string, tag: string): Promise<string> {
		const response = await this.fetch(`/v2/${repository}/manifests/${tag}`, {
			method: 'HEAD',
			headers: {
				Accept: [
					MANIFEST_V2_CONTENT_TYPE,
					OCI_MANIFEST_CONTENT_TYPE,
					MANIFEST_LIST_CONTENT_TYPE,
					OCI_INDEX_CONTENT_TYPE
				].join(', ')
			}
		});

		if (!response.ok) {
			throw new Error(`Failed to get tag digest: ${response.statusText}`);
		}

		const digest = response.headers.get('Docker-Content-Digest');
		if (!digest) {
			throw new Error('No digest returned from registry');
		}

		return digest;
	}
}
