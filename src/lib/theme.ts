// 테마 DOM 적용과 localStorage 영속화. 스토어/컴포넌트에서 분리된 순수 모듈.
import type { AppTheme } from "@/domain/types";

const THEME_STORAGE_KEY = "today-theme";

export function applyTheme(theme: AppTheme): void {
  if (typeof window === "undefined") return;
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
}

export function getSavedTheme(): AppTheme {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem(THEME_STORAGE_KEY) as AppTheme) || "dark";
}

export function saveTheme(theme: AppTheme): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}
