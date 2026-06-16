# 타임시트 기본 주차 필터링 및 권한 필터 보완 작업 목록

- [x] 백엔드 라우터 소스코드 수정 (core/api_router.py)
  - [x] get_timesheet 함수 수정
  - [x] role_level 변수 캐스팅 처리 보완 (int 변환)
  - [x] 99레벨 미만 시 query_emp_id 누락 방어(기본값 -1 지정) 구현
  - [x] year/week가 None으로 들어올 때 가장 최신 펀치 주차 정보를 구하여 기본값으로 주입하는 로직 구현
- [x] 프론트엔드 연동 및 수동 조회 속도 복구 검증
