# 수정_react_92_타임시트검색임시버튼들_plan

타임시트에 과거 실제 데이터가 존재하는 주차(2021년 27주, 2021년 39주, 2020년 39주, 2020년 40주 등)로 즉시 검색 필터를 채우고 조회할 수 있는 개발용 임시 퀵 버튼들을 생성합니다. 이 버튼은 `configs/app_config.py` 파일의 `SHOW_DEV_HINTS = True/False` 여부에 따라 프론트엔드 UI에 노출되거나 보이지 않게 처리됩니다.

## User Review Required

> [!NOTE]
> - **임시 버튼들의 역할**: 데이터가 오래된 실데이터만 있으므로, 타임시트 화면 접속 시 빈 화면 대신 실제 데이터가 많은 주요 주차로 즉시 전환할 수 있는 바로가기 버튼들을 배치합니다.
> - **연동 방식**: `configs/app_config.py` 내의 `SHOW_DEV_HINTS` 값을 `/api/config/dev_features` API를 통해 프론트엔드에 전달하고, 이 값이 `true`일 때만 타임시트 검색 영역 옆 혹은 바로 위에 임시 검색 버튼들을 노출합니다.
> - **퀵 검색 대상 주차 후보**:
>   - 2021년 27주차 (가장 많은 데이터 1,017건)
>   - 2021년 39주차 (811건)
>   - 2020년 39주차 (822건)
>   - 2020년 40주차 (886건)

## Open Questions

- 없음

## Proposed Changes

### Frontend Components

#### [MODIFY] [page.js (Timesheet)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/timesheet/page.js)
- `devConfig.devHints`가 `true`일 때 노출되는 퀵 검색 버튼 컴포넌트 추가.
- UI 상단 필터 영역 내부 또는 직전에 2021년 27주, 2021년 39주, 2020년 40주, 2020년 39주 등으로 바로 전환되는 작은 버튼 모음을 배치.
- 각 버튼을 클릭하면 `setYear` 및 `setWeek` 상태를 업데이트하고, 상태 업데이트 후 렌더링 루프에 의해 `fetchLogs`가 즉각 연쇄 트리거되도록 처리.

## Verification Plan

### Automated Tests
- 없음

### Manual Verification
- 웹 브라우저를 열고 타임시트 메뉴(`http://localhost:3701/dashboard/timesheet`)에 접근합니다.
- `SHOW_DEV_HINTS = True` 상태에서 상단 필터 영역 아래나 위에 "Quick Dev Filters: [2021 W27] [2021 W39] [2020 W40] [2020 W39]" 와 같은 임시 퀵 검색 버튼들이 나타나는지 확인합니다.
- 해당 버튼을 누르면 연도 및 주차 입력 폼이 자동으로 채워지고 해당 주차의 실시간 펀치 정보가 정상 조회되는지 확인합니다.
- `configs/app_config.py`의 `SHOW_DEV_HINTS = False`로 변경했을 때 퀵 버튼들과 Auto Week 버튼이 모두 화면에서 말끔하게 숨겨지는지 확인합니다.
