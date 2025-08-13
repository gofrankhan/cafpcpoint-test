// @ts-check
require('dotenv').config();
import { test, expect } from '@playwright/test';
import { faker, es } from '@faker-js/faker';

const username = process.env.TEST_USERNAME;
const password = process.env.TEST_PASSWORD;
const url = process.env.TEST_URL;


test('Login to the CAF PC POINT portal', async ({ page }) => {
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
});

test.only('Create a customer without subscriptions', async ({ page }) => {
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
  const strTaxID = faker.string.alphanumeric({ length: 16, casing: 'upper' });
  await page.fill('#taxid', strTaxID);
  await page.selectOption('select[name="customertype"]', 'person');
  await page.fill('#firstname', faker.person.firstName())
  await page.fill('#lastname', faker.person.lastName());

  // Telephone: +02 followed by 8 digits
  const strTelephone = '+02' + faker.string.numeric(8);

  // Mobile: +8801 followed by one of 3,5,6,7,8,9, then 8 digits
  const mobilePrefix = faker.helpers.arrayElement(['3', '5', '6', '7', '8', '9']);
  const strMobile = `+8801${mobilePrefix}${faker.string.numeric(8)}`;
  const strCountry = faker.location.country();
  const strRegion = faker.location.countryCode('alpha-2');
  const strCity = faker.location.city();
  const strPostcode = faker.location.zipCode();
  const strAddress = faker.location.streetAddress();

  await page.fill('#citizenship', strCountry);
  await page.fill('#mobile', strMobile);
  await page.fill('#telephone', strTelephone);
  await page.fill('#addressline1', strAddress);
  await page.fill('#addressline2', faker.location.streetAddress());
  await page.fill('#city', strCity);
  await page.fill('#region', strRegion);
  await page.fill('#postcode', strPostcode);
  await page.fill('#dateofbirth', faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0]);
  await page.fill('#cityofbirth', faker.location.city());

  await page.click('input[value="Save"]');

  const toast = page.locator('.toast-message'); // Replace with actual selector
  await expect(toast).toHaveText('Customer data added successfully');
  await expect(page.locator('table tr:nth-of-type(1) td:nth-of-type(3)')).toHaveText(strTaxID);

  await page.waitForTimeout(3000);
});

test('delete a customer from the top of the table', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/');

  if (!process.env.TEST_USERNAME || !process.env.TEST_PASSWORD) {
    throw new Error('Missing TEST_USERNAME or TEST_PASSWORD in environment variables');
  }
  await page.getByPlaceholder('Username').fill(process.env.TEST_USERNAME);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await page.click('#btn_customer_simple');

  // Wait for the table to be visible
  await page.waitForSelector('table');

  // Accept confirmation dialog automatically
  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  // Click the first row's delete button
  await page.locator('a.btn.btn-danger.btn-sm.edit[title="Delete"]').first().click();
  await page.waitForTimeout(3000);
});