# 타임시트 개인 조회 강제 및 전체 조회 차단 구현 계획서

최고 관리자(level 99)이더라도 타임시트에서 전체 직원의 1주치 데이터(1,017건 등)가 한꺼번에 노출되는 대량 로드를 차단하고, 무조건 특정 개인을 선택하여 주간 단위로만 조회할 수 있도록 조회를 제한하고 날짜에 요일 표시를 추가합니다.

## User Review Required

> [!NOTE]
> - 전체 조회 원천 차단: 레벨 99 어드민이라 할지라도 '전체 직원(All Employees)' 조회를 금지하고, 반드시 한 번에 단 1명의 직원 데이터만 조회할 수 있도록 제한을 적용합니다.
> - 요일 추가: 각 펀치 로그의 날짜 데이터에 요일 정보(월~일)를 결합하여 프론트엔드 화면 상에서 요일이 직관적으로 표기되도록 개선합니다.
> - 드롭다운 변경: 프론트엔드 드롭다운 메뉴에서 'All Employees' 옵션을 삭제하고, 최초 진입 시 또는 자동 선택 시 특정 직원이 기본으로 선택되어 연동되도록 보완합니다.

## Open Questions

- 없음

## Proposed Changes

### Backend Components

#### [MODIFY] [api_router.py](file:///f:/pe/public_html/steelworks-manager-react/core/api_router.py)
- `@app.get("/api/punch/timesheet")` 엔드포인트 수정:
  - `query_emp_id`가 지정되지 않았거나 유효하지 않은 경우(None, 빈 문자열, 혹은 admin 로그인 시 id 0 등), 대량 데이터 전송을 차단하기 위해 쿼리를 수행하지 않고 즉시 빈 결과(`{"status": "success", "data": [], "year": year, "week": week}`)를 반환합니다.
  - 응답 데이터 각 로그 항목에 한국어 요일 정보(`day_of_week` 예: "월", "화"...) 필드를 추가하여 제공합니다.

### Frontend Components

#### [MODIFY] [page.js (Timesheet)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/timesheet/page.js)
- 드롭다운 옵션 수정:
  - 직원 선택 드롭다운(`select`) 내의 `<option value="">All Employees</option>` 옵션을 제거합니다.
- 초기값 및 연동 보완:
  - 어드민의 경우 `selectedEmp` 초기값을 빈 값이 아닌, 직원 목록 로드 시 가장 첫 번째 직원의 ID 값으로 자동 지정합니다.
  - UI 테이블 날짜 렌더링 영역에서 `formatted_date` 옆에 요일 정보(`day_of_week`)가 괄호로 노출되도록 보완합니다.

## Verification Plan

### Manual Verification
- `admin` 계정으로 로그인하여 타임시트 화면에 진입합니다.
- 직원 선택 드롭다운에서 'All Employees'가 사라졌음을 확인합니다.
- 첫 번째 직원이 기본 선택되어 해당 직원의 최신 1주치 자료만 노출되며, 날짜 옆에 `(월)`, `(화)` 형식으로 요일이 정상 표시되는지 검증합니다.
