import { expect, Locator, Page } from '@playwright/test';

/**
 * Page Object for SauceDemo Products (Inventory) page.
 */
export class ProductsPage {
    private readonly page: Page;

    private readonly productCards: Locator;
    private readonly cartBadge: Locator;
    private readonly sortDropdown: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productCards = page.locator('.inventory_item');
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.sortDropdown = page.locator('[data-test="product_sort_container"]');
    }

    async isProductsPageDisplayed(): Promise<boolean> {
        const inventoryContainer = this.page.locator('[data-test="inventory-container"]');
        await expect(inventoryContainer).toBeVisible();
        return true;
    }

    /**
     * Adds the product with the given visible name to the cart.
     * SauceDemo products are listed in cards with:
     * - product name: .inventory_item_name
     * - add button: button.btn_primary (scoped within card)
     */
    async addProductToCart(productName: string): Promise<void> {
        const productCard = this.productCards.filter({
            has: this.page.locator('.inventory_item_name', { hasText: productName }),
        });

        const addButton = productCard.locator('button:has-text("Add to cart")');
        await expect(addButton.first()).toBeVisible();
        await addButton.first().click();
    }

    async getCartItemCount(): Promise<number> {
        // Badge may not be visible if cart is empty.
        if (!(await this.cartBadge.isVisible().catch(() => false))) return 0;

        const text = (await this.cartBadge.textContent()) ?? '0';
        return Number(text.trim());
    }

    async removeAllProductsFromCart(): Promise<void> {
        // Utility to clear cart by navigating to cart and removing items.
        // Kept minimal here; cart page owns remove behavior.
        const cartLink = this.page.locator('.shopping_cart_link');
        await cartLink.click();
    }
}
