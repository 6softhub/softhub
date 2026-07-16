// Phase 5 — i18n scaffold with SSR-safe locale detection and en fallback
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "@/locales/en.json";
import es from "@/locales/es.json";
import fr from "@/locales/fr.json";

export const SUPPORTED_LOCALES = ["en", "es", "fr"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = "en";

const RESOURCES = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
} as const;

/** Pick a supported locale from an Accept-Language header, falling back to en. */
export function pickLocaleFromAcceptLanguage(header: string | null | undefined): SupportedLocale {
  if (!header) return DEFAULT_LOCALE;
  const parts = header
    .split(",")
    .map((p) => {
      const [tag, q] = p.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .filter((p) => p.tag)
    .sort((a, b) => b.q - a.q);
  for (const { tag } of parts) {
    const base = tag.split("-")[0] as SupportedLocale;
    if ((SUPPORTED_LOCALES as readonly string[]).includes(base)) return base;
  }
  return DEFAULT_LOCALE;
}

let initialized = false;

export function initI18n(initialLocale: SupportedLocale = DEFAULT_LOCALE) {
  if (initialized || i18n.isInitialized) return i18n;
  initialized = true;
  const isBrowser = typeof window !== "undefined";
  const instance = i18n.use(initReactI18next);
  if (isBrowser) instance.use(LanguageDetector);
  instance.init({
    resources: RESOURCES,
    supportedLngs: [...SUPPORTED_LOCALES],
    fallbackLng: DEFAULT_LOCALE,
    nonExplicitSupportedLngs: true, // "en-US" → "en"
    load: "languageOnly",
    lng: isBrowser ? undefined : initialLocale,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    returnEmptyString: false, // empty string still falls back to en
    parseMissingKeyHandler: (key) => key, // missing key → show key, never crash
  });
  return i18n;
}

export { i18n };
