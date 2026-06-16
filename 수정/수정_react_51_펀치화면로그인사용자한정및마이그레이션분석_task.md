# 펀치화면 로그인 사용자 한정 및 레거시 마이그레이션 분석 테스크

- [x] `fe/src/app/dashboard/punch/page.js` 파일 수정
  - [x] `useAuth` 훅을 사용해 로그인 유저 정보 연동
  - [x] 직원 드롭다운 제거 및 로그인 사용자 고정 출력
  - [x] `handlePunch`에 `user.id` 전달하도록 수정
- [x] Next.js 빌드 및 기능 테스트
- [x] 레거시 PHP 앱(`sitepro`)과 2번 앱(Next.js) 기능 비교 및 미구현 마이그레이션 항목 식별 보고서 작성
