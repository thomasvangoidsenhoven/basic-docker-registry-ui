<script lang="ts">
	import DockerIcon from '$lib/components/icons/DockerIcon.svelte';

	interface Props {
		registryUrl?: string;
		connected?: boolean;
		onlogout?: () => void;
	}

	let { registryUrl = '', connected = false, onlogout }: Props = $props();
</script>

<header class="bg-docker-navy shadow-lg">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<div class="flex items-center gap-4">
				<a href="/" class="flex items-center gap-3">
					<DockerIcon class="h-8 w-8 text-docker-blue" />
					<span class="text-xl font-semibold text-white">Docker Registry</span>
				</a>
			</div>

			<div class="flex items-center gap-4">
				{#if registryUrl}
					<div class="flex items-center gap-2 text-sm">
						<span class="text-docker-gray-400">{registryUrl}</span>
						<span
							class="flex h-2 w-2 rounded-full {connected
								? 'bg-status-success'
								: 'bg-status-error'}"
							title={connected ? 'Connected' : 'Disconnected'}
						></span>
					</div>
					{#if onlogout}
						<button
							onclick={onlogout}
							class="rounded px-3 py-1 text-sm text-docker-gray-400 hover:bg-docker-gray-700 hover:text-white"
						>
							Logout
						</button>
					{/if}
				{/if}
			</div>
		</div>
	</div>
</header>
