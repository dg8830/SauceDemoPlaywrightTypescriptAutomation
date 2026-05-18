import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/web/pages/LoginPage';
import { webTestData } from '../../src/web/fixtures/testData';

test.describe('Web UI - Login Module', () => {
    test('should login successfully with valid credentials (positive)', async ({ page }: { page: any }) => {
        const loginPage = new LoginPage(page);

        await page.goto('/');
        await loginPage.login(webTestData.validUser.username, webTestData.validUser.password);

        await expect(page.locator('[data-test="inventory-container"]')).toBeVisible();
        await expect(page.locator('.title')).toHaveText('Products');
    });

    test('should show error with invalid credentials (negative)', async ({ page }: { page: any }) => {
        const loginPage = new LoginPage(page);

        await page.goto('/');
        await loginPage.login(webTestData.invalidUser.username, webTestData.invalidUser.password);

        const error = await loginPage.getErrorMessage();
        expect(error.toLowerCase()).toContain('username');
    });
});
