# 공휴일(Holidays) 관리 UI 화면 구현 및 사이드바 연동 계획서

## 사용자 검토 필요 사항
- 공휴일 관리 UI 접근 권한 수준: 1번 앱 및 기획 명세에 부합하도록 직원 권한 레벨 10 이상(Supervisor 이상)만 공휴일을 조회, 추가, 삭제할 수 있도록 접근 제한을 적용합니다. 
- 사이드바 메뉴 배치: 사이드바의 "Employees" 메뉴 아래 혹은 인근에 "Holidays" 링크를 추가할 예정입니다.

## 개요
이 계획서는 2번 앱(React)에서 누락되었던 공휴일(Holidays) 관리자용 프론트엔드 UI 화면을 신규 개발하고, 사이드바 메뉴에 등록하여 SQLite DB 백엔드 API와 완전히 상호작용하도록 연동하는 과정을 설명합니다.

## 변경 제안 사항

### 1. 프론트엔드 커스텀 훅 개발
#### [NEW] [useHolidays.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/hooks/useHolidays.js)
- 공휴일 목록 조회 (`GET /api/holidays`)
- 신규 공휴일 등록 (`POST /api/holidays`)
- 기존 공휴일 삭제 (`DELETE /api/holidays/{id}`)
- 로딩 상태 및 오류 핸들링 제공

### 2. 공휴일 관리 UI 페이지 구현
#### [NEW] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/holidays/page.js)
- 직원 권한 레벨 검증: Level 10 미만인 사용자는 대시보드로 리다이렉트하거나 접근 거부 화면 노출.
- 공휴일 목록 테이블 뷰 및 상세 정보(공휴일 이름, 시작 날짜, 종료 날짜) 렌더링.
- 공휴일 신규 등록 모달 팝업 제공.
- 삭제 전 사용자 확인 경고 창(Confirm Dialog) 탑재.

### 3. 사이드바 메뉴 연동
#### [MODIFY] [Sidebar.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/components/common/Sidebar.js)
- `menuItems` 배열에 `Holidays` 항목 추가 (`minRight: 10`, `path: '/dashboard/holidays'`).
- `lucide-react` 패키지에서 `CalendarDays` 아이콘 임포트하여 적용.

## 검증 계획

### Automated Tests
- Next.js 프로덕션 빌드 테스트 (`npm run build`) 수행을 통해 문법 및 모듈 임포트 관련 에러가 없는지 검증합니다.

### Manual Verification
- 권한 레벨 10 이상인 Supervisor 계정으로 로그인하여 사이드바에 "Holidays" 메뉴가 정상적으로 표시되는지 확인합니다.
- 공휴일 리스트가 백엔드 DB와 연동되어 로드되는지 조회하고, 추가 및 삭제 기능이 SQLite 데이터베이스에 즉시 반영되는지 검증합니다.
- 권한 레벨 10 미만인 일반 작업자 계정으로 로그인하여 사이드바에 메뉴가 노출되지 않는지, 그리고 직접 URL(/dashboard/holidays)로 진입 시 보안 가드에 막히는지 검증합니다.
