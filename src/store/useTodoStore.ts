import { create } from "zustand";
import {
  TaskStatus,
  CommitmentOutcome,
  CommitmentSlot,
  CommitmentRecord,
  RolloverDecision,
  calendarDateInTimeZone,
} from "../domain/task";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface Commitment {
  id: string;
  title: string;
  status: TaskStatus;
  shared: boolean;
  slot: CommitmentSlot;
}

export interface RolloverTask {
  id: string;
  title: string;
  resolved: boolean;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  streak: number;
  consistency: number;
  commitments: { title: string; completed: boolean }[];
  reactionsSent: { cheer: boolean; congratulate: boolean; remind: boolean };
}

export interface Diary {
  id: string;
  date: string;
  content: string;
}

export type AppTheme = "light" | "dark" | "system";

interface TodoState {
  currentTab: string;
  theme: AppTheme;
  tasks: Task[];
  commitments: Commitment[];
  rolloverTasks: RolloverTask[];
  friends: Friend[];
  diaries: Diary[];
  restWeekdays: number[];
  remindCount: number;
  remindTime: string;
  commitmentHistory: CommitmentRecord[];

  setCurrentTab: (tab: string) => void;
  setTheme: (theme: AppTheme) => void;
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addCommitment: (title: string, slot: CommitmentSlot) => void;
  toggleCommitment: (id: string) => void;
  changeCommitmentStatus: (id: string, status: TaskStatus) => void;
  deleteCommitment: (id: string) => void;
  resolveRollover: (id: string, decision: RolloverDecision) => void;
  addDiary: (content: string) => void;
  sendReaction: (friendId: string, type: "cheer" | "congratulate" | "remind") => void;
  toggleRestWeekday: (day: number) => void;
  setRemindSettings: (count: number, time: string) => void;
}

const getTodayStr = () => calendarDateInTimeZone(new Date(), "Asia/Seoul");

// Theme applier logic
export const applyTheme = (theme: AppTheme) => {
  if (typeof window === "undefined") return;
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
};

const getSavedTheme = (): AppTheme => {
  if (typeof window !== "undefined") {
    return (localStorage.getItem("today-theme") as AppTheme) || "dark"; // default to dark as requested earlier
  }
  return "dark";
};

