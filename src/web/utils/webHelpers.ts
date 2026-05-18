import { Page, expect } from '@playwright/test';

/**
 * Reusable web helpers to reduce duplication across specs.
 */

export async function loginAsStandardUser(
    page: Page,
    options: { username: string; password: string; },
): Promise<void> {
    await page.goto('/');

    await page.locator('#user-name').fill(options.username);
    await page.locator('#password').fill(options.password);
    await page.locator('#login-button').click();

    // SauceDemo renders two elements with the same id in some views;
    // use a unique data-test selector to avoid Playwright strict-mode violations.
    await expect(page.locator('[data-test="inventory-container"]')).toBeVisible();
}

export async function expectCartBadgeToBe(page: Page, expectedCount: number): Promise<void> {
    const badge = page.locator('.shopping_cart_badge');
    if (expectedCount === 0) {
        await expect(badge).toHaveCount(0);
        return;
    }
    await expect(badge).toHaveText(String(expectedCount));
}
