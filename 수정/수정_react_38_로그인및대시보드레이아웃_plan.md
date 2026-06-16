# 로그인 및 대시보드 코어 레이아웃 구현 계획

기존 Vanilla Bootstrap 기반의 로그인 및 메인 대시보드 화면을 React/Next.js 기반의 컴포넌트로 구현하고, 전역 레이아웃 및 내비게이션 구조를 현대화합니다.

## User Review Required

> [!IMPORTANT]
> - **인증 흐름**: 사용자가 비인증 상태로 접속 시 로그인 페이지(`/login`)로 강제 리다이렉트합니다.
> - **레이아웃 구조**: 대시보드 하위 페이지들(`/dashboard/...`)은 반응형 사이드바(Sidebar)와 상단 헤더(Header)가 포함된 `DashboardLayout`을 공유합니다.
> - **이모지 제한**: UI 텍스트 및 코드 내에 이모지 사용은 엄격히 배제하며 Lucide React 아이콘 라이브러리를 사용합니다.

## Proposed Changes

### 1. 로그인 페이지 구현
#### [NEW] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/login/page.js)
- `useAuth` 훅을 연동하여 로그인 동작 및 예외 처리를 수행하는 UI 구현.
- 현대적인 세련된 다크/라이트 그라디언트 배경과 Card UI 디자인을 채택합니다.

### 2. 대시보드 공통 레이아웃 & 컴포넌트
#### [NEW] [Sidebar.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/components/common/Sidebar.js)
- 대시보드 페이지 간 전환을 지원하는 반응형 좌측 내비게이션 메뉴바.
- 관리자 권한(`right_level`)에 따라 노출되는 메뉴 제어.
- 로고 및 현재 로그인 유저의 정보를 요약 표시.

#### [NEW] [Header.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/components/common/Header.js)
- 상단 영역에 현재 페이지 타이틀, 알림 아이콘, 프로필 드롭다운 메뉴 및 로그아웃 버튼 배치.

#### [NEW] [layout.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/layout.js)
- `Sidebar`와 `Header`를 결합하여 반응형 스크롤 구조를 갖는 메인 레이아웃 구성.

### 3. 메인 대시보드 뼈대 페이지
#### [NEW] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/page.js)
- 대시보드 메인 화면. 추후 연동될 주간 일정 현황, 차량 상태 요약, QA Pending 리스트 등의 위젯 컴포넌트들이 배치될 컨테이너 페이지.

### 4. 루트 리다이렉션 설정
#### [MODIFY] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/page.js)
- 루트 경로(`/`)에 접근할 때 세션 여부를 확인하여 로그인되지 않았다면 `/login`으로, 로그인 상태라면 `/dashboard`로 리다이렉트 처리합니다.

---

## Verification Plan

### Automated Tests
- Next.js 개발 서버(`npm run dev`) 및 백엔드 API 서버를 기동하고 `npm run build`를 빌드 오류가 없는지 테스트합니다.

### Manual Verification
- 브라우저를 통해 `http://localhost:3000`에 직접 접속하여 비인증 유저 리다이렉트가 올바르게 작동하는지 검증합니다.
- 올바른 계정 정보로 로그인한 뒤 `/dashboard`로 이동하여 반응형 사이드바와 헤더가 정상 렌더링되는지 확인합니다.
