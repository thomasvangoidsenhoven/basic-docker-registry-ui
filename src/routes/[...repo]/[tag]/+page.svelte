<script lang="ts">
	import { goto } from '$app/navigation';
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	import ImageDetails from '$lib/components/registry/ImageDetails.svelte';
	import DeleteConfirmModal from '$lib/components/registry/DeleteConfirmModal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	let { data } = $props();

	let deleteModalOpen = $state(false);
	let deleteLoading = $state(false);

	async function handleDeleteConfirm() {
		deleteLoading = true;
		try {
			const response = await fetch(`/api/${data.repository}/manifests/${data.tag}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const result = await response.json();
				throw new Error(result.error || 'Failed to delete image');
			}

			deleteModalOpen = false;
			await goto(`/${data.repository}`);
		} catch (e) {
			alert(e instanceof Error ? e.message : 'Failed to delete image');
		} finally {
			deleteLoading = false;
		}
	}
</script>

<svelte:head>
	<title>{data.repository}:{data.tag} - Docker Registry UI</title>
</svelte:head>

<PageContainer>
	{#snippet actions()}
		<a
			href="/{data.repository}"
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
			Back to {data.repository}
		</a>
	{/snippet}

	<div class="mb-8 flex items-start justify-between">
		<div>
			<div class="flex items-center gap-3">
				<h1 class="text-2xl font-bold text-docker-gray-900">{data.repository}</h1>
				<Badge variant="info">{data.tag}</Badge>
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

	<ImageDetails manifest={data.manifest} config={data.config} />
</PageContainer>

<DeleteConfirmModal
	open={deleteModalOpen}
	itemType="image"
	itemName="{data.repository}:{data.tag}"
	loading={deleteLoading}
	onconfirm={handleDeleteConfirm}
	oncancel={() => (deleteModalOpen = false)}
/>
