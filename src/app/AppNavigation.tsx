// 하단 캡슐 네비게이션.
import { Home, Compass, Bell, Send, User, type LucideIcon } from "lucide-react";
import { useUiStore, type TabId } from "@/store/useUiStore";

interface NavItem {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

const NAVIGATION: NavItem[] = [
  { id: "today", label: "Today", icon: Home },
  { id: "friends", label: "친구", icon: Compass },
  { id: "history", label: "기록", icon: Bell },
  { id: "diary", label: "일기", icon: Send },
  { id: "profile", label: "설정", icon: User },
];

export function AppNavigation() {
  const currentTab = useUiStore((s) => s.currentTab);
  const setCurrentTab = useUiStore((s) => s.setCurrentTab);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
      <nav
        aria-label="하단 네비게이션"
        className="flex justify-around items-center rounded-2xl border border-border/80 bg-card/85 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
      >
        {NAVIGATION.map(({ id, label, icon: Icon }) => {
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
              <Icon
                className={`size-5.5 transition-transform ${isActive ? "stroke-[2.5px]" : "stroke-[1.8px]"}`}
              />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
