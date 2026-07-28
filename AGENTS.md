# LunchPicker 에이전트 작업 규칙

Cursor가 이 프로젝트에서 코드를 생성·수정할 때 반드시 따른다.
`README.md`의 기술 스택·폴더 구조·아키텍처 원칙을 기준으로 한다.

**초보자·화면 지도:** [`docs/초보자가이드.md`](docs/초보자가이드.md) 를 먼저 본다.

## 시안 기반 작업 순서

한 번에 전 화면을 만들지 않는다. 아래 순서를 따른다.

1. 앱 껍질 (하단 탭) — ✅
2. 홈 다듬기 (Hero 시안 레이아웃) — ✅
3. 조건 설정 화면 — ✅
4. 뽑기 결과 풀스크린 — ✅
5. 식당 목록 UI — ✅
6. 히스토리 / 설정 / 등록 기능 — ✅

## 기술 스택

- Vue 3 + Vite
- **Vue 3 Composition API** (`<script setup>` 사용)
- **JavaScript** (TypeScript 도입 금지, 요청 없는 한)
- **모바일 퍼스트 일반 CSS** (scoped 스타일 우선, CSS Modules/SCSS/Tailwind 등 요청 없이 도입 금지)
- Vue Router
- Supabase (추후 연결, 현재는 mock)

## 디자인

- Mobile First, 반응형
- **메인 컬러: `#FF8A00`** (`src/styles/variables.css`의 `--color-brand`와 일치 유지)
- CSS 변수(`--color-*`, `--space-*`, `--radius-*` 등) 활용
- **음식 이미지는 기본적으로 Emoji 사용** (외부 음식 이미지 URL·에셋 추가는 요청이 있을 때만)
- 카드/버튼 등 공통 UI는 `components/common/`에 정의 후 재사용

## 폴더 구조와 역할

```
src/
├── assets/           # 이미지, 아이콘 등 정적 리소스
├── components/
│   ├── common/       # 공통 UI (버튼, ComingSoon 등)
│   ├── layout/       # 하단 탭 등 레이아웃 조각
│   ├── home/         # 홈 화면 전용 컴포넌트
│   └── lunch/        # 점심 도메인 컴포넌트
├── composables/      # 재사용 로직 (useLunchPick 등)
├── data/             # 목(mock) 데이터 (DB 연결 전)
├── layouts/          # 페이지 레이아웃 래퍼
├── router/           # Vue Router 설정
├── services/         # API·DB 접근 계층
├── styles/           # 전역 CSS, 디자인 토큰
└── views/            # 라우트 단위 페이지
docs/
└── 초보자가이드.md   # 시안↔파일 지도 (사람용)
```

### 역할 구분 (필수)

| 계층 | 역할 | 규칙 |
|------|------|------|
| **views** | 라우트 1개 = view 1개 | 페이지 조합만. 비즈니스 로직은 composable로 분리 |
| **components** | UI만 담당 | props/emit으로 데이터·이벤트 전달. API 직접 호출 금지 |
| **composables** | 상태·로직 재사용 | `use*` 네이밍. 필요 시 service 호출 |
| **services** | 외부 데이터 소스 접근 | DB/API는 여기만. 현재 mock, 추후 Supabase로 교체 |

- 새 페이지 → `src/views/`
- 재사용 UI → `src/components/` (도메인별 하위 폴더)
- 비즈니스 로직 → `src/composables/use*.js`
- DB/API → `src/services/`만 사용
- import 경로 별칭: `@/` (`import X from '@/components/...'`)

## 작업 전 확인 (필수)

1. **기존 파일 구조를 먼저 확인**한다. (`src/` 트리, 관련 view·component·composable·service)
2. 같은 역할의 파일이 있으면 **재사용**한다.
3. **중복 컴포넌트 생성 금지** — 기능·이름이 겹치는 컴포넌트를 새로 만들지 않는다.
4. 디자인 토큰·공통 버튼 등 기존 패턴을 우선 따른다.

## 금지 사항

- **요청 없이 패키지 설치 금지** (`npm install <pkg>` 등)
- **기존 기능 삭제 금지** — 제거·축소가 필요하면 먼저 확인을 받는다
- 요청 없이 README·환경 설정·대규모 리팩터 금지
- 요청 없이 TypeScript / CSS 전처리기 / UI 라이브러리 도입 금지
- secrets(`.env` 실값 등) 커밋 금지

## Supabase (미연결)

- 클라이언트 스텁: `src/services/supabase.js`
- 연결 시 `restaurantService.js`의 mock 호출을 Supabase 쿼리로 교체
- mock `src/data/`는 연결 전까지 유지

## 작업 완료 체크리스트

1. **`npm run build`로 오류 확인** — 빌드가 실패하면 수정 후 완료로 본다
2. **변경 파일 설명** — 작업 완료 응답에 무엇을 왜 바꿨는지 파일 단위로 짧게 적는다
3. 요청받지 않은 파일은 건드리지 않는다
4. 커밋·푸시는 사용자가 요청할 때만 한다
