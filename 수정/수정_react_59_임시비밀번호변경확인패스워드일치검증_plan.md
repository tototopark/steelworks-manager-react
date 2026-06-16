# 임시 비밀번호 변경 확인 패스워드 일치 검증 계획

본 계획서는 초기 비밀번호 변경 시, 사용자가 비밀번호 오탈자를 방지할 수 있도록 Confirm Password(비밀번호 확인) 입력 칸을 신설하고, 두 패스워드가 서로 완벽하게 일치할 때에만 변경되도록 프론트엔드 로그인 검증 로직을 고도화하는 계획입니다.

## 사용자 검토 요구사항
- New Password와 Confirm Password 입력란 추가 및 두 값이 다를 경우 오류 메시지가 정상 출력되는지 확인.

## 오픈 질문
- 없음.

## 제안된 변경 사항

### 로그인 페이지 수정

#### [MODIFY] [page.js (login)](file:///F:/pe/public_html/steelworks-manager-react/fe/src/app/login/page.js)
#### [NEW] [수정_react_59_임시비밀번호변경확인패스워드일치검증_plan.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_59_임시비밀번호변경확인패스워드일치검증_plan.md)
#### [NEW] [수정_react_59_임시비밀번호변경확인패스워드일치검증_walkthrough.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_59_임시비밀번호변경확인패스워드일치검증_walkthrough.md)

## 검증 계획

### 수동 검증
- 임시 비밀번호 로그인 시 New Password와 Confirm Password 두 개 입력란이 보이는지 확인.
- 서로 다른 비밀번호를 입력하고 제출 시 'New password and confirm password do not match' 경고가 발생하는지 검증.
