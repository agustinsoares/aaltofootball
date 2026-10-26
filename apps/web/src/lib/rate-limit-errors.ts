/** Código que usa la base de datos (y la API, como HTTP 429) cuando alguien supera un límite. */
export const RATE_LIMITED_CODE = 'PT429';

export function isRateLimited(error: { code?: string } | null | undefined): boolean {
    return error?.code === RATE_LIMITED_CODE;
}
