# 타임시트 기본 주차 필터링 및 권한 필터 보완 구현 계획서

초기 진입 시 연도(Year)와 주차(Week) 필터가 주어지지 않았을 때 전체 5만여 건의 데이터를 한꺼번에 조회해오는 현상을 방지하고, 권한 제어가 동작하지 않아 전체 데이터가 노출되는 오작동을 안전하게 방어하기 위해 로직을 보완합니다.

## User Review Required

> [!NOTE]
> - 기본 주차 자동 지정: API 요청에 `year` 또는 `week` 파라미터가 누락되었을 때(초기 화면 진입 등), 백엔드 내에서 자동으로 데이터베이스에 기록된 가장 최신의 연도와 주차를 조회하여 기본 쿼리 필터 조건으로 적용합니다. 이를 통해 필터 없는 전체 조회로 인한 10초 이상의 지연 현상을 원천 차단합니다.
> - 권한 강제 필터 안전장치: 토큰의 권한 정보 추출 및 정수형 변환을 강제하고, 99레벨(슈퍼 어드민) 미만일 때 사용자 조회가 실패하더라도 전체 조회가 실행되지 않도록 방어 코드(Default ID -1 지정 등)를 적용합니다.

## Open Questions

- 없음

## Proposed Changes

### Backend Components

#### [MODIFY] [api_router.py](file:///f:/pe/public_html/steelworks-manager-react/core/api_router.py)
- `@app.get("/api/punch/timesheet")` 엔드포인트 로직 수정:
  - `role_level` 추출 시 확실하게 정수형으로 변환합니다: `role_level = int(payload.get("right_level", 1))`
  - 99레벨 미만인 경우 `query_emp_id`가 정상적으로 구해지지 않으면 기본값 `-1`을 주어 타인의 데이터가 노출되는 사고를 방지합니다.
  - 쿼리 실행 전 `year` 또는 `week`가 제공되지 않았을 경우, 자동으로 최신 데이터가 존재하는 주간의 정보를 탐색하여 변수에 대입합니다:
    ```python
    if year is None or week is None:
        latest = db_client.fetch_one("SELECT year, week FROM tb_punchsheet ORDER BY id DESC LIMIT 1")
        if latest:
            if year is None: year = latest["year"]
            if week is None: week = latest["week"]
    ```

## Verification Plan

### Manual Verification
- 타임시트 메뉴를 클릭하고 필터가 없는 초기 로드 상태에서도 `Punch Log History`가 전체 53581 entries가 아닌, 자동으로 최신 주차 데이터만 필터링되어 고속(0ms 수준)으로 렌더링되는지 확인합니다.
- 일반 사용자(`Ulrich` 등)로 로그인하여 최초 진입 시, 본인의 최신 주차 데이터만 노출되는지 확인합니다.
