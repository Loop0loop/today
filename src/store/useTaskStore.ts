// 할 일/이월함 상태. 다른 스토어를 참조하지 않으며, 액션은 필요한 값을
// 파라미터로 받는다(selectedDate 등).
import { create } from "zustand";
import type { Task, RolloverTask, TodoTag } from "@/domain/types";
import type { RolloverDecision } from "@/domain/task";

interface TaskState {
  tasks: Task[];
  rolloverTasks: RolloverTask[];

  addTask: (input: { title: string; tag: TodoTag; date: string }) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  resolveRollover: (
    id: string,
    decision: RolloverDecision,
    currentDate: string,
  ) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [
    { id: "t1", title: "영양제 주문하기", completed: false, date: "2026-07-14", tag: "etc" },
    { id: "t2", title: "책 20페이지 읽기", completed: false, date: "2026-07-14", tag: "PLAY" },
    { id: "t3", title: "분리수거 내놓기", completed: true, date: "2026-07-14", tag: null },

    // Mock past data to keep streak logic alive seamlessly
    { id: "t4", title: "어제 했던 베이스 연습 복습", completed: true, date: "2026-07-13", tag: "BASS" },
    { id: "t5", title: "깃허브 1일 1커밋 완료", completed: true, date: "2026-07-13", tag: "DEV" },

    { id: "t10", title: "금요일 공부하기", completed: true, date: "2026-07-10", tag: "DEV" },
    { id: "t11", title: "금요일 독서 완료", completed: true, date: "2026-07-10", tag: "etc" },

    { id: "t12", title: "목요일 할 일", completed: true, date: "2026-07-09", tag: null },
    { id: "t13", title: "수요일 할 일", completed: true, date: "2026-07-08", tag: "BASS" },
  ],

  rolloverTasks: [
    { id: "r1", title: "CS 기초 강의 1개 수강하기", resolved: false },
    { id: "r2", title: "리액트 훅 공식문서 정독", resolved: false },
  ],

  addTask: ({ title, tag, date }) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: Math.random().toString(),
          title,
          completed: false,
          date,
          tag,
        },
      ],
    })),

  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  resolveRollover: (id, decision, currentDate) =>
    set((state) => {
      const task = state.rolloverTasks.find((t) => t.id === id);
      if (!task) return state;

      const updatedRollover = state.rolloverTasks.map((t) =>
        t.id === id ? { ...t, resolved: true } : t,
      );

      let nextTasks = [...state.tasks];

      if (decision.type === "today") {
        nextTasks.push({
          id: Math.random().toString(),
          title: task.title,
          completed: false,
          date: currentDate,
          tag: null,
        });
      }

      return {
        rolloverTasks: updatedRollover,
        tasks: nextTasks,
      };
    }),
}));
