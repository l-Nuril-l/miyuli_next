import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
    // Provide a static locale, fetch a user setting,
    // read from `cookies()`, `headers()`, etc.
    const supportedLocales = ['en', 'uk', 'ru']; // только доступные языки
    const rawLocale = (await cookies()).get("NEXT_LOCALE")?.value ?? 'en';
    const locale = supportedLocales.includes(rawLocale) ? rawLocale : 'en';

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});