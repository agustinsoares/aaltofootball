import { describe, expect, it } from 'vitest';
import {
    coordsFromMapsUrl,
    isGoogleHost,
    isGoogleMapsUrl,
    isShortMapsUrl,
    mapsUrlFromCoords,
} from '../google-maps';

describe('isGoogleMapsUrl', () => {
    it('acepta links completos y cortos de Google Maps', () => {
        expect(isGoogleMapsUrl('https://maps.app.goo.gl/AbCdEf123')).toBe(true);
        expect(isGoogleMapsUrl('https://goo.gl/maps/AbCdEf123')).toBe(true);
        expect(isGoogleMapsUrl('https://www.google.com/maps/place/X/@60.38,5.32,17z')).toBe(true);
        expect(isGoogleMapsUrl('https://www.google.no/maps/@60.38,5.32,15z')).toBe(true);
        expect(isGoogleMapsUrl('https://maps.google.com/?q=60.38,5.32')).toBe(true);
    });

    it('rechaza otros sitios, http y texto suelto', () => {
        expect(isGoogleMapsUrl('https://evil.example/maps/@60,5')).toBe(false);
        expect(isGoogleMapsUrl('https://google.com.evil.example/maps')).toBe(false);
        expect(isGoogleMapsUrl('http://www.google.com/maps/@60.38,5.32')).toBe(false);
        expect(isGoogleMapsUrl('https://www.google.com/search?q=pitch')).toBe(false);
        expect(isGoogleMapsUrl('Nygårdsparken')).toBe(false);
    });

    it('reconoce dominios de Google para seguir redirecciones', () => {
        expect(isGoogleHost('www.google.com')).toBe(true);
        expect(isGoogleHost('consent.google.com')).toBe(true);
        expect(isGoogleHost('maps.app.goo.gl')).toBe(true);
        expect(isGoogleHost('google.com.evil.example')).toBe(false);
        expect(isGoogleHost('evilgoogle.com')).toBe(false);
    });

    it('distingue los links cortos', () => {
        expect(isShortMapsUrl('https://maps.app.goo.gl/AbCdEf123')).toBe(true);
        expect(isShortMapsUrl('https://www.google.com/maps/@60.38,5.32,15z')).toBe(false);
    });
});

describe('coordsFromMapsUrl', () => {
    it('prefiere el marcador del lugar (!3d…!4d…) al centro de la vista (@…)', () => {
        const url =
            'https://www.google.com/maps/place/Nyg%C3%A5rdsparken/@60.3858,5.3270,17z/data=!3m1!4b1!4m6!3m5!1s0x0:0x0!8m2!3d60.3861!4d5.3285';
        expect(coordsFromMapsUrl(url)).toEqual({ lat: 60.3861, lng: 5.3285 });
    });

    it('lee la vista, los parámetros de búsqueda y los links armados con coordenadas', () => {
        expect(coordsFromMapsUrl('https://www.google.com/maps/@60.3913,5.3221,15z')).toEqual({
            lat: 60.3913,
            lng: 5.3221,
        });
        expect(coordsFromMapsUrl('https://maps.google.com/?q=60.368,5.359')).toEqual({
            lat: 60.368,
            lng: 5.359,
        });
        expect(coordsFromMapsUrl('https://www.google.com/maps/search/60.368,+5.359')).toEqual({
            lat: 60.368,
            lng: 5.359,
        });
        expect(coordsFromMapsUrl(mapsUrlFromCoords({ lat: 60.368, lng: 5.359 }))).toEqual({
            lat: 60.368,
            lng: 5.359,
        });
    });

    it('devuelve null si el link no trae coordenadas válidas', () => {
        expect(coordsFromMapsUrl('https://www.google.com/maps/search/Nyg%C3%A5rdsparken')).toBeNull();
        expect(coordsFromMapsUrl('https://maps.app.goo.gl/AbCdEf123')).toBeNull();
        expect(coordsFromMapsUrl('https://www.google.com/maps/@95.1,5.3,15z')).toBeNull();
    });
});
