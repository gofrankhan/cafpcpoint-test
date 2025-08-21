require('dotenv').config();
import { request } from '@playwright/test';
import { createUser, createUserData } from './steps/users_steps.js';

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
        form: { username: process.env.TEST_USERNAME, password: process.env.TEST_USERNAME }
    });

    // Create Admin user
    await requestContext.post('/api/users', {
        data: { user_type: 'admin', ...createUserData('admin') }
    });
    await requestContext.storageState({
        path: 'storage/admin.json',
    });

    // Create Basic user
    await requestContext.post('/api/users', {
        data: { user_type: 'user', ...createUserData('user') }
    });
    await requestContext.storageState({
        path: 'storage/user.json',
    });

    // Create Lawyer user
    await requestContext.post('/api/users', {
        data: { user_type: 'lawyer', ...createUserData('lawyer') }
    });
    await requestContext.storageState({
        path: 'storage/lawyer.json',
    });

    await requestContext.dispose();
}

export default globalSetup;