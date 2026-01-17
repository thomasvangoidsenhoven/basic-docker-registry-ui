<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import type { Repository } from '$lib/types/registry';

	interface Props {
		repository: Repository;
	}

	let { repository }: Props = $props();
</script>

<a href="/{repository.name}" class="block">
	<Card hover={true}>
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-docker-blue/10">
					<svg
						class="h-5 w-5 text-docker-blue"
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
				</div>
				<div>
					<h3 class="font-medium text-docker-gray-900">{repository.name}</h3>
				</div>
			</div>

			<div class="flex items-center gap-2">
				{#if repository.tagCount !== undefined}
					<Badge variant="info" size="sm">
						{repository.tagCount} tag{repository.tagCount !== 1 ? 's' : ''}
					</Badge>
				{/if}
				<svg
					class="h-5 w-5 text-docker-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</div>
		</div>
	</Card>
</a>
