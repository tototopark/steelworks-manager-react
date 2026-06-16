# 사용자별 최신 주차 자동 검색 보완 구현 계획서

관리자(level 99)가 아닌 일반 사용자(Ulrich 등)가 로그인하여 'Auto Week (Dev)' 버튼을 실행했을 때, 본인의 펀치 기록이 없는 엉뚱한 타인의 최신 주간(예: 2022년 17주)이 선택되어 결과가 빈 칸으로 표시되는 현상을 해결합니다.

## User Review Required

> [!NOTE]
> 최신 주차 조회 API(/api/punch/latest_week)가 로그인한 사용자의 권한 등급을 감안하도록 수정합니다. 99레벨 미만의 사용자는 전체 데이터가 아닌 '본인이 작성한 펀치 기록 중 가장 최신' 연도와 주차를 추출해 세팅되도록 고속 쿼리를 보완합니다.

## Open Questions

- 없음

## Proposed Changes

### Backend Components

#### [MODIFY] [api_router.py](file:///f:/pe/public_html/steelworks-manager-react/core/api_router.py)
- `@app.get("/api/punch/latest_week")` 엔드포인트 수정:
  - 사용자 토큰 페이로드(`Depends(get_current_user_payload)`)를 주입받습니다.
  - 권한이 99레벨 미만인 경우 `WHERE employee_id = ?` 필터를 쿼리에 추가하여, 해당 로그인 사용자의 가장 최신 기록 연도와 주차를 반환하도록 변경합니다.

## Verification Plan

### Manual Verification
- `Ulrich De Jong` 계정으로 로그인한 상태에서 `Auto Week (Dev)` 버튼을 클릭합니다.
- `Ulrich` 자신의 최신 데이터가 존재하는 연도와 주차로 정상 동기화되어, 타임시트 목록에 데이터가 누락되지 않고 올바르게 표시되는지 확인합니다.
