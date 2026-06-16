# 주간 계획 404 해결 및 화이트보드 태스크 보드 필터 조정 계획

이 계획은 Render 배포 환경에서의 /dashboard/weekly-plan 페이지 404 에러를 해결하고, 화이트보드 태스크 보드에서 완료된 태스크도 표시되도록 쿼리 조건을 조정(방법 B)하기 위한 것입니다.

## 사용자 검토 요구사항

1. next.config.mjs에 trailingSlash 설정을 추가하여 정적 내보내기(static export) 시 폴더 구조 기반으로 인덱스가 빌드되도록 변경합니다. 이 경우 Render에서 직접 URL 접근 시 404가 방지됩니다.
2. 화이트보드 태스크 보드 데이터 출력을 위해 get_active_tasks 및 get_tasks_by_date 쿼리에서 finished = 0 또는 finished IS NULL 조건을 제거하여 완료 여부와 관계없이 모든 태스크가 조회되도록 조정합니다.

## 제안된 변경사항

### 프론트엔드 빌드 설정

### [MODIFY] [next.config.mjs](file:///f:/pe/public_html/steelworks-manager-react/fe/next.config.mjs)
- nextConfig 객체에 trailingSlash: true 설정을 추가하여 정적 웹페이지 라우트 매칭 호환성을 높입니다.

### 백엔드 태스크 파이프라인

### [MODIFY] [020_task_pipeline.py](file:///f:/pe/public_html/steelworks-manager-react/skills/020_task_pipeline.py)
- get_active_tasks 함수에서 WHERE finished IS NULL OR finished = 0 조건을 제거합니다.
- get_tasks_by_date 함수에서 t.finished_date 관련 필터링을 제거하여 데이터 조회 범위를 넓힙니다.

## 검증 계획

### 자동 및 수동 검증
- 로컬 개발 환경에서 next build 명령을 수행하여 trailingSlash 빌드가 정상적으로 완료되고, out/dashboard/weekly-plan/index.html 형태로 정적 파일이 생성되는지 확인합니다.
- 020_task_pipeline.py의 get_active_tasks 함수 수정 후 로컬 DB의 태스크 데이터를 정상적으로 반환하는지 테스트 코드를 통해 확인합니다.
