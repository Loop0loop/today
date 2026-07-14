// currentTab에 따라 활성 뷰를 렌더.
import { useUiStore } from "@/store/useUiStore";
import { TodayView } from "@/features/today/TodayView";
import { FriendsView } from "@/features/friends/FriendsView";
import { HistoryView } from "@/features/history/HistoryView";
import { DiaryView } from "@/features/diary/DiaryView";
import { ProfileView } from "@/features/profile/ProfileView";

export function ViewRouter() {
  const currentTab = useUiStore((s) => s.currentTab);

  switch (currentTab) {
    case "today":
      return <TodayView />;
    case "friends":
      return <FriendsView />;
    case "history":
      return <HistoryView />;
    case "diary":
      return <DiaryView />;
    case "profile":
      return <ProfileView />;
    default:
      return <TodayView />;
  }
}
