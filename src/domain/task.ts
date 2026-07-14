export type TaskStatus =
  | "planned"
  | "in_progress"
  | "completed"
  | "deferred"
  | "abandoned";

export type CommitmentOutcome = "completed" | "deferred" | "abandoned";
export type CommitmentSlot = 1 | 2 | 3;

export type CommitmentRecord = {
  commitmentDate: string;
  outcome: CommitmentOutcome | null;
};

export type DailyActivity = {
  date: string;
  planned: number;
  completed: number;
  rate: number;
};

export type RolloverDecision =
  | { type: "today" | "reschedule"; nextDate: string }
  | { type: "someday" | "abandon" };

export function nextCommitmentSlot(
  usedSlots: readonly CommitmentSlot[],
): CommitmentSlot | null {
  return ([1, 2, 3] as const).find((slot) => !usedSlots.includes(slot)) ?? null;
}

export function applyRolloverDecision(decision: RolloverDecision): {
  scheduledFor: string | null;
  status: TaskStatus;
} {
  if (decision.type === "today" || decision.type === "reschedule") {
    if (!isCalendarDate(decision.nextDate)) throw new Error("Invalid next date");
    return { scheduledFor: decision.nextDate, status: "planned" };
  }

  return {
    scheduledFor: null,
    status: decision.type === "abandon" ? "abandoned" : "planned",
  };
}

export function calendarDateInTimeZone(now: Date, timeZone: string): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(now)
      .map(({ type, value }) => [type, value]),
  );

  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function commitmentActivity(
  records: readonly CommitmentRecord[],
): DailyActivity[] {
  const totals = new Map<string, { planned: number; completed: number }>();

  for (const { commitmentDate, outcome } of records) {
    if (!isCalendarDate(commitmentDate)) throw new Error("Invalid commitment date");
    const total = totals.get(commitmentDate) ?? { planned: 0, completed: 0 };
    total.planned += 1;
    if (outcome === "completed") total.completed += 1;
    totals.set(commitmentDate, total);
  }

  return [...totals]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, total]) => ({
      date,
      ...total,
      rate: Math.round((total.completed / total.planned) * 100),
    }));
}

export function weeklyConsistency(
  records: readonly CommitmentRecord[],
  weekStart: string,
): number {
  if (!isCalendarDate(weekStart)) throw new Error("Invalid week start");
  const weekEnd = addDays(weekStart, 7);
  const days = commitmentActivity(records).filter(
    ({ date }) => date >= weekStart && date < weekEnd,
  );
  const planned = days.reduce((total, day) => total + day.planned, 0);
  const completed = days.reduce((total, day) => total + day.completed, 0);
  return planned === 0 ? 0 : Math.round((completed / planned) * 100);
}

export function commitmentStreak(
  records: readonly CommitmentRecord[],
  throughDate: string,
  restWeekdays: readonly number[] = [],
): number {
  if (!isCalendarDate(throughDate)) throw new Error("Invalid streak date");
  if (restWeekdays.some((day) => !Number.isInteger(day) || day < 0 || day > 6)) {
    throw new Error("Invalid rest weekday");
  }

  const days = commitmentActivity(records);
  if (days.length === 0) return 0;

  const byDate = new Map(days.map((day) => [day.date, day]));
  const rest = new Set(restWeekdays);
  const earliest = days[0].date;
  let cursor = throughDate;
  let streak = 0;

  const currentRecords = records.filter(
    ({ commitmentDate }) => commitmentDate === throughDate,
  );
  const currentDayIsOpen =
    currentRecords.length === 0 ||
    (currentRecords.some(({ outcome }) => outcome === null) &&
      currentRecords.every(
        ({ outcome }) => outcome === null || outcome === "completed",
      ));
  if (currentDayIsOpen && !rest.has(new Date(`${cursor}T00:00:00Z`).getUTCDay())) {
    cursor = addDays(cursor, -1);
  }

  while (cursor >= earliest) {
    if (!rest.has(new Date(`${cursor}T00:00:00Z`).getUTCDay())) {
      const day = byDate.get(cursor);
      if (!day || day.completed !== day.planned) break;
      streak += 1;
    }
    cursor = addDays(cursor, -1);
  }

  return streak;
}

function addDays(value: string, amount: number): string {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().startsWith(value);
}
