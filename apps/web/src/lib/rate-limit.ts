import 'server-only';
import { createHmac } from 'node:crypto';
import { headers } from 'next/headers';
import { createSupabaseAdminClient } from './supabase/admin';

/**
 * Límites por IP (y por email) para los formularios que se usan sin sesión: entrar, crear
 * cuenta, enlace por email y "olvidé mi contraseña". Los botones con sesión se limitan en la
 * base de datos (migración rate_limits).
 *
 * Supabase Auth ya tiene sus propios límites, pero ve todas las peticiones como si vinieran del
 * servidor de Vercel: un bot podría agotarlos para todos. Acá se cuenta por la IP real del
 * visitante, guardada cifrada (HMAC), nunca en claro.
 */
export const RATE_LIMITS = {
    signIn: { max: 10, windowSeconds: 5 * 60 },
    signUp: { max: 5, windowSeconds: 60 * 60 },
    magicLink: { max: 5, windowSeconds: 15 * 60 },
    passwordReset: { max: 5, windowSeconds: 15 * 60 },
    /** Emails a una misma dirección (enlace o nueva contraseña), para no bombardear a nadie. */
    emailToAddress: { max: 3, windowSeconds: 15 * 60 },
} as const;

export type RateLimitAction = keyof typeof RATE_LIMITS;

const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

/** IP del visitante según Vercel (x-forwarded-for). En local o en las pruebas no hay límite. */
export function clientIp(forwardedFor: string | null, realIp: string | null): string | null {
    const ip = (forwardedFor?.split(',')[0] ?? realIp ?? '').trim();
    if (!ip || LOOPBACK.has(ip)) return null;
    return ip;
}

function hashKey(value: string, secret: string): string {
    return createHmac('sha256', secret).update(value).digest('hex').slice(0, 32);
}

async function hit(action: RateLimitAction, subject: string): Promise<boolean> {
    const admin = createSupabaseAdminClient();
    const secret = process.env.SUPABASE_SECRET_KEY;
    // Sin la clave secreta (p. ej. un entorno de prueba) no se limita: mejor eso que bloquear a todos.
    if (!admin || !secret) return true;
    const { max, windowSeconds } = RATE_LIMITS[action];
    const { data, error } = await admin.rpc('rate_limit_hit', {
        p_key: `${action}:${hashKey(subject, secret)}`,
        p_max: max,
        p_window_seconds: windowSeconds,
    });
    if (error) {
        console.error('rate_limit_hit failed', error);
        return true;
    }
    return data !== false;
}

/**
 * Registra un intento de "action" desde la IP del visitante (y, si se pasa, para ese email).
 * Devuelve false si se pasó del límite: el formulario muestra "demasiados intentos".
 */
export async function allowRequest(action: RateLimitAction, email?: string): Promise<boolean> {
    const h = await headers();
    const ip = clientIp(h.get('x-forwarded-for'), h.get('x-real-ip'));
    if (ip && !(await hit(action, `ip:${ip}`))) return false;
    if (email && !(await hit('emailToAddress', `email:${email.toLowerCase()}`))) return false;
    return true;
}
