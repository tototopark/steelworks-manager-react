# [수정 계획서] 달력 데이터 출력 오류 해결 및 메뉴 명칭 수정

달력(weekly-plan) 페이지와 칸반 보드에서 데이터를 정상적으로 표시하지 못하는 문제를 해결하고, 사용자 요청에 맞춰 메뉴의 'Weekly Plan' 명칭을 'Monthly Plan'으로 변경합니다.

## 사용자 검토 필요 사항
- 특별한 검토 사항 없음

## 해결안 및 변경 내용

### 1. 백엔드 일정 API 결과 데이터 구조 수정
#### [MODIFY] [310_schedule_pipeline.py](file:///f:/pe/public_html/steelworks-manager-react/skills/310_schedule_pipeline.py)
- `get_weekly_schedule` 함수가 `plans` 필드에 그룹화된 딕셔너리(`plans_dict`) 대신, 프론트엔드가 기대하는 플랫 리스트(`plans`)를 반환하도록 변경합니다.

### 2. 프론트엔드 달력 데이터 바인딩 로직 수정
#### [MODIFY] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/weekly-plan/page.js)
- `useCalendar` 훅으로부터 `employeesData` 및 `holidaysData`를 비구조화 할당하여 추출합니다.
- `scheduleData` 내에서 `holidays` 및 `employees`를 직접 파싱하려던 잘못된 코드 부분을 각각 `holidaysData` 및 `employeesData` 상태 변수를 사용하도록 교체합니다.

### 3. 사이드바 메뉴 및 헤더 타이틀 수정 ('Weekly Plan' -> 'Monthly Plan')
#### [MODIFY] [Sidebar.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/components/common/Sidebar.js)
- 사이드바 메뉴 배열에서 `Weekly Plan` 명칭을 `Monthly Plan`으로 수정합니다.

#### [MODIFY] [Header.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/components/common/Header.js)
- 경로 타이틀 매핑 함수 `getPageTitle`에서 `/dashboard/weekly-plan` 경로에 대한 매칭 결과 문자열을 `Weekly Plan`에서 `Monthly Plan`으로 수정합니다.

#### [MODIFY] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/weekly-plan/page.js)
- 페이지 타이틀 문구를 `Weekly Production Plan`에서 `Monthly Production Plan`으로 수정합니다.

## 검증 계획

### 수동 검증
- 백엔드 서버 구동 후 로그인하여 대시보드 진입.
- 사이드바 및 헤더 타이틀이 'Monthly Plan'으로 변경되었는지 확인.
- 'Monthly Plan' 메뉴 진입 시 정상적으로 직원(Bay) 행들과 주간 생산 계획 데이터가 노출되는지 확인.
- `Jump to Active Date (Dev)` 버튼 클릭 시 데이터가 채워진 적절한 주차로 이동하며 데이터를 온전하게 렌더링하는지 확인.
- `npm run build`를 실행하여 프론트엔드 빌드 시 정적 컴파일 오류가 없는지 최종 확인.
