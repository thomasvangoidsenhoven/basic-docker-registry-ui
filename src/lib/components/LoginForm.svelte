<script lang="ts">
	import { credentials } from '$lib/stores/credentials';
	import { RegistryClient } from '$lib/registry-client';

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
				<svg class="mx-auto h-12 w-12 text-docker-blue" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.185.185v1.888c0 .102.084.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z"
					/>
				</svg>
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
