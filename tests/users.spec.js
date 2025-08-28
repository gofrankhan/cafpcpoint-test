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
    const userData = createUserData(); //default user type is 'admin'
    await saveUserData(userData); // Save user data to file
    await createUser(page, userData);
});

test.skip('Admin user go to user edit page by searching an user and clicking edit button of the user ', async ({ page }) => {
    test.skip(test.info().project.name !== 'super-admin', 'Only valid for admin');
    await page.goto('/dashboard');
    const userData = createUserData();  //default user type is 'admin'
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

test('Admin user can update user information and validate update done', async ({ page }) => {
    test.skip(test.info().project.name !== 'super-admin', 'Only valid for admin');
    await page.goto('/dashboard');
    const userData = createUserData(); // default user type is 'admin'
    await saveUserData(userData); // Save user data to file
    await createUser(page, userData);
    await expect(page.getByRole('heading', { name: "User's Informations" })).toBeVisible();

    await page.getByRole('button', { name: 'More' }).click();
    await page.locator('.dropdown-item', { hasText: 'Config Users' }).click();
    await page.locator('input[type="search"]').fill(userData.username);
    await page.locator('a[title="Edit"]').click();
    await expect(page.getByPlaceholder('Username')).toHaveValue(userData.username);
    const userDataUpdate = createUserData({ password: userData.password, username: userData.username }); // keep same username and password
    await page.fill('#name', userDataUpdate.name);
    await page.selectOption('select[name="usertype"]', userDataUpdate.user_type);
    await page.fill('#email', userDataUpdate.email);
    await page.fill('#shop_name', userDataUpdate.shop_name);
    await page.getByRole('button', { name: 'Update' }).click();
    // const toast = page.locator('.toast-message'); // Message with actual selector
    // await expect(toast).toHaveText('User data updated successfully');
    await expect(page.getByRole('heading', { name: "User's Informations" })).toBeVisible();
    await page.locator('input[type="search"]').fill(userDataUpdate.username);
    await expect(page.locator('table').nth(0).locator('tr:nth-of-type(1) td:nth-of-type(2)')).toHaveText(userDataUpdate.name);
    await expect(page.locator('table').nth(0).locator('tr:nth-of-type(1) td:nth-of-type(3)')).toHaveText(userDataUpdate.user_type);
    await expect(page.locator('table').nth(0).locator('tr:nth-of-type(1) td:nth-of-type(4)')).toHaveText(userDataUpdate.username);
    await expect(page.locator('table').nth(0).locator('tr:nth-of-type(1) td:nth-of-type(5)')).toHaveText(userDataUpdate.email);
    await expect(page.locator('table').nth(0).locator('tr:nth-of-type(1) td:nth-of-type(6)')).toHaveText(userDataUpdate.shop_name);
    // await logoutUser(page);
});

test.only('Admin user can delete a user', async ({ page }) => {
    test.skip(test.info().project.name !== 'super-admin', 'Only valid for admin');
    await page.goto('/dashboard');
    const userData = createUserData(); // default user type is 'admin'
    await saveUserData(userData); // Save user data to file
    await createUser(page, userData);
    await expect(page.getByRole('heading', { name: "User's Informations" })).toBeVisible();

    await page.getByRole('button', { name: 'More' }).click();
    await page.locator('.dropdown-item', { hasText: 'Config Users' }).click();
    await page.locator('input[type="search"]').fill(userData.username);

    page.on('dialog', async dialog => { await dialog.accept(); });
    await page.locator('a[title="Delete"]').click();
    await expect(page.locator(`text=${userData.username}`)).not.toBeVisible();

    // await logoutUser(page);
});