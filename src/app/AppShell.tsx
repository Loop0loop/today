// 앱 레이아웃 컨테이너. 햄버거 버튼 + main(헤더/뷰) + 네비 + 옵션 서랍을 배치.
import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";
import { useUiStore } from "@/store/useUiStore";
import { AppHeader } from "./AppHeader";
import { AppNavigation } from "./AppNavigation";
import { OptionDrawer } from "./OptionDrawer";
import { ViewRouter } from "./ViewRouter";

export function AppShell() {
  const { t } = useTranslation();
  const setOptionBarOpen = useUiStore((s) => s.setOptionBarOpen);

  return (
    <div className="h-screen h-svh overflow-hidden flex flex-col bg-background text-foreground antialiased font-sans relative">
      {/* Global Fixed Hamburger Menu Button */}
      <button
        onClick={() => setOptionBarOpen(true)}
        className="fixed top-[-11px] right-5 z-40 p-1.5 rounded-full bg-card/65 border border-border/80 hover:bg-secondary text-zinc-400 hover:text-foreground transition-all cursor-pointer shadow-xs backdrop-blur-md"
        title={t("header.openOptions")}
        aria-label={t("header.openOptions")}
      >
        <Menu className="size-5.5 stroke-[2.5px]" />
      </button>

      {/* Scrollable Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-8 pb-32 sm:px-6 md:px-8">
        <div className="mx-auto max-w-4xl">
          <AppHeader />
          <div>
            <ViewRouter />
          </div>
        </div>
      </main>

      <AppNavigation />
      <OptionDrawer />
    </div>
  );
}
