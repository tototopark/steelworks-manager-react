# 미비 기능 종합 마이그레이션 구현 테스크

- [x] 백엔드 API 보완 및 추가 (`core/api_router.py`)
  - [x] `/api/punch` 세부 작업 펀치(START/STOP/PAUSE) 파라미터 및 `tb_jobs_details` 상태 업데이트 로직 이식
  - [x] 권한 기반 Timesheet 조회 API `/api/punch/timesheet` 구현 (관리자는 전체, 직원은 본인 데이터 강제 바인딩)
  - [x] CSV Export API `/api/export/punch` 권한 기반 연동
- [x] 프론트엔드 Timesheet 화면 개발 (`fe/src/app/dashboard/timesheet/page.js`)
  - [x] 일자별, 직원별 필터 및 상세 목록 뷰 렌더링
  - [x] 권한에 따른 조회 범위 및 필터 활성화/비활성화 처리
  - [x] Export CSV 연동
- [x] 사이드바 메뉴 연동 (`fe/src/components/common/Sidebar.js` 및 `DevHints.js`)
- [x] Job Details 부재별 START / STOP / PAUSE 작업 제어 UI 이식 (`fe/src/app/dashboard/jobs/page.js`)
- [x] 빌드 및 기능 테스트 (권한별 CRUD 격리 확인)
