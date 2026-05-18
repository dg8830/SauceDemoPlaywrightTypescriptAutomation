import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../src/web/pages/ProductsPage';
import { CartPage } from '../../src/web/pages/CartPage';
import { CheckoutStepOnePage } from '../../src/web/pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../../src/web/pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../../src/web/pages/CheckoutCompletePage';
import { webTestData } from '../../src/web/fixtures/testData';
import { loginAsStandardUser } from '../../src/web/utils/webHelpers';

test.describe('Web UI - Shopping Cart / Checkout Module', () => {
    test('should complete checkout with valid information (positive)', async ({ page }: { page: any }) => {
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);

        await loginAsStandardUser(page, webTestData.validUser);

        await productsPage.addProductToCart(webTestData.productsToAdd[0]);
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

    test('should show validation errors with missing checkout information (negative)', async ({ page }: { page: any }) => {
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);

        await loginAsStandardUser(page, webTestData.validUser);

        await productsPage.addProductToCart(webTestData.productsToAdd[0]);
        await cartPage.proceedToCheckout();

        const stepOne = new CheckoutStepOnePage(page);
        await stepOne.fillCheckoutInfo(
            webTestData.invalidCheckout.firstName,
            webTestData.invalidCheckout.lastName,
            webTestData.invalidCheckout.postalCode,
        );
        await stepOne.continue();

        const error = await stepOne.getErrorMessage();
        expect(error.length).toBeGreaterThan(0);
    });
});
