# 화이트보드 날짜 버퍼 및 필터 추가 계획

이 계획은 화이트보드 태스크 보드에서 날짜 매칭 시 데이터 누락을 방지하고 사용자가 유연하게 조회할 수 있도록, 조회일 전후 1일 또는 3일 범위(커튼 효과)의 데이터를 필터링하여 조회할 수 있는 옵션을 추가하기 위한 것입니다.

## 사용자 검토 요구사항

1. 백엔드 get_tasks_by_date 함수에 buffer_days 매개변수를 추가하고, SQLite date 계산식을 이용해 target_date 전후 N일 범위의 태스크를 가져오도록 쿼리를 보완합니다.
2. 백엔드 /api/tasks/active API에 buffer 쿼리 파라미터를 추가하여 프론트엔드에서 필터 범위를 지정할 수 있게 합니다.
3. 프론트엔드 화이트보드 UI에 날짜 필터 전후 범위를 설정할 수 있는 드롭다운 또는 버튼 컨트롤(전후 1일, 전후 3일)을 추가하고, API 호출 시 이 범위(buffer)를 백엔드로 전달하도록 연동합니다.

## 제안된 변경사항

### 백엔드 쿼리 및 API 보완

### [MODIFY] [020_task_pipeline.py](file:///f:/pe/public_html/steelworks-manager-react/skills/020_task_pipeline.py)
- get_tasks_by_date(target_date, buffer_days=3)로 수정하여, expiry_date가 target_date의 '-' buffer_days일과 '+' buffer_days일 사이에 속하는지 체크하도록 쿼리를 개선합니다.

### [MODIFY] [weekly_plan.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/weekly_plan.py)
- get_active_tasks_api에서 buffer 파라미터를 입력받고(기본값 3), 이를 get_tasks_by_date에 전달합니다.

### 프론트엔드 화이트보드 페이지 연동

### [MODIFY] [useWhiteboard.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/hooks/useWhiteboard.js)
- fetchTasks(date, buffer) 함수가 buffer 인자를 받아서 `/api/tasks/active?date=${date}&buffer=${buffer}` 형태로 백엔드에 요청을 전달하게 합니다.

### [MODIFY] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/whiteboard/page.js)
- dateBuffer(기본값 3) 상태값을 정의합니다.
- UI 상단 날짜 필터 입력란 옆에 버퍼 범위를 선택할 수 있는 버튼 그룹("1 Day Buffer", "3 Days Buffer") 또는 드롭다운을 추가합니다.
- dateBuffer 값이 바뀌거나 filterDate가 바뀔 때 fetchTasks를 호출하도록 의존성을 추가합니다.

## 검증 계획

### 자동 및 수동 검증
- 수정한 후 로컬 환경에서 화이트보드 페이지를 실행하여, 버퍼 범위를 "1일 전후" 또는 "3일 전후"로 전환했을 때 이에 해당하는 태스크 카드가 실시간으로 정상 매칭되어 화면에 나타나는지 확인합니다.
