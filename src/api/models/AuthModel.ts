/**
 * Auth request/response typing for Restful-Booker API.
 */

export interface AuthRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}
