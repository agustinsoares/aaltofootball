'use client';

import { useEffect, useState, type ReactNode } from 'react';

/** Píxeles de scroll a partir de los cuales la barra se despega de los bordes. */
const FLOAT_AFTER = 24;

/**
 * Contenedor de la cabecera. Arriba de todo ocupa el ancho completo; al bajar se despega de los
 * costados y queda flotando como una píldora (estilos en globals.css, .site-header).
 * El header mide siempre lo mismo, así que flotar no mueve el contenido.
 */
export default function HeaderShell({ children }: { children: ReactNode }) {
    const [floating, setFloating] = useState(false);

    useEffect(() => {
        const update = () => setFloating(window.scrollY > FLOAT_AFTER);
        update();
        window.addEventListener('scroll', update, { passive: true });
        return () => window.removeEventListener('scroll', update);
    }, []);

    return (
        <header className="site-header" data-floating={floating || undefined}>
            <div className="site-header-bar">{children}</div>
        </header>
    );
}
