import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 2 : 1,
    workers: process.env.PW_WORKERS ? Number(process.env.PW_WORKERS) : undefined,
    reporter: [
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['list'],
        ...(process.env.ALLURE_RESULTS_DIR
            ? [['allure-playwright', { resultsDir: process.env.ALLURE_RESULTS_DIR }]]
            : [['allure-playwright', { resultsDir: 'allure-results' }]]),
    ],
    use: {
        trace: 'on-first-retry',
        video: 'retain-on-failure',
        screenshot: 'only-on-failure',
        baseURL: 'http://localhost', // overridden per project
        actionTimeout: 30_000,
        navigationTimeout: 30_000,
    },
    projects: [
        {
            name: 'web',
            testMatch: ['web/**/*.spec.ts'],
            use: {
                baseURL: 'https://www.saucedemo.com',
                ...devices['Desktop Chrome'],
                viewport: { width: 1280, height: 720 },
            },
        },
        {
            name: 'api',
            testMatch: ['api/**/*.spec.ts'],
            use: {
                baseURL: 'https://restful-booker.herokuapp.com',
            },
        },
        // Optional extra browser coverage for web
        {
            name: 'web-firefox',
            testMatch: ['web/**/*.spec.ts'],
            use: {
                baseURL: 'https://www.saucedemo.com',
                ...devices['Desktop Firefox'],
                viewport: { width: 1280, height: 720 },
            },
        },
        {
            name: 'web-webkit',
            testMatch: ['web/**/*.spec.ts'],
            use: {
                baseURL: 'https://www.saucedemo.com',
                ...devices['Desktop Safari'],
                viewport: { width: 1280, height: 720 },
            },
        },
    ],
});
