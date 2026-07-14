// 상단 헤더: 날짜 + 탭 제목 + 현재 스트릭.
// liveStreak 계산은 useCurrentStreak 훅으로 위임.
import { useTranslation } from "react-i18next";
import { Flame } from "lucide-react";
import { useUiStore, type TabId } from "@/store/useUiStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useCurrentStreak } from "@/hooks/useCurrentStreak";
import { formatHeaderDate } from "@/lib/date";

const TITLE_KEY_BY_TAB: Record<TabId, string> = {
  today: "header.title.today",
  friends: "header.title.friends",
  history: "header.title.history",
  diary: "header.title.diary",
  profile: "header.title.profile",
};

export function AppHeader() {
  const { t } = useTranslation();
  const currentTab = useUiStore((s) => s.currentTab);
  const language = useSettingsStore((s) => s.language);
  const streak = useCurrentStreak();

  const formattedDate = formatHeaderDate(new Date(), language);

  return (
    <header className="mb-8 flex items-start justify-between">
      <div>
        <p className="mb-0.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          {formattedDate}
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t(TITLE_KEY_BY_TAB[currentTab])}
        </h1>
      </div>

      <div className="flex items-center gap-1 text-xs font-bold text-orange-500 shrink-0 select-none">
        <Flame className="size-4 fill-current" />
        <span>
          {streak}
          {t("header.streakSuffix")}
        </span>
      </div>
    </header>
  );
}
