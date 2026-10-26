import 'server-only';
import { createSupabasePublicClient } from './supabase/server';

// Solo para desarrollo sin Supabase: nombres de ejemplo para ver la cinta del home.
const EXAMPLE_NAMES = [
    'Ola Nordmann',
    'Kari Hansen',
    'Lucas Pereira',
    'Ingrid Berg',
    'Amir Haddad',
    'Sofie Johansen',
    'Mateo García',
    'Jonas Lie',
    'Emma Solberg',
    'Daniel Okafor',
];

/** Menos de esto y la cinta queda pobre: mejor no mostrarla. */
const MIN_NAMES = 6;

/**
 * Nombres de los miembros para la cinta del home (función member_names: solo el nombre).
 * Devuelve [] si hay error o pocos nombres, y la home no muestra la cinta.
 */
export async function getMemberNames(limit = 40): Promise<string[]> {
    const supabase = createSupabasePublicClient();
    if (!supabase) return EXAMPLE_NAMES;

    const { data, error } = await supabase.rpc('member_names', { p_limit: limit });
    if (error) {
        console.error('Error loading member names', error);
        return [];
    }
    const names = [...new Set((data ?? []).map((row) => row.full_name.trim()).filter(Boolean))];
    return names.length >= MIN_NAMES ? names : [];
}
