// i18next 초기화. 모든 리소스를 정적 import하여 번들에 포함시킨다.
// 언어 결정: localStorage('today-language') → navigator → 'ko' fallback.
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ko from "./locales/ko.json";
import ja from "./locales/ja.json";
import en from "./locales/en.json";

export const SUPPORTED_LANGUAGES = ["ko", "ja", "en"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: SupportedLanguage = "ko";

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ko: { translation: ko },
      ja: { translation: ja },
      en: { translation: en },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    nonExplicitSupportedLngs: true,
    interpolation: {
      // React는 이미 이스케이프하므로 i18next 측은 끈다.
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "today-language",
      caches: ["localStorage"],
    },
  });

export default i18n;
