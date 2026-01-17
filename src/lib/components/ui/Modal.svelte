<script lang="ts">
	import type { Snippet } from 'svelte';
	import CloseIcon from '$lib/components/icons/CloseIcon.svelte';

	interface Props {
		open: boolean;
		title: string;
		onclose: () => void;
		children: Snippet;
		footer?: Snippet;
	}

	let { open, title, onclose, children, footer }: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onclose();
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onclose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
		onclick={handleBackdropClick}
		onkeydown={(e) => e.key === 'Enter' && handleBackdropClick(e as unknown as MouseEvent)}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			class="mx-4 w-full max-w-md rounded-lg bg-white shadow-xl"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="document"
		>
			<div class="flex items-center justify-between border-b border-docker-gray-200 px-6 py-4">
				<h2 id="modal-title" class="text-lg font-semibold text-docker-gray-900">{title}</h2>
				<button
					type="button"
					class="rounded-lg p-1 text-docker-gray-400 hover:bg-docker-gray-100 hover:text-docker-gray-600"
					onclick={onclose}
					aria-label="Close"
				>
					<CloseIcon class="h-5 w-5" />
				</button>
			</div>

			<div class="px-6 py-4">
				{@render children()}
			</div>

			{#if footer}
				<div
					class="flex justify-end gap-3 border-t border-docker-gray-200 bg-docker-gray-50 px-6 py-4"
				>
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
