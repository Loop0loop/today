import React, { useState } from "react";
import {
  Check,
  Plus,
  Sparkles,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useTodoStore } from "../store/useTodoStore";
import { Input } from "./ui/input";
import { TaskStatus } from "../domain/task";
import { MonthlyCalendar } from "./MonthlyCalendar";

export function TodayView() {
  const {
    tasks,
    commitments,
    rolloverTasks,
    addTask,
    toggleTask,
    deleteTask,
    addCommitment,
    toggleCommitment,
    changeCommitmentStatus,
    deleteCommitment,
    resolveRollover,
  } = useTodoStore();

  const [newTodoText, setNewTodoText] = useState("");
  const [targetSlot, setTargetSlot] = useState<number | "task">("task");
  
  const [activeAddSlot, setActiveAddSlot] = useState<number | null>(null);
  const [inlineCommitmentText, setInlineCommitmentText] = useState("");

  const [isRolloverExpanded, setIsRolloverExpanded] = useState(false);

  const pendingRollovers = rolloverTasks.filter((r) => !r.resolved);

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    if (targetSlot === "task") {
      addTask(newTodoText.trim());
    } else {
      addCommitment(newTodoText.trim(), targetSlot as 1 | 2 | 3);
    }
    setNewTodoText("");
    setTargetSlot("task");
  };

  const handleInlineCommitmentSubmit = (slot: 1 | 2 | 3) => {
    if (!inlineCommitmentText.trim()) {
      setActiveAddSlot(null);
      return;
    }
    addCommitment(inlineCommitmentText.trim(), slot);
    setInlineCommitmentText("");
    setActiveAddSlot(null);
  };

  const commBySlot = (slot: 1 | 2 | 3) => commitments.find((c) => c.slot === slot);

  const statusColorClass = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return "text-muted-foreground line-through font-normal";
      case "deferred":
        return "text-amber-500 font-semibold";
      case "abandoned":
        return "text-rose-500/70 font-semibold";
      case "in_progress":
        return "text-primary font-semibold";
      default:
        return "text-foreground";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start animate-in fade-in duration-300">
      
      {/* LEFT COLUMN: Profile & Monthly Calendar (Ultra Minimal) */}
      <div className="space-y-8">
        
        {/* Simple Profile Name (No borders/background card) */}
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-secondary flex items-center justify-center font-bold text-muted-foreground text-sm shrink-0 select-none">
            엄
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground tracking-tight">엄세훈</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">Today First</p>
          </div>
        </div>

        {/* Squircle Monthly Calendar */}
        <div className="pt-2 border-t border-border">
          <MonthlyCalendar />
        </div>
      </div>

      {/* RIGHT COLUMN: Tasks & Commitments (Ultra Minimal, no Cards) */}
      <div className="space-y-8">
        
        {/* Rollover Section (Text Banner style) */}
        {pendingRollovers.length > 0 && (
          <div className="p-3 bg-secondary/30 border border-border rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4 text-amber-500/80 shrink-0" />
                <span className="text-[11px] font-bold text-muted-foreground">
                  어제 미완료 할 일 {pendingRollovers.length}개
                </span>
              </div>
              <button
                className="text-[10px] font-bold text-muted-foreground hover:text-foreground"
                onClick={() => setIsRolloverExpanded(!isRolloverExpanded)}
              >
                {isRolloverExpanded ? "숨기기" : "정리하기"}
              </button>
            </div>

            {isRolloverExpanded && (
              <div className="divide-y divide-border pt-1.5 space-y-2">
                {pendingRollovers.map((item) => (
                  <div key={item.id} className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs text-foreground font-semibold">{item.title}</span>
                    <div className="flex gap-1.5">
                      <button
                        className="text-[10px] font-bold text-muted-foreground hover:text-foreground bg-secondary px-2 py-1 rounded"
                        onClick={() => resolveRollover(item.id, { type: "today", nextDate: "" })}
                      >
                        오늘
                      </button>
                      <button
                        className="text-[10px] font-bold text-muted-foreground hover:text-foreground bg-secondary px-2 py-1 rounded"
                        onClick={() => resolveRollover(item.id, { type: "someday" })}
                      >
                        언젠가
                      </button>
                      <button
                        className="text-[10px] font-bold text-rose-500 hover:text-rose-450 bg-secondary px-2 py-1 rounded"
                        onClick={() => resolveRollover(item.id, { type: "abandon" })}
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

        {/* Minimal input line (No cards/shadows) */}
        <form className="flex items-center gap-3 border-b border-border pb-2" onSubmit={handleAddTaskSubmit}>
          <Input
            aria-label="새 할 일 또는 약속"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="할 일 추가..."
            className="flex-1 h-8 border-none bg-transparent p-0 text-xs text-foreground focus-visible:ring-0 shadow-none placeholder:text-muted-foreground"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <select
              aria-label="추가 위치 선택"
              value={targetSlot}
              onChange={(e) => {
                const val = e.target.value;
                setTargetSlot(val === "task" ? "task" : Number(val));
              }}
              className="h-7 rounded border border-border bg-transparent px-2 text-[10px] font-bold text-muted-foreground focus:outline-none cursor-pointer"
            >
              <option value="task">일반 할 일</option>
              <option value="1" disabled={!!commBySlot(1)}>약속 1</option>
              <option value="2" disabled={!!commBySlot(2)}>약속 2</option>
              <option value="3" disabled={!!commBySlot(3)}>약속 3</option>
            </select>

            <button type="submit" aria-label="추가" className="size-7 rounded bg-secondary hover:bg-border text-muted-foreground flex items-center justify-center transition-colors">
              <Plus className="size-3.5" />
            </button>
          </div>
        </form>

        {/* 오늘의 약속 (Ultra Minimal List style) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="size-3" /> 오늘의 약속
            </h2>
            <span className="text-[10px] font-bold text-muted-foreground">
              {commitments.filter((c) => c.status === "completed").length}/3 완료
            </span>
          </div>

          <div className="divide-y divide-border">
            {([1, 2, 3] as const).map((slot) => {
              const item = commBySlot(slot);

              if (item) {
                return (
                  <div key={item.id} className="flex items-center justify-between gap-3 py-3 group">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        onClick={() => toggleCommitment(item.id)}
                        className={`grid size-5 shrink-0 place-items-center rounded-full border-1.5 transition-colors ${
                          item.status === "completed"
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:border-zinc-400 text-transparent"
                        }`}
                      >
                        <Check className="size-3" strokeWidth={3} />
                      </button>

                      <div className="min-w-0 flex-1">
                        <span className={`text-xs font-bold leading-normal truncate ${statusColorClass(item.status)}`}>
                          {item.title}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <select
                        aria-label="약속 상태 변경"
                        value={item.status}
                        onChange={(e) => changeCommitmentStatus(item.id, e.target.value as TaskStatus)}
                        className="text-[10px] font-bold text-muted-foreground bg-transparent border-none py-0.5 pl-1 pr-3 rounded focus:ring-0 focus:outline-none hover:text-foreground cursor-pointer appearance-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='none' stroke='rgb(113,113,122)' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2500/svg'><path d='M19 9l-7 7-7-7'></path></svg>")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right center',
                          backgroundSize: '7px'
                        }}
                      >
                        <option value="planned">예정</option>
                        <option value="in_progress">진행 중</option>
                        <option value="completed">완료</option>
                        <option value="deferred">미룸</option>
                        <option value="abandoned">포기</option>
                      </select>

                      <button
                        onClick={() => deleteCommitment(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-500 transition-all p-1"
                        aria-label="약속 삭제"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                );
              }

              // Empty Slot (Simple inline indicator)
              return (
                <div key={`empty-${slot}`} className="py-2.5">
                  {activeAddSlot === slot ? (
                    <div className="flex gap-2 items-center">
                      <Input
                        autoFocus
                        value={inlineCommitmentText}
                        onChange={(e) => setInlineCommitmentText(e.target.value)}
                        placeholder={`슬롯 ${slot} 등록...`}
                        className="h-7 text-xs border-border bg-transparent shadow-none text-foreground focus-visible:ring-0 focus-visible:border-zinc-400"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleInlineCommitmentSubmit(slot);
                          if (e.key === "Escape") setActiveAddSlot(null);
                        }}
                      />
                      <button
                        className="text-[10px] font-bold text-muted-foreground hover:text-foreground shrink-0"
                        onClick={() => setActiveAddSlot(null)}
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setInlineCommitmentText("");
                        setActiveAddSlot(slot);
                      }}
                      className="text-[11px] font-bold text-muted-foreground/80 hover:text-foreground flex items-center gap-1.5 py-0.5 transition-colors"
                    >
                      <Plus className="size-3" />
                      <span>슬롯 {slot} 지정</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* General Tasks (No cards) */}
        <section className="space-y-3 pt-2 border-t border-border">
          <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            일반 할 일 ({tasks.length})
          </h2>

          <div className="divide-y divide-border">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex min-h-11 items-center justify-between gap-3 py-2.5 hover:bg-secondary/15 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`grid size-4.5 shrink-0 place-items-center rounded border transition-colors ${
                        task.completed
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-zinc-400 text-transparent"
                      }`}
                    >
                      <Check className="size-3" strokeWidth={3} />
                    </button>
                    <span
                      className={`text-xs font-semibold leading-normal min-w-0 truncate ${
                        task.completed ? "text-muted-foreground line-through" : "text-foreground"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-500 transition-all shrink-0 p-1"
                    aria-label="할 일 삭제"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-[11px] text-muted-foreground">
                예정된 일반 할 일이 없습니다.
              </div>
            )}
          </div>
        </section>
      </div>

    </div>
  );
}
