const { faker } = require('@faker-js/faker');

exports.createCustomerData = () => {
    const mobilePrefix = faker.helpers.arrayElement(['3', '5', '6', '7', '8', '9']);
    const customerData = {
        taxid: faker.string.alphanumeric({ length: 16, casing: 'upper' }),
        customertype: 'person',
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        citizenship: faker.location.country(),
        telephone: '+02' + faker.string.numeric(8),
        mobile: `+8801${mobilePrefix}${faker.string.numeric(8)}`,
        region: faker.location.countryCode('alpha-2'),
        city: faker.location.city(),
        postcode: faker.location.zipCode(),
        addressline1: faker.location.streetAddress(),
        addressline2: faker.location.secondaryAddress(),
        dateofbirth: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
        cityofbirth: faker.location.city()
    }
    return customerData;
};

exports.createCustomer = async (page, customerData) => {
    await page.goto('/dashboard');
    // Expects page to have a heading with the name of Installation.
    await page.click('#btn_customer_simple');
    await page.click('a.form-control.btn.btn-primary'); //click on "New" button

    await page.fill('#taxid', customerData.taxid);
    await page.selectOption('select[name="customertype"]', customerData.customertype);
    await page.fill('#firstname', customerData.firstname);
    await page.fill('#lastname', customerData.lastname);
    await page.fill('#citizenship', customerData.citizenship);
    await page.fill('#mobile', customerData.mobile);
    await page.fill('#telephone', customerData.telephone);
    await page.fill('#region', customerData.region);
    await page.fill('#addressline1', customerData.addressline1);
    await page.fill('#addressline2', customerData.addressline2);
    await page.fill('#city', customerData.city);
    await page.fill('#postcode', customerData.postcode);
    await page.fill('#dateofbirth', customerData.dateofbirth);
    await page.fill('#cityofbirth', customerData.cityofbirth);

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
