import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BarChart3, Flame, Award, Calendar, AlertTriangle } from "lucide-react";
import { useCurrentStreak } from "@/hooks/useCurrentStreak";
import { useWeeklyConsistency } from "@/hooks/useWeeklyConsistency";
import { useCommitmentActivity } from "@/hooks/useCommitmentActivity";
import { Card, CardContent } from "@/components/ui/card";

// TODO: weekStart는 현재 하드코딩되어 있음. 주간 경계 계산으로 교체 필요 (원본 동작 보존).
const WEEK_START = "2026-07-12";

interface FailPattern {
  labelKey: string;
  value: number;
  color: string;
}

export function HistoryView() {
  const { t } = useTranslation();
  const currentStreak = useCurrentStreak();
  const consistencyRate = useWeeklyConsistency(WEEK_START);
  const activityMap = useCommitmentActivity();

  const failPatterns: FailPattern[] = useMemo(
    () => [
      { labelKey: "history.failPatterns.overplanning", value: 45, color: "bg-primary dark:bg-white" },
      { labelKey: "history.failPatterns.condition", value: 30, color: "bg-muted-foreground/80 dark:bg-zinc-500" },
      { labelKey: "history.failPatterns.meeting", value: 15, color: "bg-secondary dark:bg-zinc-800" },
      { labelKey: "history.failPatterns.other", value: 10, color: "bg-secondary/40 dark:bg-zinc-900" },
    ],
    [],
  );

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
      return "bg-muted-foreground/60 dark:bg-zinc-65 hover:opacity-80";
    }
    return "bg-primary dark:bg-white hover:opacity-80";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-1.5">
          <BarChart3 className="size-4.5 text-foreground" />
          {t("history.header")}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          {t("history.subheader")}
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
                {t("history.stats.currentStreak")}
              </span>
              <span className="text-xl font-bold text-foreground">
                {t("history.stats.streakValue", { count: currentStreak })}
              </span>
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
                {t("history.stats.weeklyConsistency")}
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
                {t("history.stats.activeDays")}
              </span>
              <span className="text-xl font-bold text-foreground">
                {t("history.stats.activeDaysValue", { count: activityMap.size })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap Grid Card */}
      <Card className="border border-border/80 shadow-none bg-card">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <span className="text-xs font-semibold text-foreground block">
            {t("history.heatmap.title")}
          </span>

          <div className="overflow-x-auto pb-2">
            <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-[620px] h-[90px]">
              {gridCells.map((cell) => (
                <div
                  key={cell.dateStr}
                  title={`${cell.dateStr}: ${
                    cell.activity
                      ? `${cell.activity.completed}/${cell.activity.planned} (${cell.activity.rate}%)`
                      : t("history.heatmap.noPlan")
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
            <span>{t("history.heatmap.rangeStart")}</span>
            <div className="flex items-center gap-1">
              <span>{t("history.heatmap.legendLow")}</span>
              <div className="size-2 rounded-[1.5px] bg-secondary/35 dark:bg-zinc-900/30" />
              <div className="size-2 rounded-[1.5px] bg-secondary/60 dark:bg-zinc-800/40" />
              <div className="size-2 rounded-[1.5px] bg-secondary dark:bg-zinc-850" />
              <div className="size-2 rounded-[1.5px] bg-muted-foreground/60 dark:bg-zinc-65" />
              <div className="size-2 rounded-[1.5px] bg-primary dark:bg-white" />
              <span>{t("history.heatmap.legendHigh")}</span>
            </div>
            <span>{t("history.heatmap.rangeEnd")}</span>
          </div>
        </CardContent>
      </Card>

      {/* Fail Reasons Analysis Card */}
      <Card className="border border-border/80 shadow-none bg-card">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <AlertTriangle className="size-4 text-muted-foreground" />
            {t("history.failPatternTitle")}
          </span>

          <div className="space-y-3.5">
            {failPatterns.map((item) => (
              <div key={item.labelKey} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">{t(item.labelKey)}</span>
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
