# 펀치화면 로그인 사용자 한정 및 레거시 마이그레이션 분석 계획

본 계획서는 펀치 클락 화면을 로그인한 본인만을 대상으로 제한하고, 레거시 PHP 앱(`sitepro`)을 분석하여 아직 React 앱에 포팅되지 않은 비즈니스 로직 및 기능 격차를 도출하는 계획입니다.

## User Review Required

> [!NOTE]
> 펀치화면은 전체 직원 목록 드롭다운이 필요 없으며, 현재 세션에 로그인한 사용자의 고유 ID와 이름으로 고정하여 PUNCH IN/OUT을 수행하도록 수정합니다.

## Proposed Changes

### 1. 펀치 클락 페이지 수정

#### [MODIFY] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/punch/page.js)
- `useAuth()` 훅을 사용하여 로그인된 `user` 객체를 추출합니다.
- 직원 선택 Select 드롭다운을 제거하고, 로그인된 사용자의 이름을 화면에 크게 노출합니다.
- PUNCH IN/OUT 버튼 클릭 시 `user.id`를 백엔드 `/api/punch` API의 `employee_id` 파라미터로 전달하도록 수정합니다.

---

## Verification Plan

### Automated Tests
- `npm run build`를 실행하여 Next.js 빌드가 정상 완료되는지 확인합니다.

### Manual Verification
- 로그인한 계정(예: admin)으로 접속 시 펀치 화면에 로그인한 이름이 나타나는지 검증합니다.
- 드롭다운 없이 버튼 클릭만으로 본인의 출퇴근 펀치가 정상 저장되는지 확인합니다.
