# 타임시트 권한 제어 및 주간 단위 조회 최적화 구현 계획서

관리자(level 12)이더라도 타임시트 조회 시 5만 건 이상의 전체 데이터 로드로 인해 발생하는 10초 이상의 지연 현상을 해결하고, 보안성 및 조회 방식을 개선하기 위해 최적화된 주간 단위 조회 및 권한 필터를 적용합니다.

## User Review Required

> [!NOTE]
> - 권한 제한: 최고 관리자 레벨(level 99, 즉 admin ID)만 전체 직원 조회를 허용하며, 그 외의 사용자(level 12인 Ulrich De Jong 포함)는 본인의 타임시트 자료만 조회할 수 있도록 강제 제한합니다.
> - 주간 단위 조회: 한 번에 모든 데이터를 가져오지 않고, 선택한 연도(year)와 주차(week)를 기준으로 데이터베이스 쿼리 조건(WHERE)을 부여하여 속도를 획기적으로 개선합니다.
> - 개발용 힌트 임시 버튼: 데이터가 옛날 날짜로 되어 있으므로, 개발용 힌트 옵션(SHOW_DEV_HINTS)이 켜져 있을 때 활성화되는 '최근 데이터 주간 자동 선택' 버튼을 추가합니다.

## Open Questions

- 없음

## Proposed Changes

### Backend Components

#### [MODIFY] [api_router.py](file:///f:/pe/public_html/steelworks-manager-react/core/api_router.py)
- `@app.get("/api/punch/timesheet")` 엔드포인트 수정:
  - `year`, `week` 쿼리 파라미터를 추가로 입력받습니다.
  - 토큰의 `right_level`이 99(슈퍼 어드민)가 아니면 무조건 `query_emp_id = logged_in_uid`로 고정하여 보안 조치합니다.
  - SQL 쿼리에 `AND p.year = ? AND p.week = ?` 조건을 결합해 5만여 건의 전체 스캔을 방지하고 DB 단에서 고속 필터링합니다.
  - 날짜 문자열 변환 병목을 없애고 요일 정렬을 수행합니다:
    - 필터링된 해당 주차의 레코드들(수십 건)에 대해서만 요일(월요일~일요일) 오름차순으로 정렬한 후, 같은 요일 내에서는 펀치 ID 내림차순(최신순)으로 정렬해 반환합니다.
- `[NEW]` `@app.get("/api/punch/latest_week")` 엔드포인트 추가:
  - `tb_punchsheet`에서 가장 최근 데이터의 `year`와 `week` 값을 고속으로 반환합니다. (쿼리: `SELECT year, week FROM tb_punchsheet ORDER BY id DESC LIMIT 1`)

### Frontend Components

#### [MODIFY] [page.js (Timesheet)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/timesheet/page.js)
- 어드민 판단 변수 변경: `isAdmin` 변수를 `user?.right_level === 99`로 변경하여 슈퍼 어드민만 직원 선택 드롭다운을 보거나 타인의 데이터를 조회하도록 제한합니다.
- 주차(Week) 및 연도(Year) 선택 필터 UI 추가:
  - 날짜 지정 검색 대신 연도(Year)와 주차(Week)를 선택하여 검색하도록 UI를 최적화합니다.
- '최근 자료 주간 자동 선택' 임시 버튼 구현:
  - `devConfig.devHints` (개발용 힌트 플래그)가 켜져 있을 때 활성화됩니다.
  - 클릭 시 `/api/punch/latest_week` API를 호출하여 최신 데이터가 위치한 `year`와 `week` 값을 필터에 자동 설정하고 즉시 조회합니다.

## Verification Plan

### Manual Verification
- `admin` 계정으로 로그인하여 타임시트 메뉴를 클릭하고, 전체 조회 시 지연 없이 고속(0ms 수준)으로 동작하는지 확인합니다.
- `Ulrich De Jong` 등 99레벨 미만 관리자 계정으로 로그인 시 자신의 데이터만 노출되는지 확인합니다.
- 개발용 옵션이 켜져 있을 때 '최근 자료 주간 자동 선택' 임시 버튼이 노출되는지 보고, 클릭 시 가장 최근 자료가 존재하는 주간(예: 2021년 46주 등)으로 이동하여 월요일~일요일 순서로 최신 항목이 상단에 배치되어 보이는지 확인합니다.
