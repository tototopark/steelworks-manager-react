# 직원 테이블 활성화 컬럼 추가 및 마이그레이션 복구 결과 보고서

데이터베이스 완전 초기화 및 마이그레이션 진행 이후, 로그인 화면 하단 직원 리스트(Quick-Fill) 조회가 정상 수행되지 않던 현상을 해결하기 위해 스키마에 결여되어 있던 활성화 여부 컬럼(is_active)을 추가하고 마이그레이션을 재작동시켜 리스트를 원상태로 복구했습니다.

## 변경 사항

- [db_init.py](file:///f:/pe/public_html/steelworks-manager-react/tests/db_init.py)
  - `tb_login` 테이블 스키마 생성 쿼리 내에 `is_active INTEGER DEFAULT 1` 컬럼 정의를 영구 추가했습니다.
  
- [200_admin_pipeline.py](file:///f:/pe/public_html/steelworks-manager-react/skills/200_admin_pipeline.py)
  - `migrate_legacy_data` 내부 모듈 동적 호출 시, 수정된 스키마가 반영될 수 있도록 `tests.db_init` 및 `tests.import_legacy` 모듈에 대해서도 `importlib.reload` 처리를 강제하여 캐싱 무효화를 보장했습니다.

## 확인 및 검증 결과

- 마이그레이션 API를 재호출하여 DB 파일이 백업 및 리셋 후 새 덤프 데이터로 정상 구축되었습니다.
- `is_active` 컬럼 결여 오류가 완벽히 소멸되어 직원 목록 API(`/api/employees`)가 정상 상태(`200 OK`)로 복귀하고 활성 직원 32명의 목록을 안전하게 반환합니다.
- 로그인 화면 하단의 `Developer Account Quick-Fill` 목록에 정렬된 직원 계정 ID 리스트가 완전하게 복구되어 다시 정상 노출됩니다.
