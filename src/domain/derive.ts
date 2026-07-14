// Task 엔티티를 도메인 순수 로직 입력(CommitmentRecord)으로 변환.
// App/HistoryView/MonthlyCalendar에 복붙되어 있던 변환을 단일화한다.

import type { Task } from "./types";
import type { CommitmentRecord } from "./task";

export function tasksToCommitmentRecords(
  tasks: readonly Task[],
): CommitmentRecord[] {
  const totals = new Map<string, { planned: number; completed: number }>();

  for (const task of tasks) {
    const stat = totals.get(task.date) ?? { planned: 0, completed: 0 };
    stat.planned += 1;
    if (task.completed) stat.completed += 1;
    totals.set(task.date, stat);
  }

  return [...totals.entries()].map(([date, stat]) => ({
    commitmentDate: date,
    outcome:
      stat.planned > 0 && stat.completed === stat.planned
        ? ("completed" as const)
        : null,
  }));
}
