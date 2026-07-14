# Today

약속과 미완료 항목의 재결정에 집중하는 소셜 투두 앱.

[PRD v0.2](docs/PRD.md)

## Stack

- Tauri 2 / Rust
- React 19 / TypeScript 6 / Vite
- Tailwind CSS 4
- shadcn/ui / Radix UI

## Development

```sh
pnpm install
pnpm tauri dev
pnpm check
pnpm clean:rust
```

## Backend

UI 검증 전까지 로컬 목업 데이터를 사용한다. 실제 데이터는 Supabase Auth,
Postgres, Data API, RLS로 연결하고 다중 테이블 변경은 Database Function으로
처리한다. 별도 서버와 ORM은 구체적인 요구가 생길 때만 추가한다.

```sh
pnpm supabase start
pnpm db:reset
pnpm db:test
```

## Phases

0. 완료 — Tauri, React, Tailwind, pnpm 기반
1. 완료 — shadcn/ui, 디자인 토큰, 반응형 앱 셸
2. 진행 — Today 화면과 핵심 행동 목업
3. 기록 화면: 히트맵, 스트릭, 주간 일관성
4. 친구 화면: 비공개 책임 그룹과 반응
5. 로컬 상호작용: 추가, 완료, 미룸, 포기
6. 안정화: 반응형, 접근성, 빈 상태와 오류 상태
7. Supabase Auth와 실제 데이터 연결
