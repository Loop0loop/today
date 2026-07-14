// 오늘 날짜(YYYY-MM-DD)를 LocaleProvider에서 가져온다.
// 컴포넌트가 Context를 직접 import하지 않게 하는 얇은 래퍼.
import { useLocale } from "../providers/LocaleProvider";

export function useToday(): string {
  return useLocale().todayStr;
}
