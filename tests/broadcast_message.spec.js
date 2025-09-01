// @ts-check
require('dotenv').config();
import { test, expect } from '@playwright/test';
import { logoutUser, userLogin } from '../steps/login_logout_steps.js';

test.skip('Create a broadcast message', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'More' }).click();
    await page.locator('.dropdown-item', { hasText: 'Settings' }).click();
    await page.getByPlaceholder('Message').fill('Broadcast Message Test');
    await page.locator('input[value="Save"]').first().click();
    await expect(page.locator('#message_card')).toHaveText('Broadcast Message Test');
})

test.skip('Delete a broadcast message', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'More' }).click();
    await page.locator('.dropdown-item', { hasText: 'Settings' }).click();
    await page.getByPlaceholder('Message').fill('Broadcast Message Test');
    await page.locator('input[value="Save"]').first().click();
    await expect(page.locator('#message_card')).toHaveText('Broadcast Message Test');
    await page.locator('a[title="Delete"]').click();
    await expect(page.locator('#message_card')).not.toBeVisible();
})

test('Check a braodcast message is visible for a user after login', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'More' }).click();
    await page.locator('.dropdown-item', { hasText: 'Settings' }).click();
    await page.getByPlaceholder('Message').fill('Broadcast Message Test');
    await page.locator('input[value="Save"]').first().click();
    await expect(page.locator('#message_card')).toHaveText('Broadcast Message Test');
    await logoutUser(page);
    await userLogin(page, process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
    await expect(page.locator('.modal-body p')).toHaveText('Broadcast Message Test');
})