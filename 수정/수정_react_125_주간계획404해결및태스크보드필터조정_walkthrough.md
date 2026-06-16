# 주간 계획 404 해결 및 화이트보드 태스크 보드 필터 조정 결과

이번 세션에서는 Render 배포 환경의 특정 경로 404 문제를 해결하고 화이트보드 태스크 데이터를 원활하게 보여주기 위해 아래 작업을 완료했습니다.

## 완료된 작업 내용

1. **Render 404 에러 해결 (next.config.mjs 수정)**
   - [next.config.mjs](file:///f:/pe/public_html/steelworks-manager-react/fe/next.config.mjs) 파일에 `trailingSlash: true` 설정을 추가했습니다.
   - 이를 통해 static export 시 각 경로가 단독 html이 아닌 `[route]/index.html` 형태(예: `weekly-plan/index.html`)로 빌드되어 호스팅 웹 서버에서 다이렉트 접근 시 404가 발생하지 않도록 조치했습니다.

2. **화이트보드 태스크 보드 필터 조정 (방법 B 적용)**
   - [020_task_pipeline.py](file:///f:/pe/public_html/steelworks-manager-react/skills/020_task_pipeline.py) 파일의 `get_active_tasks` 및 `get_tasks_by_date` 함수 내부 쿼리에서 완료 여부(`finished`) 필터 조건을 완전히 해제했습니다.
   - 이제 완료된 태스크(`finished = 1`)를 포함한 모든 태스크 데이터가 화이트보드 태스크 보드에 정상적으로 매칭 및 노출됩니다.

## 검증 결과

- **로컬 빌드 검증**: `fe` 디렉토리에서 `npm run build` 명령을 실행하여 정상적으로 빌드가 완료됨을 확인하였습니다.
- **빌드 파일 구조 검증**: `fe/out/dashboard/weekly-plan` 경로 아래에 정적 `index.html`이 올바르게 생성되었음을 확인했습니다.
