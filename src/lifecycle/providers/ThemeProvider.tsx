// 테마 생명주기. settings.theme이 바뀌면 DOM에 반영한다.
// 최초 마운트에도 한 번 적용하여 새로고침 후에도 테마가 유지되도록 한다.
import { useEffect, type ReactNode } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { applyTheme } from "@/lib/theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return <>{children}</>;
}
