# LunchPicker

회사 동료들이 함께 쓰는 점심 추천 웹 서비스입니다.

> **처음이라면** [`docs/초보자가이드.md`](docs/초보자가이드.md) 부터 보세요.  
> 시안 화면과 수정할 파일이 표로 정리되어 있습니다.

## 기술 스택

- Vue 3 + Vite
- JavaScript
- CSS (Mobile First)
- Vue Router
- Supabase (추후 연결)

## 시작하기

```bash
npm install
npm run dev
```

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |

## 폴더 구조

```
src/
├── assets/           # 이미지, 아이콘 등 정적 리소스
├── components/
│   ├── common/     # 공통 UI (버튼, 입력 등)
│   ├── layout/     # 하단 탭 등 레이아웃 조각
│   ├── home/       # 홈 화면 전용 컴포넌트
│   └── lunch/      # 점심 도메인 컴포넌트
├── composables/    # 재사용 로직 (useLunchPick 등)
├── data/           # 목(mock) 데이터 (DB 연결 전)
├── layouts/        # 페이지 레이아웃 래퍼
├── router/         # Vue Router 설정
├── services/       # API·DB 접근 계층
├── styles/         # 전역 CSS, 디자인 토큰
└── views/          # 라우트 단위 페이지
docs/
└── 초보자가이드.md # 시안 ↔ 파일 지도
```

## 아키텍처 원칙

- **views**: 라우트 1개 = view 1개. 비즈니스 로직은 composable로 분리
- **components**: UI만 담당. 데이터는 props/emit으로 전달
- **composables**: 상태·로직 재사용 (`use*` 네이밍)
- **services**: 외부 데이터 소스 접근. 현재는 mock, 추후 Supabase로 교체
- **data**: 개발용 정적 데이터. Supabase 연결 후 제거 예정

## 환경 변수 (추후)

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```
