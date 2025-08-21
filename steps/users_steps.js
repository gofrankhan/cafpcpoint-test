const { faker } = require('@faker-js/faker');

exports.createUserData = (usertype) => {
    const userData = {
        name: faker.person.fullName(),  // Full name of the user
        email: faker.internet.email(),  // Email address
        username: faker.internet.username(),  // Username for login
        user_type: usertype,
        password: faker.internet.password(8, false, /[a-zA-Z0-9!@#$%^&*()_+]/),  // Strong password
        shop_name: faker.company.name(),  // Shop name
    }
    return userData;
};

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