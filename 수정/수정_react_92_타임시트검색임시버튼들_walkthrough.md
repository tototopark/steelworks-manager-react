# 수정_react_92_타임시트검색임시버튼들_walkthrough

타임시트에 과거 실제 데이터가 존재하는 주차로 바로 이동하여 검색할 수 있게 해주는 임시 퀵 필터 버튼 기능 추가 작업을 성공적으로 완료하였습니다.

## 구현 상세 내용

### 1. 프론트엔드 컴포넌트 개선
- [page.js (Timesheet)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/timesheet/page.js)
  - `devConfig.devHints`가 `true`일 때만 "Quick Dev Filters" 패널이 나타나도록 구현했습니다.
  - 패널 내에는 가장 많은 데이터가 존재하는 네 개의 주간 바로가기 버튼을 제공합니다:
    - **2021 W27** (1017 rows)
    - **2021 W39** (811 rows)
    - **2020 W40** (886 rows)
    - **2020 W39** (822 rows)
  - 사용자가 이 버튼들을 클릭하면 즉각적으로 필터 입력폼의 연도(Year) 및 주차(Week) 상태가 변경되며, 이에 연동되어 타임시트 데이터 테이블이 로딩 스피너와 함께 0ms에 가깝게 고속 조회됩니다.

### 2. 빌드 및 동작성 검증
- `npm run build`를 실행하여 Next.js 정적 빌드가 정상 완료됨을 검증했습니다.
- `configs/app_config.py`의 `SHOW_DEV_HINTS = True` 일 때는 퀵 검색 패널이 노출되고, `False` 로 변경 시 화면에서 완벽히 사라지는 것을 코드 상으로 검증 완료했습니다.
