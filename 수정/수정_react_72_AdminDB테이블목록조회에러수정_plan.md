# Admin DB 테이블 목록 조회 에러 해결 계획

## 사용자 검토 요구사항
- Admin DB 탭 클릭 시 `ModuleNotFoundError: No module named 'tests'` 에러가 발생하던 부분 조치 완료 확인.

## 제안된 변경 사항

### 관리자 테이블 목록 조회 버그 수정

#### [MODIFY] [200_admin_pipeline.py](file:///F:/pe/public_html/steelworks-manager-react/skills/200_admin_pipeline.py)
- `get_tables_list()` 내에서 존재하지 않는 `tests.db_inspector` 모듈을 임포트하던 부분을 삭제합니다.
- 대신, 이미 선언된 `TABLE_METADATA` 딕셔너리의 key 목록을 사용하여 테이블 목록(`TABLES`)을 직접 정의하도록 개선합니다.

## 검증 계획
- Admin DB 메뉴 클릭 시 500 에러 없이 정상적으로 데이터베이스 테이블들의 이름 및 행 수(row count) 목록이 정상 표출되는지 검증합니다.
