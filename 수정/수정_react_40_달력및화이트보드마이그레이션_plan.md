# 달력 및 화이트보드 마이그레이션 계획

프론트엔드(`fe`)에 주간 작업 계획 달력(Weekly Plan)과 드래그 앤 드롭 칸반 보드(Whiteboard)를 개발하고 백엔드 API와 연동합니다.

## User Review Required

> [!IMPORTANT]
> - **달력 기능**: 월간/주간 날짜를 토대로 직원의 작업 및 메모를 표기하며, 특정 날짜 선택 시 상세 플랜을 작성하는 레이어를 탑재합니다.
> - **화이트보드 기능**: 드래그 앤 드롭 방식을 채택하여 직원의 태스크 상태(Expiry date, Priority 등)를 직관적으로 변경할 수 있도록 HTML5 Drag and Drop API 또는 UI State로 구현합니다.
> - **로직 분리**: 화면 렌더링을 담당하는 컴포넌트와 비즈니스 데이터 처리용 커스텀 훅(`useCalendar`, `useWhiteboard`)을 물리적으로 완전히 격리합니다.
> - **이모지 배제**: CLAUDE.md 규칙을 준수하여 텍스트 및 코드에서 이모지를 제외하고 적절한 아이콘이나 라벨을 표기합니다.

## Proposed Changes

### 1. 캘린더 (Weekly Plan) 도메인 이식
#### [NEW] [useCalendar.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/hooks/useCalendar.js)
- 주간 메모 및 직원별 배치 플랜 API(`/api/tasks/active`, `/api/dev/random-date` 등) 연동.
- 메모 작성 및 생산 계획 수정 처리.

#### [NEW] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/weekly-plan/page.js)
- 주간 일정 및 일별 노트를 격자 구조로 시각화하여 렌더링하는 UI 페이지.

### 2. 화이트보드 (Whiteboard Kanban) 도메인 이식
#### [NEW] [useWhiteboard.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/hooks/useWhiteboard.js)
- 활성 태스크 데이터 호출 및 태스크 생성, 수정, 삭제 비즈니스 로직.
- 태스크 드래그 앤 드롭 시 직원의 태스크 할당 정보를 업데이트하는 로직 연동.

#### [NEW] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/whiteboard/page.js)
- 직원별/태스크별 카드를 드래그하여 할당을 변경할 수 있는 칸반 보드 화면.

---

## Verification Plan

### Automated Tests
- 코드 작성 후 `npm run build`를 구동하여 빌드 및 정적 분석 통과 여부를 검사합니다.

### Manual Verification
- 브라우저를 통해 `/dashboard/weekly-plan` 및 `/dashboard/whiteboard` 페이지로 이동하여 데이터가 제대로 노출되는지 검증합니다.
- 화이트보드 칸반 보드 상의 태스크 카드가 정상적으로 드래그 앤 드롭되어 상태가 변경되는지 테스트합니다.
