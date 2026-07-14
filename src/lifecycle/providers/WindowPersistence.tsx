// Tauri 창 크기 복원/저장 사이드이펙트.
// App.tsx에 있던 40줄 useEffect를 분리했다. 브라우저 모드에서는 no-op.
import { useEffect, type ReactNode } from "react";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";

const WIDTH_KEY = "today-window-width";
const HEIGHT_KEY = "today-window-height";

export function WindowPersistence({ children }: { children: ReactNode }) {
  useEffect(() => {
    let unlisten: (() => void) | undefined;

    (async () => {
      try {
        const appWindow = getCurrentWindow();

        // 1. 이전 창 크기 복원
        const savedWidth = localStorage.getItem(WIDTH_KEY);
        const savedHeight = localStorage.getItem(HEIGHT_KEY);
        if (savedWidth && savedHeight) {
          await appWindow.setSize(
            new LogicalSize(parseInt(savedWidth, 10), parseInt(savedHeight, 10)),
          );
        }

        // 2. 리사이즈 시 저장
        unlisten = await appWindow.onResized(async () => {
          try {
            const size = await appWindow.innerSize();
            const scaleFactor = await appWindow.scaleFactor();
            const logicalWidth = Math.round(size.width / scaleFactor);
            const logicalHeight = Math.round(size.height / scaleFactor);

            localStorage.setItem(WIDTH_KEY, logicalWidth.toString());
            localStorage.setItem(HEIGHT_KEY, logicalHeight.toString());
          } catch (e) {
            console.error("Failed to store window sizes:", e);
          }
        });
      } catch (e) {
        console.warn("Tauri API is not available (running in browser mode):", e);
      }
    })();

    return () => {
      unlisten?.();
    };
  }, []);

  return <>{children}</>;
}
