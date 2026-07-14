import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { UserRound, Coffee, Bell, ShieldCheck, SunMoon, Languages } from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import {
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "@/i18n/config";
import { Card, CardContent } from "@/components/ui/card";

export function ProfileView() {
  const { t } = useTranslation();
  const restWeekdays = useSettingsStore((s) => s.restWeekdays);
  const remindCount = useSettingsStore((s) => s.remindCount);
  const remindTime = useSettingsStore((s) => s.remindTime);
  const theme = useSettingsStore((s) => s.theme);
  const language = useSettingsStore((s) => s.language);
  const toggleRestWeekday = useSettingsStore((s) => s.toggleRestWeekday);
  const setRemindSettings = useSettingsStore((s) => s.setRemindSettings);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  const restWeekdayLabels = useMemo(
    () => t("profile.restDays.weekdays", { returnObjects: true }) as string[],
    [t],
  );

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
          {t("profile.header")}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          {t("profile.subheader")}
        </p>
      </div>

      {/* User Profile Card */}
      <Card className="border border-border/80 shadow-none bg-card">
        <CardContent className="p-4 sm:p-5 flex items-center gap-4">
          <div className="size-12 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-base select-none">
            {t("profile.profileInitial")}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {t("profile.profileName")}
            </h3>
            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/50 px-1.5 py-0.5 rounded">
              <ShieldCheck className="size-3" /> {t("profile.badgeLocalMode")}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card className="border border-border/80 shadow-none bg-card">
        <CardContent className="p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center gap-2">
            <SunMoon className="size-4 text-muted-foreground shrink-0" />
            <span className="text-xs font-semibold text-foreground">
              {t("profile.theme.title")}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {t("profile.theme.description")}
          </p>

          <div className="flex gap-2 pt-1">
            {(["light", "dark", "system"] as const).map((themeId) => {
              const label = t(`profile.theme.${themeId}`);
              const isSelected = theme === themeId;
              return (
                <button
                  key={themeId}
                  type="button"
                  onClick={() => setTheme(themeId)}
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

      {/* Language Settings */}
      <Card className="border border-border/80 shadow-none bg-card">
        <CardContent className="p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center gap-2">
            <Languages className="size-4 text-muted-foreground shrink-0" />
            <span className="text-xs font-semibold text-foreground">
              {t("profile.language.title")}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {t("profile.language.description")}
          </p>

          <div className="flex gap-2 pt-1">
            {SUPPORTED_LANGUAGES.map((lang: SupportedLanguage) => {
              const isSelected = language === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-xs"
                      : "border-border text-muted-foreground hover:text-foreground bg-secondary/35"
                  }`}
                >
                  {t(`profile.language.${lang}`)}
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
            <span className="text-xs font-semibold text-foreground">
              {t("profile.restDays.title")}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {t("profile.restDays.description")}
          </p>

          <div className="flex justify-between items-center gap-1.5 pt-1.5">
            {restWeekdayLabels.map((label, dayValue) => {
              const isChecked = restWeekdays.includes(dayValue);
              return (
                <button
                  key={dayValue}
                  type="button"
                  onClick={() => toggleRestWeekday(dayValue)}
                  className={`size-8 rounded-full border text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                    isChecked
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-zinc-400 hover:text-foreground bg-background"
                  }`}
                >
                  {label}
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
            <span className="text-xs font-semibold text-foreground">
              {t("profile.remind.title")}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 pt-1">
            <div className="space-y-1.5">
              <label htmlFor="remind-count" className="text-[11px] font-semibold text-muted-foreground uppercase">
                {t("profile.remind.countLabel")}
              </label>
              <select
                id="remind-count"
                value={remindCount}
                onChange={handleRemindCountChange}
                className="w-full h-9 rounded-lg border border-border bg-secondary/50 px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
              >
                {["1", "2", "3", "5"].map((value) => (
                  <option key={value} value={value}>
                    {t(`profile.remind.countOptions.${value}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="remind-time" className="text-[11px] font-semibold text-muted-foreground uppercase">
                {t("profile.remind.timeLabel")}
              </label>
              <select
                id="remind-time"
                value={remindTime}
                onChange={handleRemindTimeChange}
                className="w-full h-9 rounded-lg border border-border bg-secondary/50 px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
              >
                {["09:00 - 21:00", "09:00 - 18:00", "24hours"].map((value) => (
                  <option key={value} value={value}>
                    {t(`profile.remind.timeOptions.${value}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
