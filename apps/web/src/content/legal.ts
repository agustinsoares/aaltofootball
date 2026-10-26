import type { Locale } from '@/i18n/config';

// Textos legales (privacidad y términos) en inglés, noruego y español.
// Borrador redactado para el RGPD/personopplysningsloven: conviene que lo revise un abogado
// antes del lanzamiento. {email} se sustituye por NEXT_PUBLIC_CONTACT_EMAIL.

export interface LegalSection {
    heading: string;
    paragraphs?: string[];
    list?: string[];
}

export interface LegalDoc {
    title: string;
    updated: string;
    intro: string;
    sections: LegalSection[];
}

export const LEGAL_UPDATED = '2026-10-06';

const privacyEn: LegalDoc = {
    title: 'Privacy policy',
    updated: 'Last updated: 26 October 2026',
    intro: 'Aalto Football helps people in Bergen find and organise pick-up football matches. This policy explains what personal data we collect, why, who we share it with and what your rights are.',
    sections: [
        {
            heading: 'Who is responsible',
            paragraphs: [
                'Aalto Football is run by Agustín M. Soares, Bergen, Norway, who is the data controller. Contact us about anything in this policy at {email}.',
            ],
        },
        {
            heading: 'What we collect',
            list: [
                'Account: your email address, name, password (stored encrypted by our login provider) and, if you use Google sign-in, the name and email Google shares with us.',
                'Profile: level, preferred position and language.',
                'Activity: matches you host or join, waitlist position, teams, results, attendance (whether you showed up), ratings you give and receive, and chat messages in your matches.',
                'Technical data: IP address, browser and device, used to keep the service running and secure. Our providers keep these logs for a limited time.',
                'Website statistics: anonymous page views, country, device type and referring site, measured without cookies by Vercel Web Analytics.',
            ],
        },
        {
            heading: 'Why we use it (legal basis)',
            list: [
                'To provide the service you sign up for: your account, matches, waitlists, teams, results, chat and reminder emails before kick-off (contract, GDPR art. 6(1)(b)).',
                'To keep the service safe, prevent spam and abuse, and understand how the site is used in aggregate (legitimate interests, art. 6(1)(f)).',
                'To comply with legal obligations when required (art. 6(1)(c)).',
            ],
            paragraphs: ['We do not sell your data, show ads or use your data for marketing.'],
        },
        {
            heading: 'Who can see your information',
            list: [
                'Other signed-in users can see your name, level, preferred position, the matches you play and your public stats (matches played, attendance and average rating). Visitors who are not signed in see matches, how many spots are left and, on the home page, the names of our members (name only, nothing else).',
                'Individual ratings are private: players only see averages.',
                'Chat messages are visible to the host and players of that match.',
                'Site admins can see account details (including email) to run and moderate the service.',
            ],
        },
        {
            heading: 'Service providers',
            paragraphs: [
                'We use these providers to run Aalto Football. They process data on our behalf under data processing agreements:',
            ],
            list: [
                'Supabase (database and login), with data stored in the EU (Ireland).',
                'Vercel (hosting and website statistics), with servers in the EU (Ireland) and a global network.',
                'Resend (sending emails).',
                'OpenStreetMap (map images; your browser loads them directly from OpenStreetMap).',
            ],
        },
        {
            heading: 'Transfers outside the EEA',
            paragraphs: [
                'Some providers are based in the United States. When data is transferred outside the EEA, it is protected by the EU Standard Contractual Clauses or the EU–US Data Privacy Framework.',
            ],
        },
        {
            heading: 'How long we keep it',
            paragraphs: [
                'We keep your data for as long as you have an account. If you delete your account, your profile, ratings, chat messages and participations are deleted right away, and matches you host are deleted too. Backups and provider logs are deleted within their normal cycle (up to 90 days).',
            ],
        },
        {
            heading: 'Cookies',
            paragraphs: [
                'We only use cookies that are necessary for the site to work: login session cookies from Supabase and a cookie that remembers your language. Website statistics do not use cookies. The installable app (PWA) stores copies of public pages on your device so the site works offline.',
            ],
        },
        {
            heading: 'Your rights',
            list: [
                'Access and portability: ask us for a copy of your data.',
                'Correction: edit your profile at any time.',
                'Deletion: delete your account yourself from your profile page, or ask us.',
                'Objection and restriction: object to processing based on legitimate interests.',
                'Complaint: you can complain to the Norwegian Data Protection Authority (Datatilsynet, datatilsynet.no).',
            ],
            paragraphs: ['Write to {email} to use your rights. We answer within 30 days.'],
        },
        {
            heading: 'Children',
            paragraphs: ['You must be at least 16 years old to create an account.'],
        },
        {
            heading: 'Changes',
            paragraphs: [
                'If we change this policy we will update the date above, and tell signed-in users about important changes.',
            ],
        },
    ],
};

