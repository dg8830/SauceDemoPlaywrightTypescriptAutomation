import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../src/web/pages/ProductsPage';
import { webTestData } from '../../src/web/fixtures/testData';
import { loginAsStandardUser } from '../../src/web/utils/webHelpers';

test.describe('Web UI - Product Catalog Module', () => {
    test('should add product to cart successfully (positive)', async ({ page }: { page: any }) => {
        const productsPage = new ProductsPage(page);

        await loginAsStandardUser(page, webTestData.validUser);

        await productsPage.addProductToCart(webTestData.productsToAdd[0]);

        // cart badge should show 1
        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    });

    test('should handle invalid product interaction (negative - empty behavior)', async ({ page }: { page: any }) => {
        const productsPage = new ProductsPage(page);

        await loginAsStandardUser(page, webTestData.validUser);

        // Attempt to add a non-existent product; should not change cart badge.
        const invalidProductName = 'This Product Does Not Exist';
        await productsPage
            .addProductToCart(invalidProductName)
            .catch(() => {
                // Expected: locator find/click will fail
            });

        // cart badge should not become non-empty
        await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
    });
});
