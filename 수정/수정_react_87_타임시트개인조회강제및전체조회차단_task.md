# 타임시트 개인 조회 강제 및 전체 조회 차단 작업 목록

- [x] 백엔드 라우터 수정 (core/api_router.py)
  - [x] /api/punch/timesheet 엔드포인트 수정
  - [x] query_emp_id 누락 또는 0(admin)인 경우 쿼리 중단 및 빈 배열 반환 조건 추가
  - [x] 각 펀치 로그 응답 데이터에 day_of_week (한국어 요일) 필드 매핑 로직 이식
- [x] 프론트엔드 타임시트 컴포넌트 수정 (fe/src/app/dashboard/timesheet/page.js)
  - [x] 직원 선택 select 드롭다운에서 All Employees 옵션 제거
  - [x] 어드민 로그인 시 selectedEmp 기본값을 첫 번째 직원 ID로 설정하는 로직 보완
  - [x] 테이블 로그 히스토리 날짜 렌더링 시 요일(day_of_week) 노출되도록 반영
- [x] 단일 조회 및 요일 노출 수동 검증 완료
