# 개발자 힌트 대안 A 통합 구현 계획

본 계획서는 기존의 중앙 집중식 DevHints.js의 HINTS_MAP을 안전하게 유지 보관하되, 각 페이지 내부에서도 props를 통해 독자적인 힌트 정보를 렌더링할 수 있도록 컴포넌트를 업그레이드하고, 대시보드 메인 페이지에 대안 A 형식을 이식하는 계획입니다.

## 사용자 검토 요구사항
- DevHints 컴포넌트가 props 존재 여부에 따라 동적/기존 방식으로 나누어 작동하는 기능 확인.
- 백엔드 config 옵션(SHOW_DEV_HINTS)에 의해 기존 방식과 신규 방식 모두가 동일하게 관리자 제어 하에 출력되는 구조 확인.

## 오픈 질문
- 없음.

## 제안된 변경 사항

### 힌트 컴포넌트 및 페이지 이식

#### [MODIFY] [DevHints.js](file:///F:/pe/public_html/steelworks-manager-react/fe/src/components/common/DevHints.js)
#### [MODIFY] [page.js (dashboard)](file:///F:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/page.js)
#### [NEW] [수정_react_63_개발자힌트대안A통합구현_plan.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_63_개발자힌트대안A통합구현_plan.md)
#### [NEW] [수정_react_63_개발자힌트대안A통합구현_walkthrough.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_63_개발자힌트대안A통합구현_walkthrough.md)

## 검증 계획

### 수동 검증
- 대시보드 페이지 하단에 기존 레이아웃에서 띄우는 힌트 박스와 개별 컴포넌트에서 띄우는 힌트 박스 2개가 정상 노출되는지 확인.
- SHOW_DEV_HINTS 옵션을 비활성화했을 때 2개 힌트가 모두 일괄 비노출되는지 확인.
