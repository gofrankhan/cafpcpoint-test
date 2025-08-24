// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',
    headless: false,
    launchOptions: {
      slowMo: 100, // every action slowed by 300ms
    },
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  globalSetup: require.resolve('./global-setup.js'),
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'super-admin',
      use: {
        baseURL: 'http://127.0.0.1:8000',
        storageState: 'storageState.json', // logged-in state reused for all tests
      },

    },
    {
      name: 'admin',
      use: {
        baseURL: 'http://127.0.0.1:8000',
        storageState: 'storage/admin.json',
        test_data: 'test-data/admin.json',
      }
    },
    {
      name: 'user',
      use: {
        baseURL: 'http://127.0.0.1:8000',
        storageState: 'storage/user.json',
        test_data: 'test-data/user.json',
      }
    },
    {
      name: 'lawyer',
      use: {
        baseURL: 'http://127.0.0.1:8000',
        storageState: 'storage/lawyer.json',
        test_data: 'test-data/lawyer.json',
      }
    }
  ],
  /*projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },*/

  /* Test against mobile viewports. */
  // {
  //   name: 'Mobile Chrome',
  //   use: { ...devices['Pixel 5'] },
  // },
  // {
  //   name: 'Mobile Safari',
  //   use: { ...devices['iPhone 12'] },
  // },

  /* Test against branded browsers. */
  // {
  //   name: 'Microsoft Edge',
  //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
  // },
  // {
  //   name: 'Google Chrome',
  //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
  // },
  //],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

// module.exports = {
//   use: {
//     baseURL: 'http://127.0.0.1:8000',
//     storageState: 'storageState.json', // logged-in state reused for all tests
//     headless: false,
//     launchOptions: {
//       slowMo: 100, // every action slowed by 300ms
//     }
//   }
// };



