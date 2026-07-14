// 주간 일관성(%) 계산. weekStart는 호출자가 지정한다.
import { useMemo } from "react";
import { weeklyConsistency } from "@/domain/task";
import { useCommitmentRecords } from "./useCommitmentRecords";

export function useWeeklyConsistency(weekStart: string): number {
  const records = useCommitmentRecords();
  return useMemo(
    () => weeklyConsistency(records, weekStart),
    [records, weekStart],
  );
}
