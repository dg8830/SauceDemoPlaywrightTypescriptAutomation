import { expect, Locator, Page } from '@playwright/test';

/**
 * Page Object for SauceDemo Checkout Complete page.
 */
export class CheckoutCompletePage {
    private readonly page: Page;

    private readonly successMessage: Locator;
    private readonly backHomeButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.successMessage = page.locator('.complete-header');
        this.backHomeButton = page.locator('[data-test="back-to-products"]');
    }

    async isOrderComplete(): Promise<boolean> {
        await expect(this.successMessage).toBeVisible();
        return true;
    }

    async getSuccessMessage(): Promise<string> {
        await expect(this.successMessage).toBeVisible();
        return (await this.successMessage.textContent()) ?? '';
    }

    async backToProducts(): Promise<void> {
        await expect(this.backHomeButton).toBeVisible();
        await this.backHomeButton.click();
    }
}
