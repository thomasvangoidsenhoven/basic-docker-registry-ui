<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		description?: string;
		children: Snippet;
		actions?: Snippet;
	}

	let { title, description, children, actions }: Props = $props();
</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	{#if title || actions}
		<div class="mb-8 flex items-start justify-between">
			<div>
				{#if title}
					<h1 class="text-2xl font-bold text-docker-gray-900">{title}</h1>
				{/if}
				{#if description}
					<p class="mt-1 text-sm text-docker-gray-500">{description}</p>
				{/if}
			</div>
			{#if actions}
				<div class="flex items-center gap-3">
					{@render actions()}
				</div>
			{/if}
		</div>
	{/if}

	{@render children()}
</div>
