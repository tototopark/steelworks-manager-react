# 타임시트 요일 표시 보완 및 일자별 배경색 교차 디자인 계획

타임시트 날짜 옆에 요일(예: `Mon`, `Tue`)이 표시되지 않는 문제를 확실하게 보완하고, 선구분 대신 날짜(요일)가 달라질 때마다 2가지 어두운 회색 톤의 배경색을 교차 적용하여 시각적 구분을 차분하게 구현합니다.

## User Review Required

> [!NOTE]
> 본 수정은 UI에서 날짜 문자열 `formatted_date`가 있을 때 자바스크립트 내부 날짜 함수를 활용해 요일을 추가 매핑하는 프론트엔드 폴백 로직을 더해 요일이 100% 무조건 노출되도록 보장합니다.
> 선구분 대신, 날짜가 바뀔 때마다 차분한 2가지 배경색(`bg-zinc-900/10`, `bg-zinc-800/20`)이 교차로 칠해지도록 구현하여 일자별 데이터 묶음을 쉽게 눈으로 인지하게 돕습니다.

## Proposed Changes

### Frontend Component

#### [MODIFY] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/timesheet/page.js)
- 날짜를 렌더링하는 테이블 행의 날짜 셀(`formatted_date` 옆)에 표시할 요일 정보가 `log.day_of_week`로 비어 있는 경우를 위해 프론트엔드 내에서 `formatted_date`로부터 영문 요일(`Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`, `Sun`)을 얻어오는 `getDayOfWeekFallback` 폴백 함수를 작성합니다.
- 테이블 렌더링 시 `{log.formatted_date} ({dayOfWeek})`와 같이 상시 노출하도록 구조를 변경합니다.
- 기존의 상단 굵은 구분선(`border-t-2 border-zinc-700`) 스타일을 삭제합니다.
- 테이블 렌더링 루프 바깥에 `dayGroupIndex`와 `lastDate` 상태 변수를 관리하여, 날짜가 바뀔 때마다 교차 인덱스를 토글시킵니다.
- 짝수 날짜 그룹에는 `bg-zinc-900/10` (혹은 기본값), 홀수 날짜 그룹에는 너무 화려하지 않고 차분한 `bg-zinc-800/20` 배경색을 부여합니다.

### Backend Routing

#### [MODIFY] [api_router.py](file:///f:/pe/public_html/steelworks-manager-react/core/api_router.py)
- 백엔드 요일 구하기 로직에 에러 로깅을 추가하여 혹시 데이터 파싱 중 실패하는 레코드가 있는지 로깅하고, 기본 요일 매핑 동작을 다시 검증합니다.

## Verification Plan

### Manual Verification
1. 로그인 후 타임시트 페이지로 이동합니다.
2. `Auto Week (Dev)` 버튼 등을 눌러 펀치 로그 히스토리가 정상적으로 표시되는지 확인합니다.
3. 펀치 로그의 날짜 컬럼에서 `2021-07-05 (Mon)` 등 괄호 안에 영문 요일이 안전하게 표시되는지 확인합니다.
4. 선구분선이 제거되고, 날짜가 전환될 때마다 행들의 배경색이 차분하게 2개 톤으로 순환 및 묶음 표시되는지 확인합니다.
