<script lang="ts">
	import type { Snippet } from 'svelte';
	import RepositoryIcon from '$lib/components/icons/RepositoryIcon.svelte';
	import TagIcon from '$lib/components/icons/TagIcon.svelte';
	import WarningIcon from '$lib/components/icons/WarningIcon.svelte';

	interface Props {
		title: string;
		description?: string;
		icon?: 'repository' | 'tag' | 'error';
		children?: Snippet;
	}

	let { title, description, icon = 'repository', children }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center py-12 text-center">
	<div class="mb-4 rounded-full bg-docker-gray-100 p-4">
		{#if icon === 'repository'}
			<RepositoryIcon class="h-8 w-8 text-docker-gray-400" />
		{:else if icon === 'tag'}
			<TagIcon class="h-8 w-8 text-docker-gray-400" />
		{:else if icon === 'error'}
			<WarningIcon class="h-8 w-8 text-status-error" />
		{/if}
	</div>

	<h3 class="text-lg font-medium text-docker-gray-900">{title}</h3>

	{#if description}
		<p class="mt-1 text-sm text-docker-gray-500">{description}</p>
	{/if}

	{#if children}
		<div class="mt-4">
			{@render children()}
		</div>
	{/if}
</div>
