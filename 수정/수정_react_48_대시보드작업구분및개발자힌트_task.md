# 대시보드 실시간 작업 구분 표시 및 공통 개발자 힌트 기능 구현 테스크

- [x] DevHints 공통 컴포넌트 개발 (`fe/src/components/common/DevHints.js`)
  - [x] Next.js `pathname` 매핑을 통해 화면별 FE, BE, DB 정보 수집
  - [x] `/api/config/dev_features` API 또는 `/api/config` 호출하여 `dev_hints` 활성화 여부 확인
- [x] DashboardLayout에 DevHints 컴포넌트 추가 (`fe/src/app/dashboard/layout.js`)
- [x] 대시보드(Active Jobs) 2개 패널 나란히 배치 및 페이지네이션 구현 (`fe/src/app/dashboard/page.js`)
  - [x] 진행 중인 작업 (In Production - 파란색 바) 패널
  - [x] 완료된 작업 (Completed - 초록색 바) 패널
  - [x] 각 패널 최대 50개 제한 및 개별 페이지네이션(이전/다음 페이지) 기능
- [x] 빌드 및 실행 테스트
