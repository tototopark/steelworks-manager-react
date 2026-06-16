# 수정_react_95_잡목록필터및프리젠테이션힌트배치_plan

Jobs 관리자 화면의 리스트 목록을 보다 명확하고 직관적으로 관리할 수 있도록 Active / Completed / All 탭 형태의 필터링 시스템을 도입하고, 페이징 전환(Prev, Next)을 추가하여 850개 이상의 전체 DB 레코드를 자유롭게 탐색할 수 있도록 개선합니다. 또한, 프리젠테이션 환경에서 실제 도면 및 현장 사진 데이터가 들어 있는 과거 특정 프로젝트(73번, 74번)로 즉각 선택 이동할 수 있도록 안내하는 퀵 액세스(Presentation Quick Access) 배너를 UI 상에 탑재합니다.

## User Review Required

> [!NOTE]
> - **Active / Completed / All 탭 도입**: 
>   - **Active**: 아직 제작(finish=1)이 덜 끝난 작업이 있는 프로젝트
>   - **Completed**: 모든 구성 부재(tb_jobs_details)가 최종 완료(finish=1)된 프로젝트
>   - **All Jobs**: 전체 프로젝트 리스트
> - **페이징 기능**: 이전/다음(Prev, Next) 버튼을 리스트 하단에 구현하여, 50개 단위로 나누어진 페이징 단위에 따라 고속으로 DB 데이터를 탐색합니다.
> - **프리젠테이션 퀵 힌트 배너 탑재**:
>   - `SHOW_DEV_HINTS = True` 상태일 때 Jobs 리스트 상단에 사진 데이터가 실재하는 `Job 73 (Mike Greer Homes)` 및 `Job 74 (Best Nest-James)` 바로가기 버튼이 노출되어, 프레젠테이션 시 즉석 클릭 확인이 가능합니다.

## Open Questions

- 없음

## Proposed Changes

### Backend Components

#### [MODIFY] [api_router.py](file:///f:/pe/public_html/steelworks-manager-react/core/api_router.py)
- `@app.get("/api/jobs")` 엔드포인트 수정:
  - `status`(active/completed/all), `limit`, `offset` 쿼리 파라미터를 추가로 바인딩합니다.
  - SQLite의 `EXISTS` 및 `NOT EXISTS` 구문을 조합하여 완벽히 제작 완료된 작업물만을 고속 추출 및 필터링하여 반환합니다.

### Frontend Components

#### [MODIFY] [useJobs.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/hooks/useJobs.js)
- `fetchJobs` 훅에 `status`, `limit`, `offset` 파라미터를 연계하도록 업데이트합니다.

#### [MODIFY] [page.js (Jobs)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/jobs/page.js)
- Jobs 리스트 상단에 Active / Completed / All 탭 전환 단추 배치.
- Jobs 리스트 하단에 Prev, Next 페이지네이션 이동 컨트롤러 배치.
- 개발 힌트 옵션 활성화 시 사진이 존재하는 과거 Job 73 / 74 번으로 1초 만에 바로 진입하는 퀵 엑세스 단추 배너 노출.

## Verification Plan

### Automated Tests
- `npm run build` 정적 빌드가 정상 배포 가능한 상태임을 최종 확인 완료.

### Manual Verification
- Jobs 관리자 페이지에 접속하여 상단 탭을 `Active` -> `Completed` -> `All Jobs` 순으로 변경하며 리스트 목록이 즉각 동적으로 변경되는지 확인합니다.
- 하단의 Prev, Next 버튼을 눌러 페이징 조회가 순조롭게 이루어지는지 점검합니다.
- 상단 노란색 `Presentation Quick Access` 가이드 배너의 `Job 73 (Greer Homes)` 버튼을 눌렀을 때, 우측 `Drawings & Photos` 탭에 이식된 실제 사이트 도면 및 현장 사진 이미지 파일들이 잘 출력되는지 최종 확인합니다.
