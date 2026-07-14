// 사용자 설정: 휴식 요일, 리마인드, 테마. localStorage 영속은 lib/theme에 위임.
import { create } from "zustand";
import type { AppTheme } from "@/domain/types";
import { applyTheme, getSavedTheme, saveTheme } from "@/lib/theme";

interface SettingsState {
  restWeekdays: number[];
  remindCount: number;
  remindTime: string;
  theme: AppTheme;

  toggleRestWeekday: (day: number) => void;
  setRemindSettings: (count: number, time: string) => void;
  setTheme: (theme: AppTheme) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  restWeekdays: [0, 6],
  remindCount: 3,
  remindTime: "09:00 - 21:00",
  theme: getSavedTheme(),

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
}));
