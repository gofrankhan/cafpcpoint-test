// @ts-check
require('dotenv').config();
import { test, expect } from '@playwright/test';
import { faker, es } from '@faker-js/faker';
const { createCustomer, deleteCustomerByTaxId } = require('../utils/customer_steps.js');
const { saveCustomerData, getCustomerData } = require('../utils/dataStore');

const username = process.env.TEST_USERNAME;
const password = process.env.TEST_PASSWORD;
const apiAuthToken = process.env.API_AUTH_TOKEN; // Ensure this is set in your .env file
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

test('Create a customer without subscriptions', async ({ page }) => {
  await page.goto('/dashboard');
  // Expects page to have a heading with the name of Installation.
  await page.click('#btn_customer_simple');
  await page.click('a.form-control.btn.btn-primary'); //click on "New" button
  const mobilePrefix = faker.helpers.arrayElement(['3', '5', '6', '7', '8', '9']);
  const customerData = {
    taxId: faker.string.alphanumeric({ length: 16, casing: 'upper' }),
    customertype: 'person',
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    citizenship: faker.location.country(),
    telephone: '+02' + faker.string.numeric(8),
    mobile: `+8801${mobilePrefix}${faker.string.numeric(8)}`,
    region: faker.location.countryCode('alpha-2'),
    city: faker.location.city(),
    postcode: faker.location.zipCode(),
    addressLine1: faker.location.streetAddress(),
    addressLine2: faker.location.secondaryAddress(),
    dateOfBirth: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
    cityOfBirth: faker.location.city(),
  }
  console.log(customerData);
  saveCustomerData(customerData); // Save customer data to file
  await createCustomer(page, customerData);

  const toast = page.locator('.toast-message'); // Message with actual selector
  await expect(toast).toHaveText('Customer data added successfully');
  await expect(page.locator('table tr:nth-of-type(1) td:nth-of-type(3)')).toHaveText(customerData.taxId);

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

  // Click the first row's delete button
  await page.locator('a.btn.btn-danger.btn-sm.edit[title="Delete"]').first().click();
  // Assert that the old TaxID is no longer visible in the table
  await expect(page.locator(`text=${strTaxID}`)).not.toBeVisible();

  await page.waitForTimeout(3000);
});

test.only('delete a customer by tax id', async ({ page }) => {
  const taxId = getCustomerData().taxId; // Get the tax ID from the saved data
  await deleteCustomerByTaxId(page, "UEIRC9M8G624YQL0");
  await expect(page.locator(`text=${taxId}`)).not.toBeVisible();

  await page.waitForTimeout(3000);
});


test('create customer via API', async ({ request }) => {
  const mobilePrefix = faker.helpers.arrayElement(['3', '5', '6', '7', '8', '9']);
  if (!apiAuthToken) {
    throw new Error('Authentication token is not set in environment variables');
  }
  const response = await request.post('http://127.0.0.1:8000/api/customers/', {

    headers: {
      'Authorization': apiAuthToken,
      'Content-Type': 'application/json'
    },
    data: {
      user_id: 16,
      taxid: 'TAX-90001',
      customertype: 'Corporate',
      company: 'Tech Innovations Ltd',
      firstname: 'Alice',
      lastname: 'Rahman',
      telephone: '01888888888',
      mobile: '01799999999',
      dateofbirth: '1992-07-12',
      pob: 'Dhaka',
      citizenship: 'Bangladeshi',
      addressline1: 'House 15, Road 3',
      addressline2: 'Block C',
      city: 'Dhaka',
      region: 'Dhaka',
      postcode: '1216',
      is_subscribed: true,
      subscription_type: 'Annual Premium',
      start_date: '2025-08-15',
      end_date: '2026-08-15',
      description: '1-year premium subscription with priority support'
    }
  });

  expect(response.ok()).toBeTruthy(); // status 2xx
  const body = await response.json();
  console.log('Created customer:', body);
});
