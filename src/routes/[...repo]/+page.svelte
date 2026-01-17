<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	import TagList from '$lib/components/registry/TagList.svelte';
	import DeleteConfirmModal from '$lib/components/registry/DeleteConfirmModal.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import type { Tag } from '$lib/types/registry';

	let { data } = $props();

	let deleteModalOpen = $state(false);
	let tagToDelete = $state<Tag | null>(null);
	let deleteLoading = $state(false);

	function handleDeleteClick(tag: Tag) {
		tagToDelete = tag;
		deleteModalOpen = true;
	}

	async function handleDeleteConfirm() {
		if (!tagToDelete) return;

		deleteLoading = true;
		try {
			const response = await fetch(`/api/${data.repository}/manifests/${tagToDelete.name}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const result = await response.json();
				throw new Error(result.error || 'Failed to delete tag');
			}

			deleteModalOpen = false;
			tagToDelete = null;
			await invalidateAll();
		} catch (e) {
			alert(e instanceof Error ? e.message : 'Failed to delete tag');
		} finally {
			deleteLoading = false;
		}
	}

	function handleDeleteCancel() {
		deleteModalOpen = false;
		tagToDelete = null;
	}
</script>

<svelte:head>
	<title>{data.repository} - Docker Registry UI</title>
</svelte:head>

<PageContainer title={data.repository} description="View and manage image tags">
	{#snippet actions()}
		<a
			href="/"
			class="flex items-center gap-2 text-sm text-docker-gray-600 hover:text-docker-gray-900"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				/>
			</svg>
			Back to repositories
		</a>
	{/snippet}

	{#if data.error}
		<EmptyState title="Error" description={data.error} icon="error" />
	{:else}
		<TagList tags={data.tags} repository={data.repository} ondelete={handleDeleteClick} />
	{/if}
</PageContainer>

<DeleteConfirmModal
	open={deleteModalOpen}
	itemType="tag"
	itemName={tagToDelete?.name || ''}
	loading={deleteLoading}
	onconfirm={handleDeleteConfirm}
	oncancel={handleDeleteCancel}
/>
