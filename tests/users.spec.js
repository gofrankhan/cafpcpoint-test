// @ts-check
require('dotenv').config();
import { test, expect } from '@playwright/test';

const { createUser, createUserData } = require('../steps/users_steps.js');
const { saveUserData, getUserData, } = require('../utils/dataStore');

test('open a new user creation page', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'More' }).click();
    await page.locator('.dropdown-item', { hasText: 'Config Users' }).click();
    await page.getByRole('link', { name: 'New' }).click();
});

test('create a new user with admin privilage call methods', async ({ page }) => {
    const userData = createUserData();
    await saveUserData(userData); // Save user data to file
    await createUser(page, userData);
});