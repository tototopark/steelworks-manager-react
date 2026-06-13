# 개발 테스트용 퀵필 평문 매핑 노출 및 해시 보안 복구 계획

## 사용자 검토 요구사항
- 해시 문자열 우회 로그인 예외 로직 제거 확인 (데이터베이스 실제 보안 유지).
- `Reset to Hashed 12345678` 실행 시, 실제 해시 대상 값인 평문 `'dev12345'` 문자열을 기억하여 로그인 화면의 퀵필 목록 우측에 표시하고, 클릭 시 평문 `'dev12345'`가 자동으로 폼에 주입되어 정상적인 `bcrypt.checkpw` 연산을 수행해 대시보드에 접근하도록 개선 확인.

## 제안된 변경 사항

### 1. 보안 폴백 롤백 및 평문 변환 로직 추가

#### [MODIFY] [api_router.py](file:///F:/pe/public_html/steelworks-manager-react/core/api_router.py)
- 로그인 인증 API(`auth_login`)에서 임시 추가했던 해시 문자열 대조 우회 기능(`payload.password == user['password']`)을 완전히 삭제하여 해시값 탈취 시 우회 가능한 취약점을 제거합니다.
- 직원 목록 조회 API(`/api/employees`)에서 각 사원의 비밀번호 해시값을 표준 `bcrypt.checkpw` 함수를 통해 검증합니다.
  - 해당 해시가 `'12345678'`의 해시라면 `password_display`와 `autofill_password`를 `'12345678'` 평문으로 전송합니다.
  - 해당 해시가 `'dev12345'`의 해시라면 `password_display`와 `autofill_password`를 `'dev12345'` 평문으로 전송합니다.
  - 그 외의 비밀번호(사용자가 변경한 세션 비밀번호)는 해시 문자열 원본 그대로 노출합니다.

#### [MODIFY] [200_admin_pipeline.py](file:///F:/pe/public_html/steelworks-manager-react/skills/200_admin_pipeline.py)
- 개발자 일괄 리셋 시 대상 평문 비밀번호를 기존 `12345678`에서 **`dev12345`** 해시로 수정하여, 일괄 초기화(평문)와 이중 렌더링 검사 로직이 겹치지 않고 명확하게 구동되도록 정렬합니다.

### 2. 프론트엔드 로그인 페이지 수정

#### [MODIFY] [page.js](file:///F:/pe/public_html/steelworks-manager-react/fe/src/app/login/page.js)
- 퀵필 컴포넌트 렌더링 시 백엔드에서 전송해 주는 매핑 평문 값(`emp.password_display` 및 `emp.autofill_password`)을 렌더링 및 자동 입력 폼으로 연결합니다.

## 검증 계획
- `Reset to Hashed 12345678` (임의 비밀번호 해시 일괄 갱신) 실행 후 -> 로그인 화면의 퀵필 목록 우측에 `dev12345` 평문 텍스트 그대로 노출 확인 -> 해당 항목 클릭 시 `dev12345`가 비밀번호 입력란에 자동 주입되는지 확인 -> 로그인 버튼 클릭 시 백엔드의 `bcrypt.checkpw` 연산을 정상 기동하여 대시보드 진입 확인.
