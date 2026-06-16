# 수정 사항 요약 (수정_react_112_대시보드에러및차량만료알림API수정)

대시보드 통계 에러 및 헤더의 차량 만료 점검 API 500 에러를 해결하기 위한 수정을 완료했습니다.

## 변경 파일 목록

1. **[MODIFY] [api_router.py](file:///f:/pe/public_html/steelworks-manager-react/core/api_router.py)**
   - `FastAPI`의 `Request` 클래스 임포트 누락으로 인한 구동 오류 수정.
   - `/api/dashboard/job_progress`에서 숫자로 시작하는 `300_dashboard_pipeline` 모듈 로드 시의 문법 및 예외 처리 로직 수정.
   - 헤더의 차량 알림 배지 개수를 가져오는 `/api/reminders/vehicles/expiry-check` API 구현 추가 (WOF, REGO 만료일이 30일 이내로 남은 항목 카운팅).

## 검증 내용
- `core.api_router` 모듈 로드가 정상적으로 동작하는지 확인 완료 (`Router module loaded successfully`).
- `300_dashboard_pipeline` 모듈이 정상적으로 데이터를 조회하는지 테스트 완료.
