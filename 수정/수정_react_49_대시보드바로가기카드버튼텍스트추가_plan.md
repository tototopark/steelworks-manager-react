# 대시보드 바로가기 카드 버튼 텍스트 추가 구현 계획

대시보드 상단의 3개 바로가기 카드(Active Jobs, Employees & Whiteboard, Punch Clock)에 1번 앱의 스타일을 참고하여, 사용자가 직관적으로 이동할 수 있음을 나타내는 'Go to Jobs', 'Go to Employees', 'Go to Punch Clock' 등 명시적인 버튼 형태의 링크 텍스트를 카드 하단 또는 우측에 추가합니다.

## User Review Required

> [!NOTE]
> 각 카드 내부에 단순 텍스트 안내뿐만 아니라 마우스 오버 시 강조되는 형태의 "Go to ..." 버튼 UI를 이식합니다.

## Proposed Changes

### 1. 대시보드 바로가기 카드 UI 수정

#### [MODIFY] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/page.js)
기존의 3개 바로가기 카드 내부 구조를 변경하여, 카드 하단부에 이동 버튼 텍스트를 명시합니다.
- Active Jobs 카드: 하단에 "Go to Jobs ->" 추가
- Employees & Whiteboard 카드: 하단에 "Go to Employees ->" 추가
- Punch Clock 카드: 하단에 "Go to Punch Clock ->" 추가 (비활성화 상태이므로 적절하게 가이드라인 표시)

---

## Verification Plan

### Automated Tests
- `npm run build`를 수행하여 Next.js 빌드가 에러 없이 완료되는지 확인합니다.

### Manual Verification
- 대시보드 페이지를 띄우고 바로가기 카드 하단에 'Go to ...' 링크 텍스트가 정상적으로 노출되는지 확인합니다.
- 카드 클릭 시 해당 메뉴 페이지로 정상 이동하는지 점검합니다.
