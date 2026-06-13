# 임시 비밀번호 로그인 강제 변경 및 일괄 리셋 버튼 보완 계획

본 계획서는 초기 default 비밀번호(12345678)로 로그인 시 사용자가 바로 비밀번호를 변경할 수 있도록 로그인 화면 및 관련 인증 훅을 보완하고, 어드민 DB 대시보드 내의 패스워드 일괄 초기화 버튼을 직관적으로 개선하는 계획입니다.

## 사용자 검토 요구사항
- 12345678 비밀번호 사용 로그인 시, 'require_change' 응답을 프론트엔드가 받아서 새 비밀번호 변경 입력폼으로 자연스럽게 전환되는 플로우 검증.
- Admin DB 뷰어의 'Reset Passwords' 버튼이 'Reset to 12345678'로 레이블이 변경되어 직관성을 높인 조치 확인.

## 오픈 질문
- 없음.

## 제안된 변경 사항

### 프론트엔드 로그인/인증 로직 수정

#### [MODIFY] [useAuth.js](file:///F:/pe/public_html/steelworks-manager-react/fe/src/hooks/useAuth.js)
#### [MODIFY] [page.js (login)](file:///F:/pe/public_html/steelworks-manager-react/fe/src/app/login/page.js)
#### [MODIFY] [page.js (admin-db)](file:///F:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/admin-db/page.js)
#### [NEW] [수정_react_58_임시비밀번호로그인강제변경및일괄리셋버튼보완_plan.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_58_임시비밀번호로그인강제변경및일괄리셋버튼보완_plan.md)
#### [NEW] [수정_react_58_임시비밀번호로그인강제변경및일괄리셋버튼보완_walkthrough.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_58_임시비밀번호로그인강제변경및일괄리셋버튼보완_walkthrough.md)

## 검증 계획

### 수동 검증
- 12345678 패스워드를 가진 임의의 직원 계정으로 로그인 시도 시 화면에 비밀번호 변경 경고와 새 비밀번호 입력란이 출력되는지 확인.
- Admin DB 콘솔 페이지에서 'Reset to 12345678' 버튼이 출력되며, 클릭 시 작동 팝업이 노출되는지 확인.
