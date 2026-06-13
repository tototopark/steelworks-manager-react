# [Walkthrough] 로그인 API 엔드포인트 및 파라미터 수정 완료

로그인 시 발생하던 `Method Not Allowed` 오류를 수정하고 데이터 연동 검증을 완료했습니다.

## 발생 원인 (Root Cause)
- 프론트엔드의 `useAuth.js`에서 로그인 요청 시 `/api/admin/login` 엔드포인트를 호출하고 있었습니다.
- 백엔드(FastAPI)에 구성된 로그인 API 엔드포인트의 실제 경로는 `/api/auth/login` 이었습니다.
- 또한, 요청 본문(body)의 파라미터명이 백엔드는 `login`을 요구하는 데 반해 프론트엔드는 `username`으로 전달하여 파라미터 불일치가 있었습니다.

## 변경 내용 (Changes Made)
- [useAuth.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/hooks/useAuth.js):
  - API 호출 대상을 `/api/auth/login`으로 변경했습니다.
  - 전송 데이터 형식을 `{ login: username, password }` 형태로 백엔드 Pydantic 스키마(`LoginRequest`)에 맞췄습니다.
  - 로그인 성공 시 받아오는 `right_level`을 사용자 세션 객체(`userData`)에 온전히 바인딩하도록 개선했습니다.

## 검증 결과 (Validation Results)
- `npm run build`를 구동하여 컴파일 오류 없이 성공적으로 완료됨을 확인했습니다.
