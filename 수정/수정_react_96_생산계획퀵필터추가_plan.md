# Monthly Production Plan 개발자 퀵 필터 추가 계획

## User Review Required
- 본 수정사항은 Monthly Production Plan (주간 계획 및 메모) 화면 상단에 데이터가 다수 존재하고 텍스트가 많은 날짜들(2020-11-25, 2021-11-25, 2021-07-07, 2020-02-26)로 즉시 이동할 수 있는 Quick Dev Filters 버튼을 배치하는 내용입니다.
- 이미 소스코드에 해당 날짜들이 잘 구성되어 동작하는 상태이며, 이를 확정하여 기록으로 보존합니다.

## Proposed Changes

### fe (Front-end)

#### [MODIFY] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/weekly-plan/page.js)
- Quick Dev Filters에 아래의 날짜들이 추가되었는지 확인 및 최종 수정 완료:
  - 2020-11-25 (Rich Notes & Plans)
  - 2021-11-25 (Week Note)
  - 2021-07-07 (Production Plan)
  - 2020-02-26 (Production Plan)

## Verification Plan

### Manual Verification
- 웹 브라우저에서 /dashboard/weekly-plan으로 접속하여 상단의 Quick Dev Filters 영역에 2020-11-25, 2021-11-25, 2021-07-07, 2020-02-26 필터 버튼들이 제대로 노출되는지 확인합니다.
- 각 버튼을 클릭했을 때 해당 주차로 날짜 이동 및 데이터 조회가 잘 이루어지는지 검증합니다.
