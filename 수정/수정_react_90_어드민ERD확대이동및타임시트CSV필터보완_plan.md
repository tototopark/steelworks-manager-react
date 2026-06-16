# 어드민 ERD 확대 이동 및 타임시트 화면 데이터 즉시 CSV 내보내기 계획

데이터베이스 어드민 콘솔의 ERD 다이어그램을 마우스 드래그와 휠로 자유롭게 확대 및 이동할 수 있게 보완하고, 타임시트의 CSV 다운로드 방식을 백엔드 쿼리가 아닌 프론트엔드 화면에 현재 필터링 및 요일이 정확하게 표현되어 렌더링된 배열 그대로 즉시 클라이언트 단에서 가공하여 내보내도록 수정합니다.

## User Review Required

> [!NOTE]
> 1. **ERD 확대 및 이동 기능 구현**: 어드민 ERD 다이어그램 박스 영역에 마우스 드래그(Pan) 및 휠 스크롤(Zoom) 이벤트를 감지하는 React 커스텀 트랜스폼 핸들러를 장착하여 브라우저에서 편리하게 구조도를 확대하고 움직일 수 있도록 개선합니다.
> 2. **화면 렌더링 그대로 CSV 다운로드**: 별도의 백엔드 데이터베이스 재조회 없이, 현재 화면의 요일 정렬 및 필터링이 완료되어 렌더링 중인 React 상태(`logs`) 데이터를 클라이언트 사이드에서 즉시 UTF-8-BOM CSV 문자열로 가공하여 내보냅니다. 이를 통해 화면과 100% 동일한 순서 및 서식의 데이터를 빠른 속도로 출력하여 이상 데이터를 신속하게 대조/추적할 수 있게 됩니다.

## Proposed Changes

### Frontend Component

#### [MODIFY] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/admin-db/page.js)
- `activeTab === 'erd'` 일 때 보여지는 다이어그램 컨테이너에 `onWheel`, `onMouseDown`, `onMouseMove`, `onMouseUp` 이벤트를 매핑합니다.
- CSS `transform: translate(x, y) scale(s)`를 동적으로 적용하여 사용자가 다이어그램 그래프를 드래그하여 이동하고 휠로 크기를 확대/축소할 수 있도록 구현합니다.

#### [MODIFY] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/timesheet/page.js)
- `handleExportCSV` 함수를 수정하여 백엔드 API `/api/export/punch` 호출을 완전히 제거합니다.
- 현재 컴포넌트가 바인딩 중인 `logs` 배열을 참조하여, 렌더링 테이블 컬럼과 매칭되는 헤더 및 데이터 행들을 로컬 가공해 CSV blob을 생성하고 내려받게 합니다.

## Verification Plan

### Manual Verification
1. 어드민 DB 콘솔의 ERD Diagram 탭에서 휠 스크롤 및 마우스 드래그를 통해 다이어그램이 확대/축소 및 이동되는지 검증합니다.
2. 타임시트 화면에서 검색된 펀치 내역 그대로 `Export CSV`를 클릭했을 때 화면에 보이는 순서(정렬) 및 필터링된 내용과 1:1 완벽하게 부합하는 CSV 파일이 실시간으로 생성 및 다운로드되는지 확인합니다.
