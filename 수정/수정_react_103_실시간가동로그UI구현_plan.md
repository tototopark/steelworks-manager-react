# 실시간 가동 로그(Activity) UI 및 API 구현 계획서

## 사용자 검토 필요 사항
- 백엔드 API 신설: 현재 백엔드(api_router.py)에 실시간 활동 로그를 조회하는 전용 엔드포인트(/api/activity)가 존재하지 않으므로, 백엔드 코드 수정을 동반하여 신설합니다.
- 데이터 노출 범위: 최근 가동 로그 100개를 기준으로 직원 이름, 작업 부재명(member), 프로젝트 번호(job_number), 동작 종류(START/STOP/CLOCK IN/CLOCK OUT), 기록 날짜 및 시간을 역순 정렬하여 노출합니다.

## 개요
이 계획서는 2번 앱(React)에서 누락되었던 실시간 공장 가동 현황 로그 화면(Activity)을 구현하기 위해 백엔드 API를 추가하고, 프론트엔드 UI 화면 및 사이드바 메뉴를 연동하는 계획을 수립합니다.

## 변경 제안 사항

### 1. 백엔드 API 추가
#### [MODIFY] [api_router.py](file:///f:/pe/public_html/steelworks-manager-react/core/api_router.py)
- `GET /api/activity` 엔드포인트를 추가합니다.
- `tb_punchsheet` 테이블을 조회하여 최신 가동 이력(직원 성명, 부재 정보, 프로젝트 번호, 기록 시간 등) 100개를 최신순으로 반환합니다.

### 2. 프론트엔드 커스텀 훅 개발
#### [NEW] [useActivity.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/hooks/useActivity.js)
- 실시간 가동 로그 데이터를 API로부터 로드하는 `fetchActivity` 함수를 작성합니다.
- 갱신 로딩 상태 및 오류 상태 처리를 지원합니다.

### 3. 실시간 가동 로그 UI 페이지 구현
#### [NEW] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/activity/page.js)
- Tailwind CSS를 적용하여 타임라인 스타일의 실시간 로그 흐름 뷰를 제공합니다.
- 가동 상태 종류에 따른 배지(Badge) 색상 세분화:
  - CLOCK IN / START: 활성화 상태를 뜻하는 블루/그린 배지
  - CLOCK OUT / STOP: 종료 상태를 뜻하는 그레이/레드 배지
- 주기적인 자동 새로고침(Auto Refresh) 토글 기능 및 수동 새로고침 버튼 제공.

### 4. 사이드바 메뉴 연동
#### [MODIFY] [Sidebar.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/components/common/Sidebar.js)
- `menuItems`에 `Activity` 메뉴 추가 (`minRight: 1`, `path: '/dashboard/activity'`).
- `lucide-react` 패키지에서 `Activity` 아이콘을 임포트하여 적용.

## 검증 계획

### Automated Tests
- Next.js 프로덕션 빌드 테스트 (`npm run build`)를 수행하여 전체 컴파일에 문제가 없는지 확인합니다.

### Manual Verification
- 대시보드 사이드바의 "Activity" 메뉴를 클릭하여 실시간 로그 페이지에 정상적으로 진입하는지 확인합니다.
- 수동/자동 새로고침이 올바르게 구동되며, 최근 작업자들의 Punch Clock 기록이 실시간으로 반영되어 출력되는지 검증합니다.
