import { useMemo, useEffect } from "react";
import {
  Flame,
  Home,
  Compass,
  Bell,
  Send,
  User,
} from "lucide-react";
import { useTodoStore, applyTheme } from "./store/useTodoStore";
import { commitmentStreak, calendarDateInTimeZone } from "./domain/task";

// Import view components
import { TodayView } from "./components/TodayView";
import { FriendsView } from "./components/FriendsView";
import { HistoryView } from "./components/HistoryView";
import { DiaryView } from "./components/DiaryView";
import { ProfileView } from "./components/ProfileView";

import "./App.css";

const navigation = [
  { id: "today", label: "Today", icon: Home },
  { id: "friends", label: "친구", icon: Compass },
  { id: "history", label: "기록", icon: Bell },
  { id: "diary", label: "일기", icon: Send },
  { id: "profile", label: "설정", icon: User },
];

function App() {
  const { currentTab, setCurrentTab, commitmentHistory, restWeekdays, theme } = useTodoStore();

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const todayStr = useMemo(() => {
    return calendarDateInTimeZone(new Date(), "Asia/Seoul");
  }, []);

  // Compute live streak to display in global header
  const liveStreak = useMemo(() => {
    return commitmentStreak(commitmentHistory, todayStr, restWeekdays);
  }, [commitmentHistory, todayStr, restWeekdays]);

  // Formatted header date
  const formattedHeaderDate = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      weekday: "long",
    };
    return new Intl.DateTimeFormat("ko-KR", options).format(new Date());
  }, []);

  // Render view based on active tab
  const renderActiveView = () => {
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
  };

  return (
    <div className="h-screen h-svh overflow-hidden flex flex-col bg-background text-foreground antialiased font-sans">
      
      {/* Scrollable Main Content Container */}
      <main className="flex-1 overflow-y-auto px-4 py-8 pb-32 sm:px-6 md:px-8">
        <div className="mx-auto max-w-4xl">
          
          {/* Global Minimal Header */}
          <header className="mb-8 flex items-start justify-between">
            <div>
              <p className="mb-0.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                {formattedHeaderDate}
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {currentTab === "today" && "오늘을 가볍게 시작해요"}
                {currentTab === "friends" && "함께 행동을 유도해요"}
                {currentTab === "history" && "우리의 발자취"}
                {currentTab === "diary" && "오늘의 회고"}
                {currentTab === "profile" && "설정 및 프로필"}
              </h1>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-orange-500 shrink-0 select-none">
              <Flame className="size-4 fill-current" />
              <span>{liveStreak}일째</span>
            </div>
          </header>

          {/* Dynamic Inner View */}
          <div>{renderActiveView()}</div>

        </div>
      </main>

      {/* Modern Capsule FooterBar (Fixed Translucent Apple TabBar - Replicating screenshot) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
        <nav
          aria-label="하단 네비게이션"
          className="flex justify-around items-center rounded-2xl border border-border/80 bg-card/85 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          {navigation.map(({ id, label, icon: Icon }) => {
            const isActive = currentTab === id;
            return (
              <button
                key={id}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setCurrentTab(id)}
                className={`flex flex-col items-center gap-1 rounded-xl py-1.5 px-4 text-[10px] font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
                  isActive
                    ? "text-primary dark:text-white scale-105"
                    : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                }`}
              >
                <Icon className={`size-5.5 transition-transform ${isActive ? "stroke-[2.5px]" : "stroke-[1.8px]"}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

    </div>
  );
}

export default App;
