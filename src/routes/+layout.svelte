<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/layout/Header.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Docker Registry UI</title>
</svelte:head>

<div class="min-h-screen bg-docker-gray-50">
	<Header registryUrl={data.registryUrl} connected={data.connected} />
	{@render children()}
</div>
