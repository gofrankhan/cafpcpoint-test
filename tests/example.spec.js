// @ts-check
require('dotenv').config();
import { test, expect } from '@playwright/test';

const username = process.env.TEST_USERNAME;
const password = process.env.TEST_PASSWORD;
const url = process.env.TEST_URL;


test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});


test('has title for Caf', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/CAF PC POINT/);
});

test('get started link for Caf', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/');

  if (!process.env.TEST_USERNAME || !process.env.TEST_PASSWORD) {
    throw new Error('Missing TEST_USERNAME or TEST_PASSWORD in environment variables');
  }

  await page.getByPlaceholder('Username').fill(process.env.TEST_USERNAME);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  // Click the get started link.
  await page.getByRole('button', { name: 'Log in' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test.only('create a customer', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/');

  if (!process.env.TEST_USERNAME || !process.env.TEST_PASSWORD) {
    throw new Error('Missing TEST_USERNAME or TEST_PASSWORD in environment variables');
  }

  await page.getByPlaceholder('Username').fill(process.env.TEST_USERNAME);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  // Click the get started link.
  await page.getByRole('button', { name: 'Log in' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await page.click('#btn_customer_simple');
  await page.click('a.form-control.btn.btn-primary');

  await page.fill('#taxid', '123456789');
  //Fill for firstname, lastname, email, phone, address, city, state, zip 
  await page.fill('#firstname', 'John');
  await page.fill('#lastname', 'Doe');
  // await page.fill('#email', 'john.doe@example.com');
  await page.fill('#mobile', '1234567890');
  await page.fill('#telephone', '1234567890');
  await page.fill('#addressline1', '123 Main St');
  await page.fill('#city', 'Anytown');
  await page.fill('#region', 'CA');
  await page.fill('#postcode', '12345');

  //await page.click('#btn_save_customer');

  await page.waitForTimeout(3000);
});