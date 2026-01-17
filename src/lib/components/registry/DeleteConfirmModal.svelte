<script lang="ts">
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		open: boolean;
		itemType: 'tag' | 'image';
		itemName: string;
		loading?: boolean;
		onconfirm: () => void;
		oncancel: () => void;
	}

	let { open, itemType, itemName, loading = false, onconfirm, oncancel }: Props = $props();
</script>

<Modal {open} title="Delete {itemType}" onclose={oncancel}>
	<p class="text-docker-gray-600">
		Are you sure you want to delete the {itemType}
		<strong class="text-docker-gray-900">{itemName}</strong>?
	</p>
	<p class="mt-2 text-sm text-docker-gray-500">
		This action cannot be undone. The {itemType} will be permanently removed from the registry.
	</p>

	{#snippet footer()}
		<Button variant="secondary" onclick={oncancel} disabled={loading}>Cancel</Button>
		<Button variant="danger" onclick={onconfirm} {loading}>Delete</Button>
	{/snippet}
</Modal>
