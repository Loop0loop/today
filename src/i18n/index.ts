// i18n 공개 진입점. AppProviders는 config를 사이드이펙트로 초기화하기 위해
// config를 import만 하고, Provider는 I18nProvider를 사용한다.
import "./config";

export { I18nProvider } from "./I18nProvider";
export {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  type SupportedLanguage,
} from "./config";
