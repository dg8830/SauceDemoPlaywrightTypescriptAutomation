import { Booking } from '../models/BookingModel';
import { AuthRequest } from '../models/AuthModel';

/**
 * Centralized API test data.
 * Keep sensitive values in env vars when applicable.
 */

export const validAuth: AuthRequest = {
    username: process.env.API_USERNAME ?? 'admin',
    password: process.env.API_PASSWORD ?? 'password123',
};

export const invalidAuth: AuthRequest = {
    username: process.env.API_USERNAME ?? 'admin',
    password: 'wrong-password',
};

export const validBooking: Booking = {
    firstname: 'John',
    lastname: 'Doe',
    totalprice: 123.45,
    depositpaid: true,
    bookingdates: {
        checkin: '2022-10-10',
        checkout: '2022-10-20',
    },
    additionalneeds: 'Breakfast',
};

export const invalidBookingMissingFields = {
    // Missing required fields to trigger 400
    firstname: '',
};
