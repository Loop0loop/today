import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clover, Check } from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { useUiStore } from "@/store/useUiStore";
import { useToday } from "@/lifecycle/hooks/useToday";

export function MonthlyCalendar() {
  const setSelectedDate = useUiStore((s) => s.setSelectedDate);
  const selectedDate = useUiStore((s) => s.selectedDate);
  const systemTodayStr = useToday();
  const tasks = useTaskStore((s) => s.tasks);

  // tasks → {date → planned/completed} 맵. useCommitmentActivity 훅은 DailyActivity
  // 기반이라 형태가 달라 여기서는 원본 동작 그대로 task 기반 맵을 로컬 파생한다.
  const taskActivityMap = useMemo(() => {
    const map = new Map<string, { planned: number; completed: number }>();
    tasks.forEach((t) => {
      const stats = map.get(t.date) || { planned: 0, completed: 0 };
      stats.planned += 1;
      if (t.completed) stats.completed += 1;
      map.set(t.date, stats);
    });
    return map;
  }, [tasks]);

  const systemToday = useMemo(() => {
    const parts = systemTodayStr.split("-").map(Number);
    return { year: parts[0], month: parts[1], day: parts[2] };
  }, [systemTodayStr]);

  const [currentYear, setCurrentYear] = useState(systemToday.year);
  const [currentMonth, setCurrentMonth] = useState(systemToday.month);

  const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((prev) => prev - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear((prev) => prev + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleGoToToday = () => {
    setCurrentYear(systemToday.year);
    setCurrentMonth(systemToday.month);
    setSelectedDate(systemTodayStr);
  };

  const calendarDays = useMemo(() => {
    const days = [];
    const firstDayObj = new Date(currentYear, currentMonth - 1, 1);
    const jsDay = firstDayObj.getDay();
    const startPadding = jsDay === 0 ? 6 : jsDay - 1;

    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    const lastDateObj = new Date(currentYear, currentMonth, 0);
    const lastDate = lastDateObj.getDate();

    for (let d = 1; d <= lastDate; d++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const stats = taskActivityMap.get(dateStr);
      days.push({
        dayNum: d,
        dateStr,
        stats,
      });
    }

    return days;
  }, [currentYear, currentMonth, taskActivityMap]);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            aria-label="이전 달"
          >
            <ChevronLeft className="size-4" />
          </button>

          <span className="text-sm font-bold tracking-tight text-foreground select-none">
            {currentYear}년 {currentMonth}월
          </span>

          <button
            onClick={handleNextMonth}
            className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            aria-label="다음 달"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <button
          onClick={handleGoToToday}
          className="text-[10px] font-bold px-2 py-1 rounded border border-border text-muted-foreground hover:text-foreground hover:border-zinc-500 transition-all cursor-pointer bg-secondary/30"
        >
          오늘
        </button>
      </div>

      <div className="space-y-2.5">
        <div className="grid grid-cols-7 gap-1 text-center select-none">
          {weekdays.map((wd) => (
            <span key={wd} className="text-[10px] font-bold text-muted-foreground/60">
              {wd}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-3.5 gap-x-2.5 justify-items-center">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={`pad-${index}`} className="size-8" />;
            }

            const isSelected = selectedDate === day.dateStr;
            const isToday = systemTodayStr === day.dateStr;

            const completedAll =
              day.stats &&
              day.stats.planned > 0 &&
              day.stats.completed === day.stats.planned;

            // Custom gradients for mock design feel on specific dates
            const isBlueGradientCheck = day.dayNum === 7 && currentMonth === 7 && currentYear === 2026;
            const isGreenCheck = (day.dayNum === 8 || day.dayNum === 9) && currentMonth === 7 && currentYear === 2026;

            return (
              <button
                key={day.dateStr}
                onClick={() => setSelectedDate(day.dateStr)}
                className="relative size-8 flex items-center justify-center cursor-pointer select-none transition-transform active:scale-90"
              >
                {isSelected ? (
                  <div className="absolute inset-0 size-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xs z-10 shadow-xs">
                    {day.dayNum}
                  </div>
                ) : isBlueGradientCheck ? (
                  <div className="absolute inset-0 size-8 rounded-[9px] bg-gradient-to-br from-blue-500/90 to-purple-600/90 flex items-center justify-center text-white z-10">
                    <Check className="size-4 stroke-[2.5px]" />
                  </div>
                ) : isGreenCheck || completedAll ? (
                  <div className={`absolute inset-0 size-8 rounded-[9px] bg-emerald-500 flex items-center justify-center text-white z-10 ${isToday ? "ring-2 ring-foreground" : ""}`}>
                    <Check className="size-4 stroke-[2.5px]" />
                  </div>
                ) : (
                  <>
                    <Clover className={`absolute inset-0 size-8 stroke-[1px] ${
                      isToday
                        ? "text-primary opacity-90 stroke-[1.5px]"
                        : "text-muted-foreground/30 dark:text-zinc-900 opacity-35"
                    }`} />
                    <span className={`relative text-[11px] font-bold z-10 ${
                      isToday
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}>
                      {day.dayNum}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
