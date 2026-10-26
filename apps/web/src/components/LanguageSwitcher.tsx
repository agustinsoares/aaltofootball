'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { LOCALE_COOKIE, LOCALE_NAMES, LOCALE_SHORT, LOCALES, type Locale } from '@/i18n/config';

const ONE_YEAR = 60 * 60 * 24 * 365;

function pathForLocale(pathname: string, locale: Locale): string {
    const segments = pathname.split('/');
    // segments[0] es '' y segments[1] es el idioma actual.
    segments[1] = locale;
    return segments.join('/') || `/${locale}`;
}

export default function LanguageSwitcher({ current, label }: { current: Locale; label: string }) {
    const pathname = usePathname() ?? `/${current}`;
    const detailsRef = useRef<HTMLDetailsElement>(null);

    // Cierra el menú del móvil al cambiar de página.
    useEffect(() => {
        detailsRef.current?.removeAttribute('open');
    }, [pathname]);

    const rememberLocale = (locale: Locale) => {
        document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
    };

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
                                onClick={() => rememberLocale(locale)}
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
                            onClick={() => rememberLocale(locale)}
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
