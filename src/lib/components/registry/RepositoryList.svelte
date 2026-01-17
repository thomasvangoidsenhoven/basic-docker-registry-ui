<script lang="ts">
	import RepositoryCard from './RepositoryCard.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import type { Repository } from '$lib/types/registry';

	interface Props {
		repositories: Repository[];
		searchQuery?: string;
	}

	let { repositories, searchQuery = '' }: Props = $props();

	let filteredRepositories = $derived(
		searchQuery
			? repositories.filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
			: repositories
	);
</script>

{#if filteredRepositories.length === 0}
	{#if searchQuery}
		<EmptyState
			title="No matching repositories"
			description="No repositories match your search query."
			icon="repository"
		/>
	{:else}
		<EmptyState
			title="No repositories"
			description="Push an image to your registry to get started."
			icon="repository"
		/>
	{/if}
{:else}
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each filteredRepositories as repository (repository.name)}
			<RepositoryCard {repository} />
		{/each}
	</div>
{/if}
