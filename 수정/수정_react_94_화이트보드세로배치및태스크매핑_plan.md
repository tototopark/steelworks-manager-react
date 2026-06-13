# 수정_react_94_화이트보드세로배치및태스크매핑_plan

화이트보드(Whiteboard Task Board)의 레이아웃을 사용자가 인지하기 쉽도록 좌측 컬럼에 직원이 고정되고 우측 영역에 배정된 태스크들이 세로(Stack)로 나열되는 표(Table) 형태로 변경하며, 오래된 레거시 데이터와 실제 직원 간의 ID 불일치 문제를 해결하여 정상적으로 데이터가 조회되도록 매핑합니다.

## User Review Required

> [!NOTE]
> - **레이아웃 세로 보기화**: 기존의 가로로 나열되던 직원 컬럼을 첫 번째 열(w-64 고정)로 수직 정렬하고, 각 행의 우측 열에 해당 직원의 태스크 리스트가 세로 방향으로 스택 정렬되어 표현되도록 UI 구조를 재편했습니다.
> - **데이터 바인딩 매핑 복구**: 레거시 DB 마이그레이션 당시, `tb_tasks` 내의 `employee` 외래키 ID 값(1, 7, 11, 15, 18)이 실제 `tb_login` 테이블 상에 존재하는 활성 직원 ID(107, 108, 111, 115, 117 등 Sam, Felipe)와 불일치하여 데이터가 공란으로 출력되던 원인을 교정하고 매핑을 일치시켰습니다.
> - **전체 조회 퀵 필터 추가**: 날짜 필터링이 풀린 상태에서 만료일 제한 없이 모든 등록 태스크를 한 번에 브라우징할 수 있는 `All Active Tasks (No Date)` 퀵 이동 버튼을 퀵 필터에 추가했습니다.

## Open Questions

- 없음

## Proposed Changes

### Frontend Components

#### [MODIFY] [page.js (Whiteboard)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/whiteboard/page.js)
- JSX 렌더링 영역을 가로 스크롤 레이아웃에서 세로 형태의 테이블 뷰로 전면 교체.
- 좌측 `td` 영역에 직원 정보 배치, 우측 `td` 영역에 `MapPin` 아이콘이 포함된 태스크 카드들을 수직 스택으로 바인딩.
- 퀵 필터 패널에 `All Active Tasks (No Date)` 바로가기 버튼 추가.

### Database Components

- `tb_tasks` 테이블 내 과거 레거시 직원 ID 매핑 갱신 완료 (`1 -> 107`, `7 -> 108`, `11 -> 111`, `15 -> 115`, `18 -> 117`).

## Verification Plan

### Automated Tests
- `npm run build` 컴파일 검증 완료.

### Manual Verification
- 화이트보드 탭에 접속하여 `All Active Tasks (No Date)` 퀵필터를 클릭한 후, 각 직원 이름 우측에 배정된 작업물 태스크 카드들이 세로 방향으로 예쁘게 렌더링되는지 확인합니다.
- `2019-09-20 (Active Task)` 등 개별 날짜 퀵 필터를 눌렀을 때도 필터링된 해당일의 태스크 정보가 일치하는 직원 열에 정상 표시되는지 검증합니다.
