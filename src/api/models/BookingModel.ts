/**
 * Booking domain models for Restful-Booker API.
 * Used for request/response typing + data integrity assertions.
 *
 * Restful-Booker API response shapes:
 *   POST /booking  -> { bookingid: number, booking: Booking }
 *   GET  /booking/:id -> Booking  (no id field)
 *   PUT  /booking/:id -> Booking  (no id field)
 *   GET  /booking  -> BookingSummary[]
 */

export interface BookingDates {
    checkin: string; // ISO date string (e.g. "2022-10-10")
    checkout: string; // ISO date string (e.g. "2022-10-20")
}

export interface Booking {
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: BookingDates;
    additionalneeds?: string;
}

/**
 * Response from POST /booking – wraps booking data + assigned id.
 */
export interface CreateBookingResponse {
    bookingid: number;
    booking: Booking;
}

/**
 * Response from GET /booking (list) – only contains the booking id.
 */
export interface BookingSummary {
    bookingid: number;
}

/**
 * Convenient auth token response typing.
 */
export interface AuthResponse {
    token: string;
}

/**
 * Auth request typing.
 */
export interface AuthRequest {
    username: string;
    password: string;
}
