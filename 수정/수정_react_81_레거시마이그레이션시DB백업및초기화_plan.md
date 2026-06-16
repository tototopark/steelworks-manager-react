# 레거시 마이그레이션 시 기존 DB 백업 및 초기화 구현 계획서

Migrate Legacy 실행 시 기존 SQLite DB 파일을 타임스탬프가 포함된 백업본으로 복사한 뒤, 테이블 구조를 완전히 초기화(DROP & CREATE)하고 레거시 데이터를 새로 가져오도록 설계를 보완합니다.

## User Review Required

> [!NOTE]
> 기존에는 데이터가 존재하는 상태에서 INSERT OR REPLACE로 누적 적용되었으나, 이 변경으로 인해 마이그레이션 시 기존 데이터베이스의 모든 테이블 정보가 백업 후 완전히 비워진 뒤 레거시 데이터로 새로 구성됩니다.

## Open Questions

- 없음

## Proposed Changes

### Backend Components

#### [MODIFY] [200_admin_pipeline.py](file:///f:/pe/public_html/steelworks-manager-react/skills/200_admin_pipeline.py)
- `migrate_legacy_data` 함수 내부에서:
  - 기존 SQLite DB 파일(`steelworks.db`)이 존재하면 현재 시간(타임스탬프 `YYYYMMDD_HHMMSS`)을 접미사로 붙여 백업본 파일(예: `steelworks.db.bak_20260613_163816`)로 복사합니다.
  - `tests/db_init.py` 모듈의 `create_tables()`를 호출하여 전체 테이블 구조를 초기화(DROP 후 재시작)합니다.
  - 그 다음 `import_legacy.import_legacy_data()`를 통해 데이터를 덤프 파일로부터 깔끔하게 신규 로드하도록 수정합니다.

## Verification Plan

### Manual Verification
- 프론트엔드 관리자 DB 페이지에서 Migrate Legacy를 실행합니다.
- 데이터 디렉토리에 타임스탬프가 추가된 백업 파일(`steelworks.db.bak_YYYYMMDD_HHMMSS`)이 정상 생성되었는지 확인합니다.
- 데이터베이스의 정보가 중복 누적되지 않고 마이그레이션 소스 데이터 기준으로 완벽하게 동기화되었는지 확인합니다.
