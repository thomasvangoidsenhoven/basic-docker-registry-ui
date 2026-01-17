<script lang="ts">
	import { formatBytes, truncateDigest } from '$lib/utils/format';
	import type { ManifestLayer } from '$lib/types/registry';

	interface Props {
		layers: ManifestLayer[];
	}

	let { layers }: Props = $props();
</script>

<div class="overflow-x-auto rounded-lg border border-docker-gray-200 bg-white">
	<table class="w-full">
		<thead>
			<tr class="border-b border-docker-gray-200 bg-docker-gray-50">
				<th class="px-4 py-3 text-left text-sm font-medium text-docker-gray-600">#</th>
				<th class="px-4 py-3 text-left text-sm font-medium text-docker-gray-600">Digest</th>
				<th class="px-4 py-3 text-left text-sm font-medium text-docker-gray-600">Media Type</th>
				<th class="px-4 py-3 text-right text-sm font-medium text-docker-gray-600">Size</th>
			</tr>
		</thead>
		<tbody>
			{#each layers as layer, index (layer.digest)}
				<tr class="border-b border-docker-gray-100 hover:bg-docker-gray-50">
					<td class="px-4 py-3 text-docker-gray-500">{index + 1}</td>
					<td class="px-4 py-3">
						<code
							class="rounded bg-docker-gray-100 px-2 py-1 font-mono text-xs text-docker-gray-600"
						>
							{truncateDigest(layer.digest)}
						</code>
					</td>
					<td class="px-4 py-3 text-sm text-docker-gray-600">
						{layer.mediaType.split('.').pop()}
					</td>
					<td class="px-4 py-3 text-right text-docker-gray-600">
						{formatBytes(layer.size)}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