const privacyNb: LegalDoc = {
    title: 'Personvernerklæring',
    updated: 'Sist oppdatert: 26. oktober 2026',
    intro: 'Aalto Football hjelper folk i Bergen med å finne og arrangere fotballkamper. Denne erklæringen forklarer hvilke personopplysninger vi samler inn, hvorfor, hvem vi deler dem med og hvilke rettigheter du har.',
    sections: [
        {
            heading: 'Hvem er ansvarlig',
            paragraphs: [
                'Aalto Football drives av Agustín M. Soares, Bergen, som er behandlingsansvarlig. Kontakt oss om alt i denne erklæringen på {email}.',
            ],
        },
        {
            heading: 'Hva vi samler inn',
            list: [
                'Konto: e-postadresse, navn, passord (lagret kryptert hos innloggingsleverandøren vår) og, hvis du logger inn med Google, navnet og e-posten Google deler med oss.',
                'Profil: nivå, foretrukket posisjon og språk.',
                'Aktivitet: kamper du arrangerer eller melder deg på, plass på venteliste, lag, resultater, oppmøte, vurderinger du gir og får, og chatmeldinger i kampene dine.',
                'Tekniske data: IP-adresse, nettleser og enhet, for å holde tjenesten i gang og sikker. Leverandørene våre lagrer disse loggene i begrenset tid.',
                'Statistikk: anonyme sidevisninger, land, enhetstype og henvisende nettsted, målt uten informasjonskapsler av Vercel Web Analytics.',
            ],
        },
        {
            heading: 'Hvorfor vi bruker dem (behandlingsgrunnlag)',
            list: [
                'For å levere tjenesten du registrerer deg for: konto, kamper, ventelister, lag, resultater, chat og påminnelser på e-post før kampstart (avtale, GDPR art. 6 nr. 1 b).',
                'For å holde tjenesten trygg, hindre spam og misbruk, og forstå hvordan nettstedet brukes samlet (berettiget interesse, art. 6 nr. 1 f).',
                'For å oppfylle rettslige forpliktelser når det kreves (art. 6 nr. 1 c).',
            ],
            paragraphs: [
                'Vi selger ikke opplysningene dine, viser ikke reklame og bruker dem ikke til markedsføring.',
            ],
        },
        {
            heading: 'Hvem kan se opplysningene dine',
            list: [
                'Andre innloggede brukere ser navnet ditt, nivå, foretrukket posisjon, kampene du spiller og den offentlige statistikken din (spilte kamper, oppmøte og gjennomsnittlig vurdering). Besøkende som ikke er logget inn ser kampene, hvor mange plasser som er ledige og, på forsiden, navnene på medlemmene våre (bare navnet, ingenting annet).',
                'Enkeltvurderinger er private: spillere ser bare gjennomsnitt.',
                'Chatmeldinger er synlige for arrangøren og spillerne i kampen.',
                'Administratorer ser kontoopplysninger (også e-post) for å drive og moderere tjenesten.',
            ],
        },
        {
            heading: 'Leverandører',
            paragraphs: [
                'Vi bruker disse leverandørene for å drive Aalto Football. De behandler opplysninger på våre vegne etter databehandleravtaler:',
            ],
            list: [
                'Supabase (database og innlogging), med data lagret i EU (Irland).',
                'Vercel (drift og statistikk), med servere i EU (Irland) og et globalt nettverk.',
                'Resend (utsending av e-post).',
                'OpenStreetMap (kartbilder; nettleseren din henter dem direkte fra OpenStreetMap).',
            ],
        },
        {
            heading: 'Overføring utenfor EØS',
            paragraphs: [
                'Noen leverandører holder til i USA. Når opplysninger overføres utenfor EØS, er de beskyttet av EUs standardkontraktsklausuler eller EU–US Data Privacy Framework.',
            ],
        },
        {
            heading: 'Hvor lenge vi lagrer dem',
            paragraphs: [
                'Vi lagrer opplysningene så lenge du har en konto. Sletter du kontoen, slettes profil, vurderinger, chatmeldinger og påmeldinger med en gang, og kamper du arrangerer slettes også. Sikkerhetskopier og leverandørlogger slettes innen sin vanlige syklus (inntil 90 dager).',
            ],
        },
        {
            heading: 'Informasjonskapsler',
            paragraphs: [
                'Vi bruker bare informasjonskapsler som er nødvendige for at nettstedet skal virke: innloggingsøkten fra Supabase og en som husker språket ditt. Statistikken bruker ikke informasjonskapsler. Appen (PWA) lagrer kopier av offentlige sider på enheten din slik at nettstedet virker uten nett.',
            ],
        },
        {
            heading: 'Rettighetene dine',
            list: [
                'Innsyn og dataportabilitet: be om en kopi av opplysningene dine.',
                'Retting: endre profilen din når som helst.',
                'Sletting: slett kontoen selv fra profilsiden, eller be oss om det.',
                'Protest og begrensning: protester mot behandling basert på berettiget interesse.',
                'Klage: du kan klage til Datatilsynet (datatilsynet.no).',
            ],
            paragraphs: ['Skriv til {email} for å bruke rettighetene dine. Vi svarer innen 30 dager.'],
        },
        {
            heading: 'Barn',
            paragraphs: ['Du må være minst 16 år for å opprette en konto.'],
        },
        {
            heading: 'Endringer',
            paragraphs: [
                'Endrer vi erklæringen, oppdaterer vi datoen over og varsler innloggede brukere om viktige endringer.',
            ],
        },
    ],
};

