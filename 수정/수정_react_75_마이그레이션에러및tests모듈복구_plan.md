# Migrate Legacy 실행시 에러 및 tests 모듈 복구 계획

## 사용자 검토 요구사항
- `Migrate Legacy` 실행 시 `ModuleNotFoundError: No module named 'tests'` 오류 해결 확인.
- `import_legacy.py` 내부에서 에러 발생 시 uvicorn 프로세스를 완전히 셧다운시키는 `sys.exit(1)` 방식을 FastAPI 에러 처리가 가능하도록 예외를 상위로 전파(`raise`)하는 방식으로 개정 확인.

## 제안된 변경 사항

### 테스트/이관 모듈 동기화 및 에러 전파 개선

#### [NEW] [tests 폴더 복구](file:///F:/pe/public_html/steelworks-manager-react/tests/)
- 레거시(non-react) 프로젝트에 있던 `tests` 디렉토리와 마이그레이션 핵심 모듈 `import_legacy.py`, 테이블 스키마 재생성 코드 `db_init.py` 등 테스트 폴더 구조 전체를 React 프로젝트 루트 폴더에 그대로 복제해 옵니다.

#### [MODIFY] [import_legacy.py](file:///F:/pe/public_html/steelworks-manager-react/tests/import_legacy.py)
- 백엔드 API에서 호출하여 마이그레이션이 실패하거나 백업 파일 누락 시, 프로세스가 종료되던 `sys.exit(1)` 코드를 제거하고 예외가 백엔드 API 단까지 전달될 수 있도록 `raise` 처리 방식으로 개선합니다.

## 검증 계획
- `Migrate Legacy` 실행 시 백엔드 프로세스 셧다운이나 `ModuleNotFoundError` 없이 정상적으로 이관 절차가 마무리되는지 확인합니다.
- 데이터베이스 `tb_login` 테이블이 레거시 데이터로 정상 채워지고 이관 후 패스워드가 정상 변경 적용되는지 검증합니다.
