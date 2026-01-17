export interface Repository {
	name: string;
	tagCount?: number;
}

export interface Tag {
	name: string;
	digest: string;
	size?: number;
	createdAt?: string;
}

export interface Manifest {
	schemaVersion: number;
	mediaType: string;
	config: ManifestConfig;
	layers: ManifestLayer[];
	digest: string;
	totalSize: number;
}

export interface ManifestConfig {
	mediaType: string;
	size: number;
	digest: string;
}

export interface ManifestLayer {
	mediaType: string;
	size: number;
	digest: string;
}

export interface ImageConfig {
	architecture: string;
	os: string;
	created?: string;
	config?: {
		Env?: string[];
		Cmd?: string[];
		Entrypoint?: string[];
		WorkingDir?: string;
		ExposedPorts?: Record<string, object>;
		Labels?: Record<string, string>;
	};
	history?: HistoryEntry[];
}

export interface HistoryEntry {
	created?: string;
	created_by?: string;
	empty_layer?: boolean;
	comment?: string;
}

export interface RegistryError {
	code: string;
	message: string;
	detail?: unknown;
}

export interface CatalogResponse {
	repositories: string[];
}

export interface TagListResponse {
	name: string;
	tags: string[] | null;
}
