import assert from "node:assert/strict";
import test from "node:test";

import {
  applyRolloverDecision,
  calendarDateInTimeZone,
  commitmentActivity,
  commitmentStreak,
  nextCommitmentSlot,
  weeklyConsistency,
} from "../src/domain/task.ts";

test("uses the first free commitment slot", () => {
  assert.equal(nextCommitmentSlot([1, 3]), 2);
  assert.equal(nextCommitmentSlot([1, 2, 3]), null);
});

test("applies rollover decisions", () => {
  assert.deepEqual(applyRolloverDecision({ type: "today", nextDate: "2026-07-14" }), {
    scheduledFor: "2026-07-14",
    status: "planned",
  });
  assert.deepEqual(applyRolloverDecision({ type: "someday" }), {
    scheduledFor: null,
    status: "planned",
  });
  assert.deepEqual(applyRolloverDecision({ type: "abandon" }), {
    scheduledFor: null,
    status: "abandoned",
  });
  assert.throws(
    () => applyRolloverDecision({ type: "reschedule", nextDate: "2026-02-30" }),
    /Invalid next date/,
  );
});

test("uses the user's calendar date", () => {
  const now = new Date("2026-07-14T15:30:00Z");
  assert.equal(calendarDateInTimeZone(now, "Asia/Seoul"), "2026-07-15");
  assert.equal(calendarDateInTimeZone(now, "America/Los_Angeles"), "2026-07-14");
});

test("calculates activity, consistency, and streak", () => {
  const records = [
    { commitmentDate: "2026-07-09", outcome: "completed" },
    { commitmentDate: "2026-07-10", outcome: "completed" },
    { commitmentDate: "2026-07-13", outcome: "completed" },
    { commitmentDate: "2026-07-14", outcome: "completed" },
    { commitmentDate: "2026-07-14", outcome: "deferred" },
  ] as const;

  assert.deepEqual(commitmentActivity(records).at(-1), {
    date: "2026-07-14",
    planned: 2,
    completed: 1,
    rate: 50,
  });
  assert.equal(weeklyConsistency(records, "2026-07-08"), 80);
  assert.equal(commitmentStreak(records.slice(0, 4), "2026-07-14", [0, 6]), 4);
  assert.equal(commitmentStreak(records, "2026-07-14", [0, 6]), 0);
  assert.equal(commitmentStreak(records.slice(0, 3), "2026-07-14", [0, 6]), 3);
  assert.equal(
    commitmentStreak(
      [...records.slice(0, 3), { commitmentDate: "2026-07-14", outcome: null }],
      "2026-07-14",
      [0, 6],
    ),
    3,
  );
});
