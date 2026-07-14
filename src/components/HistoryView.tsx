import { useMemo } from "react";
import { BarChart3, Flame, Award, Calendar, AlertTriangle } from "lucide-react";
import { useTodoStore } from "../store/useTodoStore";
import {
  commitmentStreak,
  weeklyConsistency,
  commitmentActivity,
  calendarDateInTimeZone,
} from "../domain/task";
import { Card, CardContent } from "./ui/card";

export function HistoryView() {
  const { commitmentHistory, restWeekdays } = useTodoStore();

  const todayStr = useMemo(() => {
    return calendarDateInTimeZone(new Date(), "Asia/Seoul");
  }, []);

  const currentStreak = useMemo(() => {
    return commitmentStreak(commitmentHistory, todayStr, restWeekdays);
  }, [commitmentHistory, todayStr, restWeekdays]);

  const weekStartStr = "2026-07-12";
  const consistencyRate = useMemo(() => {
    return weeklyConsistency(commitmentHistory, weekStartStr);
  }, [commitmentHistory, weekStartStr]);

  const activityMap = useMemo(() => {
    const list = commitmentActivity(commitmentHistory);
    return new Map(list.map((a) => [a.date, a]));
  }, [commitmentHistory]);

  const gridCells = useMemo(() => {
    const cells = [];
    const now = new Date();
    for (let i = 363; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      
      const activity = activityMap.get(dateStr);
      cells.push({
        dateStr,
        activity,
      });
    }
    return cells;
  }, [activityMap]);

  const getCellColor = (rate: number | undefined, planned: number | undefined) => {
    if (planned === undefined || planned === 0) {
      return "bg-secondary/35 dark:bg-zinc-900/30 hover:opacity-80"; 
    }
    if (rate === 0) {
      return "bg-secondary/60 dark:bg-zinc-800/40 hover:opacity-80";    
    }
    if (rate! < 50) {
      return "bg-secondary dark:bg-zinc-800/80 hover:opacity-80";    
    }
    if (rate! < 100) {
      return "bg-muted-foreground/60 dark:bg-zinc-650 hover:opacity-80";   
    }
    return "bg-primary dark:bg-white hover:opacity-80";        
  };

  const failPatterns = [
    { label: "과도한 계획 수립", value: 45, color: "bg-primary dark:bg-white" },
    { label: "컨디션 조절 실패", value: 30, color: "bg-muted-foreground/80 dark:bg-zinc-500" },
    { label: "예상치 못한 미팅", value: 15, color: "bg-secondary dark:bg-zinc-800" },
    { label: "기타 사유", value: 10, color: "bg-secondary/40 dark:bg-zinc-900" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-1.5">
          <BarChart3 className="size-4.5 text-foreground" />
          성과 및 리포트
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          완료 개수가 아닙니다. 약속을 지키는 견고함 및 장애 요인을 분석합니다.
        </p>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid gap-3.5 sm:grid-cols-3">
        <Card className="border border-border/80 shadow-none bg-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="size-10 rounded-full bg-secondary flex items-center justify-center text-foreground shrink-0 select-none">
              <Flame className="size-5 fill-current text-orange-500" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground block uppercase">
                현재 약속 스트릭
              </span>
              <span className="text-xl font-bold text-foreground">{currentStreak}일 연속</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-none bg-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="size-10 rounded-full bg-secondary flex items-center justify-center text-foreground shrink-0 select-none">
              <Award className="size-5 text-foreground" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground block uppercase">
                이번 주 약속 일관성
              </span>
              <span className="text-xl font-bold text-foreground">{consistencyRate}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-none bg-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="size-10 rounded-full bg-secondary flex items-center justify-center text-foreground shrink-0 select-none">
              <Calendar className="size-5 text-foreground" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground block uppercase">
                기록된 활동일수
              </span>
              <span className="text-xl font-bold text-foreground">
                {activityMap.size}일
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap Grid Card */}
      <Card className="border border-border/80 shadow-none bg-card">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <span className="text-xs font-semibold text-foreground block">
            연간 핵심 약속 이행률
          </span>

          <div className="overflow-x-auto pb-2">
            <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-[620px] h-[90px]">
              {gridCells.map((cell) => (
                <div
                  key={cell.dateStr}
                  title={`${cell.dateStr}: ${
                    cell.activity
                      ? `${cell.activity.completed}/${cell.activity.planned} (${cell.activity.rate}%)`
                      : "계획 없음"
                  }`}
                  className={`size-2.2 rounded-[1.5px] transition-colors ${getCellColor(
                    cell.activity?.rate,
                    cell.activity?.planned
                  )}`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border">
            <span>364일 전</span>
            <div className="flex items-center gap-1">
              <span>낮음</span>
              <div className="size-2 rounded-[1.5px] bg-secondary/35 dark:bg-zinc-900/30" />
              <div className="size-2 rounded-[1.5px] bg-secondary/60 dark:bg-zinc-800/40" />
              <div className="size-2 rounded-[1.5px] bg-secondary dark:bg-zinc-850" />
              <div className="size-2 rounded-[1.5px] bg-muted-foreground/60 dark:bg-zinc-650" />
              <div className="size-2 rounded-[1.5px] bg-primary dark:bg-white" />
              <span>높음</span>
            </div>
            <span>오늘</span>
          </div>
        </CardContent>
      </Card>

      {/* Fail Reasons Analysis Card */}
      <Card className="border border-border/80 shadow-none bg-card">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <AlertTriangle className="size-4 text-muted-foreground" />
            자주 발생하는 핵심 장애 요인
          </span>

          <div className="space-y-3.5">
            {failPatterns.map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="text-foreground">{item.value}%</span>
                </div>
                <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
