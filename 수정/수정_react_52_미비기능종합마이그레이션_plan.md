# 미비 기능 종합 마이그레이션 구현 계획

분석 결과 도출된 레거시 앱과의 기능 격차를 해소하고 미구현된 3대 비즈니스 로직(세부 작업 단위 시간 추적 펀치, 타임시트 일지 화면 및 CSV 익스포트, 도면/사진 업로드 보완)을 순차적으로 이식하기 위한 종합 개발 계획입니다.

## User Review Required

> [!IMPORTANT]
> 1. **세부 작업 펀치 연동**: 직원이 특정 가공 조각(Job Member)에 대해 작업 시작(START), 정지(STOP), 일시정지(PAUSE)를 할 수 있는 직관적인 버튼을 Whiteboard 또는 Job Details 화면에 주입합니다.
> 2. **Timesheet 메뉴 신설 및 권한 기반 CRUD 적용**: 직원의 일자별 출퇴근 및 작업 수행 상세 타임라인을 확인하고 CSV로 추출할 수 있는 관리자 화면을 개발합니다.
>    - **권한 제어**: 관리자(Level 10+)는 전 직원의 타임시트 이력을 확인 및 관리(CRUD)할 수 있으나, 일반 직원은 오직 본인의 타임시트만 열람 및 본인 펀치만 가능하도록 강력하게 제어합니다.

## Proposed Changes

### 1. 백엔드 API 보완

#### [MODIFY] [api_router.py](file:///f:/pe/public_html/steelworks-manager-react/core/api_router.py)
- **세부 작업 펀치 기능 확장**: `/api/punch` 엔드포인트에 작업 상세 ID(`job_detail_id`)와 가공 상태 세분화(START, STOP, PAUSE) 파라미터를 추가 반영하여 `tb_punchsheet` 및 `tb_jobs_details`의 완료도(`made`, `finish`) 상태를 업데이트하는 로직을 이식합니다.
- **권한 기반 Timesheet 조회 API 구현**: `/api/punch/timesheet` 엔드포인트를 신설하여, 요청한 사용자의 토큰/권한을 검증합니다.
  - 관리자 권한(Level 10+)일 경우 직원 필터를 적용하여 전체 직원의 데이터를 반환하고, 일반 직원일 경우 본인의 ID로 쿼리를 강제 바인딩하여 반환합니다.
- **Punch 로그 CSV 다운로드**: 전체/개별 직원의 Punch 내역을 기간별로 반환하는 API 및 CSV 파일 생성을 수행하는 익스포트 엔드포인트 `/api/export/punch`를 연동/보완합니다. (동일하게 권한별 반환 범위 차등 적용)

### 2. 프론트엔드 Timesheet 화면 개발

#### [NEW] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/timesheet/page.js)
- 직원별/날짜별 Punch 이력(출퇴근 및 작업 개시/종료 시간)을 상세 목록으로 열람할 수 있는 보고서 화면을 신설합니다.
- **권한별 UI 차등**: 관리자는 직원 선택 필터가 활성화되어 전 직원의 데이터를 조회할 수 있지만, 일반 직원은 필터가 비활성화되거나 본인 이름으로만 고정되어 본인 이력만 표시됩니다.
- 상단에 날짜 및 직원 필터, 그리고 Punch 이력 전체 데이터를 엑셀(CSV) 형식으로 보관/내려받을 수 있는 **Export CSV** 버튼을 배치합니다.

#### [MODIFY] [Sidebar.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/components/common/Sidebar.js)
사이드바 메뉴 목록에 `Timesheet` (아이콘: Clipboard/FileSpreadsheet) 메뉴 항목을 추가합니다. (최소 권한 제한 `minRight: 1`로 설정하여 직원 본인 것도 조회 가능하게 함)

### 3. 세부 작업 펀치 제어 UI 이식

#### [MODIFY] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/jobs/page.js)
- Job Details의 부재(Members) 목록의 각 아이템 우측에 작업자가 즉각적으로 작업을 개시하거나 완료할 수 있는 **Start Job / Stop Job / Pause Job** 동작 버튼 그룹을 이식합니다. (로그인 세션 기준 자동 펀치 연계)

---

## Verification Plan

### Automated Tests
- `npm run build`를 실행하여 Next.js 빌드가 에러 없이 통과되는지 확인합니다.

### Manual Verification
- Job Details에서 특정 Member의 "Start Job" 클릭 후, `tb_punchsheet` 테이블에 올바르게 기록이 추가되는지 확인합니다.
- Timesheet 화면에서 이력이 실시간으로 보이며, Export CSV 클릭 시 파일 다운로드가 시작되는지 확인합니다.
- 일반 직원이 타인 ID로 Timesheet를 조회하거나 조작하려 할 때 차단되는지 권한 제어 검증을 수행합니다.
