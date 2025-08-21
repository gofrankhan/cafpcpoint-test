import { request } from '@playwright/test';
import { createUser, createUserData } from './steps/users_steps.js';

async function globalSetup(config) {
    console.log('>>> Global setup is running...'); // debug line
    const requestContext = await request.newContext({
        baseURL: 'http://127.0.0.1:8000'
    });

    // Login as super-admin
    await requestContext.post('/login', {
        form: { username: 'superadmin', password: 'password' }
    });

    // Create Admin user
    await requestContext.post('/api/users', {
        data: { user_type: 'admin', ...createUserData() }
    });

    // Create Basic user
    await requestContext.post('/api/users', {
        data: { user_type: 'basic', ...createUserData() }
    });

    // Create Lawyer user
    await requestContext.post('/api/users', {
        data: { user_type: 'lawyer', ...createUserData() }
    });

    await requestContext.dispose();
}

export default globalSetup;