const termsEn: LegalDoc = {
    title: 'Terms of use',
    updated: 'Last updated: 6 October 2026',
    intro: 'These terms apply when you use Aalto Football. By creating an account you accept them. Please also read our privacy policy.',
    sections: [
        {
            heading: 'The service',
            paragraphs: [
                'Aalto Football is a free platform where hosts publish pick-up football matches and players join them. We do not organise the matches ourselves, book pitches or take payments: the host is responsible for the match, and any payment is made directly to the host or at the pitch.',
            ],
        },
        {
            heading: 'Your account',
            list: [
                'You must be at least 16 years old.',
                'Use your real name and keep your login details safe. You are responsible for what happens in your account.',
                'One person, one account.',
            ],
        },
        {
            heading: 'Hosts',
            list: [
                'Only publish real matches, with correct time, place, level and price.',
                'Make sure you have the right to use the pitch.',
                'Cancel the match in the app as early as possible if it will not take place.',
            ],
        },
        {
            heading: 'Players',
            list: [
                'Only join matches you plan to attend, and leave the match in the app as soon as you know you cannot make it, so someone on the waitlist can play.',
                'Hosts can record attendance, and no-shows are shown in your stats.',
            ],
        },
        {
            heading: 'Fair play',
            paragraphs: ['You must not:'],
            list: [
                'harass, threaten or discriminate against anyone, on or off the pitch, including in the chat;',
                'post illegal, offensive or misleading content, spam or advertising;',
                'give dishonest ratings, or rate players you did not play with;',
                'try to access other users’ data, overload or attack the service, or use bots to scrape it.',
            ],
        },
        {
            heading: 'Your content',
            paragraphs: [
                'You keep the rights to what you write (for example match descriptions and chat messages) and give us permission to show it in the service. We may remove content and suspend or delete accounts that break these terms.',
            ],
        },
        {
            heading: 'Safety and responsibility',
            paragraphs: [
                'Football involves a risk of injury. You take part in matches at your own risk and are responsible for your own health and insurance. We are not responsible for what happens at matches, for the condition of pitches, or for disputes between users.',
                'We do our best to keep the service available and correct, but it is provided "as is". To the extent Norwegian law allows, we are not liable for indirect losses. Nothing in these terms limits your rights as a consumer.',
            ],
        },
        {
            heading: 'Ending your use',
            paragraphs: [
                'You can delete your account at any time from your profile page. We may close the service or your account with reasonable notice, or immediately if you seriously break these terms.',
            ],
        },
        {
            heading: 'Changes and law',
            paragraphs: [
                'We may update these terms and will tell you about important changes before they apply. Norwegian law applies. Questions or complaints: {email}. As a consumer you can also contact Forbrukerrådet.',
            ],
        },
    ],
};

