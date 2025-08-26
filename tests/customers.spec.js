// @ts-check
require('dotenv').config();
import { test, expect } from '@playwright/test';
const { createCustomer, createCustomerData, deleteCustomerByTaxId } = require('../steps/customer_steps.js');
const { saveCustomerData, getCustomerData, } = require('../utils/dataStore');

const apiAuthToken = process.env.API_AUTH_TOKEN; // Ensure this is set in your .env file

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

test('View a customer details in view page', async ({ page }) => {
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

  // Find the row with the given Tax ID
  const row = page.locator(`table tr:has(td:has-text("${customerData.taxid}"))`);

  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),           // 👈 wait for new tab
    page.click('a[title="Show"]'),        // 👈 click Show button
  ]);

  // Verify new tab URL matches expected pattern
  await expect(newPage).toHaveURL(/\/customer\/show\/\d+/);
  // Optional: also check something in the new tab, e.g., heading or taxid
  await expect(newPage.getByRole('heading', { name: `Show Customer's Information` })).toBeVisible();

  // Locate the row containing "Tax ID"
  const taxIdRow = newPage.locator('.row.mb-3', { hasText: 'Tax ID' });

  // Get the value inside the div
  const taxIdValue = await taxIdRow.locator('div.col-sm-10').innerText();

  // Assert that it's not empty (or matches expected value)
  await expect(taxIdRow.locator('div.col-sm-10')).toHaveText(/[A-Z0-9]+/);

  // If you know expected taxid:
  await expect(taxIdRow.locator('div.col-sm-10')).toHaveText(customerData.taxid);

  await page.waitForTimeout(3000);
});

test.only('View customer page has edit and close buttons', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('#btn_customer_simple');
  const customerData = getCustomerData()

  // Find the row with the given Tax ID
  const row = page.locator(`table tr:has(td:has-text("${customerData.taxid}"))`);
  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),           // 👈 wait for new tab
    page.click('a[title="Show"]'),        // 👈 click Show button
  ]);

  await expect(newPage.getByRole('heading', { name: `Show Customer's Information` })).toBeVisible();
  await expect(newPage.locator('input[value="Edit"]')).toHaveText('Edit');
  await expect(newPage.locator('input[value="Close"]')).toHaveText('Close');

  await page.waitForTimeout(3000);
});

test.only('Close button closes the customer view tab', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('#btn_customer_simple');
  const customerData = getCustomerData()

  // Find the row with the given Tax ID
  const row = page.locator(`table tr:has(td:has-text("${customerData.taxid}"))`);
  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),           // 👈 wait for new tab
    page.click('a[title="Show"]'),        // 👈 click Show button
  ]);

  await Promise.all([
    newPage.waitForEvent('close'),        // 👈 wait for the tab to close
    newPage.click('input[value="Close"]') // 👈 click Close button
  ]);
  // Verify the new page is closed
  await expect(newPage.isClosed()).toBeTruthy();
  await page.waitForTimeout(3000);
});

test.only('Edit button opens the customer edit page', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('#btn_customer_simple');
  const customerData = getCustomerData()

  // Find the row with the given Tax ID
  const row = page.locator(`table tr:has(td:has-text("${customerData.taxid}"))`);
  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),           // 👈 wait for new tab
    page.click('a[title="Show"]'),        // 👈 click Show button
  ]);
  // 👈 wait for the tab to close
  await newPage.click('input[value="Edit"]') // 👈 click Close button
  // Verify the new page is closed
  await expect(newPage.getByRole('heading', { name: `Edit Customer Information` })).toBeVisible();
  await page.waitForTimeout(3000);
});


test('Edit a customer details in edit page', async ({ page }) => {
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

  // Find the row with the given Tax ID
  const row = page.locator(`table tr:has(td:has-text("${customerData.taxid}"))`);
  await page.click('a.btn.btn-outline-secondary.btn-sm.edit[title="Delete"]'); //click Edit button,
  // Verify new tab URL matches expected pattern
  await expect(page).toHaveURL(/\/customer\/edit\/\d+/);
  // Optional: also check something in the new tab, e.g., heading or taxid
  await expect(page.getByRole('heading', { name: `Edit Customer Information` })).toBeVisible();

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
  test.skip(test.info().project.name !== 'admin', 'Only valid for admin');
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
  test.skip(test.info().project.name !== 'admin', 'Only valid for admin');
  const customerData = createCustomerData();
  saveCustomerData(customerData); // Save customer data to file
  await createCustomer(page, customerData);
  const taxId = getCustomerData().taxid; // Get the tax ID from the saved data
  await deleteCustomerByTaxId(page, taxId);
  await expect(page.locator(`text=${taxId}`)).not.toBeVisible();

  await page.waitForTimeout(3000);
});


test.skip('create customer via API', async ({ request }) => {

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
