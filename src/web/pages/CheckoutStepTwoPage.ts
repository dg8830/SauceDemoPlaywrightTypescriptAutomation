import { expect, Locator, Page } from '@playwright/test';

/**
 * Page Object for SauceDemo Checkout Step Two (Overview + Finish).
 */
export class CheckoutStepTwoPage {
    private readonly page: Page;

    private readonly itemSummary: Locator;
    private readonly totalPrice: Locator;
    private readonly finishButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.itemSummary = page.locator('.summary_items');
        this.totalPrice = page.locator('.summary_total_label');
        this.finishButton = page.locator('[data-test="finish"]');
    }

    async getOrderSummary(): Promise<{ itemsText: string; totalText: string }> {
        const itemsText = (await this.itemSummary.textContent()) ?? '';
        const totalText = (await this.totalPrice.textContent()) ?? '';
        return { itemsText: itemsText.trim(), totalText: totalText.trim() };
    }

    async finish(): Promise<void> {
        await expect(this.finishButton).toBeVisible();
        await this.finishButton.click();
    }
}
