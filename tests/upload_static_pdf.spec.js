// @ts-check
require('dotenv').config();
import { test, expect } from '@playwright/test';
import { logoutUser, userLogin } from '../steps/login_logout_steps.js';

test('Goto Static pdf upload page', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'More' }).click();
    await page.locator('.dropdown-item', { hasText: 'Static PDF File' }).click();
    await expect(page.getByRole('heading', { name: "Static PDF Files Informations" })).toBeVisible();
})


test('Upload a Static pdf file', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'More' }).click();
    await page.locator('.dropdown-item', { hasText: 'Static PDF File' }).click();
    await expect(page.getByRole('heading', { name: "Static PDF Files Informations" })).toBeVisible();
    const filePath = 'test-data/pdf/sample.pdf'; // Adjust the path as necessary
    await page.click('a.btn.btn-primary.waves-effect.waves-light'); //click on "Upload PDF File" button
    await page.getByPlaceholder("Enter PDF File Name").fill('Sample PDF');
    await page.selectOption('select[name="pdf_category"]', { index: 1 });
    await page.selectOption('select[name="pdf_service"]', { index: 1 });
    await page.setInputFiles('input[type="file"]', filePath);
    await page.getByRole('button', { name: 'Upload File' }).click();
    const toast = page.locator('.toast-message');
    await expect(toast).toHaveText('New statif pdf file added successfully');
})