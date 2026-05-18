import { APIRequestContext, APIResponse } from '@playwright/test';
import { AuthRequest, AuthResponse } from '../models/AuthModel';
import { Booking, CreateBookingResponse, BookingSummary } from '../models/BookingModel';

/**
 * Booking API Client encapsulates all Restful-Booker calls.
 * Uses Playwright's request context under the hood.
 */
export class BookingAPIClient {
    private readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    /**
     * Safely parse JSON responses. Falls back to empty object when
     * the response is not JSON (e.g. "Forbidden" plain text on 403).
     */
    private async parseJson<T>(response: APIResponse): Promise<T> {
        try {
            return (await response.json()) as T;
        } catch {
            return {} as T;
        }
    }

    async createToken(credentials: AuthRequest): Promise<{ response: APIResponse; body: AuthResponse }> {
        const response = await this.request.post('/auth', {
            data: credentials,
            headers: { 'Content-Type': 'application/json' },
        });

        const body = await this.parseJson<AuthResponse>(response);
        return { response, body };
    }

    async getAllBookings(params?: Record<string, string | number>): Promise<{ response: APIResponse; body: BookingSummary[] }> {
        const response = await this.request.get('/booking', { params });
        const body = await this.parseJson<BookingSummary[]>(response);
        return { response, body };
    }

    async getBookingById(
        id: number
    ): Promise<{ response: APIResponse; body: Booking }> {
        const response = await this.request.get(`/booking/${id}`);
        const body = await this.parseJson<Booking>(response);
        return { response, body };
    }

    async createBooking(bookingData: Booking): Promise<{ response: APIResponse; body: CreateBookingResponse }> {
        const response = await this.request.post('/booking', {
            data: bookingData,
            headers: { 'Content-Type': 'application/json' },
        });
        const body = await this.parseJson<CreateBookingResponse>(response);
        return { response, body };
    }

    async updateBooking(
        id: number,
        bookingData: Booking,
        token: string
    ): Promise<{ response: APIResponse; body: Booking }> {
        const response = await this.request.put(`/booking/${id}`, {
            data: bookingData,
            headers: {
                'Content-Type': 'application/json',
                Cookie: `token=${token}`,
            },
        });
        const body = await this.parseJson<Booking>(response);
        return { response, body };
    }

    async partialUpdateBooking(
        id: number,
        bookingData: Partial<Booking>,
        token: string
    ): Promise<{ response: APIResponse; body: Booking }> {
        const response = await this.request.patch(`/booking/${id}`, {
            data: bookingData,
            headers: {
                'Content-Type': 'application/json',
                Cookie: `token=${token}`,
            },
        });
        const body = await this.parseJson<Booking>(response);
        return { response, body };
    }

    async deleteBooking(id: number, token: string): Promise<{ response: APIResponse; bodyText: string }> {
        const response = await this.request.delete(`/booking/${id}`, {
            headers: {
                Cookie: `token=${token}`,
            },
        });

        // Restful-Booker sometimes returns empty body. Keep it resilient.
        const bodyText = await response.text().catch(() => '');
        return { response, bodyText };
    }
}
