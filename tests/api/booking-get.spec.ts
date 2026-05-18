import { test, expect, request as playwrightRequest } from '@playwright/test';
import { BookingAPIClient } from '../../src/api/clients/BookingAPIClient';
import { validAuth } from '../../src/api/fixtures/apiTestData';
import { expectStatus } from '../../src/api/utils/apiHelpers';

async function createClient() {
    const apiRequest = await playwrightRequest.newContext({
        baseURL: process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com',
    });
    const client = new BookingAPIClient(apiRequest);
    return { apiRequest, client };
}

test.describe('API - Booking Management - GET (/booking)', () => {
    test('should get all bookings (positive)', async () => {
        const { client } = await createClient();
        const { response } = await client.getAllBookings();

        await expectStatus(response, 200);
    });

    test('should return 404 for non-existent booking (negative)', async () => {
        const { client } = await createClient();
        const nonExistentId = 9999999;

        const { response } = await client.getBookingById(nonExistentId);
        await expectStatus(response, 404);
    });

    test('should get specific booking by ID (positive)', async () => {
        // Create a booking first so we have a valid ID (keeps test self-contained).
        const { client } = await createClient();
        const { response: authResp, body: authBody } = await client.createToken(validAuth);

        await expectStatus(authResp, 200);
        expect(authBody.token).toBeTruthy();

        const bookingPayload = {
            firstname: 'Jane',
            lastname: 'Doe',
            totalprice: 321,
            depositpaid: true,
            bookingdates: { checkin: '2022-10-10', checkout: '2022-10-20' },
            additionalneeds: 'Lunch',
        };

        const createRes = await client.createBooking(bookingPayload as any);
        await expectStatus(createRes.response, 200);

        // POST /booking returns { bookingid, booking }
        const bookingId = createRes.body.bookingid;
        expect(bookingId).toBeGreaterThan(0);

        // GET /booking/:id returns the Booking object (no id field)
        const getRes = await client.getBookingById(bookingId);
        await expectStatus(getRes.response, 200);
        expect(getRes.body.firstname).toBe('Jane');
        expect(getRes.body.lastname).toBe('Doe');
    });
});
