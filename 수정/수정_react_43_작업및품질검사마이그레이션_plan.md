# [수정 계획서] 작업(Jobs) 및 품질 검사(QA WIP) 영역 마이그레이션

이 단계에서는 Next.js 프론트엔드(`fe`) 내부에 Job 관리 및 도면/사진 업로드 기능, 그리고 품질 검사(QA WIP & Inspection List) 화면을 구축합니다.

## 사용자 검토 필요 사항
- 백엔드 업로드 엔드포인트 `/api/jobs/{job_number}/photos`는 파일 업로드를 지원하며, React 프론트엔드에서 멀티파트 폼 데이터(FormData)를 전송하여 도면이나 사진 파일을 등록할 수 있습니다.
- 품질 검사(QA WIP) 중 NCR 판정(Fail) 시, 백엔드 로직에 의해 자동으로 Whiteboard용 재작업(NCR Rework) 태스크 및 신규 부재 항목이 자동 추가되도록 연동됩니다.

## 해결안 및 변경 내용

### 1. API 연동 커스텀 훅 개발
#### [NEW] [useJobs.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/hooks/useJobs.js)
- Job 목록 조회, 특정 Job 상세 내역 조회, 신규 Job 생성, Job 정보 수정/삭제, Excel 부재 목록 Ingestion 연동 훅을 제작합니다.
- 특정 Job의 도면/사진 목록 조회 및 파일 업로드(FormData 활용) API 연동 상태를 관리합니다.

#### [NEW] [useQA.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/hooks/useQA.js)
- QA 대상 Pending Job 목록 조회, 특정 Job의 WIP(품질검사 대상 부재) 리스트 조회, 그리고 합격(Pass) / 불합격(Fail - NCR 코멘트 등록) 처리 호출을 처리하는 훅을 개발합니다.

### 2. 페이지 및 컴포넌트 마이그레이션
#### [NEW] [page.js (Jobs)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/jobs/page.js)
- Job 마스터 목록을 최신순 테이블로 시각화합니다.
- 새로운 Job 생성 모달 및 엑셀 대용량 부재 탭 복사-붙여넣기 텍스트 파싱 Ingest 모달을 개발합니다.
- 특정 Job 클릭 시 상세 목록(Lot 정보 및 부재 리스트, GALV 처리 상태 등)을 확인하는 서브패널을 로드합니다.
- Job 상세 화면 내에 도면 및 현장 사진을 카드 리스트로 조회하고, 파일 업로드 필드를 통해 새로운 이미지를 등록하는 컨트롤을 장착합니다.

#### [NEW] [page.js (QA WIP)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/qa-wip/page.js)
- 품질 검사 대기 중인 활성 Job 목록을 노출합니다.
- Job 선택 시 해당 Job의 아직 합격되지 않은(inspection_pass_fail = 0) WIP 리스트(부재명, WPS 정보, 지정 인하우스 검사원 등)를 렌더링합니다.
- 각 부재별로 'Pass(합격)' 버튼 클릭 시 즉시 합격처리하고, 'Fail(불합격)' 클릭 시 NCR 코멘트를 작성하는 모달을 띄워 백엔드에 불합격 처리를 전송합니다.

## 검증 계획

### 수동 검증
- `/dashboard/jobs`에서 신규 Job(예: 8001)을 생성하고 정상적으로 목록에 등록되는지 확인.
- Excel Ingestion 기능으로 탭 구분값 형식의 데이터를 붙여넣어 부재 및 WIP가 자동 추가되는지 확인.
- 특정 Job 상세에서 드로잉(이미지/PDF) 파일을 업로드하고 다운로드 및 확인이 잘 되는지 테스트.
- `/dashboard/qa-wip`에 진입하여 Pending 상태인 부재를 Pass 처리하여 목록에서 지워지는지 확인하고, Fail 처리 시 NCR 코멘트가 정상 기록되어 Whiteboard에 자동으로 Rework 태스크 카드가 출현하는지 테스트.
- `npm run build`를 구동하여 빌드 타임 컴파일 오류가 없는지 검토.
