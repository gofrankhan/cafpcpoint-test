// @ts-check
require('dotenv').config();
import { test, expect } from '@playwright/test';
const { createCustomer, createCustomerData, deleteCustomerByTaxId } = require('../steps/customer_steps.js');
const { saveCustomerData, getCustomerData, } = require('../utils/dataStore');

test.skip('Create a file with new customer and current user', async ({ page }) => {
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
    await page.press('body', 'Tab');
    await expect(page.locator('#customer_type')).toHaveValue(customerData.customertype); //1 means "Individual"
    await expect(page.locator('#first_name')).toHaveValue(customerData.firstname);
    await expect(page.locator('#last_name')).toHaveValue(customerData.lastname);
    await expect(page.locator('#date_of_birth')).toHaveValue(customerData.dateofbirth);
    await expect(page.locator('#telephone')).toHaveValue(customerData.telephone);
    await page.getByRole('button', { name: 'Create' }).click();
    await page.waitForTimeout(3000);
});


test('delete a customer from the top of the table', async ({ page }) => {
    test.skip(test.info().project.name !== 'super-admin', 'Only valid for admin');
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await page.click('#btn_file_simple');

    // Wait for the table to be visible
    await page.waitForSelector('table');

    const strTaxID = await page.locator('table tr:nth-of-type(1) td:nth-of-type(2)').first().innerText();
    page.on('dialog', async dialog => { await dialog.accept(); });
    await page.locator('a.btn.btn-danger.btn-sm.edit[title="Delete"]').first().click();
    await expect(page.locator(`text=${strTaxID}`)).not.toBeVisible();

    await page.waitForTimeout(3000);
});