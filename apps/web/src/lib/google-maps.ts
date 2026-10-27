/**
 * Links de Google Maps de las canchas: el admin pega el link y de ahí salen las coordenadas
 * que usan el mapa de partidos, el mapa de cada partido y el calendario (.ics).
 */

export interface Coords {
    lat: number;
    lng: number;
}

const NUM = '(-?\\d{1,3}(?:\\.\\d+)?)';

// En orden de precisión: el pin del lugar (!3d…!4d…) es el punto exacto; "@lat,lng" es el
// centro de la vista, y los parámetros de búsqueda son lo que se escribió.
const PATTERNS = [
    new RegExp(`!3d${NUM}!4d${NUM}`),
    new RegExp(`[?&](?:q|query|ll|destination|center|daddr)=(?:loc:)?${NUM},\\s*\\+?${NUM}`),
    new RegExp(`/(?:place|search|dir)/${NUM},\\s*\\+?${NUM}`),
    new RegExp(`@${NUM},${NUM}`),
];

// google.com, google.no, google.co.uk, google.com.ar… (y no "google.com.evil.example").
const GOOGLE_HOST = /^(?:www\.)?google\.(?:[a-z]{2,3}|com?\.[a-z]{2})$/;

/** ¿Es un dominio de Google (incluidos consent.google.… y el acortador goo.gl)? */
export function isGoogleHost(host: string): boolean {
    const h = host.toLowerCase();
    return h === 'goo.gl' || h === 'maps.app.goo.gl' || GOOGLE_HOST.test(h.replace(/^[a-z]+\./, 'www.'));
}

/** ¿Es un link de Google Maps? (completo o corto de "Compartir"). */
export function isGoogleMapsUrl(value: string): boolean {
    let url: URL;
    try {
        url = new URL(value);
    } catch {
        return false;
    }
    if (url.protocol !== 'https:') return false;
    const host = url.hostname.toLowerCase();
    if (host === 'maps.app.goo.gl') return true;
    if (host === 'goo.gl' && url.pathname.startsWith('/maps')) return true;
    if (GOOGLE_HOST.test(host.replace(/^maps\./, 'www.'))) {
        return host.startsWith('maps.') || url.pathname.startsWith('/maps');
    }
    return false;
}

/** Link corto de "Compartir" (hay que seguir la redirección para ver las coordenadas). */
export function isShortMapsUrl(value: string): boolean {
    try {
        const host = new URL(value).hostname.toLowerCase();
        return host === 'maps.app.goo.gl' || host === 'goo.gl';
    } catch {
        return false;
    }
}

function valid({ lat, lng }: Coords): boolean {
    return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
}

/** Saca las coordenadas de un link completo de Google Maps, o null si no las trae. */
export function coordsFromMapsUrl(value: string): Coords | null {
    let text = value;
    try {
        text = decodeURIComponent(value);
    } catch {
        // Si no se puede decodificar, se busca en el texto tal cual.
    }
    for (const pattern of PATTERNS) {
        const match = text.match(pattern);
        if (!match) continue;
        const coords = { lat: Number(match[1]), lng: Number(match[2]) };
        if (valid(coords)) return coords;
    }
    return null;
}

/** Link para ver la cancha en Google Maps a partir de sus coordenadas. */
export function mapsUrlFromCoords({ lat, lng }: Coords): string {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
