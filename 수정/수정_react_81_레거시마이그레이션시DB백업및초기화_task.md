# 레거시 마이그레이션 시 기존 DB 백업 및 초기화 작업 목록

- [x] 백엔드 마이그레이션 코드 수정 (skills/200_admin_pipeline.py)
  - [x] migrate_legacy_data 함수 수정
  - [x] DB 파일 존재 시 타임스탬프 기반 백업 복사(shutil.copy2) 로직 구현
  - [x] db_init.create_tables()를 호출하여 기존 DB 스키마 리셋 및 빈 테이블 생성
- [x] 마이그레이션 연동 테스트 및 백업 파일 생성 여부 수동 검증
