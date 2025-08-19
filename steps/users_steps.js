const { faker } = require('@faker-js/faker');

exports.createUserData = () => {
    const userData = {
        name: faker.person.fullName(),  // Full name of the user
        email: faker.internet.email(),  // Email address
        username: faker.internet.userName(),  // Username for login
        usertype: 'admin',
        password: faker.internet.password(8, false, /[a-zA-Z0-9!@#$%^&*()_+]/),  // Strong password
        shopname: faker.company.name(),  // Shop name
    }
    return userData;
};

exports.createUser = async (page, userData) => {
    await page.goto('/client/new');
    await page.fill('#name', userData.name);
    await page.selectOption('select[name="usertype"]', userData.usertype);
    await page.fill('#username', userData.username);
    await page.fill('#email', userData.email);
    await page.fill('#password', userData.password);
    await page.fill('#password_confirmation', userData.password);
    await page.fill('#new_shop', userData.shopname);
    await page.getByRole('button', { name: 'Create' }).click();
}