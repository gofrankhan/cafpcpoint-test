const { test, expect } = require('@playwright/test');
require('dotenv').config();

test.only('authenticate', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/CAF PC POINT/);

    if (!process.env.TEST_USERNAME || !process.env.TEST_PASSWORD) {
        throw new Error('Missing TEST_USERNAME or TEST_PASSWORD in environment variables');
    }

    await page.getByPlaceholder('Username').fill(process.env.TEST_USERNAME);
    await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
    // Click the get started link.
    await page.getByRole('button', { name: 'Log in' }).click();

    // Expects page to have a heading with the name of Installation.
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    // Save storage state (session)
    await page.context().storageState({ path: 'storageState.json' });
});