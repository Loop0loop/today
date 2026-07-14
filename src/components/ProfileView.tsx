import React from "react";
import { UserRound, Coffee, Bell, ShieldCheck, SunMoon } from "lucide-react";
import { useTodoStore } from "../store/useTodoStore";
import { Card, CardContent } from "./ui/card";

export function ProfileView() {
  const {
    restWeekdays,
    remindCount,
    remindTime,
    theme,
    toggleRestWeekday,
    setRemindSettings,
    setTheme,
  } = useTodoStore();

  const weekdays = [
    { label: "일", value: 0 },
    { label: "월", value: 1 },
    { label: "화", value: 2 },
    { label: "수", value: 3 },
    { label: "목", value: 4 },
    { label: "금", value: 5 },
    { label: "토", value: 6 },
  ];

  const handleRemindCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRemindSettings(Number(e.target.value), remindTime);
  };

  const handleRemindTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRemindSettings(remindCount, e.target.value);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-1.5">
          <UserRound className="size-4.5 text-foreground" />
          내 설정 및 정보
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          나만의 속도로 약속을 이어갈 수 있도록 휴식 요일 및 알림을 조절합니다.
        </p>
      </div>

      {/* User Profile Card */}
      <Card className="border border-border/80 shadow-none bg-card">
        <CardContent className="p-4 sm:p-5 flex items-center gap-4">
          <div className="size-12 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-base select-none">
            민
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">민 (프로토타입 계정)</h3>
            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/50 px-1.5 py-0.5 rounded">
              <ShieldCheck className="size-3" /> 로컬 모드 동작 중
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card className="border border-border/80 shadow-none bg-card">
        <CardContent className="p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center gap-2">
            <SunMoon className="size-4 text-muted-foreground shrink-0" />
            <span className="text-xs font-semibold text-foreground">화면 테마 설정</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            앱의 화면 색상 테마를 선택합니다. 시스템 선택 시 OS 설정에 맞춥니다.
          </p>

          <div className="flex gap-2 pt-1">
            {(["light", "dark", "system"] as const).map((t) => {
              const label = t === "light" ? "라이트" : t === "dark" ? "다크" : "시스템";
              const isSelected = theme === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-xs"
                      : "border-border text-muted-foreground hover:text-foreground bg-secondary/35"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Rest Days Settings */}
      <Card className="border border-border/80 shadow-none bg-card">
        <CardContent className="p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center gap-2">
            <Coffee className="size-4 text-muted-foreground shrink-0" />
            <span className="text-xs font-semibold text-foreground">휴식 요일 지정</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            휴식 요일로 지정된 날에는 오늘의 약속을 등록하지 않아도 스트릭이 끊기지 않습니다.
          </p>

          <div className="flex justify-between items-center gap-1.5 pt-1.5">
            {weekdays.map((day) => {
              const isChecked = restWeekdays.includes(day.value);
              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleRestWeekday(day.value)}
                  className={`size-8 rounded-full border text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                    isChecked
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-zinc-400 hover:text-foreground bg-background"
                  }`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Reminder Settings */}
      <Card className="border border-border/80 shadow-none bg-card">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-muted-foreground shrink-0" />
            <span className="text-xs font-semibold text-foreground">리마인드 알림 조절</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 pt-1">
            <div className="space-y-1.5">
              <label htmlFor="remind-count" className="text-[11px] font-semibold text-muted-foreground uppercase">
                하루 허용 횟수
              </label>
              <select
                id="remind-count"
                value={remindCount}
                onChange={handleRemindCountChange}
                className="w-full h-9 rounded-lg border border-border bg-secondary/50 px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
              >
                <option value="1">하루 최대 1회</option>
                <option value="2">하루 최대 2회</option>
                <option value="3">하루 최대 3회</option>
                <option value="5">하루 최대 5회</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="remind-time" className="text-[11px] font-semibold text-muted-foreground uppercase">
                알림 비허용 시간대
              </label>
              <select
                id="remind-time"
                value={remindTime}
                onChange={handleRemindTimeChange}
                className="w-full h-9 rounded-lg border border-border bg-secondary/50 px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
              >
                <option value="09:00 - 21:00">21:00 ~ 09:00 (밤/새벽 제한)</option>
                <option value="09:00 - 18:00">18:00 ~ 09:00 (저녁 제한)</option>
                <option value="24hours">제한 없음 (24시간 허용)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
