<script lang="ts">
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	import RepositoryList from '$lib/components/registry/RepositoryList.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';

	let { data } = $props();

	let searchQuery = $state('');
</script>

<svelte:head>
	<title>Repositories - Docker Registry UI</title>
</svelte:head>

<PageContainer title="Repositories" description="Browse and manage Docker images in your registry">
	{#snippet actions()}
		<div class="relative">
			<svg
				class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-docker-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
			<input
				type="text"
				placeholder="Search repositories..."
				class="w-64 rounded-lg border border-docker-gray-300 py-2 pr-4 pl-10 text-sm focus:border-docker-blue focus:ring-1 focus:ring-docker-blue focus:outline-none"
				bind:value={searchQuery}
			/>
		</div>
	{/snippet}

	{#if data.error}
		<EmptyState title="Connection Error" description={data.error} icon="error" />
	{:else}
		<RepositoryList repositories={data.repositories} {searchQuery} />
	{/if}
</PageContainer>
