// SSR locale detection — reads Accept-Language on the server, safe fallback to en
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { pickLocaleFromAcceptLanguage, DEFAULT_LOCALE, type SupportedLocale } from "./i18n";

export const detectLocale = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const header = getRequestHeader("accept-language") ?? null;
    const locale: SupportedLocale = pickLocaleFromAcceptLanguage(header);
    return { locale };
  } catch {
    return { locale: DEFAULT_LOCALE };
  }
});
