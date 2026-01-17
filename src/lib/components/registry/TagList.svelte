<script lang="ts">
	import TagRow from './TagRow.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import type { Tag } from '$lib/types/registry';

	interface Props {
		tags: Tag[];
		repository: string;
		ondelete?: (tag: Tag) => void;
	}

	let { tags, repository, ondelete }: Props = $props();
</script>

{#if tags.length === 0}
	<EmptyState
		title="No tags"
		description="This repository has no tags. Push an image to create one."
		icon="tag"
	/>
{:else}
	<div class="overflow-x-auto rounded-lg border border-docker-gray-200 bg-white">
		<table class="w-full">
			<thead>
				<tr class="border-b border-docker-gray-200 bg-docker-gray-50">
					<th class="header-cell">Tag</th>
					<th class="header-cell">Digest</th>
					<th class="header-cell">Size</th>
					<th class="header-cell">Created</th>
					<th class="header-cell-right">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each tags as tag (tag.name)}
					<TagRow {tag} {repository} {ondelete} />
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<style>
	@reference "$lib/styles.css";

	.header-cell {
		@apply px-4 py-3 text-left text-sm font-medium text-docker-gray-600;
	}
	.header-cell-right {
		@apply px-4 py-3 text-right text-sm font-medium text-docker-gray-600;
	}
</style>
