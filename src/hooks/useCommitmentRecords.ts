// tasks → CommitmentRecord[] 파생. App/HistoryView이 공유하던 변환을 단일화.
import { useMemo } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { tasksToCommitmentRecords } from "@/domain/derive";

export function useCommitmentRecords() {
  const tasks = useTaskStore((s) => s.tasks);
  return useMemo(() => tasksToCommitmentRecords(tasks), [tasks]);
}
