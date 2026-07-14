// 사용자 설정: 휴식 요일, 리마인드, 테마, 언어. localStorage 영속은 lib/theme과
// lib/language에 위임한다.
import { create } from "zustand";
import type { AppTheme } from "@/domain/types";
import { applyTheme, getSavedTheme, saveTheme } from "@/lib/theme";
import {
  getSavedLanguage,
  saveLanguage,
  type SupportedLanguage,
} from "@/lib/language";

interface SettingsState {
  restWeekdays: number[];
  remindCount: number;
  remindTime: string;
  theme: AppTheme;
  language: SupportedLanguage;

  toggleRestWeekday: (day: number) => void;
  setRemindSettings: (count: number, time: string) => void;
  setTheme: (theme: AppTheme) => void;
  setLanguage: (language: SupportedLanguage) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  restWeekdays: [0, 6],
  remindCount: 3,
  remindTime: "09:00 - 21:00",
  theme: getSavedTheme(),
  language: getSavedLanguage(),

  toggleRestWeekday: (day) =>
    set((state) => ({
      restWeekdays: state.restWeekdays.includes(day)
        ? state.restWeekdays.filter((d) => d !== day)
        : [...state.restWeekdays, day],
    })),

  setRemindSettings: (count, time) =>
    set({
      remindCount: count,
      remindTime: time,
    }),

  setTheme: (theme) => {
    saveTheme(theme);
    applyTheme(theme);
    set({ theme });
  },

  setLanguage: (language) => {
    saveLanguage(language);
    // i18n.changeLanguage는 I18nProvider의 useEffect가 language 변경을 감지해
    // 호출한다. 여기서는 영속화와 상태 갱신만 담당.
    set({ language });
  },
}));
