<script lang="ts">
	import type { Snippet } from 'svelte';

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
			<svg
				class="h-8 w-8 text-docker-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
				/>
			</svg>
		{:else if icon === 'tag'}
			<svg
				class="h-8 w-8 text-docker-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
				/>
			</svg>
		{:else if icon === 'error'}
			<svg class="h-8 w-8 text-status-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/>
			</svg>
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
