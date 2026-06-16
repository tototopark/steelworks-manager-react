# 수정_react_95_잡목록필터및프리젠테이션힌트배치_task

Jobs 리스트의 탭 단위 분류(Active/Completed/All) 및 페이징 조회 구현, 프레젠테이션용 과거 특정 Job(73, 74) 퀵 바로가기 배너 구현 진행 상태입니다.

- [x] 백엔드 `/api/jobs` 에 status, limit, offset 기반 필터링 쿼리 조치 (`core/api_router.py`)
- [x] 프론트엔드 `useJobs.js` 훅에 페이징 파라미터 연계
- [x] `fe/src/app/dashboard/jobs/page.js` UI 개편
  - [x] Active / Completed / All 탭 전환기 탑재
  - [x] Prev / Next 페이지네이션 탐색 바 구성
  - [x] devConfig.devHints 연동 사진이 존재하는 과거 Job 73 / 74 퀵 액세스 바로가기 버튼 배치
- [x] Next.js 정적 빌드 이상 유무 검증 완료
