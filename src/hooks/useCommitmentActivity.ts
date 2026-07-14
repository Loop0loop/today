// records → DailyActivity Map. HistoryView/MonthlyCalendar이 사용하던 파생.
import { useMemo } from "react";
import { commitmentActivity, type DailyActivity } from "@/domain/task";
import { useCommitmentRecords } from "./useCommitmentRecords";

export function useCommitmentActivity(): Map<string, DailyActivity> {
  const records = useCommitmentRecords();
  return useMemo(() => {
    const list = commitmentActivity(records);
    return new Map(list.map((a) => [a.date, a]));
  }, [records]);
}
