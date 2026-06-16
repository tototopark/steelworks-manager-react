# 개발 테스트용 퀵필 고유 평문 노출 및 해시 보안 복구 계획

## 사용자 검토 요구사항
- 해시 우회 로그인 제거 및 DB 보안 조치 완료 확인.
- `Reset to Unique Hashed` 실행 시, 각 직원별 고유 평문 비밀번호(예: `dev_Aaron`, `dev_Alison` 등)가 생성 및 해싱되어 저장되는지 확인.
- 로그인 화면의 퀵필 목록 우측에 각 사용자의 고유 평문 비밀번호(`dev_[login]`)가 노출되는지 확인.
- 클릭 시 해당 고유 평문이 자동 주입되고, 정상적인 `bcrypt.checkpw` 연산을 수행해 대시보드에 즉시 진입하는지 확인.

## 제안된 변경 사항

### 1. 백엔드 및 퀵필의 고유 비밀번호 생성/대조 로직 구현

#### [MODIFY] [200_admin_pipeline.py](file:///F:/pe/public_html/steelworks-manager-react/skills/200_admin_pipeline.py)
- `reset_all_passwords_hashed()`: 모든 사용자의 비밀번호를 `'dev_[사용자ID]'` (예: `dev_Aaron`) 형태로 생성한 후, 각 사용자별 고유 salt를 적용하여 `bcrypt` 해시 형태로 DB에 일괄 저장합니다.

#### [MODIFY] [api_router.py](file:///F:/pe/public_html/steelworks-manager-react/core/api_router.py)
- `/api/employees` 엔드포인트에서 각 직원의 비밀번호 해시값을 표준 `bcrypt.checkpw`로 검증합니다.
  - 해당 해시가 `'12345678'`의 해시라면 `password_display`와 `autofill_password`를 `'12345678'` 평문으로 전송합니다.
  - 해당 해시가 고유값인 `'dev_[login]'` (예: `dev_Aaron`)의 해시라면 `password_display`와 `autofill_password`를 `'dev_[login]'` 평문으로 전송합니다.
  - 그 외의 비밀번호(사용자가 변경한 커스텀 세션 비밀번호)는 해시 문자열 원본 그대로 노출합니다.

### 2. 프론트엔드 어드민 DB 및 로그인 페이지 연동

#### [MODIFY] [page.js](file:///F:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/admin-db/page.js)
- 어드민 DB 페이지 내 리셋 버튼 정보를 `Reset to Unique Hashed` 및 `dev_[login]`으로 설명을 변경합니다.

#### [MODIFY] [page.js](file:///F:/pe/public_html/steelworks-manager-react/fe/src/app/login/page.js)
- 퀵필 컴포넌트 렌더링 시 백엔드에서 결정한 `emp.password_display` 및 `emp.autofill_password` 값을 적용하여 각 직원의 고유 평문을 노출하고 클릭 시 폼에 주입합니다.

## 검증 계획
- `Reset to Unique Hashed` 실행 후 -> 로그인 화면의 퀵필 목록 우측에 각 사용자의 아이디에 따라 `dev_Aaron`, `dev_Alison` 등이 독립적으로 노출되는지 확인 -> 클릭 시 해당 평문이 자동 주입되고, 정상적인 `bcrypt.checkpw` 검증을 거쳐 로그인 및 대시보드 진입이 성공하는지 검증합니다.
