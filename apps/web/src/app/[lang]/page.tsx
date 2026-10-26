import Image from 'next/image';
import Link from 'next/link';
import type { ComponentType, SVGProps } from 'react';
import MatchCard from '@/components/MatchCard';
import MemberMarquee from '@/components/MemberMarquee';
import { Alert } from '@/components/ui';
import { CalendarIcon, ClockIcon, ShareIcon, StarIcon, UsersIcon } from '@/components/icons';
import { getDictionary } from '@/i18n/dictionaries';
import { isLocale } from '@/i18n/config';
import { getUpcomingMatches } from '@/lib/matches';
import { getMemberNames } from '@/lib/members';
import { notFound } from 'next/navigation';
import heroImage from '../../../public/images/hero.webp';

// Los partidos cambian a lo largo del día: regeneramos la página como mucho cada 5 minutos.
export const revalidate = 300;

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

const HOST_ICONS: IconType[] = [CalendarIcon, UsersIcon, ShareIcon, StarIcon];

function FeatureIcon({ icon: IconComponent }: { icon: IconType }) {
    return (
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary-strong">
            <IconComponent className="h-5 w-5" />
        </span>
    );
}

export default async function HomePage({ params, searchParams }: PageProps<'/[lang]'>) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();
    const dict = await getDictionary(lang);
    const [{ matches, isExample }, memberNames] = await Promise.all([
        getUpcomingMatches(6),
        getMemberNames(),
    ]);
    const accountDeleted = (await searchParams).deleted === '1';

    return (
        <>
            {accountDeleted && (
                <div className="mx-auto max-w-6xl px-4 pt-6">
                    <Alert tone="success">{dict.account.deleted}</Alert>
                </div>
            )}
            {/* Hero */}
            <section className="relative isolate overflow-hidden bg-ink">
                <Image
                    src={heroImage}
                    alt=""
                    fill
                    priority
                    placeholder="blur"
                    sizes="100vw"
                    className="-z-10 object-cover object-[70%_center]"
                />
                <div className="absolute inset-0 -z-10 bg-linear-to-r from-primary-strong/95 via-primary-strong/70 to-primary-strong/10" />
                <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-linear-to-t from-black/30 to-transparent" />
                <div className="mx-auto max-w-6xl px-4 py-24 sm:py-36">
                    <div className="hero-intro max-w-xl text-white">
                        <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-white/90 uppercase backdrop-blur-sm">
                            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-white/70" />
                            {dict.hero.eyebrow}
                        </p>
                        <h1 className="mt-6 text-4xl leading-tight sm:text-6xl sm:leading-[1.05]">
                            <span className="underline decoration-white/60 decoration-2 underline-offset-8">
                                {dict.hero.titleStart}
                            </span>
                            <span className="block text-[0.82em]">{dict.hero.titleEnd}</span>
                        </h1>
                        <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">
                            {dict.hero.subtitle}
                        </p>
                        <div className="mt-10 flex flex-wrap gap-3">
                            <Link
                                href={`/${lang}/matches`}
                                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-strong"
                            >
                                {dict.hero.ctaFind}
                                <span
                                    aria-hidden="true"
                                    className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                                >
                                    →
                                </span>
                            </Link>
                            <Link
                                href={`/${lang}/matches/new`}
                                className="rounded-full border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                            >
                                {dict.hero.ctaHost}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <MemberMarquee title={dict.members.title} names={memberNames} />

            {/* How it works */}
            <section id="how-it-works" className="py-20 sm:py-28">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="reveal max-w-2xl">
                        <h2 className="text-3xl font-semibold sm:text-4xl">{dict.howItWorks.title}</h2>
                        <p className="mt-3 text-lg text-ink/70">{dict.howItWorks.subtitle}</p>
                    </div>
                    <ol className="reveal-children mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
                        {dict.howItWorks.steps.map((step, index) => (
                            <li key={step.title} className="border-t border-black/10 pt-6">
                                <span className="font-display text-sm text-primary">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                                <p className="mt-2 leading-relaxed text-ink/70">{step.text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* Matches */}
            <section id="matches" className="bg-surface py-20 sm:py-28">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="reveal flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-semibold sm:text-4xl">{dict.matches.title}</h2>
                            {isExample && <p className="mt-3 text-lg text-ink/70">{dict.matches.subtitle}</p>}
                        </div>
                        {isExample && (
                            <p className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-sm font-medium text-ink/75">
                                <ClockIcon className="h-4 w-4" />
                                {dict.matches.examplesBadge}
                            </p>
                        )}
                    </div>
                    <div className="reveal-children mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {matches.map((match) => (
                            <MatchCard key={match.id} match={match} locale={lang} dict={dict} />
                        ))}
                    </div>
                    {!isExample && (
                        <div className="mt-12 text-center">
                            <Link
                                href={`/${lang}/matches`}
                                className="inline-block rounded-full border border-black/15 bg-white px-6 py-3 font-semibold transition-colors hover:border-black/25"
                            >
                                {dict.matchList.viewAll}
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Hosts */}
            <section id="hosts" className="py-20 sm:py-28">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="reveal max-w-2xl">
                        <h2 className="text-3xl font-semibold sm:text-4xl">{dict.hosts.title}</h2>
                        <p className="mt-3 text-lg text-ink/70">{dict.hosts.subtitle}</p>
                    </div>
                    <ul className="reveal-children mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                        {dict.hosts.features.map((feature, index) => (
                            <li key={feature.title}>
                                <FeatureIcon icon={HOST_ICONS[index]} />
                                <h3 className="mt-5 font-semibold">{feature.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-ink/70">{feature.text}</p>
                            </li>
                        ))}
                    </ul>
                    <div className="reveal relative isolate mt-20 overflow-hidden rounded-3xl bg-primary-strong px-6 py-14 text-center text-white sm:px-12 sm:py-16">
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_0%,rgb(29_63_143/0.9),transparent)]"
                        />
                        <p className="font-display text-3xl sm:text-4xl">{dict.hosts.bannerTitle}</p>
                        <p className="mx-auto mt-4 max-w-xl text-lg text-white/75">{dict.hosts.bannerText}</p>
                        <Link
                            href={`/${lang}/matches/new`}
                            className="mt-8 inline-block rounded-full bg-accent px-7 py-3 font-semibold text-white transition-colors hover:bg-accent-strong"
                        >
                            {dict.hosts.bannerCta}
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