const termsNb: LegalDoc = {
    title: 'Vilkår for bruk',
    updated: 'Sist oppdatert: 6. oktober 2026',
    intro: 'Disse vilkårene gjelder når du bruker Aalto Football. Ved å opprette en konto godtar du dem. Les også personvernerklæringen vår.',
    sections: [
        {
            heading: 'Tjenesten',
            paragraphs: [
                'Aalto Football er en gratis plattform der arrangører publiserer fotballkamper og spillere melder seg på. Vi arrangerer ikke kampene selv, booker ikke baner og tar ikke imot betaling: arrangøren er ansvarlig for kampen, og eventuell betaling skjer direkte til arrangøren eller på banen.',
            ],
        },
        {
            heading: 'Kontoen din',
            list: [
                'Du må være minst 16 år.',
                'Bruk ditt ekte navn og hold innloggingen din hemmelig. Du er ansvarlig for det som skjer på kontoen din.',
                'Én person, én konto.',
            ],
        },
        {
            heading: 'Arrangører',
            list: [
                'Publiser bare ekte kamper, med riktig tid, sted, nivå og pris.',
                'Sørg for at du har rett til å bruke banen.',
                'Avlys kampen i appen så tidlig som mulig hvis den ikke blir noe av.',
            ],
        },
        {
            heading: 'Spillere',
            list: [
                'Meld deg bare på kamper du har tenkt å spille, og meld avbud i appen så snart du vet at du ikke kan, slik at noen på ventelisten får plassen.',
                'Arrangøren kan registrere oppmøte, og uteblivelser vises i statistikken din.',
            ],
        },
        {
            heading: 'Fair play',
            paragraphs: ['Du skal ikke:'],
            list: [
                'trakassere, true eller diskriminere noen, på eller utenfor banen, også i chatten;',
                'legge ut ulovlig, støtende eller villedende innhold, spam eller reklame;',
                'gi uærlige vurderinger, eller vurdere spillere du ikke har spilt med;',
                'prøve å få tilgang til andres data, overbelaste eller angripe tjenesten, eller bruke roboter til å hente data fra den.',
            ],
        },
        {
            heading: 'Innholdet ditt',
            paragraphs: [
                'Du beholder rettighetene til det du skriver (for eksempel kampbeskrivelser og chatmeldinger) og gir oss tillatelse til å vise det i tjenesten. Vi kan fjerne innhold og stenge eller slette kontoer som bryter vilkårene.',
            ],
        },
        {
            heading: 'Sikkerhet og ansvar',
            paragraphs: [
                'Fotball innebærer risiko for skader. Du deltar på egen risiko og er selv ansvarlig for helse og forsikring. Vi er ikke ansvarlige for det som skjer på kampene, for banenes tilstand eller for uenigheter mellom brukere.',
                'Vi gjør vårt beste for at tjenesten skal være tilgjengelig og riktig, men den leveres «som den er». Så langt norsk lov tillater, er vi ikke ansvarlige for indirekte tap. Ingenting i vilkårene begrenser rettighetene dine som forbruker.',
            ],
        },
        {
            heading: 'Avslutning',
            paragraphs: [
                'Du kan slette kontoen din når som helst fra profilsiden. Vi kan legge ned tjenesten eller stenge kontoen din med rimelig varsel, eller umiddelbart ved alvorlige brudd på vilkårene.',
            ],
        },
        {
            heading: 'Endringer og lovvalg',
            paragraphs: [
                'Vi kan oppdatere vilkårene og varsler om viktige endringer før de gjelder. Norsk lov gjelder. Spørsmål eller klager: {email}. Som forbruker kan du også kontakte Forbrukerrådet.',
            ],
        },
    ],
};

