# 타임시트 정렬 보완 및 어드민 ERD 그래프 이식 계획

타임시트의 정렬 순서를 개선하여 시각적 인지 편의성을 높이고, 레거시 시스템 관리 화면(`admin.html`)에 존재했으나 React 이주 과정에서 누락되었던 mermaid.js 기반의 Core Business ERD 그래프 뷰어를 이식합니다.

## User Review Required

> [!NOTE]
> 1. **타임시트 정렬 개선**: 기존의 월요일~일요일 오름차순 정렬은 최신 데이터가 아래로 밀려 시각적으로 불편함을 줍니다. 이를 주간 단위 내에서 최신 날짜(일요일 -> 월요일 역순, 내림차순) 및 최신 펀치 ID 내림차순으로 변경하여 최신 기록이 최상단에 먼저 노출되도록 보완합니다.
> 2. **ERD 다이어그램 그래프 이식**: `fe/src/app/dashboard/admin-db/page.js`에 mermaid.js를 연동하고 탭 구조를 복구하여 데이터베이스 테이블 간의 관계 그래프(ERD Viewer)를 복원합니다.

## Proposed Changes

### Backend Routing

#### [MODIFY] [api_router.py](file:///f:/pe/public_html/steelworks-manager-react/core/api_router.py)
- `get_timesheet` 함수 내 정렬 코드를 `filtered_rows.sort(key=lambda x: (-get_weekday_index(x), -x["id"]))`로 수정하여 주간 단위 내 최신 요일 및 최신 펀치 기록이 최상단에 오도록 정렬 방식을 내림차순으로 변경합니다.

### Frontend Component

#### [MODIFY] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/admin-db/page.js)
- mermaid.js 라이브러리를 React 컴포넌트 내에서 로드하거나 `next/script`를 사용하여 연동합니다.
- `Database Inspector` 카드 내부 상단에 `Data Explorer`와 `ERD Diagram` 2개 탭을 복원합니다.
- `ERD Diagram` 탭 활성화 시 레거시 `admin.html`에 정의되어 있던 `Core Business ERD` 마크다운 다이어그램을 mermaid 컴포넌트로 파싱 및 시각화하여 렌더링합니다.

## Verification Plan

### Manual Verification
1. 타임시트 페이지 진입 후 펀치 로그가 일요일부터 월요일 역순(최신 날짜가 위)으로 자연스럽게 표시되는지 확인합니다.
2. 어드민 DB 콘솔(`AdminDBPage`)에 진입하여 `ERD Diagram` 탭을 클릭했을 때 데이터베이스 구조 그래프가 정상적으로 렌더링되는지 확인합니다.
