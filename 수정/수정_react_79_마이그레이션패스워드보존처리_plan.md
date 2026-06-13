# 마이그레이션 시 기존 패스워드 보존 처리 계획

## 사용자 검토 요구사항
- `Migrate Legacy` 실행 시 레거시 DB에 저장되어 있는 비밀번호 데이터를 임의로 초기화(12345678 리셋)하지 않고, **레거시 DB에 있던 해시 패스워드 그대로 보존**하도록 설정 확인.

## 제안된 변경 사항

### 1. 레거시 마이그레이션 비밀번호 자동 갱신 로직 제거

#### [MODIFY] [200_admin_pipeline.py](file:///F:/pe/public_html/steelworks-manager-react/skills/200_admin_pipeline.py)
- `migrate_legacy_data()` 함수에서 마이그레이션 완료 직후 자동으로 전체 비밀번호를 초기화시키던 `reset_all_passwords()` 호출 블록을 제거합니다.
- 레거시 SQL 백업에 선언된 로그인 계정의 비밀번호 해시 데이터를 가공이나 리셋 없이 **있는 그대로(Preserve)** SQLite에 이관 완료하도록 조치합니다.

## 검증 계획
- `Migrate Legacy` 실행 후 -> 성공 알림 메시지가 "Legacy database successfully migrated. All legacy passwords have been preserved."로 출력되는지 확인.
- 로그인 화면의 퀵필 목록 우측에 레거시 DB dump에서 유래한 기존 패스워드 해시 문자열들이 변형 없이 보존되어 노출되는지 검증합니다.
