import { expect, Locator, Page } from '@playwright/test';

/**
 * Page Object for SauceDemo Checkout Step One.
 */
export class CheckoutStepOnePage {
    private readonly page: Page;

    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly postalCodeInput: Locator;
    private readonly continueButton: Locator;
    private readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        // SauceDemo uses a <h3 data-test="error"> for form validation messages.
        this.errorMessage = page.locator('h3[data-test="error"]');
    }

    async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    async continue(): Promise<void> {
        await expect(this.continueButton).toBeVisible();
        await this.continueButton.click();
    }

    async getErrorMessage(): Promise<string> {
        // Negative path can be timing-sensitive: error message may appear after clicking Continue.
        // Be resilient by waiting for it briefly; if not present, return empty string.
        try {
            await this.errorMessage.waitFor({ state: 'visible', timeout: 3000 });
        } catch {
            return '';
        }
        return (await this.errorMessage.textContent()) ?? '';
    }
}
