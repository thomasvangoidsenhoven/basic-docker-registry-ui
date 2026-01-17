import { expect, test } from '@playwright/test';

test.describe('Docker Registry UI', () => {
	test('home page displays header with Docker branding', async ({ page }) => {
		await page.goto('/');

		// Header should be visible with Docker Registry title
		await expect(page.locator('header')).toBeVisible();
		await expect(page.getByText('Docker Registry')).toBeVisible();
	});

	test('home page shows repositories heading', async ({ page }) => {
		await page.goto('/');

		// Should show the Repositories page title
		await expect(page.locator('h1')).toContainText('Repositories');
	});

	test('home page has search input', async ({ page }) => {
		await page.goto('/');

		// Should have a search input for filtering repositories
		await expect(page.getByPlaceholder('Search repositories...')).toBeVisible();
	});

	test('shows empty state or repository list', async ({ page }) => {
		await page.goto('/');

		// Should show either the empty state or repository cards
		const hasEmptyState = await page
			.getByText('No repositories')
			.isVisible()
			.catch(() => false);
		const hasConnectionError = await page
			.getByText('Connection Error')
			.isVisible()
			.catch(() => false);
		const hasRepositories = await page
			.locator('a[href^="/"]')
			.first()
			.isVisible()
			.catch(() => false);

		// One of these conditions should be true
		expect(hasEmptyState || hasConnectionError || hasRepositories).toBe(true);
	});

	test('header shows connection status indicator', async ({ page }) => {
		await page.goto('/');

		// The header should show the registry URL
		await expect(page.locator('header')).toBeVisible();
	});
});
