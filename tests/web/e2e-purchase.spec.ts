import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../src/web/pages/ProductsPage';
import { CartPage } from '../../src/web/pages/CartPage';
import { CheckoutStepOnePage } from '../../src/web/pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../../src/web/pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../../src/web/pages/CheckoutCompletePage';
import { webTestData } from '../../src/web/fixtures/testData';
import { loginAsStandardUser } from '../../src/web/utils/webHelpers';

test.describe('Web UI - E2E Purchase Flow', () => {
    test('should complete full purchase flow from login to order confirmation (E2E)', async ({
        page,
    }: {
        page: any;
    }) => {
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);

        await loginAsStandardUser(page, webTestData.validUser);

        // Add product(s)
        await productsPage.addProductToCart(webTestData.productsToAdd[0]);
        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

        // Checkout flow
        await cartPage.proceedToCheckout();

        const stepOne = new CheckoutStepOnePage(page);
        await stepOne.fillCheckoutInfo(
            webTestData.checkout.firstName,
            webTestData.checkout.lastName,
            webTestData.checkout.postalCode,
        );
        await stepOne.continue();

        const stepTwo = new CheckoutStepTwoPage(page);
        await stepTwo.finish();

        const completePage = new CheckoutCompletePage(page);
        await completePage.isOrderComplete();

        const success = await completePage.getSuccessMessage();
        expect(success.toLowerCase()).toContain('thank you');
    });
});
