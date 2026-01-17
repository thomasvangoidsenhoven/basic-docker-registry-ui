<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	import ImageDetails from '$lib/components/registry/ImageDetails.svelte';
	import DeleteConfirmModal from '$lib/components/registry/DeleteConfirmModal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { getClient } from '$lib/stores/credentials';
	import type { Manifest, ImageConfig } from '$lib/types/registry';

	let repository = $derived($page.params.repo);
	let tag = $derived($page.params.tag);

	let manifest = $state<Manifest | null>(null);
	let config = $state<ImageConfig | null>(null);
	let error = $state<string | null>(null);
	let loading = $state(true);

	let deleteModalOpen = $state(false);
	let deleteLoading = $state(false);

	onMount(() => {
		loadImageDetails();
	});

	$effect(() => {
		if (repository && tag) {
			loading = true;
			loadImageDetails();
		}
	});

	async function loadImageDetails() {
		const client = getClient();
		if (!client) {
			error = 'Not connected to registry';
			loading = false;
			return;
		}

		if (!repository || !tag) {
			error = 'Repository and tag are required';
			loading = false;
			return;
		}

		try {
			manifest = await client.getManifest(repository, tag);
			config = await client.getImageConfig(repository, manifest.config.digest);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to fetch image details';
		} finally {
			loading = false;
		}
	}

	async function handleDeleteConfirm() {
		const client = getClient();
		if (!client || !manifest || !repository) return;

		deleteLoading = true;
		try {
			await client.deleteManifest(repository, manifest.digest);
			deleteModalOpen = false;
			await goto(`/${repository}`);
		} catch (e) {
			alert(e instanceof Error ? e.message : 'Failed to delete image');
		} finally {
			deleteLoading = false;
		}
	}
</script>

<svelte:head>
	<title>{repository}:{tag} - Docker Registry UI</title>
</svelte:head>

<PageContainer>
	{#snippet actions()}
		<a
			href="/{repository}"
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
			Back to {repository}
		</a>
	{/snippet}

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="text-docker-gray-500">Loading image details...</div>
		</div>
	{:else if error}
		<EmptyState title="Error" description={error} icon="error" />
	{:else if manifest && config}
		<div class="mb-8 flex items-start justify-between">
			<div>
				<div class="flex items-center gap-3">
					<h1 class="text-2xl font-bold text-docker-gray-900">{repository}</h1>
					<Badge variant="info">{tag}</Badge>
				</div>
				<p class="mt-1 text-sm text-docker-gray-500">Image details and configuration</p>
			</div>

			<Button variant="danger" onclick={() => (deleteModalOpen = true)}>
				<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
					/>
				</svg>
				Delete Image
			</Button>
		</div>

		<ImageDetails {manifest} {config} />
	{/if}
</PageContainer>

<DeleteConfirmModal
	open={deleteModalOpen}
	itemType="image"
	itemName="{repository}:{tag}"
	loading={deleteLoading}
	onconfirm={handleDeleteConfirm}
	oncancel={() => (deleteModalOpen = false)}
/>
