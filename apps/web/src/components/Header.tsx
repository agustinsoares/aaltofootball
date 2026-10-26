import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import LanguageSwitcher from './LanguageSwitcher';
import HeaderShell from './HeaderShell';
import Logo from './Logo';
import UserMenu from './UserMenu';

export default function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
    const links = [
        { href: `/${locale}/matches`, label: dict.nav.matches },
        { href: `/${locale}#how-it-works`, label: dict.nav.howItWorks },
        { href: `/${locale}#hosts`, label: dict.nav.hosts },
    ];

    return (
        <HeaderShell>
            <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-5">
                <Logo locale={locale} label={dict.nav.logoLabel} inverted />
                <nav aria-label={dict.nav.label} className="hidden md:block">
                    <ul className="flex items-center gap-1 text-sm font-medium">
                        {links.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="rounded-full px-3 py-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="flex items-center gap-2 sm:gap-3">
                    <Link
                        href={`/${locale}/matches`}
                        className="hidden text-sm font-medium sm:inline md:hidden"
                    >
                        {dict.nav.matches}
                    </Link>
                    <LanguageSwitcher current={locale} label={dict.nav.languageLabel} />
                    <UserMenu locale={locale} dict={dict.userMenu} />
                </div>
            </div>
        </HeaderShell>
    );
}
