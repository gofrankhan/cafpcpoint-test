// @ts-check
require('dotenv').config();
import { test, expect } from '@playwright/test';

const { createUser, createUserData } = require('../steps/users_steps.js');
const { saveUserData, getUserData, } = require('../utils/dataStore');

test.skip('open a new user creation page', async ({ page }) => {
    test.skip(test.info().project.name !== 'admin', 'Only valid for admin');
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'More' }).click();
    await page.locator('.dropdown-item', { hasText: 'Config Users' }).click();
    await page.getByRole('link', { name: 'New' }).click();
});

test.skip('create a new user with admin privilage call methods', async ({ page }) => {
    const userData = createUserData('admin');
    await saveUserData(userData); // Save user data to file
    await createUser(page, userData);
});

test('Admin user can edit user information', async ({ page }) => {
    test.skip(test.info().project.name !== 'super-admin', 'Only valid for admin');
    await page.goto('/dashboard');
    const userData = createUserData('admin');
    await saveUserData(userData); // Save user data to file
    await createUser(page, userData);
    await expect(page.getByRole('heading', { name: "User's Informations" })).toBeVisible();

    await page.getByRole('button', { name: 'More' }).click();
    await page.locator('.dropdown-item', { hasText: 'Config Users' }).click();
    await page.locator('input[type="search"]').fill(userData.username);
    await page.locator('a[title="Edit"]').click();
    await expect(page.getByPlaceholder('Username')).toHaveValue(userData.username);
    await expect(page.getByRole('heading', { name: `Update Client Information` })).toBeVisible();
    await expect(page.locator('input[value="Update"]')).toHaveText('Update');

    // await logoutUser(page);
});