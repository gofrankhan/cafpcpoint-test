require('dotenv').config();
import { request, chromium } from '@playwright/test';
import { createUser, createUserData } from './steps/users_steps.js';
import { userLogin } from './steps/login_logout_steps.js';

async function globalSetup(config) {
    console.log('>>> Global setup is running...'); // debug line
    const requestContext = await request.newContext({
        baseURL: process.env.TEST_URL,
        extraHTTPHeaders: {
            'Authorization': `Bearer ${process.env.API_AUTH_TOKEN}`,
            'Content-Type': 'application/json'
        },
    });

    // Login as super-admin
    await requestContext.post('api/login', {
        data: { username: process.env.TEST_USERNAME, password: process.env.TEST_USERNAME }
    });

    // Create Admin user\
    const browserAdmin = await chromium.launch({ headless: false });
    const userDataAdmin = createUserData('admin');
    await requestContext.post('/api/users', { data: { user_type: 'admin', ...userDataAdmin } });
    const contextAdmin = await browserAdmin.newContext();
    const pageAdmin = await contextAdmin.newPage();
    await userLogin(pageAdmin, userDataAdmin.username, userDataAdmin.password);
    await contextAdmin.storageState({ path: `storage/admin.json` });
    await browserAdmin.close();

    // Create Basic user
    const browserUser = await chromium.launch({ headless: false });
    const userDataUser = createUserData('user');
    await requestContext.post('/api/users', { data: { user_type: 'user', ...userDataUser } });
    const contextUser = await browserUser.newContext();
    const pageUser = await contextUser.newPage();
    await userLogin(pageUser, userDataUser.username, userDataUser.password);
    await contextUser.storageState({ path: `storage/user.json` });
    await browserUser.close();

    // Create Lawyer user
    const browserLawyer = await chromium.launch({ headless: false });
    const userDataLawyer = createUserData('lawyer');
    await requestContext.post('/api/users', { data: { user_type: 'lawyer', ...userDataLawyer } });
    const contextLawyer = await browserLawyer.newContext();
    const pageLawyer = await contextLawyer.newPage();
    await userLogin(pageLawyer, userDataLawyer.username, userDataLawyer.password);
    await contextLawyer.storageState({ path: `storage/lawyer.json` });
    await browserLawyer.close();

    await requestContext.dispose();
}

export default globalSetup;