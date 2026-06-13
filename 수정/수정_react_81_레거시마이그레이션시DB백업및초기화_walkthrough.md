# 레거시 마이그레이션 시 기존 DB 백업 및 초기화 결과 보고서

마이그레이션 도중 기존 데이터가 누적되지 않도록 기존 DB를 백업하고 테이블 구조를 완전히 초기화한 후 새로 데이터를 가져오도록 보완했습니다.

## 변경 사항

- [200_admin_pipeline.py](file:///f:/pe/public_html/steelworks-manager-react/skills/200_admin_pipeline.py)
  - `migrate_legacy_data()` 함수 내에 백업 및 초기화 로직을 추가했습니다.
  - 마이그레이션 작업 시작 시 기존에 `steelworks.db` 파일이 존재할 경우 `steelworks.db.bak_YYYYMMDD_HHMMSS` 형식의 이름으로 안전하게 복사본을 만듭니다.
  - 백업이 완료되면 `tests/db_init.py` 모듈의 `create_tables()`를 수행하여 모든 테이블을 완전히 초기화(Drop & Recreate)합니다.
  - 초기화 직후 `import_legacy.import_legacy_data()`를 실행하여 레거시 덤프 데이터만을 온전히 새롭게 로드합니다.

## 확인 및 검증 결과

- 이제 `Migrate Legacy` API 호출 시 기존에 가지고 있던 불필요한 데이터가 누적되지 않고 깔끔하게 소스 데이터로 초기화되어 구축되는 한편, 만약의 사태를 위해 기존 데이터베이스 파일은 타임스탬프와 함께 백업 파일로 보존됩니다.
