# 관리자 파이프라인 모듈 동적 리로드 적용 구현 계획서

백엔드가 켜져 있는 상태에서 skills/200_admin_pipeline.py 모듈 변경사항이 즉각 메모리에 갱신되지 않아 이전 로직(백업 및 DB 초기화 미동작)이 호출되는 문제를 해결하기 위해, API 엔드포인트 호출 시 모듈을 강제 리로드(importlib.reload)하도록 변경합니다.

## User Review Required

> [!NOTE]
> Uvicorn 개발 서버 환경에서 동적으로 임포트되는 모듈들의 변경사항이 감지되지 않을 수 있습니다. 본 변경을 통해 API 요청 시점에 해당 파이프라인 모듈을 명시적으로 리로드하게 만듦으로써 백엔드 재시작 없이도 항상 최신 버전의 코드가 작동되도록 보장합니다.

## Open Questions

- 없음

## Proposed Changes

### Backend Components

#### [MODIFY] [api_router.py](file:///f:/pe/public_html/steelworks-manager-react/core/api_router.py)
- `_200_admin_pipeline` 또는 `200_admin_pipeline` 모듈을 가져오는 다음 6개 API 엔드포인트의 임포트 구문 바로 뒤에 `importlib.reload(admin_pipeline)`를 추가합니다:
  - `api_migrate_legacy`
  - `api_reset_passwords`
  - `api_reset_passwords_hashed`
  - `api_db_inspect_tables`
  - `api_db_inspect_table`
  - `api_db_integrity`

## Verification Plan

### Manual Verification
- `core/api_router.py` 수정 후 저장 시 Uvicorn reloader가 작동하는지 확인합니다.
- 관리자 DB 페이지에서 `Migrate Legacy`를 재실행하여 데이터 누적 없이 새 덤프 파일 기준으로 초기화되며 백업 파일(steelworks.db.bak_YYYYMMDD_HHMMSS)이 올바르게 생성되는지 검증합니다.
