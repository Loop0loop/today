// i18n locale 무결성 검사.
// ko(진실의 원본)와 ja/en이 동일한 키 구조를 갖고, 번역이 누락/깨짐 없는지 검증한다.
// package.json의 `check` 스크립트가 node --test tests/*.test.ts로 자동 포함한다.
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = resolve(__dirname, "../src/i18n/locales");

const LOCALES = ["ko", "ja", "en"] as const;
type Locale = (typeof LOCALES)[number];

// 정적 import 대신 런타임 읽기: JSON 문법 에러(깨진 파일) 자체를 검증 대상으로 삼는다.
function loadLocale(locale: Locale): unknown {
  const raw = readFileSync(resolve(LOCALES_DIR, `${locale}.json`), "utf8");
  return JSON.parse(raw);
}

// 중첩 객체의 모든 리프 키 경로를 dot notation으로 수집.
// 배열은 요소 인덱스를 경로로 취급한다([0], [1], ...).
function collectKeys(obj: unknown, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object") return [];
  const keys: string[] = [];

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      keys.push(`${prefix}[]`);
    } else {
      obj.forEach((item, idx) => {
        const path = `${prefix}[${idx}]`;
        if (item !== null && typeof item === "object") {
          keys.push(...collectKeys(item, path));
        } else {
          keys.push(path);
        }
      });
    }
    return keys;
  }

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object") {
      keys.push(...collectKeys(value, path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

// 모든 리프 값 수조회 (빈 문자열 검사용).
function collectValues(obj: unknown): { path: string; value: unknown }[] {
  if (obj === null || typeof obj !== "object") return [];
  const entries: { path: string; value: unknown }[] = [];

  if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      if (item !== null && typeof item === "object") {
        for (const e of collectValues(item)) {
          entries.push({ path: `[${idx}].${e.path}`, value: e.value });
        }
      } else {
        entries.push({ path: `[${idx}]`, value: item });
      }
    });
    return entries;
  }

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (value !== null && typeof value === "object") {
      for (const e of collectValues(value)) {
        entries.push({ path: `${key}.${e.path}`, value: e.value });
      }
    } else {
      entries.push({ path: key, value });
    }
  }
  return entries;
}

// i18next interpolation placeholder {{name}} 패턴 추출.
const PLACEHOLDER_RE = /\{\{(\w+)\}\}/g;
function extractPlaceholders(value: unknown): string[] {
  if (typeof value !== "string") return [];
  const matches = [...value.matchAll(PLACEHOLDER_RE)];
  return matches.map((m) => m[1]).sort();
}

// 모든 locale을 미리 로드하여 공유.
const localeData: Record<Locale, unknown> = {
  ko: loadLocale("ko"),
  ja: loadLocale("ja"),
  en: loadLocale("en"),
};

test("all locale files parse as valid JSON", () => {
  // loadLocale이 throw하지 않으면 통과. 여기 도달했다면 3개 전부 유효 JSON.
  for (const locale of LOCALES) {
    assert.ok(
      localeData[locale] !== undefined,
      `${locale}.json failed to load`,
    );
  }
});

test("every locale has the same key structure as ko (the source of truth)", () => {
  const koKeys = new Set(collectKeys(localeData.ko));
  const expected = [...koKeys].sort();

  for (const locale of LOCALES) {
    if (locale === "ko") continue;
    const localeKeys = new Set(collectKeys(localeData[locale]));
    const missing = expected.filter((k) => !localeKeys.has(k));
    const extra = [...localeKeys]
      .filter((k) => !koKeys.has(k))
      .sort();

    assert.deepEqual(
      missing,
      [],
      `${locale}.json is missing keys present in ko.json: ${missing.join(", ")}`,
    );
    assert.deepEqual(
      extra,
      [],
      `${locale}.json has keys not present in ko.json: ${extra.join(", ")}`,
    );
  }
});

test("no locale has empty translation values", () => {
  for (const locale of LOCALES) {
    const values = collectValues(localeData[locale]);
    const empty = values.filter(
      (v) => typeof v.value === "string" && v.value.trim() === "",
    );
    assert.deepEqual(
      empty.map((e) => e.path),
      [],
      `${locale}.json has empty values at: ${empty.map((e) => e.path).join(", ")}`,
    );
  }
});

test("interpolation placeholders match across locales", () => {
  const koValues = collectValues(localeData.ko);

  for (const locale of LOCALES) {
    if (locale === "ko") continue;
    const localeValues = collectValues(localeData[locale]);
    const localeByPath = new Map(localeValues.map((v) => [v.path, v.value]));

    for (const { path, value } of koValues) {
      const koPlaceholders = extractPlaceholders(value);
      if (koPlaceholders.length === 0) continue;

      const translated = localeByPath.get(path);
      const translatedPlaceholders = extractPlaceholders(translated);

      assert.deepEqual(
        translatedPlaceholders,
        koPlaceholders,
        `${locale}.json at ${path}: expected placeholders ${koPlaceholders.join(", ")} but got ${translatedPlaceholders.join(", ")}`,
      );
    }
  }
});
