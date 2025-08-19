// @ts-check
require('dotenv').config();
import { test, expect } from '@playwright/test';

const { createUser, createUserData } = require('../utils/users_steps.js');

test('create a new user with admin privilage', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'More' }).click();
    await page.locator('.dropdown-item', { hasText: 'Config Users' }).click();
    await page.getByRole('link', { name: 'New' }).click();
    await page.waitForTimeout(3000);
});

test.only('create a new user with admin privilage call methods', async ({ page }) => {
    await createUser(page, createUserData());
});