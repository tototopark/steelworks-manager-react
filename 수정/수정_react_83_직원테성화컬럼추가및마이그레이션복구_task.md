# 직원 테이블 활성화 컬럼 추가 및 마이그레이션 복구 작업 목록

- [x] 데이터베이스 초기화 유틸리티 수정 (tests/db_init.py)
  - [x] TABLE_SCHEMAS["tb_login"] 정의 내에 is_active INTEGER DEFAULT 1 컬럼 라인 추가
- [x] Migrate Legacy API를 다시 호출하여 테이블 재생성 및 데이터 재임포트 수행
- [x] 직원 목록 API (/api/employees) 호출 성공 여부 및 로그인 화면 Quick-Fill 리스트 복구 검증
