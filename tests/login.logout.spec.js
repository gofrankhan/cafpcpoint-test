// @ts-check
require('dotenv').config();
import { test, expect } from '@playwright/test';
const { userLogin, logoutbyUserFullName, logoutUser } = require('../steps/login_logout_steps.js');
const { createUser, createUserData } = require('../steps/users_steps.js');
const { saveUserData, getUserData, } = require('../utils/dataStore');

test('Login to the CAF PC POINT portal with new user', async ({ page }) => {
    test.skip(test.info().project.name !== 'admin', 'Only valid for admin');
    await page.goto('/dashboard');
    const userData = createUserData('admin');
    await saveUserData(userData); // Save user data to file
    await createUser(page, userData);
    await userLogin(page, userData.username, userData.password);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    // await logoutUser(page);
});

test.skip('User can logout successfully', async ({ page }) => {
    await logoutbyUserFullName(page, "Md. Gofran Khan");
    await expect(page.getByRole('button', { name: 'Log In' })).toBeVisible();
});