import { test, expect, request as playwrightRequest } from '@playwright/test';
import { BookingAPIClient } from '../../src/api/clients/BookingAPIClient';
import { validAuth, invalidBookingMissingFields, validBooking } from '../../src/api/fixtures/apiTestData';
import { expectStatus } from '../../src/api/utils/apiHelpers';

async function createClient() {
    const apiRequest = await playwrightRequest.newContext({
        baseURL: process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com',
    });
    return { apiRequest, client: new BookingAPIClient(apiRequest) };
}

test.describe('API - Booking Management - POST & PUT (/booking)', () => {
    test('@smoke should create new booking (positive)', async () => {
        const { client } = await createClient();
        const { response: authResp, body: authBody } = await client.createToken(validAuth);

        await expectStatus(authResp, 200);
        expect(authBody.token).toBeTruthy();

        const createRes = await client.createBooking(validBooking as any);
        await expectStatus(createRes.response, 200);

        // POST /booking returns { bookingid: number, booking: { ... } }
        expect(createRes.body.bookingid).toBeGreaterThan(0);
        expect(createRes.body.booking.firstname).toBe(validBooking.firstname);
        expect(createRes.body.booking.lastname).toBe(validBooking.lastname);
    });

    test('should update existing booking (positive)', async () => {
        const { client } = await createClient();
        const { body: authBody } = await client.createToken(validAuth);
        const token = authBody.token;

        const created = await client.createBooking(validBooking as any);
        await expectStatus(created.response, 200);

        const bookingId = created.body.bookingid;

        const updatePayload = {
            ...validBooking,
            firstname: 'UpdatedFirst',
            lastname: 'UpdatedLast',
        };

        const updateRes = await client.updateBooking(bookingId, updatePayload as any, token);
        await expectStatus(updateRes.response, 200);

        // PUT returns the updated Booking object without an id field
        expect(updateRes.body.firstname).toBe('UpdatedFirst');
        expect(updateRes.body.lastname).toBe('UpdatedLast');
    });

    test('should fail to create booking with invalid data (negative)', async () => {
        const { client } = await createClient();

        // Restful-Booker expects full body; sending invalid shape should yield 400/422.
        const badPayload = invalidBookingMissingFields as any;

        const res = await client.createBooking(badPayload);
        // Restful-Booker may return 500 (Internal Server Error) for malformed payloads
        expect([400, 422, 500]).toContain(res.response.status());
    });

    test('should fail to update without authentication (negative)', async () => {
        const { client } = await createClient();

        const created = await client.createBooking(validBooking as any);
        await expectStatus(created.response, 200);

        const bookingId = created.body.bookingid;

        // Call updateBooking with empty token (effectively unauthenticated)
        const updateRes = await client.updateBooking(
            bookingId,
            { ...validBooking, firstname: 'NoAuth' } as any,
            '',
        );

        expect([401, 403]).toContain(updateRes.response.status());
    });
});
