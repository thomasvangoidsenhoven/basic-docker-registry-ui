<script lang="ts">
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EyeIcon from '$lib/components/icons/EyeIcon.svelte';
	import TrashIcon from '$lib/components/icons/TrashIcon.svelte';
	import { formatBytes, formatRelativeTime, truncateDigest } from '$lib/utils/format';
	import type { Tag } from '$lib/types/registry';

	interface Props {
		tag: Tag;
		repository: string;
		ondelete?: (tag: Tag) => void;
	}

	let { tag, repository, ondelete }: Props = $props();

	let isLatest = $derived(tag.name === 'latest');
</script>

<tr class="border-b border-docker-gray-100 hover:bg-docker-gray-50">
	<td class="px-4 py-3">
		<a href="/{repository}/{tag.name}" class="flex items-center gap-2 hover:text-docker-blue">
			<span class="font-medium text-docker-gray-900">{tag.name}</span>
			{#if isLatest}
				<Badge variant="success" size="sm">latest</Badge>
			{/if}
		</a>
	</td>
	<td class="px-4 py-3">
		{#if tag.digest}
			<code class="rounded bg-docker-gray-100 px-2 py-1 font-mono text-xs text-docker-gray-600">
				{truncateDigest(tag.digest)}
			</code>
		{:else}
			<span class="text-docker-gray-400">-</span>
		{/if}
	</td>
	<td class="px-4 py-3 text-docker-gray-600">
		{#if tag.size !== undefined}
			{formatBytes(tag.size)}
		{:else}
			<span class="text-docker-gray-400">-</span>
		{/if}
	</td>
	<td class="px-4 py-3 text-docker-gray-600">
		{#if tag.createdAt}
			<span title={tag.createdAt}>{formatRelativeTime(tag.createdAt)}</span>
		{:else}
			<span class="text-docker-gray-400">-</span>
		{/if}
	</td>
	<td class="px-4 py-3 text-right">
		<div class="flex items-center justify-end gap-2">
			<a
				href="/{repository}/{tag.name}"
				class="rounded p-1 text-docker-gray-400 hover:bg-docker-gray-100 hover:text-docker-gray-600"
				title="View details"
			>
				<EyeIcon class="h-4 w-4" />
			</a>
			{#if ondelete}
				<Button variant="ghost" size="sm" onclick={() => ondelete(tag)}>
					<TrashIcon class="h-4 w-4 text-status-error" />
				</Button>
			{/if}
		</div>
	</td>
</tr>
