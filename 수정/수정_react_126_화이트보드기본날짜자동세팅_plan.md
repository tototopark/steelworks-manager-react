# 화이트보드 기본 날짜 자동 세팅 계획

이 계획은 화이트보드 태스크 보드에 최초 진입했을 때 데이터가 없어 화면이 비어 보이는 현상을 방지하기 위해, 데이터가 존재하는 날짜(예: 2021-07-23 등)를 백엔드에서 자동으로 조회하여 기본 필터 날짜로 설정하도록 구현하기 위한 것입니다.

## 사용자 검토 요구사항

1. 백엔드에 데이터가 존재하는 가장 최근의 expiry_date를 반환하는 API 엔드포인트(/api/tasks/active-date)를 새로 구현합니다.
2. 프론트엔드 화이트보드 페이지 최초 로드 시, 필터 날짜가 지정되지 않은 상태라면 해당 API를 호출하여 데이터가 있는 날짜로 초기값을 세팅하도록 프론트엔드 컴포넌트 마운트 로직을 수정합니다.

## 제안된 변경사항

### 백엔드 API 추가

### [MODIFY] [weekly_plan.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/weekly_plan.py)
- /api/tasks/active-date 엔드포인트를 추가하여 tb_tasks 테이블에서 가장 최근의 expiry_date 값을 쿼리해 반환하도록 구현합니다.

### 프론트엔드 화이트보드 화면 수정

### [MODIFY] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/whiteboard/page.js)
- 컴포넌트 마운트 시 useEffect 내에서 /api/tasks/active-date API를 호출하고, 반환된 날짜가 존재하면 filterDate 상태값의 기본값으로 설정해 즉시 해당 일자의 태스크를 조회하도록 구성합니다.

## 검증 계획

### 자동 및 수동 검증
- 수정 후 로컬 환경에서 화이트보드 페이지에 새로고침하여 접속했을 때, 데이터가 있는 날짜(예: 2021-07-23)가 날짜 입력 필드에 자동으로 입력되고 해당 날짜의 태스크 카드가 올바르게 노출되는지 확인합니다.
