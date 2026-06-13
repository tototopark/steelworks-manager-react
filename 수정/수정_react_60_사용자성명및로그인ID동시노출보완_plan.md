# 사용자 성명 및 로그인 ID 동시 노출 보완 계획

본 계획서는 대시보드 화면 및 사이드바 프로필 영역에서 단순 'user' 텍스트 표시를 지양하고, 현재 로그인된 사용자의 성명(Firstname, Surname)과 로그인 ID(Login)를 명확하게 결합하여 출력함으로써 사용자 정체성을 확보하는 계획입니다.

## 사용자 검토 요구사항
- 대시보드의 'Welcome back, {이름} ({ID})' 형식 적용 및 사이드바 내 ID 추가 출력 여부 확인.

## 오픈 질문
- 없음.

## 제안된 변경 사항

### 프론트엔드 UI 수정

#### [MODIFY] [page.js (dashboard)](file:///F:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/page.js)
#### [MODIFY] [Sidebar.js](file:///F:/pe/public_html/steelworks-manager-react/fe/src/components/common/Sidebar.js)
#### [NEW] [수정_react_60_사용자성명및로그인ID동시노출보완_plan.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_60_사용자성명및로그인ID동시노출보완_plan.md)
#### [NEW] [수정_react_60_사용자성명및로그인ID동시노출보완_walkthrough.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_60_사용자성명및로그인ID동시노출보완_walkthrough.md)

## 검증 계획

### 수동 검증
- 대시보드 진입 시 상단에 'Welcome back, {사용자 성명} ({로그인 ID})' 형식으로 정보가 정상 출력되는지 확인.
- 사이드바 프로필 탭에 이름 밑에 'ID: {로그인 ID}' 텍스트가 명확하게 추가되어 렌더링되는지 확인.
