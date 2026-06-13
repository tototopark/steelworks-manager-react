# [수정 계획서] 첫 번째 메뉴(Dashboard) 디자인 및 기능 동기화

1번 앱의 대시보드 강점을 결합하여 2번 앱(React)의 대시보드를 더 직관적이고 시인성 높은 형태로 개선 및 일치시킵니다.

## 사용자 검토 필요 사항
- 실시간 작업 진행률 표시를 최대 50개까지 노출하며, 그 이상일 경우 페이지네이션(페이징) 버튼을 제공합니다.
- 대시보드 바로가기 카드 3개(Jobs, Staff, Punch Clock)가 새로 배치됩니다.

## 해결안 및 변경 내용

### 1. API 호출 한도 확장
#### [MODIFY] [useDashboard.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/hooks/useDashboard.js)
- `fetchJobProgress` 내 호출 주소의 limit 파라미터를 `limit=5`에서 `limit=100`으로 넉넉하게 증대하여 프론트엔드 페이징이 원활하게 이루어지도록 준비합니다.

### 2. 대시보드 디자인 및 컴포넌트 개선
#### [MODIFY] [page.js (Dashboard)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/page.js)
- **배색 시스템 개선**: 진행 상황에 맞추어 포인트 컬러를 적용합니다.
  - 진행 중: 소프트 블루(`bg-blue-600/80` 및 `border-blue-500/30`)
  - 100% 완료: 시인성이 뛰어난 소프트 그린(`bg-green-600/80` 및 `border-green-500/30`)
- **바로가기 카드 3개 신설**:
  - `Active Jobs` (링크: `/dashboard/jobs`), `Manage Staff` (링크: `/dashboard/employees`), `Punch Clock` (링크: `/dashboard/punch` - 메뉴 신설 대비) 카드 컴포넌트를 이식합니다.
- **실시간 작업 진행 표시 일치**:
  - 잡 번호(`job_number`) 오름차순(Ascending)으로 목록을 자동 정렬합니다.
  - 한 화면에 최대 50개씩 페이징 노출되도록 클라이언트 페이징 제어를 추가합니다. (50개 초과 시 이전/다음 페이징 지원)
  - 진행도 바 내부에 완료 상세 수량 분수비(예: `85% (17/20)`) 또는 완료 완료 문구(`100% COMPLETED`)를 텍스트 오버레이 처리합니다.

## 검증 계획

### 수동 검증
- 대시보드 진입 시 3개의 바로가기 카드가 정상 렌더링되며, 클릭 시 올바른 경로로 이동하는지 확인.
- 잡 목록이 잡 번호 오름차순으로 완벽히 자동 정렬되는지 확인.
- 진행 중인 잡과 100% 완료된 잡의 프로그레스 바가 각각 파란색/초록색으로 명확하게 렌더링되는지 확인.
- 바 내부 오버레이로 `85% (17/20)` 및 `100% COMPLETED` 텍스트가 정상 출력되는지 검증.
- `npm run build`를 구동하여 빌드 컴파일 오류 여부 최종 검증.
