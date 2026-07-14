// 모든 생명주기 Provider를 한 곳에서 합성.
// App.tsx는 이 컴포넌트로 자식을 감싸기만 하면 된다.
import type { ReactNode } from "react";
import { LocaleProvider } from "./LocaleProvider";
import { ThemeProvider } from "./ThemeProvider";
import { WindowPersistence } from "./WindowPersistence";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <WindowPersistence>{children}</WindowPersistence>
      </ThemeProvider>
    </LocaleProvider>
  );
}
