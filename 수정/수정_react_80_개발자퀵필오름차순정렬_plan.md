# Developer Account Quick-Fill 오름차순 정렬

로그인 화면의 개발자 퀵필 목록에 표시되는 계정들의 순서를 로그인 ID(login) 기준으로 오름차순 정렬하여 보여지도록 개선합니다.

## User Review Required

> [!NOTE]
> 백엔드 API에서 이미 ORDER BY login ASC가 일부 적용되어 있을 수 있으나, 프론트엔드 화면단에서 데이터 정렬을 명시적으로 처리하여 항상 ID 기준 오름차순으로 정렬되도록 보장합니다.

## Open Questions

- 없음

## Proposed Changes

### Frontend Components

#### [MODIFY] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/login/page.js)
- `employees.map`을 사용하기 전에 `login` 필드 기준 오름차순으로 정렬한 뒤 렌더링되도록 수정합니다.

## Verification Plan

### Manual Verification
- 로그인 페이지 하단의 Developer Account Quick-Fill 영역에서 계정들이 A-Z 순서로 오름차순 정렬되어 노출되는지 직접 확인합니다.
