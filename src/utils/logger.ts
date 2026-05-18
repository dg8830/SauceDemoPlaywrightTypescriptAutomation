/**
 * Minimal logger utility for consistent console output.
 * Extend later (e.g., use pino/winston) if needed.
 */

export function logInfo(message: string): void {
    // eslint-disable-next-line no-console
    console.log(`[INFO] ${message}`);
}

export function logError(message: string, err?: unknown): void {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, err ?? '');
}
