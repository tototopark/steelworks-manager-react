# 직원 테이블 활성화 컬럼 추가 및 마이그레이션 복구 구현 계획서

레거시 마이그레이션 및 데이터베이스 초기화 진행 후, 로그인 화면의 직원 ID 목록(Quick-Fill)이 나타나지 않는 문제를 해결하기 위해 tb_login 테이블 스키마에 결여되어 있던 is_active 컬럼을 명시적으로 추가합니다.

## User Review Required

> [!NOTE]
> 데이터베이스 초기화 유틸리티(db_init.py)의 tb_login 테이블 생성 정의에 is_active 컬럼(기본값 1)이 결여되어 있어, API 조회 쿼리(SELECT ... WHERE is_active = 1) 실행 시 no such column 오류가 발생하여 직원 목록을 가져오지 못했습니다. 본 조치를 통해 스키마에 컬럼을 영구 추가하고 마이그레이션을 재실행하여 목록을 원상 복구합니다.

## Open Questions

- 없음

## Proposed Changes

### Database Configs & Inits

#### [MODIFY] [db_init.py](file:///f:/pe/public_html/steelworks-manager-react/tests/db_init.py)
- `TABLE_SCHEMAS["tb_login"]` SQL문 정의 내에 `is_active INTEGER DEFAULT 1` 컬럼을 명시적으로 추가합니다.

## Verification Plan

### Manual Verification
- `tests/db_init.py` 수정 후, 관리자 DB 메뉴에서 `Migrate Legacy`를 재실행합니다.
- 데이터베이스 초기화 및 레거시 데이터 임포트가 에러 없이 정상적으로 수행되는지 확인합니다.
- 로그인 화면 하단 `Developer Account Quick-Fill`에 직원 ID 리스트가 정상적으로 나타나 복구되었는지 수동 검증합니다.