const privacyEs: LegalDoc = {
    title: 'Política de privacidad',
    updated: 'Última actualización: 26 de octubre de 2026',
    intro: 'Aalto Football ayuda a la gente de Bergen a encontrar y organizar partidos de fútbol amateur. Esta política explica qué datos personales recogemos, para qué, con quién los compartimos y cuáles son tus derechos.',
    sections: [
        {
            heading: 'Quién es el responsable',
            paragraphs: [
                'Aalto Football lo gestiona Agustín M. Soares, Bergen (Noruega), que es el responsable del tratamiento. Escríbenos sobre cualquier punto de esta política a {email}.',
            ],
        },
        {
            heading: 'Qué datos recogemos',
            list: [
                'Cuenta: tu email, tu nombre, tu contraseña (guardada cifrada por nuestro proveedor de inicio de sesión) y, si entras con Google, el nombre y el email que Google nos comparte.',
                'Perfil: nivel, posición preferida e idioma.',
                'Actividad: los partidos que organizas o a los que te apuntas, tu puesto en la lista de espera, equipos, resultados, asistencia (si fuiste o no), las valoraciones que das y recibes, y los mensajes del chat de tus partidos.',
                'Datos técnicos: dirección IP, navegador y dispositivo, que usamos para que el servicio funcione y sea seguro. Nuestros proveedores guardan estos registros durante un tiempo limitado.',
                'Estadísticas de la web: páginas vistas, país, tipo de dispositivo y sitio de procedencia, de forma anónima y sin cookies, medidos con Vercel Web Analytics.',
            ],
        },
        {
            heading: 'Para qué los usamos (base legal)',
            list: [
                'Para darte el servicio en el que te registras: tu cuenta, partidos, listas de espera, equipos, resultados, chat y emails de recordatorio antes del partido (ejecución de un contrato, art. 6.1.b del RGPD).',
                'Para mantener el servicio seguro, evitar spam y abusos, y entender de forma agregada cómo se usa la web (interés legítimo, art. 6.1.f).',
                'Para cumplir obligaciones legales cuando corresponda (art. 6.1.c).',
            ],
            paragraphs: ['No vendemos tus datos, no mostramos anuncios ni usamos tus datos para marketing.'],
        },
        {
            heading: 'Quién puede ver tu información',
            list: [
                'Los demás usuarios con sesión iniciada ven tu nombre, nivel, posición preferida, los partidos que juegas y tus estadísticas públicas (partidos jugados, asistencia y valoración media). Los visitantes sin sesión ven los partidos, cuántas plazas quedan y, en la página de inicio, los nombres de nuestros miembros (solo el nombre, nada más).',
                'Las valoraciones individuales son privadas: los jugadores solo ven la media.',
                'Los mensajes del chat los ven el organizador y los jugadores de ese partido.',
                'Los administradores del sitio pueden ver los datos de las cuentas (incluido el email) para gestionar y moderar el servicio.',
            ],
        },
        {
            heading: 'Proveedores',
            paragraphs: [
                'Usamos estos proveedores para que Aalto Football funcione. Tratan los datos por encargo nuestro, con contratos de encargo del tratamiento:',
            ],
            list: [
                'Supabase (base de datos e inicio de sesión), con los datos guardados en la UE (Irlanda).',
                'Vercel (alojamiento y estadísticas de la web), con servidores en la UE (Irlanda) y una red global.',
                'Resend (envío de emails).',
                'OpenStreetMap (imágenes de los mapas; tu navegador las carga directamente de OpenStreetMap).',
            ],
        },
        {
            heading: 'Transferencias fuera del EEE',
            paragraphs: [
                'Algunos proveedores tienen sede en Estados Unidos. Cuando los datos salen del EEE, están protegidos por las cláusulas contractuales tipo de la UE o por el Marco de Privacidad de Datos UE–EE. UU.',
            ],
        },
        {
            heading: 'Cuánto tiempo los guardamos',
            paragraphs: [
                'Guardamos tus datos mientras tengas una cuenta. Si borras tu cuenta, se borran al momento tu perfil, tus valoraciones, tus mensajes y tus inscripciones, y también los partidos que organizas. Las copias de seguridad y los registros de los proveedores se borran en su ciclo normal (hasta 90 días).',
            ],
        },
        {
            heading: 'Cookies',
            paragraphs: [
                'Solo usamos las cookies necesarias para que la web funcione: las de la sesión de Supabase y una que recuerda tu idioma. Las estadísticas de la web no usan cookies. La app instalable (PWA) guarda copias de las páginas públicas en tu dispositivo para que la web funcione sin conexión.',
            ],
        },
        {
            heading: 'Tus derechos',
            list: [
                'Acceso y portabilidad: pídenos una copia de tus datos.',
                'Rectificación: edita tu perfil cuando quieras.',
                'Supresión: borra tu cuenta tú mismo desde tu perfil, o pídenoslo.',
                'Oposición y limitación: oponte a los tratamientos basados en el interés legítimo.',
                'Reclamación: puedes reclamar ante la autoridad noruega de protección de datos (Datatilsynet, datatilsynet.no).',
            ],
            paragraphs: ['Escribe a {email} para ejercer tus derechos. Respondemos en un plazo de 30 días.'],
        },
        {
            heading: 'Menores',
            paragraphs: ['Tienes que tener al menos 16 años para crear una cuenta.'],
        },
        {
            heading: 'Cambios',
            paragraphs: [
                'Si cambiamos esta política actualizaremos la fecha de arriba y avisaremos de los cambios importantes a los usuarios con sesión iniciada.',
            ],
        },
    ],
};

