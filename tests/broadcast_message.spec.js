// @ts-check
require('dotenv').config();
import { test, expect } from '@playwright/test';

test('Create a broadcast message', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'More' }).click();
    await page.locator('.dropdown-item', { hasText: 'Settings' }).click();
    await page.getByPlaceholder('Message').fill('Broadcast Message Test');
    await page.locator('input[value="Save"]').first().click();
    await expect(page.locator('#message_card')).toHaveText('Broadcast Message Test');
})