export const useTodoStore = create<TodoState>((set) => ({
  currentTab: "today",
  theme: getSavedTheme(),
  
  tasks: [
    { id: "t1", title: "영양제 주문하기", completed: false },
    { id: "t2", title: "책 20페이지 읽기", completed: false },
    { id: "t3", title: "분리수거 내놓기", completed: true },
  ],

  commitments: [
    { id: "c1", title: "아침 30분 러닝", status: "completed", shared: true, slot: 1 },
    { id: "c2", title: "포트폴리오 문장 다듬기", status: "in_progress", shared: false, slot: 2 },
  ],

  rolloverTasks: [
    { id: "r1", title: "CS 기초 강의 1개 수강하기", resolved: false },
    { id: "r2", title: "리액트 훅 공식문서 정독", resolved: false },
  ],

  friends: [
    {
      id: "f1",
      name: "김민수",
      avatar: "민수",
      streak: 5,
      consistency: 85,
      commitments: [
        { title: "코딩 테스트 1문제 풀기", completed: true },
        { title: "헬스장 유산소 40분", completed: false },
        { title: "영어 단어 30개 외우기", completed: true },
      ],
      reactionsSent: { cheer: false, congratulate: false, remind: false },
    },
    {
      id: "f2",
      name: "이지영",
      avatar: "지영",
      streak: 12,
      consistency: 100,
      commitments: [
        { title: "디자인 시안 피드백 반영", completed: true },
        { title: "매일 감사일기 쓰기", completed: true },
      ],
      reactionsSent: { cheer: false, congratulate: false, remind: false },
    },
  ],

  diaries: [
    { id: "d1", date: "2026-07-13", content: "어제는 달리기를 하다가 발목을 살짝 삐끗했다. 오늘은 조심히 달려야겠다. 포트폴리오 정리가 드디어 끝나간다." },
    { id: "d2", date: "2026-07-12", content: "일요일 아침 일찍 일어나 공부를 하니 효율이 좋았다. 스터디원들과의 약속을 다 지켜서 다행이다." },
  ],

  restWeekdays: [0, 6],
  remindCount: 3,
  remindTime: "09:00 - 21:00",

  commitmentHistory: [
    { commitmentDate: "2026-07-14", outcome: null },
    { commitmentDate: "2026-07-14", outcome: "completed" },
    { commitmentDate: "2026-07-13", outcome: "completed" },
    { commitmentDate: "2026-07-13", outcome: "completed" },
    { commitmentDate: "2026-07-10", outcome: "completed" },
    { commitmentDate: "2026-07-10", outcome: "completed" },
    { commitmentDate: "2026-07-10", outcome: "completed" },
    { commitmentDate: "2026-07-09", outcome: "completed" },
    { commitmentDate: "2026-07-08", outcome: "completed" },
  ],

  setCurrentTab: (tab) => set({ currentTab: tab }),

  setTheme: (theme) => {
    localStorage.setItem("today-theme", theme);
    applyTheme(theme);
    set({ theme });
  },

  addTask: (title) =>
    set((state) => ({
      tasks: [...state.tasks, { id: Math.random().toString(), title, completed: false }],
    })),

  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  addCommitment: (title, slot) =>
    set((state) => {
      if (state.commitments.some((c) => c.slot === slot)) return state;
      const newCommitment: Commitment = {
        id: Math.random().toString(),
        title,
        status: "planned",
        shared: true,
        slot,
      };
      const todayStr = getTodayStr();
      const updatedHistory = [...state.commitmentHistory, { commitmentDate: todayStr, outcome: null }];

      return {
        commitments: [...state.commitments, newCommitment],
        commitmentHistory: updatedHistory,
      };
    }),

  toggleCommitment: (id) =>
    set((state) => {
      const todayStr = getTodayStr();
      const comm = state.commitments.find((c) => c.id === id);
      if (!comm) return state;

      const nextStatus: TaskStatus = comm.status === "completed" ? "planned" : "completed";
      const nextOutcome: CommitmentOutcome | null = nextStatus === "completed" ? "completed" : null;

      const updatedCommitments = state.commitments.map((c) =>
        c.id === id ? { ...c, status: nextStatus } : c
      );

      let updatedHistory = [...state.commitmentHistory];
      const matchIndex = updatedHistory.findIndex(
        (h) => h.commitmentDate === todayStr && (comm.status === "completed" ? h.outcome === "completed" : h.outcome === null)
      );
      if (matchIndex !== -1) {
        updatedHistory[matchIndex] = { commitmentDate: todayStr, outcome: nextOutcome };
      } else {
        updatedHistory.push({ commitmentDate: todayStr, outcome: nextOutcome });
      }

      return {
        commitments: updatedCommitments,
        commitmentHistory: updatedHistory,
      };
    }),

  changeCommitmentStatus: (id, status) =>
    set((state) => {
      const todayStr = getTodayStr();
      const comm = state.commitments.find((c) => c.id === id);
      if (!comm) return state;

      const updatedCommitments = state.commitments.map((c) =>
        c.id === id ? { ...c, status } : c
      );

      let outcome: CommitmentOutcome | null = null;
      if (status === "completed") outcome = "completed";
      else if (status === "deferred") outcome = "deferred";
      else if (status === "abandoned") outcome = "abandoned";

      let updatedHistory = [...state.commitmentHistory];
      const matchIndex = updatedHistory.findIndex(
        (h) => h.commitmentDate === todayStr && h.outcome === (comm.status === "completed" ? "completed" : comm.status === "deferred" ? "deferred" : comm.status === "abandoned" ? "abandoned" : null)
      );

      if (matchIndex !== -1) {
        updatedHistory[matchIndex] = { commitmentDate: todayStr, outcome };
      } else {
        updatedHistory.push({ commitmentDate: todayStr, outcome: outcome });
      }

      return {
        commitments: updatedCommitments,
        commitmentHistory: updatedHistory,
      };
    }),

  deleteCommitment: (id) =>
    set((state) => {
      const comm = state.commitments.find((c) => c.id === id);
      if (!comm) return state;

      const updatedCommitments = state.commitments.filter((c) => c.id !== id);

      const todayStr = getTodayStr();
      let updatedHistory = [...state.commitmentHistory];
      const matchIndex = updatedHistory.findIndex(
        (h) => h.commitmentDate === todayStr && h.outcome === (comm.status === "completed" ? "completed" : comm.status === "deferred" ? "deferred" : comm.status === "abandoned" ? "abandoned" : null)
      );
      if (matchIndex !== -1) {
        updatedHistory.splice(matchIndex, 1);
      }

      return {
        commitments: updatedCommitments,
        commitmentHistory: updatedHistory,
      };
    }),

  resolveRollover: (id, decision) =>
    set((state) => {
      const task = state.rolloverTasks.find((t) => t.id === id);
      if (!task) return state;

      const updatedRollover = state.rolloverTasks.map((t) =>
        t.id === id ? { ...t, resolved: true } : t
      );

      let nextTasks = [...state.tasks];
      let nextCommitments = [...state.commitments];
      let nextHistory = [...state.commitmentHistory];

      if (decision.type === "today") {
        nextTasks.push({
          id: Math.random().toString(),
          title: task.title,
          completed: false,
        });
      }

      return {
        rolloverTasks: updatedRollover,
        tasks: nextTasks,
        commitments: nextCommitments,
        commitmentHistory: nextHistory,
      };
    }),

  addDiary: (content) =>
    set((state) => ({
      diaries: [
        {
          id: Math.random().toString(),
          date: getTodayStr(),
          content,
        },
        ...state.diaries,
      ],
    })),

  sendReaction: (friendId, type) =>
    set((state) => ({
      friends: state.friends.map((f) =>
        f.id === friendId
          ? {
              ...f,
              reactionsSent: {
                ...f.reactionsSent,
                [type]: true,
              },
            }
          : f
      ),
    })),

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
}));
