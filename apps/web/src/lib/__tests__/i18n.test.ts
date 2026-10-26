import { describe, expect, it } from 'vitest';
import { localeAlternates, localeFromAcceptLanguage } from '@/i18n/config';

describe('localeFromAcceptLanguage', () => {
    it('elige español para cualquier variante de es', () => {
        expect(localeFromAcceptLanguage('es-AR,es;q=0.9,en;q=0.8')).toBe('es');
        expect(localeFromAcceptLanguage('es')).toBe('es');
    });

    it('respeta la prioridad (q) entre idiomas', () => {
        expect(localeFromAcceptLanguage('en;q=0.5,es;q=0.9')).toBe('es');
        expect(localeFromAcceptLanguage('nn,es;q=0.8')).toBe('nb');
    });

    it('cae en inglés si no hay un idioma conocido', () => {
        expect(localeFromAcceptLanguage('fr-FR,de;q=0.8')).toBe('en');
        expect(localeFromAcceptLanguage(null)).toBe('en');
    });
});

describe('localeAlternates', () => {
    it('genera un enlace por idioma', () => {
        expect(localeAlternates('/matches')).toEqual({
            en: '/en/matches',
            nb: '/nb/matches',
            es: '/es/matches',
        });
    });
});
