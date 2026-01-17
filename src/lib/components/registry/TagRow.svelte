<script lang="ts">
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
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
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
					/>
				</svg>
			</a>
			{#if ondelete}
				<Button variant="ghost" size="sm" onclick={() => ondelete(tag)}>
					<svg
						class="h-4 w-4 text-status-error"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
						/>
					</svg>
				</Button>
			{/if}
		</div>
	</td>
</tr>
