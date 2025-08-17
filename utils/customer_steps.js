exports.createCustomer = async (page, customerData) => {
    await page.goto('/dashboard');
    // Expects page to have a heading with the name of Installation.
    await page.click('#btn_customer_simple');
    await page.click('a.form-control.btn.btn-primary'); //click on "New" button

    await page.fill('#taxid', customerData.taxId);
    await page.selectOption('select[name="customertype"]', customerData.customertype);
    await page.fill('#firstname', customerData.firstName);
    await page.fill('#lastname', customerData.lastName);
    await page.fill('#citizenship', customerData.citizenship);
    await page.fill('#mobile', customerData.mobile);
    await page.fill('#telephone', customerData.telephone);
    await page.fill('#region', customerData.region);
    await page.fill('#addressline1', customerData.addressLine1);
    await page.fill('#addressline2', customerData.addressLine2);
    await page.fill('#city', customerData.city);
    await page.fill('#postcode', customerData.postcode);
    await page.fill('#dateofbirth', customerData.dateOfBirth);
    await page.fill('#cityofbirth', customerData.cityOfBirth);

    await page.click('input[value="Save"]');
};

exports.deleteCustomerByTaxId = async (page, taxId) => {
    await page.goto('/dashboard');
    await page.getByRole('heading', { name: 'Dashboard' }).waitFor({ state: 'visible' });;
    await page.click('#btn_customer_simple');
    // Wait for the table to be visible
    await page.waitForSelector('table');
    const rowLocator = page.locator(`table tr:has-text("${taxId}")`);
    // Accept confirmation dialog automatically
    page.on('dialog', async dialog => { await dialog.accept(); });
    await rowLocator.locator('a.btn.btn-danger.btn-sm.edit[title="Delete"]').click();
    // Assert that the old TaxID is no longer visible in the table

};
