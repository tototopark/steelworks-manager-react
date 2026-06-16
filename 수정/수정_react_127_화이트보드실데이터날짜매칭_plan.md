# 화이트보드 실데이터 날짜 매칭 및 시프트 보완 계획

이 계획은 DB 날짜 시프트(Sync Dates to Today)를 실행했을 때, 화이트보드 태스크 테이블(tb_tasks)의 최신 데이터 날짜가 오늘 날짜와 일치하도록 보완하고, 화이트보드 화면 로드 시 하드코딩된 날짜가 아닌 실제 데이터가 존재하는 날짜를 백엔드에서 조회하여 설정하도록 처리하기 위한 것입니다.

## 사용자 검토 요구사항

1. 날짜 시프트 기능(shift_dates_to_today)에서 tb_tasks의 expiry_date 및 finished_date를 시프트할 때, tb_jobs 기준의 공통 오프셋이 아닌 tb_tasks 자체의 MAX(expiry_date)와 오늘(today)의 차이만큼 개별 오프셋을 적용하여 시프트합니다. 이렇게 하면 시프트 후 화이트보드 태스크의 최신 날짜가 정확히 오늘로 맞아떨어집니다.
2. 백엔드에서 tb_tasks의 데이터 중 가장 최근 날짜를 정확히 조회하여 반환하고, 프론트엔드는 이 날짜를 초기 필터 날짜로 안전하게 세팅합니다.

## 제안된 변경사항

### 백엔드 날짜 시프트 파이프라인 보완

### [MODIFY] [200_admin_pipeline.py](file:///f:/pe/public_html/steelworks-manager-react/skills/200_admin_pipeline.py)
- shift_dates_to_today 함수 내부에서 tb_tasks 테이블을 DATE_COLUMNS 루프에서 제외하고, 별도의 로직으로 tb_tasks의 MAX(expiry_date)를 조회하여 오늘 날짜와의 차이(개별 오프셋)만큼 expiry_date 및 finished_date를 업데이트하도록 수정합니다.

### 백엔드 API 보완

### [MODIFY] [weekly_plan.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/weekly_plan.py)
- /api/tasks/active-date 엔드포인트에서 tb_tasks의 실데이터가 있는 가장 최신 expiry_date를 조회하여 반환하도록 로직을 공고히 유지합니다.

## 검증 계획

### 자동 및 수동 검증
- 로컬 DB에서 shift_dates_to_today를 실행한 후, tb_tasks 테이블의 MAX(expiry_date)가 오늘 날짜(2026-06-16 등)로 정확히 이동했는지 쿼리를 통해 확인합니다.
- 프론트엔드 화이트보드 화면에 접속했을 때 자동으로 세팅되는 날짜가 오늘 날짜와 일치하는지 확인합니다.
