import 'server-only';
import { coordsFromMapsUrl, isGoogleHost, isShortMapsUrl, type Coords } from './google-maps';

const MAX_REDIRECTS = 4;
const TIMEOUT_MS = 5000;

/**
 * Coordenadas de un link de Google Maps. Los links cortos de "Compartir"
 * (maps.app.goo.gl/…) no las traen: se siguen las redirecciones hasta el link completo.
 */
export async function resolveMapsCoords(url: string): Promise<Coords | null> {
    const direct = coordsFromMapsUrl(url);
    if (direct || !isShortMapsUrl(url)) return direct;

    let current = url;
    for (let i = 0; i < MAX_REDIRECTS; i++) {
        let response: Response;
        try {
            response = await fetch(current, {
                redirect: 'manual',
                signal: AbortSignal.timeout(TIMEOUT_MS),
            });
        } catch {
            return null;
        }
        const location = response.headers.get('location');
        if (!location) return null;
        current = new URL(location, current).toString();
        const coords = coordsFromMapsUrl(current);
        if (coords) return coords;
        // Solo se siguen redirecciones dentro de Google.
        const host = new URL(current).hostname;
        if (!isGoogleHost(host)) return null;
    }
    return null;
}

/**
 * Respaldo si el link no trae coordenadas: busca la dirección de la cancha en OpenStreetMap
 * (Nominatim). Solo lo usan los admins al guardar una cancha, así que respeta de sobra el
 * límite de uso de Nominatim (1 consulta por segundo).
 */
export async function geocodeAddress(address: string, city = 'Bergen'): Promise<Coords | null> {
    const query = `${address}, ${city}, Norway`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'AaltoFootball/1.0 (pitch admin)', 'Accept-Language': 'en' },
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!response.ok) return null;
        const results = (await response.json()) as { lat?: string; lon?: string }[];
        const lat = Number(results[0]?.lat);
        const lng = Number(results[0]?.lon);
        return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
    } catch {
        return null;
    }
}
