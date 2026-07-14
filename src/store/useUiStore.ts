// UI 상태: 현재 탭, 선택 날짜, 옵션 서랍 열림 여부.
// 도메인 데이터와 무관한 뷰 제어만 담당한다.
import { create } from "zustand";
import { calendarDateInTimeZone } from "@/domain/task";

export type TabId = "today" | "friends" | "history" | "diary" | "profile";

interface UiState {
  currentTab: TabId;
  selectedDate: string; // YYYY-MM-DD
  isOptionBarOpen: boolean;

  setCurrentTab: (tab: TabId) => void;
  setSelectedDate: (date: string) => void;
  setOptionBarOpen: (open: boolean) => void;
}

function initialSelectedDate(): string {
  if (typeof window === "undefined") return "";
  return calendarDateInTimeZone(new Date(), "Asia/Seoul");
}

export const useUiStore = create<UiState>((set) => ({
  currentTab: "today",
  selectedDate: initialSelectedDate(),
  isOptionBarOpen: false,

  setCurrentTab: (tab) => set({ currentTab: tab }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setOptionBarOpen: (open) => set({ isOptionBarOpen: open }),
}));
