# 관리자 파이프라인 모듈 동적 리로드 적용 작업 목록

- [x] 백엔드 라우터 소스코드 수정 (core/api_router.py)
  - [x] api_migrate_legacy 엔드포인트에 importlib.reload 추가
  - [x] api_reset_passwords 엔드포인트에 importlib.reload 추가
  - [x] api_reset_passwords_hashed 엔드포인트에 importlib.reload 추가
  - [x] api_db_inspect_tables 엔드포인트에 importlib.reload 추가
  - [x] api_db_inspect_table 엔드포인트에 importlib.reload 추가
  - [x] api_db_integrity 엔드포인트에 importlib.reload 추가
- [x] Migrate Legacy 재작동 및 백업 생성 검증
