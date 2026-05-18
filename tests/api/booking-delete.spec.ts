import { test, expect, request as playwrightRequest } from '@playwright/test';
import { BookingAPIClient } from '../../src/api/clients/BookingAPIClient';
import { validAuth, validBooking } from '../../src/api/fixtures/apiTestData';
import { expectStatus } from '../../src/api/utils/apiHelpers';

async function createClient() {
    const apiRequest = await playwrightRequest.newContext({
        baseURL: process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com',
    });
    return { apiRequest, client: new BookingAPIClient(apiRequest) };
}

test.describe('API - Booking Management - DELETE (/booking/:id)', () => {
    test('should delete booking with valid token (positive)', async () => {
        const { client } = await createClient();
        const { body: authBody, response: authResp } = await client.createToken(validAuth);

        await expectStatus(authResp, 200);
        expect(authBody.token).toBeTruthy();

        const created = await client.createBooking(validBooking as any);
        await expectStatus(created.response, 200);

        // POST /booking returns { bookingid, booking }
        const bookingId = created.body.bookingid;
        expect(bookingId).toBeGreaterThan(0);

        const deleteRes = await client.deleteBooking(bookingId, authBody.token);
        expect([200, 201, 204]).toContain(deleteRes.response.status());
    });

    test('should fail to delete without authentication (negative)', async () => {
        const { client } = await createClient();

        // Create booking
        const created = await client.createBooking(validBooking as any);
        await expectStatus(created.response, 200);

        const bookingId = created.body.bookingid;
        expect(bookingId).toBeGreaterThan(0);

        const deleteRes = await client.deleteBooking(bookingId, '');
        expect([401, 403]).toContain(deleteRes.response.status());
    });
});
