<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import LayerList from './LayerList.svelte';
	import { formatBytes, formatDate } from '$lib/utils/format';
	import type { Manifest, ImageConfig } from '$lib/types/registry';

	interface Props {
		manifest: Manifest;
		config: ImageConfig;
	}

	let { manifest, config }: Props = $props();
</script>

<div class="space-y-6">
	<!-- Overview -->
	<Card>
		<h3 class="mb-4 text-lg font-medium text-docker-gray-900">Overview</h3>
		<dl class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<div>
				<dt class="text-sm text-docker-gray-500">Architecture</dt>
				<dd class="mt-1 font-medium text-docker-gray-900">{config.architecture || 'Unknown'}</dd>
			</div>
			<div>
				<dt class="text-sm text-docker-gray-500">OS</dt>
				<dd class="mt-1 font-medium text-docker-gray-900">{config.os || 'Unknown'}</dd>
			</div>
			<div>
				<dt class="text-sm text-docker-gray-500">Total Size</dt>
				<dd class="mt-1 font-medium text-docker-gray-900">{formatBytes(manifest.totalSize)}</dd>
			</div>
			<div>
				<dt class="text-sm text-docker-gray-500">Created</dt>
				<dd class="mt-1 font-medium text-docker-gray-900">{formatDate(config.created)}</dd>
			</div>
		</dl>
	</Card>

	<!-- Digest -->
	<Card>
		<h3 class="mb-4 text-lg font-medium text-docker-gray-900">Digest</h3>
		<code
			class="block rounded bg-docker-gray-100 p-3 font-mono text-sm break-all text-docker-gray-700"
		>
			{manifest.digest}
		</code>
	</Card>

	<!-- Config -->
	{#if config.config}
		<Card>
			<h3 class="mb-4 text-lg font-medium text-docker-gray-900">Configuration</h3>
			<div class="space-y-4">
				{#if config.config.Entrypoint}
					<div>
						<dt class="text-sm font-medium text-docker-gray-500">Entrypoint</dt>
						<dd class="mt-1">
							<code
								class="rounded bg-docker-gray-100 px-2 py-1 font-mono text-sm text-docker-gray-700"
							>
								{config.config.Entrypoint.join(' ')}
							</code>
						</dd>
					</div>
				{/if}

				{#if config.config.Cmd}
					<div>
						<dt class="text-sm font-medium text-docker-gray-500">Command</dt>
						<dd class="mt-1">
							<code
								class="rounded bg-docker-gray-100 px-2 py-1 font-mono text-sm text-docker-gray-700"
							>
								{config.config.Cmd.join(' ')}
							</code>
						</dd>
					</div>
				{/if}

				{#if config.config.WorkingDir}
					<div>
						<dt class="text-sm font-medium text-docker-gray-500">Working Directory</dt>
						<dd class="mt-1">
							<code
								class="rounded bg-docker-gray-100 px-2 py-1 font-mono text-sm text-docker-gray-700"
							>
								{config.config.WorkingDir}
							</code>
						</dd>
					</div>
				{/if}

				{#if config.config.ExposedPorts}
					<div>
						<dt class="text-sm font-medium text-docker-gray-500">Exposed Ports</dt>
						<dd class="mt-1 flex flex-wrap gap-2">
							{#each Object.keys(config.config.ExposedPorts) as port (port)}
								<Badge variant="info" size="sm">{port}</Badge>
							{/each}
						</dd>
					</div>
				{/if}

				{#if config.config.Env && config.config.Env.length > 0}
					<div>
						<dt class="text-sm font-medium text-docker-gray-500">Environment Variables</dt>
						<dd
							class="mt-2 max-h-48 overflow-y-auto rounded border border-docker-gray-200 bg-docker-gray-50 p-3"
						>
							{#each config.config.Env as env, i (i)}
								<div class="font-mono text-xs text-docker-gray-600">{env}</div>
							{/each}
						</dd>
					</div>
				{/if}

				{#if config.config.Labels && Object.keys(config.config.Labels).length > 0}
					<div>
						<dt class="text-sm font-medium text-docker-gray-500">Labels</dt>
						<dd
							class="mt-2 max-h-48 overflow-y-auto rounded border border-docker-gray-200 bg-docker-gray-50 p-3"
						>
							{#each Object.entries(config.config.Labels) as [key, value] (key)}
								<div class="font-mono text-xs">
									<span class="text-docker-blue-dark">{key}</span>
									<span class="text-docker-gray-400">=</span>
									<span class="text-docker-gray-600">{value}</span>
								</div>
							{/each}
						</dd>
					</div>
				{/if}
			</div>
		</Card>
	{/if}

	<!-- Layers -->
	<div>
		<h3 class="mb-4 text-lg font-medium text-docker-gray-900">
			Layers ({manifest.layers.length})
		</h3>
		<LayerList layers={manifest.layers} />
	</div>
</div>
