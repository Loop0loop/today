// i18n 생명주기. settings.language와 i18n 인스턴스를 동기화한다.
// 양방향: setLanguage → i18n.changeLanguage, 외부 i18n 변경 → settings 반영은
// 이 앱에서는 setLanguage 경로만 사용하므로 단방향으로 충분하다.
import { useEffect, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./config";
import { useSettingsStore } from "@/store/useSettingsStore";

export function I18nProvider({ children }: { children: ReactNode }) {
  const language = useSettingsStore((s) => s.language);

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [language]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
