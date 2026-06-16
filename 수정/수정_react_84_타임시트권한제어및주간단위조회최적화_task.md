# 타임시트 권한 제어 및 주간 단위 조회 최적화 작업 목록

- [x] 백엔드 라우터 수정 및 추가 (core/api_router.py)
  - [x] /api/punch/latest_week 엔드포인트 신설 (최신 데이터의 year, week 반환)
  - [x] /api/punch/timesheet 엔드포인트 수정 (year, week 파라미터 조건 처리 및 right_level 99 제한 필터 적용, 요일 오름차순 및 ID 내림차순 정렬 처리 적용)
- [x] 프론트엔드 타임시트 컴포넌트 수정 (fe/src/app/dashboard/timesheet/page.js)
  - [x] isAdmin 변수를 right_level === 99 기준으로 변경
  - [x] 기존 시작/종료 날짜 입력 컴포넌트를 연도(Year) 및 주차(Week) 입력으로 교체
  - [x] devHints 플래그 조건에 맞게 '최근 자료 주간 자동 선택' 버튼 렌더링
  - [x] 자동 주간 선택 기능 API 연동 구현 및 요일 정렬 표시 대응
- [x] 권한 및 조회 성능 수동 확인 및 검증
