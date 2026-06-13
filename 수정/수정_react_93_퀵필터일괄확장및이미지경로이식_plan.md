# 수정_react_93_퀵필터일괄확장및이미지경로이식_plan

오래된 레거시 데이터 검색 환경을 보조하기 위해 타임시트 외의 주요 스케줄 및 실적 통계 페이지에 퀵 필터(Data Available) 및 Auto Week 버튼을 일괄 배치하고, 레거시 PHP 프로젝트(`F:\pe\public_html\sitepro`)로부터 드로잉, 현장 사진 및 직원 아바타 파일들을 이식하며, 관리자 ERD 다이어그램의 무한 로딩 지연 현상을 해결합니다.

## User Review Required

> [!NOTE]
> - **적용 대상 페이지**:
>   - **Whiteboard Task Board**: 2019년도 활성 데이터 퀵 필터 및 Auto Week 버튼 추가
>   - **Monthly Production Plan**: 2021년, 2020년 생산 계획 및 메모 주차 퀵 이동 버튼 추가
>   - **Performance Statistics**: 2021년 27주/39주, 2020년 40주/39주 등 실 데이터 퀵 이동 버튼 추가
>   - **Fabrication Efficiency Rankings**: 위 실적 통계에 동일 적용
> - **미디어 파일 이식**:
>   - `sitepro/uploads` -> 아바타 폴더 (`static/uploads/avatars`)로 파일 전송 및 DB (`tb_login.avatar`) 내 고유 경로 맵핑 갱신
>   - `sitepro/uploadsPhoto/2021` -> 도면/사진 폴더 (`static/uploads/jobs/2021`)로 파일 전송 및 DB (`tb_photos.photo_name`) 경로 갱신
> - **ERD 렌더링 무한 대기 수정**:
>   - Mermaid 스크립트 로드 전략 최적화 및 activeTab이 'erd'로 변경될 때 강제 렌더링 함수(`window.mermaid.run()`)를 재시도하도록 개선

## Open Questions

- 없음

## Proposed Changes

### Frontend Components

#### [MODIFY] [page.js (Whiteboard)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/whiteboard/page.js)
- `devConfig.devHints`에 따라 2019년도 실제 태스크 날짜(2019-09-20, 2019-09-08 등)로 즉시 전환되는 퀵 이동 버튼들을 헤더 영역에 추가.

#### [MODIFY] [page.js (WeeklyPlan)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/weekly-plan/page.js)
- `devConfig.devHints` 활성화 시 2021-11-25(메모), 2021-07-07(계획), 2020-02-26(계획) 등 실제 데이터 주간 월요일로 이동하는 퀵 필터 배치.

#### [MODIFY] [page.js (Performance)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/performance/page.js)
- `devConfig.devHints`에 연동되어 2021년도 27주, 39주, 2020년도 40주, 39주차로 바로가기 전환되는 퀵 버튼 패널 추가.

#### [MODIFY] [page.js (AdminDB)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/admin-db/page.js)
- Mermaid graph `lazyOnload` 전략 적용 및 initialize 시 startOnLoad=false 처리. activeTab 전환 시 selector 기반 `.run()` 및 fallback인 `contentLoaded()`를 이중 구성하여 무한 렌더링 지연 해결.

### Database Components

#### [NEW] [update_paths.py](file:///f:/pe/public_html/steelworks-manager-react/scratch/update_paths.py)
- `tb_photos` 및 `tb_login` 테이블 내 평문 상대경로명을 실제 정적 업로드 URL 패턴(`/uploads/...`)으로 마이그레이션 적용하는 파이썬 일회성 스크립트 작성 및 실행 완료.

## Verification Plan

### Automated Tests
- `npm run build`를 통해 빌드가 정상 동작하며 신택스 오류가 발생하지 않음을 점검 완료.

### Manual Verification
- 브라우저를 열고 각 통계/화이트보드/생산 계획 페이지에서 "Quick Dev Filters" 영역이 노출되는지 확인합니다.
- 각 퀵 버튼 클릭 시 연동 폼이 갱신되며 지연 없이 바로 결과 리스트가 출력되는지 확인합니다.
- Employees Directory 및 Jobs / Drawings & Photos 탭에서 레거시로부터 복사된 이미지들이 정상적으로 출력되는지 확인합니다.
- Admin DB의 Core Business ERD 탭 전환 시 다이어그램이 끊김 없이 정상 로드되는지 검증합니다.
