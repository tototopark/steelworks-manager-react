# 일반 사원 로그인 시 401 Unauthorized 오류 해결 및 순수 bcrypt 전환 계획

일반 사원 계정으로 로그인 시 401 Unauthorized 에러가 발생하는 원인을 분석하고, 백엔드의 비밀번호 검증 및 해싱 방식을 표준 `bcrypt` 패키지를 사용하는 순수 bcrypt 방식으로 전환하여 로그인 오류를 복구하는 계획입니다.

## 사용자 검토 요구사항
- `passlib` 대신 순수 `bcrypt` 모듈을 통한 패스워드 검증 및 생성 전환 확인.
- SQLite 데이터베이스 내 기존 32바이트 잘린 해시값을 정상적인 bcrypt 해시값으로 일괄 정상화 완료 확인.

## Proposed Changes

### 백엔드 인증 및 비밀번호 관리 로직 개선

#### [MODIFY] [api_router.py](file:///F:/pe/public_html/steelworks-manager-react/core/api_router.py)
- 로그인 패스워드 검증(`auth_login`), 비밀번호 직접 변경(`change_password`), 직원 등록 시의 기본 임시비밀번호 해싱(`create_employee`), 랜덤 패스워드 발급(`generate_random_password`) 시 `passlib.context.CryptContext` 대신 Python의 표준 `bcrypt` 라이브러리를 직접 사용하도록 수정합니다.

#### [MODIFY] [200_admin_pipeline.py](file:///F:/pe/public_html/steelworks-manager-react/skills/200_admin_pipeline.py)
- 관리자용 비밀번호 일괄 리셋(`reset_all_passwords`) 기능에서 `passlib` 대신 순수 `bcrypt` 모듈을 이용하여 비밀번호를 해싱 및 업데이트 하도록 수정합니다.

## Verification Plan

### 수동 검증
- 일반 사원 계정(예: `Alison`, 패스워드 `12345678`)으로 정상 로그인이 실행되는지 브라우저에서 테스트합니다.
- 로그인 성공 후 대시보드가 정상 표출되는지, 임시 비밀번호 변경 창이 의도대로 동작하는지 확인합니다.
