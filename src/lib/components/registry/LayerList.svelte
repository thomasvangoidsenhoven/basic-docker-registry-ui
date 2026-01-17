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
				<th class="header-cell">#</th>
				<th class="header-cell">Digest</th>
				<th class="header-cell">Media Type</th>
				<th class="header-cell-right">Size</th>
			</tr>
		</thead>
		<tbody>
			{#each layers as layer, index (layer.digest)}
				<tr class="border-b border-docker-gray-100 hover:bg-docker-gray-50">
					<td class="cell text-docker-gray-500">{index + 1}</td>
					<td class="cell">
						<code
							class="rounded bg-docker-gray-100 px-2 py-1 font-mono text-xs text-docker-gray-600"
						>
							{truncateDigest(layer.digest)}
						</code>
					</td>
					<td class="cell text-sm text-docker-gray-600">
						{layer.mediaType.split('.').pop()}
					</td>
					<td class="cell text-right text-docker-gray-600">
						{formatBytes(layer.size)}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	@reference "$lib/styles.css";

	.header-cell {
		@apply px-4 py-3 text-left text-sm font-medium text-docker-gray-600;
	}
	.header-cell-right {
		@apply px-4 py-3 text-right text-sm font-medium text-docker-gray-600;
	}
	.cell {
		@apply px-4 py-3;
	}
</style>
