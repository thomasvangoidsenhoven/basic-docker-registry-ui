<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import RepositoryIcon from '$lib/components/icons/RepositoryIcon.svelte';
	import ChevronRightIcon from '$lib/components/icons/ChevronRightIcon.svelte';
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
					<RepositoryIcon class="h-5 w-5 text-docker-blue" />
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
				<ChevronRightIcon class="h-5 w-5 text-docker-gray-400" />
			</div>
		</div>
	</Card>
</a>
