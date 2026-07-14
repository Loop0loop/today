// 현재 완료 스트릭. records + 오늘 + 휴식요일로 계산.
// App.tsx 헤더가 사용하던 로직을 그대로 옮겼다.
import { useMemo } from "react";
import { commitmentStreak } from "@/domain/task";
import { useCommitmentRecords } from "./useCommitmentRecords";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useToday } from "@/lifecycle/hooks/useToday";

export function useCurrentStreak(): number {
  const records = useCommitmentRecords();
  const restWeekdays = useSettingsStore((s) => s.restWeekdays);
  const today = useToday();

  return useMemo(
    () => commitmentStreak(records, today, restWeekdays),
    [records, today, restWeekdays],
  );
}
