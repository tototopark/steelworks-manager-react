# 퀵필 해시 직접 대조 개발자 로그인 바이패스 구현 계획

## 사용자 검토 요구사항
- Developer Account Quick-Fill 컴포넌트에서 변경된 해시값(`$2b$12$...`)을 클릭하여 로그인 폼에 입력 후 로그인 단추를 눌렀을 때, `401 Unauthorized` 오류 없이 바로 바이패스 연동이 완료되는지 확인.

## 제안된 변경 사항

### 1. 백엔드 로그인 인증 우회 기능 추가

#### [MODIFY] [api_router.py](file:///F:/pe/public_html/steelworks-manager-react/core/api_router.py)
- 로그인 인증 API(`auth_login`)에서 클라이언트가 전송한 비밀번호 원문(`payload.password`)이 DB의 비밀번호 컬럼 문자열(`user['password']`)과 완전하게 일치하는 경우(즉, 퀵필에 노출된 해시 문자열을 그대로 클릭하여 그대로 전송해 온 개발자 우회 시나리오), `bcrypt.checkpw` 연산을 우회하고 즉시 인증 성공(`valid_password = True`)으로 처리하는 보완 로직을 구현합니다.

## 검증 계획
- `Reset to Hashed 12345678` 실행 후 -> 로그인 페이지에서 임의 사원 계정(예: `Aaron`)을 선택 -> 폼에 해시값 자동 바인딩 -> 로그인 시 변경 요청 페이지를 건너뛰고 정상 로그인 및 대시보드 진입 여부를 검증합니다.
