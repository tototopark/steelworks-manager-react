# 미비 기능 종합 마이그레이션 구현 결과서 (Walkthrough)

레거시 PHP 앱 분석에 기반한 미비 기능(세부 단위 작업 시간 추적 펀치, 타임시트 일지 및 엑셀 다운로드, 도면/사진 관리 보완)의 이식 및 권한 제어 정책 적용이 성공적으로 완료되었습니다.

## 구현 및 변경 사항

### 1. 백엔드 권한 기반 API 및 펀치 로직 고도화 (`core/api_router.py`)
- **세부 작업 펀치 제어**: `/api/punch` POST API에 `job_detail_id` 매핑 로직을 이식하여, 일반 출퇴근뿐만 아니라 개별 부재의 제작 시작(START) 및 완료(STOP) 펀치 기록을 지원합니다.
  - 가공 완료(STOP) 시 해당 부재의 타입("task" 여부)을 판별하여 `tb_jobs_details`의 완료 플래그(`made` 혹은 `finish`)와 완료일, 완료자를 자동 기록합니다.
  - Lot 내의 모든 부재가 완성될 경우, `tb_jobs_date_install`의 `status_install`을 `"ready"`로 상향 변경하는 자동화 트리거를 구현했습니다.
- **권한 격리형 Timesheet API (`/api/punch/timesheet`)**: JWT 토큰을 판독하여 관리자(Level 10+)는 필터를 통해 전 직원의 펀치 로그를 조회할 수 있게 하고, 일반 직원은 본인의 ID 데이터만 반환하도록 차단했습니다.
- **CSV Export API (`/api/export/punch`)**: 동일한 권한 격리 로직을 이식하여 다운로드되는 CSV 리포트의 데이터 노출 범위를 권한별로 제한하였습니다.

### 2. Timesheet (작업 시간 일지) 화면 개발 및 연동
- **Timesheet 페이지 (`fe/src/app/dashboard/timesheet/page.js`)**: 일자별/직원별 펀치 기록 및 가공 이력을 리스트 형태로 정렬하여 열람할 수 있는 보고서 페이지를 신규 제작했습니다.
  - 관리자는 직원 선택 필터를 통해 전체 직원의 로그를 조회할 수 있으나, 일반 직원은 필터가 비활성화되고 본인 이름으로만 고정 조회됩니다.
  - **Export CSV** 클릭 시 현재 필터 조건에 부합하는 가공/출퇴근 내역을 엑셀(CSV) 파일로 간편하게 아카이브할 수 있도록 다운로드 기능을 제공합니다.
- **사이드바 메뉴 (`fe/src/components/common/Sidebar.js` / `DevHints.js`)**: `Timesheet` 메뉴 항목을 Clipboard 아이콘과 함께 `minRight: 1` 권한으로 연동하여 전 직원이 본인 일지를 쉽게 보도록 조치했습니다.

### 3. Jobs 상세 뷰 내 부재별 펀치 동작 버튼 추가 (`fe/src/app/dashboard/jobs/page.js`)
- `Jobs` 상세 보기의 부재(Members) 리스트에 있는 각 미완료 부재들의 우측에 **Start(작업 시작 - Play 아이콘)** 및 **Stop(작업 종료 - Square 아이콘)** 제어 버튼 그룹을 이식했습니다.
- 로그인한 계정의 고유 세션을 기반으로 본인의 이름과 ID로 즉시 부재 제작을 추적/완료할 수 있도록 버튼 동작을 펀치 API와 결합했습니다.

## 빌드 및 검증 결과
- `npm run build`를 실행하여 Next.js Turbopack 정적 생성 프로세스가 에러 없이 컴파일 및 번들링을 마쳤음을 검증 완료했습니다.
