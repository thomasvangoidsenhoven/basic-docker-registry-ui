<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
		size?: 'sm' | 'md';
		children: Snippet;
	}

	let { variant = 'default', size = 'md', children }: Props = $props();

	const baseClasses = 'inline-flex items-center font-medium rounded-full';

	const variantClasses = {
		default: 'bg-docker-gray-100 text-docker-gray-700',
		success: 'bg-green-100 text-green-800',
		warning: 'bg-yellow-100 text-yellow-800',
		error: 'bg-red-100 text-red-800',
		info: 'bg-blue-100 text-docker-blue-dark'
	};

	const sizeClasses = {
		sm: 'px-2 py-0.5 text-xs',
		md: 'px-2.5 py-1 text-sm'
	};
</script>

<span class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]}">
	{@render children()}
</span>
