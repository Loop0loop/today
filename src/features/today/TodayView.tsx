import React, { useState, useMemo } from "react";
import {
  Check,
  Plus,
  Trash2,
  AlertCircle,
  X,
  NotebookPen,
  User,
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { useUiStore } from "@/store/useUiStore";
import { useToday } from "@/lifecycle/hooks/useToday";
import type { TodoTag } from "@/domain/types";
import { Input } from "@/components/ui/input";
import { MonthlyCalendar } from "./MonthlyCalendar";

export function TodayView() {
  const tasks = useTaskStore((s) => s.tasks);
  const rolloverTasks = useTaskStore((s) => s.rolloverTasks);
  const addTask = useTaskStore((s) => s.addTask);
  const toggleTask = useTaskStore((s) => s.toggleTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const resolveRollover = useTaskStore((s) => s.resolveRollover);

  const selectedDate = useUiStore((s) => s.selectedDate);
  const setCurrentTab = useUiStore((s) => s.setCurrentTab);
  const today = useToday();

  // Todo Modal State
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [newTodoText, setNewTodoText] = useState("");
  const [selectedTag, setSelectedTag] = useState<TodoTag>(null);

  const [isRolloverExpanded, setIsRolloverExpanded] = useState(false);

  const pendingRollovers = rolloverTasks.filter((r) => !r.resolved);

  // Filter tasks by selectedDate
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => t.date === selectedDate);
  }, [tasks, selectedDate]);

  const handleAddTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    addTask({ title: newTodoText.trim(), tag: selectedTag, date: selectedDate });
    setNewTodoText("");
    setSelectedTag(null);
    setIsTodoModalOpen(false);
  };

  const formattedSelectedDate = useMemo(() => {
    const parts = selectedDate.split("-").map(Number);
    if (parts.length !== 3) return selectedDate;
    return `${parts[1]}월 ${parts[2]}일`;
  }, [selectedDate]);

  // Grouped tasks helper
  const tasksByTag = useMemo(() => {
    const groups: Record<string, typeof filteredTasks> = {
      BASS: [],
      DEV: [],
      etc: [],
      PLAY: [],
      none: [],
    };

    filteredTasks.forEach((t) => {
      if (t.tag) {
        groups[t.tag].push(t);
      } else {
        groups.none.push(t);
      }
    });

    return groups;
  }, [filteredTasks]);

  // Category Header styles config
  const categoryHeaders = [
    { name: "BASS", tagValue: "BASS" as TodoTag, textClass: "text-blue-500", key: "BASS" as const },
    { name: "DEV", tagValue: "DEV" as TodoTag, textClass: "text-pink-500", key: "DEV" as const },
    { name: "etc", tagValue: "etc" as TodoTag, textClass: "text-emerald-500", key: "etc" as const },
    { name: "PLAY", tagValue: "PLAY" as TodoTag, textClass: "text-foreground dark:text-zinc-200", key: "PLAY" as const },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-in fade-in duration-300 relative">

      {/* LEFT COLUMN: Profile & Monthly Calendar */}
      <div className="space-y-6">

        {/* Simple Profile Name & Diary Tab Redirection */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-secondary flex items-center justify-center font-bold text-muted-foreground text-sm shrink-0 select-none">
              엄
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground tracking-tight">엄세훈</h2>
              <p className="text-[10px] text-muted-foreground mt-0.5">Today First</p>
            </div>
          </div>

          {/* Diary Button -> Switches currentTab to "diary" */}
          <button
            onClick={() => setCurrentTab("diary")}
            className="size-8 rounded-full bg-secondary hover:bg-border text-foreground flex items-center justify-center shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            title="일기 탭으로 이동하여 작성"
            aria-label="일기 작성 화면 이동"
          >
            <NotebookPen className="size-4 stroke-[2px]" />
          </button>
        </div>

        {/* Squircle Monthly Calendar */}
        <div className="pt-2 border-t border-border">
          <MonthlyCalendar />
        </div>
      </div>

      {/* RIGHT COLUMN: Nested Category -> Tasks List */}
      <div className="space-y-5">

        {/* Selected Date Header indicator */}
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="text-xs font-bold text-primary uppercase tracking-wider block">
            {formattedSelectedDate} 할 일
          </span>

          <div className="flex items-center gap-2">
            {/* General Plus Button (Adds to 'None' category) */}
            <button
              onClick={() => {
                setSelectedTag(null);
                setIsTodoModalOpen(true);
              }}
              className="size-7 rounded-full bg-foreground text-background flex items-center justify-center shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              title="일반 할 일 추가"
              aria-label="일반 할 일 추가"
            >
              <Plus className="size-4 stroke-[2.5px]" />
            </button>
          </div>
        </div>

        {/* Rollover Section */}
        {pendingRollovers.length > 0 && (
          <div className="p-2.5 bg-secondary/30 border border-border rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4 text-amber-500/80 shrink-0" />
                <span className="text-[10px] font-bold text-muted-foreground">
                  어제 미완료 할 일 {pendingRollovers.length}개
                </span>
              </div>
              <button
                className="text-[9px] font-bold text-muted-foreground hover:text-foreground"
                onClick={() => setIsRolloverExpanded(!isRolloverExpanded)}
              >
                {isRolloverExpanded ? "숨기기" : "정리하기"}
              </button>
            </div>

            {isRolloverExpanded && (
              <div className="divide-y divide-border pt-1.5 space-y-1.5">
                {pendingRollovers.map((item) => (
                  <div key={item.id} className="flex flex-col gap-1.5 pt-1.5 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs text-foreground font-semibold">{item.title}</span>
                    <div className="flex gap-1">
                      <button
                        className="text-[9px] font-bold text-muted-foreground hover:text-foreground bg-secondary px-2 py-0.5 rounded"
                        onClick={() => resolveRollover(item.id, { type: "today", nextDate: "" }, today)}
                      >
                        오늘
                      </button>
                      <button
                        className="text-[9px] font-bold text-muted-foreground hover:text-foreground bg-secondary px-2 py-0.5 rounded"
                        onClick={() => resolveRollover(item.id, { type: "someday" }, today)}
                      >
                        언젠가
                      </button>
                      <button
                        className="text-[9px] font-bold text-rose-500 hover:text-rose-450 bg-secondary px-2 py-0.5 rounded"
                        onClick={() => resolveRollover(item.id, { type: "abandon" }, today)}
                      >
                        포기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Hierarchical Todo list */}
        <section className="space-y-4.5">
          {filteredTasks.length > 0 ? (
            <div className="space-y-5">

              {/* Loop through category spaces first */}
              {categoryHeaders.map((space) => {
                const groupList = tasksByTag[space.key];
                if (groupList.length === 0) return null;

                return (
                  <div key={space.name} className="space-y-2.5">
                    {/* Category Capsule header */}
                    <div className="flex items-center justify-between w-40 bg-zinc-900/60 dark:bg-zinc-900/80 border border-zinc-200/50 dark:border-zinc-800/80 rounded-full py-1 px-3 select-none">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <User className="size-3.5 text-zinc-500 shrink-0" />
                        <span className={`text-[11px] font-bold truncate ${space.textClass}`}>
                          {space.name}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedTag(space.tagValue);
                          setIsTodoModalOpen(true);
                        }}
                        className="size-5 rounded-full bg-zinc-950 text-white flex items-center justify-center hover:scale-105 active:scale-95 cursor-pointer border border-zinc-850"
                        title={`${space.name} 카테고리에 할 일 추가`}
                      >
                        <Plus className="size-2.5 stroke-[2.5px]" />
                      </button>
                    </div>

                    {/* Todo cards */}
                    <div className="space-y-2 pl-1.5">
                      {groupList.map((task) => (
                        <div
                          key={task.id}
                          className="group flex min-h-11 items-center justify-between gap-3 py-2.5 px-3.5 border border-zinc-200/80 dark:border-zinc-800/95 bg-card/60 rounded-2xl shadow-xs transition-all hover:bg-secondary/15 hover:border-zinc-400 dark:hover:border-zinc-650"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <button
                              onClick={() => toggleTask(task.id)}
                              className={`grid size-5 shrink-0 place-items-center rounded border-1.5 transition-colors ${
                                task.completed
                                  ? "border-foreground bg-foreground text-background"
                                  : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 text-transparent bg-transparent"
                              }`}
                            >
                              <Check className="size-3 stroke-[2.5px]" />
                            </button>
                            <span
                              className={`text-xs font-semibold leading-normal min-w-0 truncate ${
                                task.completed ? "text-muted-foreground line-through font-normal" : "text-foreground"
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>

                          <button
                            onClick={() => deleteTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-500 transition-all p-0.5 shrink-0"
                            aria-label="할 일 삭제"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* None/General Category tasks */}
              {tasksByTag.none.length > 0 && (
                <div className="space-y-2.5 pt-1.5">
                  <div className="flex items-center gap-1.5 select-none pl-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      일반 할 일
                    </span>
                  </div>

                  <div className="space-y-2 pl-1.5">
                    {tasksByTag.none.map((task) => (
                      <div
                        key={task.id}
                        className="group flex min-h-11 items-center justify-between gap-3 py-2.5 px-3.5 border border-zinc-200/80 dark:border-zinc-800/95 bg-card/60 rounded-2xl shadow-xs transition-all hover:bg-secondary/15 hover:border-zinc-400 dark:hover:border-zinc-650"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`grid size-5 shrink-0 place-items-center rounded border-1.5 transition-colors ${
                              task.completed
                                ? "border-foreground bg-foreground text-background"
                                : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 text-transparent bg-transparent"
                            }`}
                          >
                            <Check className="size-3 stroke-[2.5px]" />
                          </button>
                          <span
                            className={`text-xs font-semibold leading-normal min-w-0 truncate ${
                              task.completed ? "text-muted-foreground line-through font-normal" : "text-foreground"
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>

                        <button
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-500 transition-all p-0.5 shrink-0"
                          aria-label="할 일 삭제"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="py-16 text-center text-xs font-semibold text-muted-foreground select-none border border-dashed border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl bg-card/25 animate-in fade-in">
              선택된 날짜의 할 일이 없습니다.
            </div>
          )}
        </section>
      </div>

      {/* Add Todo Dialog Modal */}
      {isTodoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-card border border-border/80 p-4.5 rounded-3xl space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                할 일 추가 ({selectedTag ? `${selectedTag} 카테고리` : formattedSelectedDate})
              </span>
              <button
                onClick={() => {
                  setIsTodoModalOpen(false);
                  setNewTodoText("");
                  setSelectedTag(null);
                }}
                className="p-1 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                aria-label="닫기"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddTodoSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="todo-name" className="text-[9px] font-bold text-muted-foreground uppercase">할 일 이름</label>
                <Input
                  id="todo-name"
                  autoFocus
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  placeholder={selectedTag ? `${selectedTag} 할 일 입력...` : "무엇을 해야 하나요?"}
                  className="h-10 border-border bg-secondary/30 px-3.5 text-xs text-foreground focus-visible:ring-primary shadow-none"
                />
              </div>

              <div className="flex gap-2 pt-1 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsTodoModalOpen(false);
                    setNewTodoText("");
                    setSelectedTag(null);
                  }}
                  className="px-3.5 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!newTodoText.trim()}
                  className="px-4 py-1.5 text-[11px] font-bold text-background bg-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm cursor-pointer"
                >
                  추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
