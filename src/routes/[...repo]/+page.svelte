<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	import TagList from '$lib/components/registry/TagList.svelte';
	import DeleteConfirmModal from '$lib/components/registry/DeleteConfirmModal.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import ArrowLeftIcon from '$lib/components/icons/ArrowLeftIcon.svelte';
	import { getClient } from '$lib/stores/credentials';
	import type { Tag } from '$lib/types/registry';

	let repository = $derived(page.params.repo);

	let tags = $state<Tag[]>([]);
	let error = $state<string | null>(null);
	let loading = $state(true);

	let deleteModalOpen = $state(false);
	let tagToDelete = $state<Tag | null>(null);
	let deleteLoading = $state(false);

	onMount(() => {
		loadTags();
	});

	$effect(() => {
		if (repository) {
			loading = true;
			loadTags();
		}
	});

	async function loadTags() {
		const client = getClient();
		if (!client) {
			error = 'Not connected to registry';
			loading = false;
			return;
		}

		if (!repository) {
			error = 'Repository name is required';
			loading = false;
			return;
		}

		try {
			const tagNames = await client.listTags(repository);

			tags = await Promise.all(
				tagNames.map(async (name) => {
					try {
						const manifest = await client.getManifest(repository, name);
						const config = await client.getImageConfig(repository, manifest.config.digest);

						return {
							name,
							digest: manifest.digest,
							size: manifest.totalSize,
							createdAt: config.created
						};
					} catch {
						return {
							name,
							digest: '',
							size: undefined,
							createdAt: undefined
						};
					}
				})
			);

			// Sort tags: 'latest' first, then alphabetically
			tags.sort((a, b) => {
				if (a.name === 'latest') return -1;
				if (b.name === 'latest') return 1;
				return a.name.localeCompare(b.name);
			});
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to fetch tags';
		} finally {
			loading = false;
		}
	}

	function handleDeleteClick(tag: Tag) {
		tagToDelete = tag;
		deleteModalOpen = true;
	}

	async function handleDeleteConfirm() {
		if (!tagToDelete || !repository) return;

		const client = getClient();
		if (!client) return;

		deleteLoading = true;
		try {
			// Get the digest for the tag first
			const digest = await client.getTagDigest(repository, tagToDelete.name);
			await client.deleteManifest(repository, digest);

			deleteModalOpen = false;
			tagToDelete = null;
			await loadTags();
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
	<title>{repository} - Docker Registry UI</title>
</svelte:head>

<PageContainer title={repository} description="View and manage image tags">
	{#snippet actions()}
		<a
			href="/"
			class="flex items-center gap-2 text-sm text-docker-gray-600 hover:text-docker-gray-900"
		>
			<ArrowLeftIcon class="h-4 w-4" />
			Back to repositories
		</a>
	{/snippet}

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="text-docker-gray-500">Loading tags...</div>
		</div>
	{:else if error}
		<EmptyState title="Error" description={error} icon="error" />
	{:else if repository}
		<TagList {tags} {repository} ondelete={handleDeleteClick} />
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
