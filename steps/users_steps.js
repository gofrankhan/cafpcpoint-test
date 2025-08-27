const { faker } = require('@faker-js/faker');
const { request, chromium } = require('@playwright/test');
const { userLogin } = require('./login_logout_steps.js');
const { saveUserData } = require('../utils/dataStore.js');

exports.createUserData = (overrides = {}) => {
    return {
        name: overrides.name || faker.person.fullName(),
        username: overrides.username || faker.internet.username(),
        password: overrides.password || faker.internet.password(8, false, /[a-zA-Z0-9!@#$%^&*()_+]/),
        user_type: overrides.user_type || 'admin',
        shop_name: overrides.shopname || faker.company.name(),
        email: overrides.email || faker.internet.email()
    };
}

exports.createUser = async (page, userData) => {
    await page.goto('/client/new');
    await page.fill('#name', userData.name);
    await page.selectOption('select[name="usertype"]', userData.user_type);
    await page.fill('#username', userData.username);
    await page.fill('#email', userData.email);
    await page.fill('#password', userData.password);
    await page.fill('#password_confirmation', userData.password);
    await page.fill('#new_shop', userData.shop_name);
    await page.getByRole('button', { name: 'Create' }).click();
}

exports.createUserAPI = async (requestContext, userData) => {
    const response = await requestContext.post('/api/users', {
        data: {
            user_type: userData.user_type,
            name: userData.name,
            username: userData.username,
            email: userData.email,
            password: userData.password,
            shop_name: userData.shop_name
        }
    });

    if (!response.ok()) {
        throw new Error(`Failed to create user: ${response.status()} ${await response.text()}`);
    }

    return await response.json();
}


exports.createUserAndSaveState = async (requestContext, userData) => {
    // Create Admin/User/Lawyer user
    const browser = await chromium.launch({ headless: false });
    await requestContext.post('/api/users', { data: userData });
    const context = await browser.newContext();
    const page = await context.newPage();
    await userLogin(page, userData.username, userData.password);
    await context.storageState({ path: `storage/${userData.user_type}.json` });
    await saveUserData(userData); // Save user data to file
    await browser.close();
}