import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
const { geocodeAddress, resolveMapsCoords } = await import('../google-maps-server');

const redirect = (location: string) => new Response(null, { status: 302, headers: { location } });

afterEach(() => vi.unstubAllGlobals());

describe('resolveMapsCoords', () => {
    it('no hace peticiones si el link ya trae las coordenadas', async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
        await expect(resolveMapsCoords('https://www.google.com/maps/@60.39,5.32,15z')).resolves.toEqual({
            lat: 60.39,
            lng: 5.32,
        });
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('sigue la redirección de un link corto hasta las coordenadas', async () => {
        vi.stubGlobal(
            'fetch',
            vi
                .fn()
                .mockResolvedValue(
                    redirect('https://www.google.com/maps/place/Pitch/data=!4m2!3m1!8m2!3d60.3861!4d5.3285'),
                ),
        );
        await expect(resolveMapsCoords('https://maps.app.goo.gl/Abc123')).resolves.toEqual({
            lat: 60.3861,
            lng: 5.3285,
        });
    });

    it('no sigue redirecciones fuera de Google', async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce(redirect('https://evil.example/next'))
            .mockResolvedValue(redirect('https://www.google.com/maps/@60.39,5.32,15z'));
        vi.stubGlobal('fetch', fetchMock);
        await expect(resolveMapsCoords('https://maps.app.goo.gl/Abc123')).resolves.toBeNull();
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('devuelve null si la red falla', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
        await expect(resolveMapsCoords('https://maps.app.goo.gl/Abc123')).resolves.toBeNull();
    });
});

describe('geocodeAddress', () => {
    it('usa el primer resultado de OpenStreetMap', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json([{ lat: '60.368', lon: '5.359' }])));
        await expect(geocodeAddress('Stemmemyren, 5063 Bergen')).resolves.toEqual({
            lat: 60.368,
            lng: 5.359,
        });
    });

    it('devuelve null si no encuentra la dirección', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json([])));
        await expect(geocodeAddress('nowhere')).resolves.toBeNull();
    });
});
