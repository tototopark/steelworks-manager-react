# 어드민 메뉴 권한 탭 추가 및 비교표 업데이트 계획

## User Review Required
- **어드민 DB 콘솔 기능 추가**: 데이터베이스 관리 페이지(Admin DB)에 "Menu Permissions (권한별 메뉴 구조)" 탭을 새로 배치하고, 레거시 시스템의 관리자 권한 레벨별 접근 가능 메뉴 구조도 정보를 표 형태로 제공합니다.
- **메뉴 비교표 업데이트**: `_수정_react_46_1번과2번앱메뉴비교표.md` 파일 상단에 레거시 앱 경로(`F:\pe\public_html\sitepro`)와 1번 앱, 2번 앱의 마이그레이션 배경 설명 및 사유를 추가하고, 하단에 레거시 9개 핵심 메뉴에 대한 상세 기능 및 1/2번 앱 구현 매핑 여부(미구현 항목 명시)를 추가합니다.

## Proposed Changes

### fe (Front-end)

#### [MODIFY] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/admin-db/page.js)
- `menu-structure` 탭 셀렉터 및 구조 표 렌더링 코드 통합 구현.

### docs (Documentation)

#### [MODIFY] [_수정_react_46_1번과2번앱메뉴비교표.md](file:///f:/pe/public_html/steelworks-manager-react/수정/_수정_react_46_1번과2번앱메뉴비교표.md)
- 머리말 영역에 마이그레이션 목적 서술 추가.
- 꼬리말 영역에 레거시 전체 메뉴 상세 기능 일람 및 1번, 2번 앱과의 구현 비교 정보 추가.

## Verification Plan

### Manual Verification
- 브라우저에서 `/dashboard/admin-db` 페이지 접속 시 권한 등급 99(Super Admin)에서 정상적으로 "Menu Permissions" 탭이 뜨는지 확인합니다.
- 해당 탭을 클릭하여 레거시 메뉴 권한 구조 정보가 표 형식으로 올바르게 렌더링되는지 확인합니다.
