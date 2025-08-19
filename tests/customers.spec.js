// @ts-check
require('dotenv').config();
import { test, expect } from '@playwright/test';
const { createCustomer, createCustomerData, deleteCustomerByTaxId } = require('../utils/customer_steps.js');
const { saveCustomerData, getCustomerData, } = require('../utils/dataStore');

const username = process.env.TEST_USERNAME;
const password = process.env.TEST_PASSWORD;
const apiAuthToken = process.env.API_AUTH_TOKEN; // Ensure this is set in your .env file
const base_url = process.env.TEST_URL;


test('Login to the CAF PC POINT portal', async ({ page }) => {
  if (!base_url || !username || !password) {
    throw new Error('Missing BaseURL or USERNAME or PASSWORD in environment variables');
  }
  await page.goto(base_url);
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/CAF PC POINT/);

  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  // Click the get started link.
  await page.getByRole('button', { name: 'Log in' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test('Create a customer without subscriptions', async ({ page }) => {
  await page.goto('/dashboard');
  // Expects page to have a heading with the name of Installation.
  await page.click('#btn_customer_simple');
  await page.click('a.form-control.btn.btn-primary'); //click on "New" button

  const customerData = createCustomerData();
  // console.log(customerData);
  saveCustomerData(customerData); // Save customer data to file
  await createCustomer(page, customerData);

  const toast = page.locator('.toast-message'); // Message with actual selector
  await expect(toast).toHaveText('Customer data added successfully');
  await expect(page.locator('table tr:nth-of-type(1) td:nth-of-type(3)')).toHaveText(customerData.taxid);

  await page.waitForTimeout(3000);
});

test('Create a customer without tax Id and check error message', async ({ page }) => {
  await page.goto('/dashboard');
  // Expects page to have a heading with the name of Installation.
  await page.click('#btn_customer_simple');
  await page.click('a.form-control.btn.btn-primary'); //click on "New" button

  const customerData = createCustomerData();
  customerData.taxid = ''; // Set taxId to empty string to trigger validation error
  // console.log(customerData);
  saveCustomerData(customerData); // Save customer data to file
  await createCustomer(page, customerData);

  const toast = page.locator('.toast-message'); // Message with actual selector
  await expect(toast).toHaveText('Tax ID should not be empty');

  await page.waitForTimeout(3000);
});

test('delete a customer from the top of the table', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await page.click('#btn_customer_simple');

  // Wait for the table to be visible
  await page.waitForSelector('table');

  const strTaxID = await page.locator('table tr:nth-of-type(1) td:nth-of-type(3)').innerText();
  // Accept confirmation dialog automatically
  page.on('dialog', async dialog => { await dialog.accept(); });
  await page.locator('a.btn.btn-danger.btn-sm.edit[title="Delete"]').first().click();
  // Assert that the old TaxID is no longer visible in the table
  await expect(page.locator(`text=${strTaxID}`)).not.toBeVisible();

  await page.waitForTimeout(3000);
});

test('delete a customer by tax id', async ({ page }) => {
  const customerData = createCustomerData();
  saveCustomerData(customerData); // Save customer data to file
  await createCustomer(page, customerData);
  const taxId = getCustomerData().taxid; // Get the tax ID from the saved data
  await deleteCustomerByTaxId(page, taxId);
  await expect(page.locator(`text=${taxId}`)).not.toBeVisible();

  await page.waitForTimeout(3000);
});


test('create customer via API', async ({ request }) => {

  if (!apiAuthToken) {
    throw new Error('Authentication token is not set in environment variables');
  }
  const customerData = createCustomerData();
  customerData.user_id = 16;
  customerData.account_id = 1;
  customerData.is_subscribed = true;
  customerData.subscription_type = 'Annual Premium';
  customerData.start_date = '2025-08-15';
  customerData.end_date = '2026-08-15';
  customerData.description = '1-year premium subscription with priority support';

  // console.log('Customer Data:', customerData);
  const response = await request.post('http://127.0.0.1:8000/api/customers/', {
    headers: {
      'Authorization': 'Bearer ' + apiAuthToken,
      'Content-Type': 'application/json'
    },
    data: customerData
  });
  expect(response.ok()).toBeTruthy(); // status 2xx
  const body = await response.json();
  // console.log('Created customer:', body);
});
