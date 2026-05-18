/**
 * Web UI test data for SauceDemo.
 * Keep credentials in env vars when possible for CI safety.
 */

export const webTestData = {
    validUser: {
        username: process.env.SAUCED_USERNAME ?? 'standard_user',
        password: process.env.SAUCED_PASSWORD ?? 'secret_sauce',
    },
    invalidUser: {
        username: process.env.SAUCED_USERNAME ?? 'standard_user',
        password: 'wrong-password',
    },
    productsToAdd: ['Sauce Labs Backpack'],
    checkout: {
        firstName: 'John',
        lastName: 'Doe',
        postalCode: '12345',
    },
    invalidCheckout: {
        firstName: '',
        lastName: '',
        postalCode: '',
    },
};
