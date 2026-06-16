# 수정_react_93_퀵필터일괄확장및이미지경로이식_task

타임시트 외 주요 통계 및 스케줄 화면 퀵 검색 필터 적용, 레거시 PHP 프로젝트 사진 파일 이식, ERD 무한로딩 수정 진행 상태입니다.

- [x] 주요 통계 및 스케줄 퀵 버튼 배치
  - [x] Whiteboard Task Board 퀵 이동 버튼 구성 (`fe/src/app/dashboard/whiteboard/page.js`)
  - [x] Monthly Production Plan 퀵 이동 버튼 구성 (`fe/src/app/dashboard/weekly-plan/page.js`)
  - [x] Performance Statistics 및 Rankings 퀵 이동 버튼 구성 (`fe/src/app/dashboard/performance/page.js`)
- [x] 레거시 `sitepro` 이미지 및 아바타 파일 이식
  - [x] `sitepro/uploads` 아바타 파일을 `static/uploads/avatars`로 복사
  - [x] `sitepro/uploadsPhoto/2021` 도면/현장 사진을 `static/uploads/jobs/2021`로 복사
  - [x] 복사된 파일명과 실제 DB 경로 컬럼 매핑 업데이트 (`scratch/update_paths.py` 실행 완료)
- [x] ERD 다이어그램 무한 로딩 수정 (`fe/src/app/dashboard/admin-db/page.js`)
  - [x] Mermaid 스크립트 로드 전략 최적화
  - [x] activeTab erd 전환 시 run/contentLoaded 이중 렌더링 호출 보완
- [x] 브라우저 검증 및 빌드 정상 완료 확인
