// 오늘 날짜(KST, Asia/Seoul)의 단일 원본.
// App/HistoryView/MonthlyCalendar에서 각자 useMemo로 계산하던 todayStr을
// Context 1회 계산으로 통합한다.
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { calendarDateInTimeZone } from "@/domain/task";

interface LocaleContextValue {
  todayStr: string; // YYYY-MM-DD
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const value = useMemo<LocaleContextValue>(() => {
    return { todayStr: calendarDateInTimeZone(new Date(), "Asia/Seoul") };
  }, []);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
