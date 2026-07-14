import { useMemo } from "react";
import { ChevronDown, Clover, Check } from "lucide-react";
import { useTodoStore } from "../store/useTodoStore";
import { commitmentActivity } from "../domain/task";

export function MonthlyCalendar() {
  const { commitmentHistory } = useTodoStore();

  const year = 2026;
  const month = 7;
  const todayDateNum = 14;

  const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

  const activityMap = useMemo(() => {
    const list = commitmentActivity(commitmentHistory);
    return new Map(list.map((a) => [a.date, a]));
  }, [commitmentHistory]);

  const calendarDays = useMemo(() => {
    const days = [];
    const startPadding = 2; // Wed start

    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    for (let d = 1; d <= 31; d++) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const activity = activityMap.get(dateStr);
      days.push({
        dayNum: d,
        dateStr,
        activity,
      });
    }

    return days;
  }, [activityMap]);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Compact Header */}
      <div className="flex items-center gap-1 cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-sm font-bold tracking-tight text-zinc-300">
          {year}년 {month}월
        </span>
        <ChevronDown className="size-3.5 text-zinc-500" />
      </div>

      {/* Grid calendar (No heavy borders or background) */}
      <div className="space-y-3">
        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekdays.map((wd) => (
            <span key={wd} className="text-[10px] font-bold text-zinc-650">
              {wd}
            </span>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-y-3 gap-x-2.5 justify-items-center">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={`pad-${index}`} className="size-8" />;
            }

            const isToday = day.dayNum === todayDateNum;
            const completedAll =
              day.activity &&
              day.activity.planned > 0 &&
              day.activity.completed === day.activity.planned;

            const isBlueGradientCheck = day.dayNum === 7;
            const isGreenCheck = day.dayNum === 8 || day.dayNum === 9;

            return (
              <div
                key={day.dateStr}
                className="relative size-8 flex items-center justify-center select-none"
              >
                {isToday ? (
                  <div className="absolute inset-0 size-8 rounded-full bg-white flex items-center justify-center text-zinc-950 font-bold text-xs z-10">
                    {day.dayNum}
                  </div>
                ) : isBlueGradientCheck ? (
                  <div className="absolute inset-0 size-8 rounded-[9px] bg-gradient-to-br from-blue-500/90 to-purple-600/90 flex items-center justify-center text-white z-10">
                    <Check className="size-4 stroke-[2.5px]" />
                  </div>
                ) : isGreenCheck || completedAll ? (
                  <div className="absolute inset-0 size-8 rounded-[9px] bg-emerald-500/90 flex items-center justify-center text-white z-10">
                    <Check className="size-4 stroke-[2.5px]" />
                  </div>
                ) : (
                  <>
                    <Clover className="absolute inset-0 size-8 text-zinc-900 stroke-[1px] opacity-35" />
                    <span className="relative text-[11px] font-medium text-zinc-450 z-10">
                      {day.dayNum}
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
