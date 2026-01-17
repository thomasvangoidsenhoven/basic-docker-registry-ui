<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		hover?: boolean;
		padding?: 'none' | 'sm' | 'md' | 'lg';
		children: Snippet;
	}

	let { hover = false, padding = 'md', children }: Props = $props();

	const baseClasses = 'bg-white rounded-lg border border-docker-gray-200 shadow-sm';

	const paddingClasses: Record<string, string> = {
		none: '',
		sm: 'p-3',
		md: 'p-4',
		lg: 'p-6'
	};

	let hoverClasses = $derived(
		hover ? 'transition-shadow hover:shadow-md hover:border-docker-gray-300 cursor-pointer' : ''
	);

	let paddingClass = $derived(paddingClasses[padding] || '');
</script>

<div class="{baseClasses} {hoverClasses} {paddingClass}">
	{@render children()}
</div>
