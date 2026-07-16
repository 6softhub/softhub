// Phase 5 — i18n scaffold (additive; no UI text changes required to use it)
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "@/locales/en.json";
import es from "@/locales/es.json";
import fr from "@/locales/fr.json";

let initialized = false;

export function initI18n() {
  if (initialized || i18n.isInitialized) return i18n;
  initialized = true;
  const isBrowser = typeof window !== "undefined";
  const instance = i18n.use(initReactI18next);
  if (isBrowser) instance.use(LanguageDetector);
  instance.init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
    },
    fallbackLng: "en",
    lng: isBrowser ? undefined : "en",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
  return i18n;
}

export { i18n };
