# LunchPicker 프로젝트 규칙

## 스택
Vue 3 (Composition API + `<script setup>`), Vite, JavaScript, CSS, Vue Router

## 코딩 규칙
- 새 페이지는 `src/views/`에, 재사용 UI는 `src/components/`에 추가
- 비즈니스 로직은 `src/composables/use*.js`로 분리
- DB/API 호출은 `src/services/`를 통해서만 수행 (현재 mock)
- `@/` 경로 별칭 사용 (`import X from '@/components/...'`)
- CSS는 컴포넌트 scoped 스타일 우선, 공통 토큰은 `src/styles/variables.css`

## 디자인
- Mobile First, 반응형
- CSS 변수(`--color-*`, `--space-*`) 활용
- 카드/버튼 등 공통 UI는 `components/common/`에 정의 후 재사용

## Supabase (미연결)
- 클라이언트 스텁: `src/services/supabase.js`
- 연결 시 `restaurantService.js`의 mock 호출을 Supabase 쿼리로 교체
