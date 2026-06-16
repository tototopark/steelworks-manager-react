# [완료 보고서] 달력 데이터 출력 오류 해결 및 메뉴 명칭 수정 완료

달력(weekly-plan) 화면의 데이터 미출력 버그를 해결하고 메뉴의 'Weekly Plan' 명칭을 'Monthly Plan'으로 변경했습니다.

## 완료 항목 (Changes Made)

### 1. 백엔드 일정 API 데이터 평탄화
- [310_schedule_pipeline.py](file:///f:/pe/public_html/steelworks-manager-react/skills/310_schedule_pipeline.py)
  - `get_weekly_schedule` 함수가 프론트엔드가 요구하는 1차원 평탄화(Flat) 리스트 형태의 `plans`를 반환하도록 수정했습니다.

### 2. 프론트엔드 달력 데이터 정상 바인딩
- [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/weekly-plan/page.js)
  - `useCalendar` 훅에서 `employeesData`와 `holidaysData` 상태값을 올바르게 전달받아 사용하도록 디스트럭처링을 보완했습니다.
  - `scheduleData` 내부에 들어있지 않던 `employees` 및 `holidays`를 `useCalendar`로부터 가져온 데이터 소스로 대체하여 오류를 해결했습니다.
  - 페이지 내부 타이틀을 `Monthly Production Plan`으로 일관되게 변경했습니다.

### 3. 사이드바 및 헤더 메뉴명 수정 ('Weekly Plan' -> 'Monthly Plan')
- [Sidebar.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/components/common/Sidebar.js)
  - 사이드바 메뉴 이름을 `Monthly Plan`으로 수정했습니다.
- [Header.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/components/common/Header.js)
  - 경로에 따른 헤더 타이틀 매핑 함수 `getPageTitle`에서 `/dashboard/weekly-plan` 라우트에 대한 반환값을 `Monthly Plan`으로 수정했습니다.

## 검증 결과 (Validation Results)

### Next.js 정적 빌드 테스트
- `npm run build`를 실행하여 컴파일 에러 및 빌드 오류 없이 정상적으로 빌드 완료됨을 확인했습니다.
