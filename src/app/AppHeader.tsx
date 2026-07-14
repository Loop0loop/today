// 상단 헤더: 날짜 + 탭 제목 + 현재 스트릭.
// liveStreak 계산은 useCurrentStreak 훅으로 위임.
import { useMemo } from "react";
import { Flame } from "lucide-react";
import { useUiStore, type TabId } from "@/store/useUiStore";
import { useCurrentStreak } from "@/hooks/useCurrentStreak";

const TITLE_BY_TAB: Record<TabId, string> = {
  today: "오늘을 가볍게 시작해요",
  friends: "함께 행동을 유도해요",
  history: "우리의 발자취",
  diary: "오늘의 회고",
  profile: "설정 및 프로필",
};

export function AppHeader() {
  const currentTab = useUiStore((s) => s.currentTab);
  const streak = useCurrentStreak();

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat("ko-KR", {
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(new Date());
  }, []);

  return (
    <header className="mb-8 flex items-start justify-between">
      <div>
        <p className="mb-0.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          {formattedDate}
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {TITLE_BY_TAB[currentTab]}
        </h1>
      </div>

      <div className="flex items-center gap-1 text-xs font-bold text-orange-500 shrink-0 select-none">
        <Flame className="size-4 fill-current" />
        <span>{streak}일째</span>
      </div>
    </header>
  );
}
