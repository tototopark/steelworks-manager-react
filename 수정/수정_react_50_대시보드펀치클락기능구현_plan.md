# 대시보드 펀치클락(Punch Clock) 기능 구현 계획

1번 앱의 `punch.html`을 참고하여 2번 앱(Next.js)에 Punch Clock 기능을 추가하고 사이드바 메뉴 및 대시보드 바로가기를 연결합니다.

## User Review Required

> [!NOTE]
> 펀치클락 페이지는 현지 시간(en-NZ 포맷)을 실시간으로 표시하며, 직원 선택 후 Punch In(출근) / Punch Out(퇴근) 기록을 백엔드 API `/api/punch`로 전송합니다.

## Proposed Changes

### 1. 사이드바 메뉴에 Punch Clock 추가

#### [MODIFY] [Sidebar.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/components/common/Sidebar.js)
사이드바 메뉴 하단에 `Punch Clock` 항목을 추가하고, `/dashboard/punch` 경로로 매핑합니다.

### 2. 대시보드 바로가기 카드 링크 활성화

#### [MODIFY] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/page.js)
대시보드의 세 번째 카드인 `Punch Clock` 영역을 단순 `div`에서 `Link` 컴포넌트로 변경하여 `/dashboard/punch`로 이동할 수 있도록 활성화하고, opacity-80 등의 비활성 스타일을 제거합니다.

### 3. Punch Clock 페이지 생성

#### [NEW] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/punch/page.js)
현지 시간 실시간 표시, 직원 선택 드롭다운, PUNCH IN (성공/초록색 버튼), PUNCH OUT (실패/빨간색 버튼)이 포함된 깔끔한 다크 모드 스타일의 펀치클락 화면을 구현합니다.

### 4. 개발자 힌트 매핑 추가

#### [MODIFY] [DevHints.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/components/common/DevHints.js)
`/dashboard/punch` 경로에 대해 FE, BE, DB 매핑 힌트를 표시할 수 있도록 `HINTS_MAP`에 추가합니다.

---

## Verification Plan

### Automated Tests
- `npm run build`를 수행하여 빌드 오류 및 린트 오류가 없는지 검증합니다.

### Manual Verification
- 사이드바 메뉴 및 대시보드 카드에서 `Punch Clock` 클릭 시 페이지 이동이 잘 되는지 확인합니다.
- 직원 선택 후 PUNCH IN/OUT 버튼 작동 여부 및 결과 메시지가 올바르게 출력되는지 검증합니다.
