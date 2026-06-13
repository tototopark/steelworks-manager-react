# 대시보드 실시간 작업 구분 표시 및 공통 개발자 힌트 기능 구현 계획

대시보드의 Active Jobs Production Progress 목록을 **진행 중인 작업**과 **완료된 작업** 2개의 패널로 구분하여 출력하고, 최대 50개 단위 페이지네이션을 적용합니다. 
또한 시스템 유지보수 편의를 위해 `SHOW_DEV_HINTS = True` 설정 시 화면 하단에 현재 페이지와 관련된 소스 코드 파일(FE, BE, DB 테이블 및 조건)을 보여주는 공통 개발자 힌트 컴포넌트를 추가합니다.

## User Review Required

> [!NOTE]
> `configs/app_config.py`의 `SHOW_DEV_HINTS = True` 옵션에 따라 프론트엔드가 활성화 여부를 백엔드 API `/api/config/dev_features` 또는 기존 `/api/config`를 호출하여 판단합니다.

## Proposed Changes

### 1. Backend Config API 제공 확인

기존 `core/api_router.py`에 구현되어 있는 `/api/config/dev_features` (또는 `/api/config`) API를 활용하여 프론트엔드에서 `dev_hints` 옵션을 받아올 수 있도록 합니다.

### 2. Frontend 공통 DevHints 컴포넌트 추가

#### [NEW] [DevHints.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/components/common/DevHints.js)
현재 Next.js Router의 `pathname`을 인식하여 화면 하단에 관련 정보(FE 파일, Hooks, BE API, DB 테이블 및 조건)를 표시하는 반응형 컴포넌트입니다.
- 백엔드에서 `dev_hints` 활성화 여부를 조회하여 `true`인 경우에만 렌더링합니다.
- UI: 다크 모드에 어울리는 Sleek한 모던 그레이 보더 디자인 및 뱃지 스타일 적용.

### 3. Dashboard Layout에 DevHints 추가

#### [MODIFY] [layout.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/layout.js)
`DashboardLayout`에 `<DevHints />`를 공통 적용하여 대시보드 하위의 모든 페이지에 자동으로 개발자 힌트가 출력되도록 함.

### 4. 대시보드 Active Jobs 패널 분할 및 페이지네이션

#### [MODIFY] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/page.js)
Active Jobs Production Progress 영역을 **진행 중인 작업 (In Production)**과 **완료된 작업 (Completed)** 두 패널로 나란히 또는 위아래 탭 형식으로 표시합니다.
- 정렬: 두 패널 모두 Job # 오름차순.
- 페이징: 패널마다 최대 50개씩 개별 페이지네이션(이전/다음 페이지 버튼)을 제공하여 깔끔하게 표시.
- 진행 중 바 색상: 파란색 (Blue)
- 완료 바 색상: 초록색 (Green)

---

## Verification Plan

### Automated Tests
- `npm run build`를 수행하여 빌드 오류 및 린트 오류가 없는지 검증합니다.

### Manual Verification
- 대시보드에서 진행 중인 작업과 완료된 작업이 올바르게 분류되고 개별 페이지네이션이 작동하는지 검증합니다.
- `SHOW_DEV_HINTS = True` 일 때 화면 하단에 힌트 정보 영역이 이쁘게 렌더링되는지 확인하고, `False`로 변경 시 숨겨지는지 점검합니다.
