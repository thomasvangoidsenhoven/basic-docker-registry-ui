<script lang="ts">
	import { credentials } from '$lib/stores/credentials';
	import { RegistryClient } from '$lib/registry-client';
	import DockerIcon from '$lib/components/icons/DockerIcon.svelte';

	let url = $state('http://localhost:5050');
	let username = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		loading = true;

		try {
			const client = new RegistryClient({ url, username, password });
			const connected = await client.checkConnection();

			if (!connected) {
				error = 'Failed to connect. Check your URL and credentials.';
				return;
			}

			credentials.set({ url, username, password });
		} catch (err) {
			error = err instanceof Error ? err.message : 'Connection failed';
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
	<div class="w-full max-w-md">
		<div class="rounded-xl bg-white p-8 shadow-lg">
			<div class="mb-6 text-center">
				<DockerIcon class="mx-auto h-12 w-12 text-docker-blue" />
				<h2 class="mt-4 text-xl font-semibold text-docker-gray-900">Connect to Registry</h2>
				<p class="mt-1 text-sm text-docker-gray-500">Enter your Docker Registry credentials</p>
			</div>

			{#if error}
				<div class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
					{error}
				</div>
			{/if}

			<form onsubmit={handleSubmit} class="space-y-4">
				<div>
					<label for="url" class="block text-sm font-medium text-docker-gray-700">
						Registry URL
					</label>
					<input
						type="url"
						id="url"
						bind:value={url}
						required
						placeholder="http://localhost:5050"
						class="mt-1 block w-full rounded-lg border border-docker-gray-300 px-3 py-2 text-sm focus:border-docker-blue focus:ring-1 focus:ring-docker-blue focus:outline-none"
					/>
				</div>

				<div>
					<label for="username" class="block text-sm font-medium text-docker-gray-700">
						Username
					</label>
					<input
						type="text"
						id="username"
						bind:value={username}
						required
						class="mt-1 block w-full rounded-lg border border-docker-gray-300 px-3 py-2 text-sm focus:border-docker-blue focus:ring-1 focus:ring-docker-blue focus:outline-none"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-docker-gray-700">
						Password
					</label>
					<input
						type="password"
						id="password"
						bind:value={password}
						required
						class="mt-1 block w-full rounded-lg border border-docker-gray-300 px-3 py-2 text-sm focus:border-docker-blue focus:ring-1 focus:ring-docker-blue focus:outline-none"
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-lg bg-docker-blue px-4 py-2 text-sm font-medium text-white hover:bg-docker-blue-dark focus:ring-2 focus:ring-docker-blue focus:ring-offset-2 focus:outline-none disabled:opacity-50"
				>
					{#if loading}
						Connecting...
					{:else}
						Connect
					{/if}
				</button>
			</form>
		</div>
	</div>
</div>
