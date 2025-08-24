require('dotenv').config();
import { request, chromium } from '@playwright/test';
import { createUserAndSaveState, createUserData } from './steps/users_steps.js';
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
    const userDataAdmin = createUserData('admin');
    await createUserAndSaveState(requestContext, userDataAdmin);

    // Create Basic user
    const userDataUser = createUserData('user');
    await createUserAndSaveState(requestContext, userDataUser);

    // Create Lawyer user
    const userDataLawyer = createUserData('lawyer');
    await createUserAndSaveState(requestContext, userDataLawyer);

    await requestContext.dispose();
}

export default globalSetup;