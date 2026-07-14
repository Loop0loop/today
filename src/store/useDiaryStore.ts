// 일기 상태. addDiary는 작성 날짜를 파라미터로 받는다(오늘 날짜는 뷰/훅에서 주입).
import { create } from "zustand";
import type { Diary } from "@/domain/types";

interface DiaryState {
  diaries: Diary[];
  addDiary: (content: string, date: string) => void;
}

export const useDiaryStore = create<DiaryState>((set) => ({
  diaries: [
    { id: "d1", date: "2026-07-13", content: "어제는 달리기를 하다가 발목을 살짝 삐끗했다. 오늘은 조심히 달려야겠다. 포트폴리오 정리가 드디어 끝나간다." },
    { id: "d2", date: "2026-07-12", content: "일요일 아침 일찍 일어나 공부를 하니 효율이 좋았다. 스터디원들과의 약속을 다 지켜서 다행이다." },
  ],

  addDiary: (content, date) =>
    set((state) => ({
      diaries: [
        {
          id: Math.random().toString(),
          date,
          content,
        },
        ...state.diaries,
      ],
    })),
}));
