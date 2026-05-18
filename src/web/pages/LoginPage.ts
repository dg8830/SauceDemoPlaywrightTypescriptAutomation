import { expect, Locator, Page } from '@playwright/test';

/**
 * Page Object Model for SauceDemo Login page.
 * Encapsulates locators + actions for the login module.
 */
export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        this.usernameInput = page.locator('#user-name');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login-button');
        this.errorMessage = page.locator('h3[data-test="error"]');
    }

    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async getErrorMessage(): Promise<string> {
        // Ensure the message is visible (if it appears).
        await expect(this.errorMessage).toBeVisible();
        return this.errorMessage.textContent() ?? '';
    }

    async isLoginSuccessful(): Promise<boolean> {
        // On success, SauceDemo shows products page which has a products container.
        const inventoryContainer = this.page.locator('[data-test="inventory-container"]');
        await expect(inventoryContainer).toBeVisible();
        return true;
    }
}
