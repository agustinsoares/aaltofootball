'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, type MouseEvent } from 'react';
import { LOCALE_COOKIE, LOCALE_NAMES, LOCALE_SHORT, LOCALES, type Locale } from '@/i18n/config';

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Si la página nueva tarda más que esto, la transición termina igual (y se ve sin animar). */
const MAX_WAIT_MS = 4000;

/**
 * Fundido entre idiomas (estilos en globals.css, "locale-change"): el navegador congela la
 * página actual, Next navega a la otra versión y, cuando ya se ve, la vieja se desvanece y la
 * nueva aparece. Se guarda fuera del componente porque el selector puede volver a montarse al
 * cambiar de idioma.
 */
let finishLocaleTransition: (() => void) | null = null;

function navigateWithFade(event: MouseEvent<HTMLAnchorElement>, navigate: () => void) {
    if (
        typeof document.startViewTransition !== 'function' ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.button !== 0
    ) {
        return; // Sin soporte o abriendo en otra pestaña: navegación normal del <Link>.
    }
    event.preventDefault();
    document.startViewTransition({
        types: ['locale-change'],
        update: () =>
            new Promise<void>((resolve) => {
                const timeout = window.setTimeout(resolve, MAX_WAIT_MS);
                finishLocaleTransition = () => {
                    window.clearTimeout(timeout);
                    resolve();
                };
                navigate();
            }),
    });
}

function pathForLocale(pathname: string, locale: Locale): string {
    const segments = pathname.split('/');
    // segments[0] es '' y segments[1] es el idioma actual.
    segments[1] = locale;
    return segments.join('/') || `/${locale}`;
}

/** Guarda el idioma elegido para la próxima visita (lo lee proxy.ts). */
function rememberLocale(locale: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}

export default function LanguageSwitcher({ current, label }: { current: Locale; label: string }) {
    const pathname = usePathname() ?? `/${current}`;
    const router = useRouter();
    const detailsRef = useRef<HTMLDetailsElement>(null);

    // La versión nueva ya está en el DOM: que arranque el fundido. (No usar requestAnimationFrame:
    // mientras dura la actualización de la View Transition el navegador no pinta frames.)
    useEffect(() => {
        if (!finishLocaleTransition) return;
        const finish = finishLocaleTransition;
        finishLocaleTransition = null;
        finish();
    }, [current]);

    const onLocaleClick = (event: MouseEvent<HTMLAnchorElement>, locale: Locale) => {
        rememberLocale(locale);
        if (locale === current) return;
        // Misma página en otro idioma: se mantiene donde estaba el usuario.
        navigateWithFade(event, () => router.push(pathForLocale(pathname, locale), { scroll: false }));
    };

    // Cierra el menú del móvil al cambiar de página.
    useEffect(() => {
        detailsRef.current?.removeAttribute('open');
    }, [pathname]);

    return (
        <nav aria-label={label} className="text-xs font-semibold">
            {/* Móvil: solo el idioma actual y un menú, para que entre junto al logo y "Entrar". */}
            <details ref={detailsRef} className="relative sm:hidden">
                <summary className="flex cursor-pointer list-none items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 [&::-webkit-details-marker]:hidden">
                    {LOCALE_SHORT[current]}
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-3.5 w-3.5 opacity-70"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </summary>
                <ul className="absolute right-0 mt-2 w-36 overflow-hidden rounded-xl border border-black/10 bg-white py-1 text-sm font-medium text-ink shadow-lg">
                    {LOCALES.map((locale) => (
                        <li key={locale}>
                            <Link
                                href={pathForLocale(pathname, locale)}
                                hrefLang={locale}
                                lang={locale}
                                aria-current={locale === current ? 'true' : undefined}
                                onClick={(event) => onLocaleClick(event, locale)}
                                className={`block px-4 py-2 hover:bg-surface ${locale === current ? 'text-primary-strong' : ''}`}
                            >
                                {LOCALE_NAMES[locale]}
                            </Link>
                        </li>
                    ))}
                </ul>
            </details>

            {/* Desde sm: todos los idiomas a la vista. */}
            <div className="hidden items-center rounded-lg bg-white/10 p-0.5 sm:flex">
                {LOCALES.map((locale) => {
                    const active = locale === current;
                    return (
                        <Link
                            key={locale}
                            href={pathForLocale(pathname, locale)}
                            hrefLang={locale}
                            lang={locale}
                            aria-current={active ? 'true' : undefined}
                            title={LOCALE_NAMES[locale]}
                            onClick={(event) => onLocaleClick(event, locale)}
                            className={`rounded-md px-2 py-1 uppercase transition-colors ${
                                active ? 'bg-white text-ink' : 'text-white/80 hover:text-white'
                            }`}
                        >
                            {LOCALE_SHORT[locale]}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
