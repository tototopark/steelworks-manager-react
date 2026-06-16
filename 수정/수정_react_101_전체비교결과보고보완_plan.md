# 1번과 2번 앱 전체 비교 결과 보고 보완 계획서

## 사용자 검토 필요 사항
- 2번 앱(React)에서 누락되었거나 미비한 기능들에 대한 보완 조치 계획:
  1. Holidays (공휴일): 백엔드 API와 SQLite 테이블은 존재하나, 프론트엔드 독립 UI 화면(fe/src/app/dashboard/holidays/page.js) 및 사이드바 메뉴 연동이 누락되어 있습니다.
  2. Activity (실시간 작업 로그): 1번 앱에는 activity.html이 존재하나, 2번 앱에는 해당 메뉴 및 화면이 아예 누락되어 있습니다.
  3. Staff Reminder (직원 자격증 만료 알림): 1번 앱에는 staff_reminder.html이 존재하나, 2번 앱에는 차량 알림(Vehicles)만 반영되어 있고 직원 자격증 만료 알림판은 누락되어 있습니다.

## 개요
이 계획서는 1번 앱과 2번 앱의 나머지 모든 메뉴(4번 Monthly Plan ~ 10번 Admin DB)에 대한 실제 React 소스 코드 구현 상태를 검증하고, 비교 분석서 문서(_수정_react_46_1번과2번앱메뉴비교표.md)에 미비 사항들을 완벽히 정리하여 최종 완료 상태로 업데이트하기 위한 계획을 수립합니다.

## 변경 제안 사항

### 비교 분석서 보완

#### [MODIFY] [_수정_react_46_1번과2번앱메뉴비교표.md](file:///f:/pe/public_html/steelworks-manager-react/수정/_수정_react_46_1번과2번앱메뉴비교표.md)
- 4번 Monthly Plan, 5번 Whiteboard, 6번 Employees, 7번 Vehicles, 9번 Punch Clock, 10번 Admin DB 메뉴의 세부 구현 일치 여부를 검증 완료 상태로 업데이트합니다.
- 미비점/누락 항목인 Holidays UI 부재, Activity 로그 화면 부재, Staff Reminder 화면 부재를 각각의 항목 및 레거시 메뉴 비교 섹션에 구체적으로 기술하여 향후 추가 마이그레이션이 필요한 대상을 명확히 밝힙니다.

## 검증 계획

### 수동 검증
- 수정된 _수정_react_46_1번과2번앱메뉴비교표.md 파일의 텍스트 구성 및 마크다운 링크 형식이 유효한지 확인합니다.
- 빌드 검증을 통해 프로젝트에 오류가 없는지 최종 확인합니다.
