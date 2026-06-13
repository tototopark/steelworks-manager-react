# 강제 12345678 평문 업데이트 및 테스트용 해시 일괄 업데이트 기능 추가 계획

## 사용자 검토 요구사항
- Admin DB에 2개의 독립적인 비밀번호 업데이트 버튼 및 연동 확인:
  1. `Reset to 12345678`: DB에 평문 `'12345678'`로 다이렉트 업데이트. 로그인 시 "비밀번호 변경 강제" 프로세스 정상 진입.
  2. `Reset to Hashed 12345678`: DB에 암호화된 해시값(`$2b$12$...`)으로 업데이트. 퀵필에 해시 데이터가 그대로 보이며, 클릭 시 비밀번호 변경 창 없이 즉시 로그인 통과 (테스트용 편의 기능).

## 제안된 변경 사항

### 1. 백엔드 로직 분리 및 라우트 추가

#### [MODIFY] [200_admin_pipeline.py](file:///F:/pe/public_html/steelworks-manager-react/skills/200_admin_pipeline.py)
- `reset_all_passwords()`: 모든 비밀번호를 평문 `'12345678'`로 강제 갱신합니다.
- `reset_all_passwords_hashed()`: 모든 비밀번호를 `bcrypt` 암호화 해시로 일괄 갱신합니다.

#### [MODIFY] [api_router.py](file:///F:/pe/public_html/steelworks-manager-react/core/api_router.py)
- `@app.post("/api/admin/reset_passwords_hashed")` API 라우트를 신설하여 `reset_all_passwords_hashed()`를 호출하도록 연결합니다.
- 로그인 검증 로직(`auth_login`)에서 `user['password'] == "12345678"` 평문 일치 및 암호화 해시 검증을 모두 유기적으로 대응하도록 구조를 안정화합니다.

### 2. 프론트엔드 어드민 DB 페이지 UI 추가

#### [MODIFY] [useAdminDB.js](file:///F:/pe/public_html/steelworks-manager-react/fe/src/hooks/useAdminDB.js)
- `resetAllPasswordsHashed()` 동작 메소드를 추가하여 백엔드의 `/api/admin/reset_passwords_hashed` API와 매핑합니다.

#### [MODIFY] [page.js](file:///F:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/admin-db/page.js)
- 기존 단일 리셋 버튼 영역에 **"Reset to 12345678" (평문 강제 업데이트)** 버튼과 **"Reset to Hashed 12345678" (개발 테스트용 암호화 해시 강제 업데이트)** 버튼 2개로 분리하여 레이아웃을 구성합니다.

## 검증 계획
- `Reset to 12345678` 실행 후 -> 로그인 화면 퀵필에 `12345678` 텍스트 그대로 표시 -> 클릭 후 로그인 시 비밀번호 변경 화면 진입 확인.
- `Reset to Hashed 12345678` 실행 후 -> 로그인 화면 퀵필에 `$2b$12$...` 해시 실데이터 그대로 표시 -> 클릭 후 로그인 시 변경창 없이 즉시 로그인 및 대시보드 진입 성공 확인.
