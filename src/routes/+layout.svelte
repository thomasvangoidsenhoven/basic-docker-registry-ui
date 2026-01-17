<script lang="ts">
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/layout/Header.svelte';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import { credentials, isLoggedIn, getClient } from '$lib/stores/credentials';

	let { children } = $props();

	let connected = $state(false);
	let initialized = $state(false);

	onMount(() => {
		credentials.init();
		initialized = true;
	});

	$effect(() => {
		if ($credentials) {
			const client = getClient();
			if (client) {
				client.checkConnection().then((result) => {
					connected = result;
				});
			}
		} else {
			connected = false;
		}
	});

	function handleLogout() {
		credentials.clear();
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Docker Registry UI</title>
</svelte:head>

<div class="min-h-screen bg-docker-gray-50">
	{#if !initialized}
		<div class="flex h-screen items-center justify-center">
			<div class="text-docker-gray-500">Loading...</div>
		</div>
	{:else if !$isLoggedIn}
		<Header />
		<LoginForm />
	{:else}
		<Header registryUrl={$credentials?.url} {connected} onlogout={handleLogout} />
		{@render children()}
	{/if}
</div>
