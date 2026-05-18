import { APIResponse } from '@playwright/test';

/**
 * Response helpers for consistent assertions.
 * Keep them small + reusable for team enablement.
 */

export async function expectStatus(response: APIResponse, expectedStatus: number): Promise<void> {
    if (response.status() !== expectedStatus) {
        const bodyText = await response.text().catch(() => '');
        throw new Error(
            `Expected status ${expectedStatus} but got ${response.status()}. Body:\n${bodyText}`
        );
    }
}

export async function getJson<T>(response: APIResponse): Promise<T> {
    return (await response.json()) as T;
}

export function hasNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}
