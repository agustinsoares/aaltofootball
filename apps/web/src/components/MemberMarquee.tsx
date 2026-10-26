/** Segundos por nombre: la velocidad se mantiene parecida con pocos o muchos nombres. */
const SECONDS_PER_NAME = 3;

/**
 * Cinta de nombres de miembros que se desplaza sin fin (estilos en globals.css, .marquee).
 * La lista se repite dos veces para que el bucle no tenga corte; la copia queda oculta
 * para los lectores de pantalla.
 */
export default function MemberMarquee({ title, names }: { title: string; names: string[] }) {
    if (!names.length) return null;

    const row = (hidden: boolean) => (
        <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
            {names.map((name, index) => (
                <li key={`${name}-${index}`} className="flex items-center">
                    <span className="px-5 text-lg font-medium whitespace-nowrap text-ink/70 sm:text-xl">
                        {name}
                    </span>
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent/70" />
                </li>
            ))}
        </ul>
    );

    return (
        <section aria-label={title} className="border-y border-black/5 py-10 sm:py-12">
            <p className="text-center text-xs font-semibold tracking-[0.3em] text-ink/45 uppercase">
                {title}
            </p>
            <div
                className="marquee mt-6 overflow-hidden"
                style={{ '--marquee-duration': `${names.length * SECONDS_PER_NAME}s` } as React.CSSProperties}
            >
                <div className="marquee-track">
                    {row(false)}
                    {row(true)}
                </div>
            </div>
        </section>
    );
}
