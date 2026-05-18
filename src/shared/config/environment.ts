/**
 * Centralized environment configuration.
 * Uses env vars so CI can override sensitive values.
 */

export const environment = {
    web: {
        baseUrl: process.env.WEB_BASE_URL ?? 'https://www.saucedemo.com',
        username: process.env.SAUCED_USERNAME ?? 'standard_user',
        password: process.env.SAUCED_PASSWORD ?? 'secret_sauce',
    },
    api: {
        baseUrl: process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com',
        username: process.env.API_USERNAME ?? 'admin',
        password: process.env.API_PASSWORD ?? 'password123',
    },
};
