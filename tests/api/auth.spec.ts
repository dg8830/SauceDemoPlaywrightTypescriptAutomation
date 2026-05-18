import { test, expect, request as playwrightRequest } from '@playwright/test';
import { BookingAPIClient } from '../../src/api/clients/BookingAPIClient';
import { validAuth, invalidAuth } from '../../src/api/fixtures/apiTestData';
import { expectStatus, getJson } from '../../src/api/utils/apiHelpers';
import { AuthResponse } from '../../src/api/models/AuthModel';

test.describe('API - Authentication (/auth)', () => {
    test('should generate token with valid credentials (positive)', async () => {
        const apiRequest = await playwrightRequest.newContext({ baseURL: process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com' });
        const client = new BookingAPIClient(apiRequest);

        const { response } = await client.createToken(validAuth);
        await expectStatus(response, 200);

        const { token } = await getJson<AuthResponse>(response);
        expect(token).toBeTruthy();
    });

    test('should fail to generate token with invalid credentials (negative)', async () => {
        const apiRequest = await playwrightRequest.newContext({ baseURL: process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com' });
        const client = new BookingAPIClient(apiRequest);

        const { response } = await client.createToken(invalidAuth);

        // Restful-Booker typically returns 200 with empty token for invalid creds, but requirement asks positive & negative.
        // We assert non-empty token expectation.
        const body = await getJson<Partial<AuthResponse>>(response);
        expect(body.token).toBeFalsy();
    });
});
