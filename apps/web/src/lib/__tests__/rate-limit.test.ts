import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({ headers: vi.fn() }));
const { clientIp } = await import('../rate-limit');
const { isRateLimited } = await import('../rate-limit-errors');

describe('clientIp', () => {
    it('usa la primera IP de x-forwarded-for (la del visitante, según Vercel)', () => {
        expect(clientIp('203.0.113.7, 10.0.0.1', null)).toBe('203.0.113.7');
        expect(clientIp(null, '198.51.100.2')).toBe('198.51.100.2');
    });

    it('no limita en local ni sin IP (pruebas y desarrollo)', () => {
        expect(clientIp('127.0.0.1', null)).toBeNull();
        expect(clientIp('::1', null)).toBeNull();
        expect(clientIp(null, null)).toBeNull();
        expect(clientIp('', '')).toBeNull();
    });
});

describe('isRateLimited', () => {
    it('reconoce el código PT429 de la base de datos', () => {
        expect(isRateLimited({ code: 'PT429' })).toBe(true);
        expect(isRateLimited({ code: 'P0001' })).toBe(false);
        expect(isRateLimited(null)).toBe(false);
    });
});
