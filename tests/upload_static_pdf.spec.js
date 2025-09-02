// @ts-check
require('dotenv').config();
import { test, expect } from '@playwright/test';
import { logoutUser, userLogin } from '../steps/login_logout_steps.js';

test('Goto Static pdf upload page', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'More' }).click();
    await page.locator('.dropdown-item', { hasText: 'Static PDF File' }).click();
    await expect(page.getByRole('heading', { name: "Static PDF Files Informations" })).toBeVisible();
})