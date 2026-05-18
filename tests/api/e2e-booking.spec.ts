import { test, expect, request as playwrightRequest } from '@playwright/test';
import { BookingAPIClient } from '../../src/api/clients/BookingAPIClient';
import { validAuth, validBooking } from '../../src/api/fixtures/apiTestData';
import { expectStatus } from '../../src/api/utils/apiHelpers';

test.describe('API - E2E Booking Lifecycle', () => {
    test('should complete Create → Update → Verify → Delete', async () => {
        const apiRequest = await playwrightRequest.newContext({
            baseURL: process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com',
        });
        const client = new BookingAPIClient(apiRequest);

        // Auth
        const { response: authResp, body: authBody } = await client.createToken(validAuth);
        await expectStatus(authResp, 200);
        expect(authBody.token).toBeTruthy();
        const token = authBody.token;

        // Create — POST /booking returns { bookingid, booking }
        const created = await client.createBooking({ ...validBooking } as any);
        await expectStatus(created.response, 200);
        const bookingId = created.body.bookingid;
        expect(bookingId).toBeGreaterThan(0);

        // Verify (GET by id) — returns Booking without id
        const getRes = await client.getBookingById(bookingId);
        await expectStatus(getRes.response, 200);
        expect(getRes.body.firstname).toBe(validBooking.firstname);
        expect(getRes.body.lastname).toBe(validBooking.lastname);

        // Update (PUT)
        const updatePayload = {
            ...validBooking,
            firstname: 'UpdatedFirst',
            lastname: 'UpdatedLast',
        };
        const updated = await client.updateBooking(bookingId, updatePayload as any, token);
        await expectStatus(updated.response, 200);

        // Verify update — PUT returns Booking without id
        expect(updated.body.firstname).toBe('UpdatedFirst');
        expect(updated.body.lastname).toBe('UpdatedLast');

        const afterUpdate = await client.getBookingById(bookingId);
        await expectStatus(afterUpdate.response, 200);
        expect(afterUpdate.body.firstname).toBe('UpdatedFirst');

        // Delete
        const deleted = await client.deleteBooking(bookingId, token);
        expect([200, 201, 204]).toContain(deleted.response.status());

        // Verify deletion (negative)
        const deletedCheck = await client.getBookingById(bookingId);
        await expectStatus(deletedCheck.response, 404);
    });
});
