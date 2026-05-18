import { expect, Locator, Page } from '@playwright/test';

/**
 * Page Object for SauceDemo Cart page.
 */
export class CartPage {
    private readonly page: Page;

    private readonly cartItems: Locator;
    private readonly checkoutButton: Locator;
    private readonly continueShoppingButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.cartItems = page.locator('.cart_item');
        // SauceDemo cart page checkout button uses id="checkout"
        this.checkoutButton = page.locator('#checkout');
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    }

    async getCartItems(): Promise<string[]> {
        // Cart items have a name element inside each cart_item row.
        const names = this.cartItems.locator('.inventory_item_name');
        const count = await names.count();
        const result: string[] = [];
        for (let i = 0; i < count; i++) {
            const txt = (await names.nth(i).textContent()) ?? '';
            if (txt.trim()) result.push(txt.trim());
        }
        return result;
    }

    async removeItemByName(productName: string): Promise<void> {
        const itemRow = this.cartItems.filter({
            has: this.page.locator('.inventory_item_name', { hasText: productName }),
        });

        const removeButton = itemRow.locator('button:has-text("Remove")');
        await expect(removeButton.first()).toBeVisible();
        await removeButton.first().click();
    }

    async proceedToCheckout(): Promise<void> {
        // Always go through cart link so the checkout button exists on the page.
        const cartLink = this.page.locator('.shopping_cart_link');
        await cartLink.click();

        // Wait for cart to render.
        await expect(this.cartItems.first()).toBeVisible();

        // SauceDemo checkout button selector can vary; try data-test first, fallback to #checkout.
        const checkoutByDataTest = this.page.locator('[data-test="checkout"]');
        const checkoutById = this.page.locator('#checkout');

        const checkoutButton =
            (await checkoutByDataTest.isVisible().catch(() => false)) ? checkoutByDataTest : checkoutById;

        await expect(checkoutButton).toBeVisible();
        await checkoutButton.click();
    }

    async continueShopping(): Promise<void> {
        await expect(this.continueShoppingButton).toBeVisible();
        await this.continueShoppingButton.click();
    }
}
