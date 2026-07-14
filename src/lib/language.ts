// 언어 영속화 모듈. 테마(lib/theme.ts)와 동일한 패턴.
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  type SupportedLanguage,
} from "@/i18n/config";

export type { SupportedLanguage };

const LANGUAGE_STORAGE_KEY = "today-language";

export function getSavedLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (isSupportedLanguage(stored)) return stored;
  return DEFAULT_LANGUAGE;
}

export function saveLanguage(language: SupportedLanguage): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return (
    typeof value === "string" &&
    (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
  );
}