const termsEs: LegalDoc = {
    title: 'Términos de uso',
    updated: 'Última actualización: 26 de octubre de 2026',
    intro: 'Estos términos se aplican cuando usas Aalto Football. Al crear una cuenta los aceptas. Lee también nuestra política de privacidad.',
    sections: [
        {
            heading: 'El servicio',
            paragraphs: [
                'Aalto Football es una plataforma gratuita donde los organizadores publican partidos de fútbol amateur y los jugadores se apuntan. Nosotros no organizamos los partidos, no reservamos canchas ni cobramos pagos: el organizador es responsable del partido, y cualquier pago se hace directamente al organizador o en la cancha.',
            ],
        },
        {
            heading: 'Tu cuenta',
            list: [
                'Tienes que tener al menos 16 años.',
                'Usa tu nombre real y cuida tus datos de acceso. Eres responsable de lo que pase en tu cuenta.',
                'Una persona, una cuenta.',
            ],
        },
        {
            heading: 'Organizadores',
            list: [
                'Publica solo partidos reales, con la hora, el lugar, el nivel y el precio correctos.',
                'Asegúrate de tener derecho a usar la cancha.',
                'Cancela el partido en la app lo antes posible si no se va a jugar.',
            ],
        },
        {
            heading: 'Jugadores',
            list: [
                'Apúntate solo a partidos a los que piensas ir, y bájate en la app en cuanto sepas que no puedes, para que juegue alguien de la lista de espera.',
                'Los organizadores pueden registrar la asistencia, y las ausencias aparecen en tus estadísticas.',
            ],
        },
        {
            heading: 'Juego limpio',
            paragraphs: ['No puedes:'],
            list: [
                'acosar, amenazar o discriminar a nadie, dentro o fuera de la cancha, también en el chat;',
                'publicar contenido ilegal, ofensivo o engañoso, spam o publicidad;',
                'dar valoraciones deshonestas o valorar a jugadores con los que no jugaste;',
                'intentar acceder a datos de otros usuarios, sobrecargar o atacar el servicio, o usar bots para extraer información.',
            ],
        },
        {
            heading: 'Tu contenido',
            paragraphs: [
                'Conservas los derechos sobre lo que escribes (por ejemplo, descripciones de partidos y mensajes del chat) y nos das permiso para mostrarlo en el servicio. Podemos retirar contenido y suspender o borrar cuentas que incumplan estos términos.',
            ],
        },
        {
            heading: 'Seguridad y responsabilidad',
            paragraphs: [
                'El fútbol implica riesgo de lesiones. Participas en los partidos bajo tu propia responsabilidad y te encargas de tu salud y tu seguro. No somos responsables de lo que pase en los partidos, del estado de las canchas ni de los conflictos entre usuarios.',
                'Hacemos lo posible para que el servicio esté disponible y sea correcto, pero se ofrece "tal cual". En la medida en que lo permita la ley noruega, no respondemos de pérdidas indirectas. Nada en estos términos limita tus derechos como consumidor.',
            ],
        },
        {
            heading: 'Dejar de usar el servicio',
            paragraphs: [
                'Puedes borrar tu cuenta cuando quieras desde tu perfil. Podemos cerrar el servicio o tu cuenta con un aviso razonable, o de inmediato si incumples gravemente estos términos.',
            ],
        },
        {
            heading: 'Cambios y ley aplicable',
            paragraphs: [
                'Podemos actualizar estos términos y te avisaremos de los cambios importantes antes de que se apliquen. Se aplica la ley noruega. Dudas o reclamaciones: {email}. Como consumidor también puedes contactar con Forbrukerrådet.',
            ],
        },
    ],
};

export const LEGAL: Record<Locale, { privacy: LegalDoc; terms: LegalDoc }> = {
    en: { privacy: privacyEn, terms: termsEn },
    nb: { privacy: privacyNb, terms: termsNb },
    es: { privacy: privacyEs, terms: termsEs },
};

/** Email de contacto para temas legales y de privacidad (NEXT_PUBLIC_CONTACT_EMAIL, obligatorio en producción). */
export function contactEmail(): string {
    return process.env.NEXT_PUBLIC_CONTACT_EMAIL || '[contact email]';
}
