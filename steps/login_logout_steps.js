const { faker } = require('@faker-js/faker');
const { test, expect } = require('@playwright/test');

const username = process.env.TEST_USERNAME;
const password = process.env.TEST_PASSWORD;
const fullName = process.env.TEST_FULL_NAME;
const base_url = process.env.TEST_URL;

exports.userLogin = (page, username, password) => {

    if (!base_url || !username || !password) {
        throw new Error('Missing BaseURL or USERNAME or PASSWORD in environment variables');
    }
    return page.goto(base_url)
        .then(() => page.getByPlaceholder('Username').fill(username))
        .then(() => page.getByPlaceholder('Password').fill(password))
        .then(() => page.getByRole('button', { name: 'Log in' }).click())
        .then(() => expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible());
};


exports.logoutbyUserFullName = async (page, fullName) => {

    if (!fullName) {
        throw new Error('TEST_FULL_NAME is not set in the environment variables');
    }

    await page.goto('/dashboard');
    await page.getByRole('button', { name: fullName }).click();
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByRole('button', { name: 'Log In' })).toBeVisible();
}

exports.logoutUser = async (page) => {
    await page.goto('/admin/logout/');
    await expect(page.getByRole('button', { name: 'Log In' })).toBeVisible();
}