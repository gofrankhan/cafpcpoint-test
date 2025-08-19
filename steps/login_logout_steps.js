const { faker } = require('@faker-js/faker');
const { test, expect } = require('@playwright/test');

const username = process.env.TEST_USERNAME;
const password = process.env.TEST_PASSWORD;
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