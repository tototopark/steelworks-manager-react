# 직원 자격증 만료 알림(Staff Reminder) UI 및 API 구현 계획서

## 사용자 검토 필요 사항
- 백엔드 API 신설: `tb_login` 테이블의 `site_safe_exp_date` 컬럼 데이터를 기준으로 만료 30일 이내인 직원을 식별하는 `/api/reminders/staff/expiry-check` API를 백엔드에 추가합니다.
- 알림 UI 노출 영역: 관리자가 바로 확인할 수 있도록 대시보드 메인(page.js) 및 직원 관리(employees/page.js) 상단 영역에 동적 경고 배너로 알림 위젯을 노출합니다.

## 개요
이 계획서는 1번 앱(Legacy)에서 제공하던 직원 안전 자격증(SiteSafe) 만료 안내판(Staff Reminder) 기능을 2번 앱(React)에 이식하여, 관리자가 자격증 갱신 대상자를 직관적으로 확인하고 조치할 수 있도록 백엔드 API와 프론트엔드 UI를 구현하는 계획을 수립합니다.

## 변경 제안 사항

### 1. 백엔드 API 추가
#### [MODIFY] [api_router.py](file:///f:/pe/public_html/steelworks-manager-react/core/api_router.py)
- `GET /api/reminders/staff/expiry-check` 엔드포인트를 추가합니다.
- `tb_login` 테이블에서 `site_safe_exp_date` 필드가 현재 날짜 기준 30일 이내로 남았거나 이미 경과한 활성 직원 목록을 필터링하여 만료일, 직종 정보 등과 함께 반환합니다.

### 2. 프론트엔드 커스텀 훅 개발
#### [NEW] [useStaffReminders.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/hooks/useStaffReminders.js)
- 직원 자격증 만료 알림 데이터를 가져오는 `fetchStaffExpiryAlerts` 함수를 설계합니다.
- 로딩 상태와 에러 정보를 관리합니다.

### 3. 직원 관리 페이지 알림 보드 추가
#### [MODIFY] [page.js (employees)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/employees/page.js)
- `useStaffReminders` 훅을 바인딩하여 직원 마스터 페이지 상단에 만료 경고 박스(Critical Safety Warnings)를 렌더링합니다.
- 경고 보드는 권한 레벨 10 이상(Supervisor 이상) 관리자에게만 노출되어 자격증 관리를 수행할 수 있도록 합니다.
- 만료 임박(30일 이내)은 오렌지색 배지, 만료 완료는 빨간색 배지로 긴급도를 직관적으로 시각화합니다.

### 4. 대시보드 메인 화면 알림 연동
#### [MODIFY] [page.js (dashboard)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/page.js)
- 대시보드 메인 화면 상단 요약 영역에 직원 안전 자격증 만료 알림판을 탑재하여, 로그인 즉시 위험 관리 상황을 파악할 수 있도록 연동합니다.

## 검증 계획

### Automated Tests
- Next.js 프로덕션 빌드 테스트 (`npm run build`)를 구동하여 빌드 오류 및 린트 경고가 발생하지 않는지 검증합니다.

### Manual Verification
- SQLite DB 상에서 임의의 직원의 `site_safe_exp_date`를 현재 기준 15일 전(만료 상태) 또는 15일 후(임박 상태)로 설정한 후, 대시보드와 직원 관리 화면 상단에 알림 메시지가 정확한 등급 배지와 함께 동적으로 출력되는지 확인합니다.
