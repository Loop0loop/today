// 날짜 포맷 헬퍼. 언어별 Intl 로케일을 사용해 포맷한다.
// AppHeader/TodayView/MonthlyCalendar의 하드코딩된 ko-KR 포매터를 대체한다.
import type { SupportedLanguage } from "@/i18n/config";

const LOCALE_MAP: Record<SupportedLanguage, string> = {
  ko: "ko-KR",
  ja: "ja-JP",
  en: "en-US",
};

function localeOf(language: string): string {
  return LOCALE_MAP[language as SupportedLanguage] ?? LOCALE_MAP.ko;
}

// 헤더 날짜: "2026년 7월 14일 월요일" / "2026年7月14日月曜日" / "Monday, July 14, 2026"
export function formatHeaderDate(date: Date, language: string): string {
  return new Intl.DateTimeFormat(localeOf(language), {
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
}

//월일: ko/ja는 "7월 14일", en은 "7/14"
export function formatMonthDay(
  year: number,
  month: number,
  day: number,
  language: string,
): string {
  const locale = localeOf(language);
  if (locale === "en-US") {
    return `${month}/${day}`;
  }
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
  }).format(new Date(year, month - 1, day));
}

// 년월: ko/ja는 "2026년 7월", en은 "July 2026"
export function formatYearMonth(
  year: number,
  month: number,
  language: string,
): string {
  return new Intl.DateTimeFormat(localeOf(language), {
    year: "numeric",
    month: "long",
  }).format(new Date(year, month - 1, 1));
}
