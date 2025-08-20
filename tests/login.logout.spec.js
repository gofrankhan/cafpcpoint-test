// @ts-check
require('dotenv').config();
import { test, expect } from '@playwright/test';
const { userLogin, logoutbyUserFullName } = require('../steps/login_logout_steps.js');
const { createUser, createUserData } = require('../steps/users_steps.js');
const { saveUserData, getUserData, } = require('../utils/dataStore');

test('Login to the CAF PC POINT portal with new user', async ({ page }) => {
    await page.goto('/dashboard');
    const userData = createUserData();
    await saveUserData(userData); // Save user data to file
    await createUser(page, userData);
    await userLogin(page, userData.username, userData.password);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test.only('User can logout successfully', async ({ page }) => {
    await logoutbyUserFullName(page, "Md. Gofran Khan");
    await expect(page.getByRole('button', { name: 'Log In' })).toBeVisible();
});