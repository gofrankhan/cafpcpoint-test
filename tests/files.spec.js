// @ts-check
require('dotenv').config();
import { test, expect } from '@playwright/test';
const { createCustomer, createCustomerData, deleteCustomerByTaxId } = require('../steps/customer_steps.js');
const { saveCustomerData, getCustomerData, } = require('../utils/dataStore');

test('Create a file with new customer and current user', async ({ page }) => {
    await page.goto('/dashboard');
    // Expects page to have a heading with the name of Installation.
    await page.click('#btn_customer_simple');
    await page.click('a.form-control.btn.btn-primary'); //click on "New" button
    const customerData = createCustomerData();
    saveCustomerData(customerData); // Save customer data to file
    await createCustomer(page, customerData);

    await page.click('#btn_file_simple');
    await page.click('a.btn.btn-primary.waves-effect.waves-light'); //click on "New" button
    await page.getByRole('button', { name: 'Next' }).click();
    await page.selectOption('select[name="category"]', { index: 1 });
    await page.selectOption('select[name="service"]', { index: 1 });
    await page.locator('#taxid').fill(customerData.taxid);
    await page.waitForTimeout(3000);
});