# 1번 앱과 2번 앱 메뉴 및 기능 비교 분석서 (리스트 형식)

> **[참고] 마이그레이션 배경 및 진행 목적**
> - **레거시 앱 (오리지널 레거시)**: F:\pe\public_html\sitepro
> - **1번 앱 (레거시 마이그레이션)**: F:\pe\public_html\steelworks-manager
> - **2번 앱 (신규 트렌디 스택 프로젝트)**: F:\pe\public_html\steelworks-manager-react
> - **사유**: 레거시 sitepro 시스템(F:\pe\public_html\sitepro)에서 1번 앱으로 처음 마이그레이션을 진행하였으며, 최신 트렌드 기술 스택(React/Next.js/Tailwind)을 반영하기 위해 현재 2번 앱 개발을 진행하고 있습니다. 레거시 및 1번 앱과 비교하여 2번 앱에 누락되거나 미비한 메뉴/기능들을 지속적으로 동기화하고 업데이트하고 있습니다. 본 설명은 다음 세션에서도 신속히 맥락을 파악하고 작업을 진행하기 위해 기록으로 남깁니다.
>
> **[문서 업데이트 방법 및 규칙]**
> 1. **메뉴별 구현 및 비교 상세화**: 각 메뉴 작업 시, 해당 대항목(예: `### 2. Jobs (1번) vs Jobs (2번)`) 하위에 기능 차이와 새로 추가된 핵심 로직을 구체적으로 비교 기록합니다.
> 2. **미비점 및 결과 보고 연동**: 작업이 진행된 메뉴에 대해 해당 섹션 하위에 `#### [작업 결과 보고]` 형태로 미비점/계획을 기록하고, 수정이 완료된 후에는 이를 `수정 결과(완료)`로 상태를 갱신 및 기록하여 추가 작업 여부를 명확히 밝힙니다.
> 3. **맥락 보존**: 다음 세션을 시작하는 AI 모델이 이 문서만 보고도 즉각 이전 작업 맥락과 현황을 정확히 파악하여 다음 메뉴 작업을 막힘없이 이어나갈 수 있도록 설계합니다.

---

## [1] 메뉴별 일대일 매핑 및 세부 비교

### 1. Home (1번) vs Dashboard (2번) - 첫 번째 메뉴
* **1번 앱 (Home - index.html)**
  * **핵심 기능**:
    * 환영 웰컴 배너 표시.
    * 주요 작업 화면 바로가기 카드 3개 제공 (Active Jobs, Employees & Whiteboard, Punch Clock).
    * 실시간 활성 작업 진행률 현황판 출력:
      * API `/api/dashboard/job_progress?limit=10` 연동.
      * 가져온 잡 데이터를 잡 번호(Job Number) 기준으로 오름차순(Ascending) 정렬하여 시각화.
      * 진행도 100% 미만은 블루 색상(`progress-bar-info`), 100% 완료는 그린 색상(`progress-bar-success`) 바 표시.
      * 진행도에 맞추어 `85% (17/20)` 형태의 분수비 완료 상세 수량 표기.
* **2번 앱 (Dashboard - page.js)**
  * **핵심 기능**:
    * 현재 로그인된 사용자명 연동 환영 문구 출력.
    * Uvicorn 서버 상태를 즉각 새로고침할 수 있는 수동 Refresh 버튼 제공.
    * 상단 핵심 지표 요약 카드 3개 제공 (Active Jobs 개수, Average Progress %, WIP Checked Lots 개수).
    * 활성 작업 진행 테이블:
      * API `/api/dashboard/job_progress?limit=5` 연동.
      * 정렬 규칙 없음 (최신 순서대로 5개만 로드).
      * 심플한 단일 색상(화이트) 진행도 바 렌더링.

#### [작업 결과 보고] Home (1번) vs Dashboard (2번) (추가 작업 없음 - 최종 완료)
* **디자인 톤앤매너 개선 (완료)**: 1번 앱의 세련된 배색을 2번 앱 디자인 시스템에 완벽하게 이식하였습니다. (진행 중인 활성 작업: 신뢰감을 주는 블루 계열, 100% 완료된 작업: 시인성이 뛰어난 소프트 그린 계열)
* **바로가기 카드 섹션 추가 (완료)**: 1번 앱에서 제공하는 핵심 카드 3개(Jobs 바로가기, Staff 바로가기, Punch Clock 바로가기)를 2번 앱 대시보드 상단 영역에 이식하여 조작성을 극대화하였습니다.
* **실시간 작업 진행률 표시 방식 통일 (1번 스펙 기준 일치) (완료)**:
  * 활성 작업을 동시에 최대 50개까지 보여주도록 API를 확장하였으며, 50개 초과 시 다음 페이지로 탐색할 수 있는 페이징 기능을 구현 완료했습니다.
  * 활성 작업을 잡 번호(Job Number) 기준 오름차순(Ascending)으로 정렬하여 표시하도록 로직을 반영했습니다.
  * 진행률 바 내부에 `85% (17/20 pcs)` 및 완료 시 `100% COMPLETED`와 같은 상세 완료 수량 분수비 텍스트 오버레이를 적용 완료했습니다.

---

### 2. Jobs (1번) vs Jobs (2번)
* **1번 앱 (Jobs - jobs.html)**
  * **핵심 기능**:
    - 활성 프로젝트 리스트 조회 (필터링 미비, 고정 데이터 위주).
    - Excel 데이터 파싱 및 신규 Job 업로드 (`Ingest Excel`).
    - 도면 및 현장 사진 파일 관리 및 업로드 기능 제공.
* **2번 앱 (Jobs - page.js)**
  * **핵심 기능**:
    - 커스텀 훅 `useJobs` 기반의 React UI 상태 관리 구축 완료.
    - **분류 탭 기능**: `Active`, `Completed`, `All Jobs` 탭을 지원하여 원하는 데이터 범주를 원클릭으로 필터링.
    - **페이징 처리**: 대량의 누적 데이터(850개 이상)를 50개 단위로 나누어 조회할 수 있는 `Prev` 및 `Next` 버튼 페이징 기능 완비.
    - **Drawings & Photos 통합**: 선택된 Job의 도면 파일 및 현장 품질 검사 사진 업로드/조회 연동 완료.
    - **개발자/프레젠테이션용 퀵 바로가기 배너**: `SHOW_DEV_HINTS` 상태에 따라 과거 특정 벤치마크 데이터(Job 73 - Greer Homes, Job 74 - Best Nest)를 빠르게 로드할 수 있는 단축 단추 지원.

#### [작업 결과 보고] Jobs (1번) vs Jobs (2번) (추가 작업 없음 - 최종 완료)
* **프로젝트 완료(Completed) 상태 분류 필터 탑재 (완료)**: `Active`, `Completed`, `All Jobs` 탭 필터를 제공하여 생산이 완전히 끝난 Job과 전체 Job을 완벽하게 분류 조회할 수 있도록 개선했습니다.
* **대용량 데이터 페이징 네비게이션 적용 (완료)**: 50개 단위로 나뉘어 안전하게 전체 행을 조회할 수 있도록 하단에 `Prev` 및 `Next` 버튼을 이용한 페이징 기능을 추가 완료했습니다.
* **프레젠테이션용 과거 데이터 퀵 바로가기 배너 제공 (완료)**: `SHOW_DEV_HINTS` 상태일 때 나타나는 프레젠테이션 배너를 통해 원클릭으로 Greer Homes(Job 73)와 Best Nest(Job 74) 상세 정보로 강제 이동 및 연동 검증을 성공적으로 완료했습니다.

---

### 3. QA Dashboard (1번) vs QA WIP (2번)
* **1번 앱 (QA Dashboard - qa_dashboard.html)**
  * **핵심 기능**:
    - 품질 검사 대기 품목 목록 조회.
    - 간단한 상태 변경 기록 지원.
* **2번 앱 (QA WIP - page.js)**
  * **핵심 기능**:
    - 커스텀 훅 `useQA` 기반의 품질 검사 프로세스 구현 완료.
    - **품질 합격 판정 (Pass)**: 해당 부재의 품질 합격 여부를 즉각 기록하고 대기 목록에서 완료 처리.
    - **NCR 불합격 및 재작업 등록 (Fail NCR)**: 불합격 판정 시 상세 사유(NCR Comment)를 기입할 수 있는 모달 팝업 제공 및 이력 저장.
    - **버전 관리 (Rework Versioning)**: 불합격 시 자동으로 `wip_version`이 1씩 증가하여 Rework v1, Rework v2 등으로 관리되며 백엔드 DB와 정상 연동.

#### [작업 결과 보고] QA Dashboard (1번) vs QA WIP (2번) (추가 작업 없음 - 최종 완료)
* **품질 검사 합격(Pass) 판정 프로세스 연동 (완료)**: 각 WIP 아이템의 Pass 버튼을 통해 실시간으로 품질 검사 합격 처리를 진행하고 대기 열에서 소거되도록 데이터베이스 연동을 완료했습니다.
* **NCR 불합격(Fail) 및 상세 실패 사유 기입 모달 연동 (완료)**: Fail (NCR) 클릭 시 직관적인 모달 창을 띄워 구체적인 불합격 사유(Comment)를 기입하여 DB에 기록할 수 있도록 인터페이스를 개발 완료했습니다.
* **재작업 버전 관리(Rework Versioning) 자동화 (완료)**: NCR 불합격 처리될 때마다 자동으로 해당 부재의 `wip_version`이 1씩 누적 증가되어 `Rework v1`, `Rework v2` 형태로 라벨링 및 시계열 추적이 가능하도록 비즈니스 로직을 구축 완료했습니다.

---

### 4. Monthly Notes (1번) vs Monthly Plan (2번)
* **1번 앱 (Monthly Notes - weekly.html)**
  * **핵심 기능**:
    - 주간 단위 생산 계획 등록 및 조회.
    - 일간 메모 작성 및 간이 조율 내역 관리.
* **2번 앱 (Monthly Plan - page.js)**
  * **핵심 기능**:
    - 직원별 주간 단위 Job 배정 및 스케줄링 캘린더 매트릭스 그리드 제공.
    - 일별 세부 조율 노트 작성 및 수정 기능 완비.
    - **개발자/프레젠테이션용 퀵 바로가기 배너**: 실제 현장 데이터 및 조율 사항이 집중되어 입력되어 있는 과거 특정 일자(2020-11-25, 2021-11-25, 2021-07-07, 2020-02-26)로 즉시 이동할 수 있는 단축 필터 단추 제공.

#### [작업 결과 보고] Monthly Notes (1번) vs Monthly Plan (2번) (추가 작업 없음 - 최종 완료)
* **스케줄링 및 노트 수정 동기화 (완료)**: 캘린더 상의 주간 단위 배정 그리드 및 개별 메모가 SQLite 백엔드 데이터와 실시간으로 반응형 연동 및 업데이트되도록 복구 완료했습니다.
* **데이터 집중 일자 퀵 바로가기 배치 (완료)**: 실제 기획 데이터가 집중된 대표 주간(2020-11-25 등)을 원클릭으로 이동하여 캘린더 화면에 불러올 수 있게 개발용 퀵 필터 단추를 상단에 이식 완료했습니다.

---

### 5. Whiteboard (1번) vs Whiteboard (2번)
* **1번 앱 (Whiteboard - whiteboard.html)**
  * **핵심 기능**:
    - 직원별 일간 태스크를 배치하고 마우스로 끌어서 이동할 수 있는 가로 드래그 앤 드롭 배정 판넬.
* **2번 앱 (Whiteboard - page.js)**
  * **핵심 기능**:
    - HTML5 Drag and Drop API를 활용한 칸반 형태의 보드 레이아웃 구축 완료.
    - **세로 배치 레이아웃 구현**: 직원을 첫 번째 열(Column)로 배치하여 직원별 담당 작업(instruction, site)을 세로로 정렬하고 명확히 매핑하도록 보완.
    - **개발자용 퀵 필터 단추**: 데이터가 조밀하게 들어있는 특정 주차(2021 W27, 2021 W39, 2020 W40, 2020 W39 등)로 바로 이동할 수 있는 퀵 필터 단추 탑재 완료.

#### [작업 결과 보고] Whiteboard (1번) vs Whiteboard (2번) (추가 작업 없음 - 최종 완료)
* **직원 첫 컬럼 세로 배치 레이아웃 (완료)**: 대화면에서 직원 이름을 세로 첫 열로 고정하고, 그에 따른 하위 할당 작업 카드가 세로축으로 나열되어 관리 효율성을 높였습니다.
* **드래그 앤 드롭 태스크 재배정 (완료)**: 태스크 카드를 드래그하여 다른 직원 컬럼으로 드롭 시 SQLite 백엔드 DB와 즉각 API 통신을 통해 실시간으로 재배정 정보가 업데이트 및 리렌더링되도록 구현 완료했습니다.
* **주차별 데이터 퀵 버튼 배치 (완료)**: 테스트 편의성을 위해 실데이터 밀집 주간으로 즉시 점프하는 퀵 데브 필터 단추를 배치 완료했습니다.

---

### 6. Employees (1번) vs Employees (2번)
* **1번 앱 (Employees - employees.html)**
  * **핵심 기능**:
    * 직원 계정 마스터 디렉토리 조회 및 추가.
* **2번 앱 (Employees - page.js)**
  * **핵심 기능**:
    * **Active / Retired 이원화 관리**: `Active Workforce` 탭과 `Retired / Inactive` 탭을 분리하여 퇴사자 정보와 현재 근무자를 완벽히 구분 조회.
    * **프로필 아바타 이미지 관리**: 직원의 아바타 이미지를 직접 업로드(`Camera` 아이콘 연동)하여 서버의 `/uploads/avatars/` 경로에 저장하고 화면에 즉시 리렌더링.
    * **임시 비밀번호 생성기 (Random Password Generator)**: 관리자가 직원의 비밀번호 분실 시 `Key` 버튼 클릭으로 8자리 안전한 무작위 난수 비밀번호를 즉시 생성 및 발급 모달 팝업 제공.
    * **상세 프로필 설정 및 권한 매핑**: 이름, 아이디(Login), 역할(Welder, Fabricator 등), 권한 등급(Level 1, 2, 10, 99), 담당 용접 Bay 번호, Shop Label 매핑 기능 완비.

#### [작업 결과 보고] Employees (1번) vs Employees (2번) (추가 작업 없음 - 최종 완료)
* **은퇴(Retired) 직원 탭 필터링 및 분리 (완료)**: 은퇴하거나 비활성화된 직원을 마스터 목록에서 제외하고 별도의 Inactive 탭에서 조회할 수 있도록 탭 인터페이스를 완성하였습니다.
* **아바타 업로더 및 임시 비밀번호 난수 발급 연동 (완료)**: 개별 직원 카드에서 아바타 업로드 시 API를 호출하여 파일 처리가 정상 완료되도록 바인딩하였으며, 8자리 무작위 문자열 비밀번호를 안전하게 생성하여 관리자에게 안내해 주는 모달 창을 구현 완료했습니다.
* **작업장 Bay 및 권한 레벨 수정 (완료)**: Supervisor(Level 10) 및 Super Admin(Level 99) 권한에 맞춘 직원 편집 모달 폼을 연동하여 Bay 번호 및 Shop Label을 유연하게 할당할 수 있도록 수정 완료했습니다.

---

### 7. Vehicles (1번) vs Vehicles (2번)
* **1번 앱 (Vehicles - vehicles.html)**
  * **핵심 기능**:
    * 차량 목록 조회 및 WOF/REGO 만료일 정보 확인.
* **2번 앱 (Vehicles - page.js)**
  * **핵심 기능**:
    * **30일 이내 만료 경고 알림 연동**: WOF 및 REGO 검사 만료일이 현재 기준 30일 이내로 도래하거나 경과했을 때, 대시보드 상단에 빨간색 `Critical Fleet Warnings` 알림 보드를 동적으로 출력하여 직관성 극대화.
    * **차량 상세 스펙 관리**: 번호판(Plate), WOF 만료일, REGO 만료일, 차기 서비스 주기(km), RUC 한도(km), 현재 주행거리(Current ODO) 정보 입력 및 DB 연동.
    * **보안 권한 가드**: Admin 권한(Level 10+)을 보유한 계정만 신규 차량 등록(Register), 정보 수정(Edit), 차량 삭제(Delete) 버튼을 표시하고 수행 가능하도록 가드 적용.

#### [작업 결과 보고] Vehicles (1번) vs Vehicles (2번) (추가 작업 없음 - 최종 완료)
* **WOF/REGO 30일 이내 만료 경고 보드 완비 (완료)**: 차량의 정기검사(WOF)와 등록세(REGO) 일자가 만료 30일 이내이거나 이미 만료된 경우, 눈에 띄는 Warning Alert 카드가 차량 관리 상단 영역에 동적으로 렌더링되도록 구현했습니다.
* **마일리지 기반 누적 수치 관리 기능 적용 (완료)**: SERVICE 및 RUC 잔여 주행 거리가 Current ODO 값과 유기적으로 비교될 수 있도록 입력 단위를 정수형(km)으로 바인딩하여 정상 업데이트되도록 완료했습니다.

---

### 8. Holidays (1번) vs (2번 일부 미구현)
* **1번 앱 (Holidays - holidays.html)**
  * **핵심 기능**:
    * 연간 공휴일 일정 추가 및 삭제.
* **2번 앱**
  * **핵심 기능**:
    * 백엔드 API (`/api/holidays` GET/POST/DELETE) 및 DB 테이블(`tb_public_holidays`)은 구축되어 정상 작동함.
    * `weekly-plan` 및 `Calendar` 훅에서 해당 공휴일 데이터를 가져와 캘린더 화면에 렌더링하는 로직은 완료되었으나, **관리자가 공휴일을 추가/삭제하고 조회하는 독립된 UI 화면(`fe/src/app/dashboard/holidays/page.js`)이 현재 미구현(누락) 상태임.**

#### [작업 결과 보고] Holidays (1번) vs Holidays (2번) (추가 작업 없음 - 최종 완료)
* **백엔드 API 및 캘린더 바인딩 (완료)**: 데이터베이스 연동 및 Weekly Plan 달력에서 공휴일을 읽어오는 파이프라인은 정상 작동합니다.
* **프론트엔드 관리자 UI 화면 구현 (완료)**:
  * `fe/src/app/dashboard/holidays/page.js`를 신설하여 공휴일 리스트 조회, 신규 공휴일 추가(이름, 시작일, 종료일), 기존 공휴일 삭제(DELETE) 기능 화면을 완성하고 SQLite DB와 연동했습니다.
  * 사이드바 메뉴에 `Holidays` 링크를 노출하고, 권한 레벨 10 이상만 접근 가능하도록 강력한 보안 가드를 탑재했습니다.

---

### 9. Punch Clock (1번) vs Punch (2번)
* **1번 앱 (Punch Clock - punch.html)**
  * **핵심 기능**:
    * 출근/퇴근(Clock In/Out) 타임카드 수동 기록 폼.
* **2번 앱 (Punch - page.js)**
  * **핵심 기능**:
    * **Live NZ Clock 실시간 연동**: 뉴질랜드 현지 시간(en-NZ, 24시간 표기법)을 실시간으로 화면 중앙에 렌더링하여 출퇴근 기준 시간 제공.
    * **원클릭 Punch In / Punch Out**: 로그인된 직원의 고유 세션 ID와 성명을 자동으로 추적하여, 단 한 번의 클릭으로 `tb_punchsheet` 테이블에 출/퇴근 로그를 안전하게 기록.
    * **상세 타임시트 연동 (Timesheet Page)**: 관리자가 직원별, 주차별 출퇴근 이력을 필터링하여 일목요연하게 모니터링할 수 있는 별도의 `timesheet/page.js` 화면이 동시 제공되어 관리 효율 증대.

#### [작업 결과 보고] Punch Clock (1번) vs Punch (2번) (추가 작업 없음 - 최종 완료)
* **출퇴근 원클릭 기록 및 세션 자동 추적 (완료)**: 로그인된 사용자의 ID를 통해 수동 입력 없이 원클릭으로 출근(IN) / 퇴근(OUT)이 백엔드 DB로 안전하게 전송 및 영구 보존되도록 연동 완료했습니다.
* **Timesheet 필터링 및 관리자용 로그 조회 연동 (완료)**: Punch로 누적된 출퇴근 타임카드를 연도별, 주차별, 직원별로 상세 검색할 수 있는 Timesheet 페이지 연동을 완료했습니다.

---

### 10. Admin (1번) vs Admin DB (2번)
* **1번 앱 (Admin - admin.html / login.html)**
  * **핵심 기능**:
    * 시스템 백업, 복구 및 계정 복구 관리.
* **2번 앱 (Admin DB - page.js)**
  * **핵심 기능**:
    * **Super Admin(Level 99) 전용 보안 가드**: 로그인 유저의 `right_level`이 99 미만일 경우 아예 페이지 로딩을 제한하여 불법적인 DB 접근 원천 차단.
    * **SQLite DB 테이블 브라우저 (Explorer)**: 데이터베이스 내의 모든 테이블(Jobs, Employees, Vehicles, Punch 등)의 스키마 및 레코드를 상세히 조회하고 컬럼별 정렬 및 페이지 탐색 지원.
    * **시스템 복구 및 초기화 툴킷**:
      * **Integrity Check**: SQLite DB 무결성 및 이상 여부 수동 진단.
      * **Seed Database**: 기본 테스트 세트 데이터 일괄 주입.
      * **Clean Database**: 데이터베이스 초기화 및 레코드 소거.
      * **Reset All Passwords (Plain / Hashed)**: 직원 패스워드를 기본값으로 강제 복구/동기화.
      * **Migrate Legacy Data**: 레거시(1번 앱)로부터 DB 마이그레이션 실행.
    * **Mermaid ERD 시각화 및 Pan/Zoom**: 전체 릴레이션 스키마 다이어그램을 브라우저에 렌더링하고 사용자가 드래그/확대하며 볼 수 있는 인터랙티브 ERD 탑재.

#### [작업 결과 보고] Admin (1번) vs Admin DB (2번) (추가 작업 없음 - 최종 완료)
* **보안 등급 가드 탑재 (완료)**: Level 99(Super Admin)를 초과하는 계정만 해당 콘솔에 진입하도록 강력한 권한 검증을 적용했습니다.
* **데이터 브라우징 및 정비 툴킷 통합 (완료)**: 전체 테이블 복구, 시드 데이터 주입, 패스워드 일괄 초기화 등의 백엔드 조작 스크립트를 웹 인터페이스 버튼으로 안전하게 격리 실행하도록 연동을 완료했습니다.

---

### 11. 잡 부재 상세 체크 진행 화면 (1번 일부 미구현) vs (2번 구현 완료)
* **1번 앱 (Jobs - jobs.html)**
  * **핵심 기능**:
    * 부재별 Design/Made/Loaded/On Site/Finish 상태를 단순 텍스트 또는 비활성 읽기 전용 상태로만 표시.
* **2번 앱 (Jobs - page.js / Details)**
  * **핵심 기능**:
    * **인터랙티브 상태 토글**: 각 부재의 Design, Made, Loaded, On Site, TmpFix, Chemset, Tightened, Finish 단계를 클릭하여 실시간 상태 변경(0/1 토글) 및 날짜 자동 입력 연동.
    * **권한별 조작 제한**: 로그인 사용자의 `right_level` 권한 등급에 따라 편집 가능한 필드를 동적으로 판단 및 가드 처리. (예: office는 design 가능, welder는 made 가능 등)
    * **롯 단위 일괄 처리 (Bulk Tick)**: 관리자(right_level >= 10)의 경우, 롯 헤더 우측의 All Loaded, All On Site, All Finish 버튼으로 해당 롯 내 전체 부재를 일괄 완료 처리 가능.

#### [작업 결과 보고] 잡 부재 상세 체크 진행 화면 (추가 작업 없음 - 최종 완료)
* **단일 부재 실시간 토글 바인딩 (완료)**: 각 단계 배지 클릭 시 SQLite DB의 `tb_jobs_details` 및 해당하는 업데이트 일자 컬럼(`*_date_update`)이 유기적으로 자동 갱신 및 토글되도록 PATCH API를 구현 완료했습니다.
* **관리자 롯 단위 일괄 완료 지원 (완료)**: 롯 헤더에 일괄 전환 기능 단추를 탑재하여 대량 처리 생산성을 극대화하였습니다.

---

### 12. 잡 설치 일자 관리 (1번 미구현) vs (2번 구현 완료)
* **1번 앱 (Jobs - jobs.html)**
  * **핵심 기능**:
    * 롯(Lot)별 설치 예정일 및 상태 관리 부재.
* **2번 앱 (Jobs - page.js / Install Schedule)**
  * **핵심 기능**:
    * **롯별 설치 일정 및 상태 관리**: 각 롯(Lot) 단위 카드의 상단에 설치 예정일(`date_install`) 날짜 선택기(`input type="date"`)와 설치 단계 상태(`status_install` - `Design`, `Fabrication`, `Ready`, `Temp Installed`, `Finished`) 선택 박스(`select`) 제공.
    * **스케줄링 DB 즉시 저장**: 날짜 및 상태 정보 수정 시 비동기로 `tb_jobs_date_install` 테이블에 INSERT/UPDATE 쿼리 즉시 연동.
    * **일정 리셋 및 권한 제어**: 관리자(Level 10+) 계정 한정으로 등록된 롯별 설치 스케줄을 데이터베이스에서 즉각 제거 및 초기화할 수 있는 `Reset Date` 단추 배치.

#### [작업 결과 보고] 잡 설치 일자 관리 (추가 작업 없음 - 최종 완료)
* **롯별 일정 CRUD API 연동 (완료)**: `GET`, `PUT`, `DELETE` API와 프론트엔드 `useJobs` 훅 연동을 통해 롯별 설치 예정 날짜와 마일스톤 상태를 저장 및 무결하게 삭제하는 프로세스를 탑재 완료했습니다.
* **인터페이스 최적화 (완료)**: Jobs 상세 보기 내에 롯 카드별 설치 제어 필드를 렌더링하고 비동기 피드백 처리로 사용성 향상을 마쳤습니다.

---

### 13. 작업 지시서 인쇄 (1번 미구현) vs (2번 구현 완료)
* **1번 앱 (Jobs - jobs.html)**
  * **핵심 기능**:
    * 작업 지시서 인쇄 또는 종이 출력 기능 미비.
* **2번 앱 (Jobs - page.js / Print)**
  * **핵심 기능**:
    * **인쇄용 전용 팝업 조립**: 프린터 아이콘 클릭 시 A4 규격에 꼭 맞는 전용 Jobsheet CSS 스타일시트와 잡 정보, 부재 테이블을 조립한 새 창(Popup)을 로드.
    * **자동 출력 팝업**: 문서 로드 시 브라우저 인쇄 다이얼로그(`window.print()`)가 즉각 실행되어 PDF 저장 혹은 용지 인쇄 지원.
    * **잡 전체 및 롯 단위 개별 출력**: 상세 정보 헤더의 'Print All' 및 각 롯 카드의 개별 프린터 버튼을 통해 원하는 범주만 타겟 인쇄 가능.

#### [작업 결과 보고] 작업 지시서 인쇄 (추가 작업 없음 - 최종 완료)
* **인쇄용 마크업 및 스타일링 구현 (완료)**: 새 윈도우 창 내에 2번 앱 디자인 톤앤매너에 맞게 가독성 높은 흑백 인쇄 레이아웃(헤더 메타, 도금 여부, 서명 영역)을 삽입 완료했습니다.
* **이중 출력 라우팅 바인딩 (완료)**: 잡 전체와 롯 단위 인쇄 기능을 유연하게 나누어 동작하도록 UI 연동을 완료했습니다.

---

### 14. QA 검사 보고서 PDF 출력 (1번 미구현) vs (2번 구현 완료)
* **1번 앱 (QA Dashboard - qa_dashboard.html)**
  * **핵심 기능**:
    * QA 검사 성적서 인쇄/PDF 저장 기능 없음.
* **2번 앱 (QA WIP - page.js / Print)**
  * **핵심 기능**:
    * **검사 성적서 인쇄용 전용 팝업 조립**: 프린터 아이콘 클릭 시 A4 규격 레이아웃에 딱 맞춘 QA Inspection Report 스타일시트와 데이터 테이블을 구성한 팝업창을 로드.
    * **자동 출력 및 PDF 저장**: 팝업 로딩 즉시 `window.print()`를 실행하여 종이 인쇄 및 PDF 저장 유도.
    * **실시간 성적 집계**: 현재 QA WIP 검사 대기 중인 모든 부재들의 용접 규격(WPS), 배정 검사자, Rework 재작업 이력 및 NCR 코멘트 기록을 테이블 양식으로 실시간 수집 및 시각화.

#### [작업 결과 보고] QA 검사 보고서 PDF 출력 (추가 작업 없음 - 최종 완료)
* **품질 성적서 마크업 레이아웃 구현 (완료)**: 팝업창 내에 용접 검사 합격/NCR 불합격 사유 히스토리가 기록된 성적서 양식(하단 수석 검사원 및 관리자 서명 승인란 포함)을 인쇄용 스타일로 출력 연동 완료했습니다.
* **WIP Items 단일 연동 바인딩 (완료)**: 특정 잡의 WIP 항목들이 조회된 상세 패널 우측 헤더에 "Print Report" 단추를 구현하여 즉각적인 출력이 가능하도록 완료했습니다.

---

### 15. 기타 인증 항목 관리 (1번 미구현) vs (2번 구현 완료)
* **1번 앱 (Vehicles 페이지 내 미구현)**
  * **핵심 기능**:
    * `tb_reminder_other` 테이블에 대한 별도 UI 없음. 레거시에서 `15.php` 통합 알림판에 조회 전용으로만 포함됨.
* **2번 앱 (Vehicles - page.js / Other Certifications & Reminders)**
  * **핵심 기능**:
    * **기타 인증 항목 CRUD**: 장비 정기 점검, 안전 자격증, 소화기 점검 등 WOF/REGO/SiteSafe 외의 기타 인증 항목을 `name`, `comment`, `expiry_date` 필드로 등록·수정·삭제.
    * **30일 이내 만료 경고 배너**: 만료일이 30일 이내이거나 이미 만료된 항목은 Vehicles 페이지 하단에 오렌지색 `Certification Warnings` 경고 배너를 동적으로 출력.
    * **인라인 상태 뱃지**: 목록 테이블에서 각 항목의 만료일 기준으로 `Valid`(초록), `Expiring Soon`(주황), `Expired`(빨강), `No Date`(회색) 상태 뱃지를 실시간으로 표시.
    * **권한 가드**: Admin(Level 10+) 계정만 Add Item 버튼 및 Edit/Delete 아이콘을 표시 및 조작 가능.
    * **Vehicles 페이지 통합**: 별도 페이지 없이 차량 관리 페이지(`vehicles/page.js`) 하단에 구분선으로 분리된 전용 섹션으로 통합 배치.

#### [작업 결과 보고] 기타 인증 항목 관리 (추가 작업 없음 - 최종 완료)
* **백엔드 API 5종 신설 (완료)**: `GET /api/reminders/others`, `POST /api/reminders/others`, `PUT /api/reminders/others/{id}`, `DELETE /api/reminders/others/{id}`, `GET /api/reminders/others/expiry-check` 엔드포인트를 `core/api_router.py`에 추가. `tb_reminder_other` 테이블과 완전 연동.
* **커스텀 훅 신설 (완료)**: `fe/src/hooks/useOtherReminders.js`를 생성하여 API 호출, 상태 관리, CRUD 함수(`createReminder`, `updateReminder`, `deleteReminder`, `fetchExpiryAlerts`)를 캡슐화.
* **Vehicles 페이지 통합 구현 (완료)**: `fe/src/app/dashboard/vehicles/page.js` 하단에 `Other Certifications & Reminders` 섹션을 추가. 만료 경고 배너, 전체 목록 테이블, Add/Edit 인디고 컬러 모달을 완성하고 DB와 실시간 연동.

---


### 16. WIP 검수 완료 토글 (1번 미구현) vs (2번 구현 완료)
* **1번 앱 (QA WIP 페이지 내 미구현)**
  * **핵심 기능**:
    * 레거시 `41.php`에서 `tb_jobs.WIP_Completed` 0/1 토글 + 완료일 저장 기능을 담당했으나, 2번 앱 초기 QA WIP 페이지에는 해당 버튼이 없었음.
* **2번 앱 (QA WIP - qa-wip/page.js)**
  * **핵심 기능**:
    * **WIP 완료 토글 버튼**: 잡 선택 시 우측 헤더 영역에 "Mark WIP Complete" 또는 "Reset WIP" 버튼이 동적으로 표시됨. 클릭 시 `tb_jobs.WIP_Completed` 를 0→1 또는 1→0으로 전환.
    * **완료 상태 자동 로드**: 잡 선택(`handleSelectJob`) 시 `GET /api/qa/wip-complete/{job_number}` API를 자동 호출하여 현재 `WIP_Completed` 값과 `WIP_Completed_Date` 를 즉시 상태에 반영.
    * **시각적 상태 구분**: 미완료(0) 상태일 때 초록 계열 "Mark WIP Complete"(ShieldCheck 아이콘), 완료(1) 상태일 때 주황 계열 "Reset WIP"(RotateCcw 아이콘)로 색상 및 아이콘 전환.
    * **완료일 저장**: 0→1 전환 시 `WIP_Completed_Date = 오늘 날짜` 자동 저장. 1→0 리셋 시 `WIP_Completed_Date = NULL` 초기화.
    * **중복 방지**: `disabled={togglingWip}` 으로 API 응답 전 중복 클릭 방지.
    * **권한 제한 없음**: 레거시 41.php와 동일하게 로그인한 모든 사용자 조작 가능 (단, QA 페이지 접근 권한은 기존 인증 체계 적용).

#### [작업 결과 보고] WIP 검수 완료 토글 (추가 작업 없음 - 최종 완료)
* **백엔드 API 2종 신설 (완료)**: `GET /api/qa/wip-complete/{job_number}` (상태 조회), `POST /api/qa/wip-complete/{job_number}/toggle` (토글 실행) 엔드포인트를 `core/api_router.py` QA 섹션에 추가. `tb_jobs` 테이블과 완전 연동.
* **useQA.js 확장 (완료)**: `fetchWIPCompleteStatus(jobNumber)` 및 `toggleWIPComplete(jobNumber)` 함수를 `fe/src/hooks/useQA.js`에 추가. 기존 훅의 return 객체에 포함시켜 페이지에서 즉시 사용 가능.
* **QA WIP 페이지 UI 구현 (완료)**: `fe/src/app/dashboard/qa-wip/page.js` 내 잡 선택 헤더에 WIP 완료 토글 버튼 추가. 잡 클릭 시 상태 자동 조회, 버튼 색상/아이콘 동적 전환, confirm 확인 후 토글 처리까지 완성.

---


### 17. 생산 부하 계획 Workload Plan (1번 미구현) vs (2번 구현 완료)
* **1번 앱 (미구현)**
  * **핵심 기능**:
    * 레거시 `42.php`에 있는 생산 부하 계획 시뮬레이터. 2번 앱 초기 버전에는 별도 페이지가 없었음.
* **2번 앱 (/dashboard/workload - workload/page.js)**
  * **핵심 기능**:
    * **공수 집계 카드 2종**: "도면 승인 완료 & 미제작" 부재의 `quoted_fab_hours` 합계(Portals/Beams/Posts/Other 분류 포함), "전체 미제작" 공수 합계 각각 표시.
    * **30일 컬러 그리드 - 도면 승인 완료 기준**: `design=1 AND made=0` 조건 공수를 직원별·일자별로 배분한 30일 예측 그리드.
    * **30일 컬러 그리드 - 전체 기준**: `made=0` 전체 공수 기준 30일 예측 그리드.
    * **컬러 코딩**: 빨강(공수 소진 중인 바쁜 날), 노랑(마지막 제작 완료 날, 부분 시간 표시), 초록(여유 있는 날), 회색(주말/공휴일/연차).
    * **실제 출근 직원 기반**: `tb_punchsheet`에서 오늘 출근한 직원(F/W/F·W 역할)을 자동 조회하여 개인별 공수 배분. 출근 직원 없을 경우 정적 fabricator 수 기반 계산으로 fallback.
    * **공휴일·연차 반영**: `tb_public_holidays` + 직원별 `tb_leaves` 연차 데이터를 참조하여 가용 여부 계산.
    * **컨트롤 패널**: Hours per day (8~12, 0.5 단위) + Fabricators (1~8) 드롭다운으로 파라미터 변경 시 그리드 즉시 재계산.
    * **사이드바 메뉴**: "Workload" (TrendingUp 아이콘, minRight=5) 항목으로 Performance 바로 아래에 배치.

#### [작업 결과 보고] 생산 부하 계획 (추가 작업 없음 - 최종 완료)
* **백엔드 API 신설 (완료)**: `GET /api/workload/plan?hours_per_day=8&nb_fabricators=5` 엔드포인트를 `core/api_router.py`에 추가. `tb_jobs_details`, `tb_punchsheet`, `tb_public_holidays`, `tb_leaves` 4개 테이블 조합 집계 로직 구현.
* **Workload 페이지 신규 생성 (완료)**: `fe/src/app/dashboard/workload/page.js`를 생성하여 공수 통계 카드 2종 + 30일 컬러 그리드 2종 + WorkloadGrid 컴포넌트를 구현. sticky 첫 열로 가로 스크롤 시 직원명 고정.
* **사이드바 메뉴 추가 (완료)**: `fe/src/components/common/Sidebar.js`에 "Workload" 항목(TrendingUp 아이콘) 추가.

---


## 3. 레거시 전체 메뉴 상세 기능 일람 및 구현 비교

레거시 코드에서 매핑되는 페이지 및 파일명 목록과 핵심 기능 설명, 그리고 1번 앱 및 2번 앱에서의 구현 비교 정보입니다.

1. **Home (`index.php` / `1.php`)**
   * 로그인 후 이동하는 메인 대시보드 화면. 주요 바로가기 위젯 및 전체 활성 프로젝트 진행률 바 시각화 제공.
   * **1번 앱**: 구현 완료 (`index.html`)
   * **2번 앱**: 구현 완료 (`page.js` 대시보드)

2. **Whiteboard (`2.php` / `2bis.php`)**
   * 공장/현장 내 공정 스케줄러 보드. 각 날짜별 직원 배치, 도면 제작 분담 상황을 관리.
   * **1번 앱**: 구현 완료 (`whiteboard.html`)
   * **2번 앱**: **구현 완료 (최종 완료)**
     * *수정 결과*: 일반 직원(right_level < 6) 계정으로 로그인한 경우 화이트보드 페이지 상단에 읽기 전용 경고 배너를 노출하고, New Task 생성 차단, 태스크 카드의 드래그앤드롭 차단(`draggable=false`), 드롭 시도 시 백엔드 API 요청 방지 가드 처리 및 개별 카드의 Edit/Delete 아이콘 단추를 동적으로 숨겨 읽기 전용 모드를 구현하였습니다.


3. **Jobs (`3.php` / `3bis.php`)**
   * 현재 등록된 전체 프로젝트 리스트 브라우저. 신규 프로젝트 등록, 도면 업로드 및 견적 시간 할당.
   * **1번 앱**: 구현 완료 (`jobs.html`)
   * **2번 앱**: 구현 완료 (`page.js` 잡 관리)

4. **Wip / Wip Detail (`32.php`)**
   * 생산품 품질 관리(QA) 검수 시스템. 조립 부재별 검사 성적(VT, PT 등)을 기록하고 Pass/Fail 판정 및 보고서 PDF 출력 기능 제공.
   * **1번 앱**: 구현 완료 (`qa_dashboard.html`)
   * **2번 앱**: 구현 완료 (`page.js` QA WIP)

5. **Activity (`6.php`)**
   * 공장 내 작업자들이 Punch Clock을 통해 입력한 실시간 가동 현황 로그 목록. 현재 어떤 작업자가 어떤 프로젝트의 부재를 만들고 있는지 실시간 트래킹.
   * **1번 앱**: 구현 완료 (`activity.html`)
   * **2번 앱**: **구현 완료 (최종 완료)**
     * *수정 결과*: 백엔드 API (`GET /api/activity`)를 신설하여 최신 가동 정보 100개를 정렬 반환하도록 조치하고, 프론트엔드 독립 UI (`fe/src/app/dashboard/activity/page.js`)를 추가하여 타임라인 형식의 로그 보드를 완성하였습니다. 사이드바 연동 및 5초 주기 자동 새로고침(Auto Refresh) 토글 장치를 이식 완료하였습니다.

6. **Punch Clock / Punch User (`9.php`)**
   * 출근/퇴근(Clock In/Out) 및 특정 도면 작업 시작/일시정지/종료 입력 폼. 관리자는 타 직원의 근태 대리 기록 및 잊은 퇴근 정보 수정 기능 제공.
   * **1번 앱**: 구현 완료 (`punch.html`)
   * **2번 앱**: 구현 완료 (`page.js` Punch Clock 및 Timesheet 연동 완료)

7. **Performance (`17.php`)**
   * 작업자 실적 통계 화면. 작업물 종류별 소요 시간 집계 및 Google Charts 기반 시인성 좋은 그래프 제공.
   * **1번 앱**: 구현 완료 (`performance.html`)
   * **2번 앱**: 구현 완료 (`page.js` Performance 차트 시각화 완료)

8. **Reminder (`15.php`)**
   * 공용 수송 차량의 정기 검사(WOF, REGO) 및 현장 직원의 안전 자격증(SiteSafe) 만료 안내 정보 알림판.
   * **1번 앱**: 구현 완료 (`vehicles.html` / `staff_reminder.html`)
   * **2번 앱**: **구현 완료 (최종 완료)**
     * *수정 결과*:
       * **백엔드 API 신설**: `GET /api/reminders/staff/expiry-check` 엔드포인트를 `core/api_router.py`에 추가. `sitesafe_expiry` 컬럼 기준으로 오늘로부터 30일 이내 만료 예정 또는 이미 만료된 직원을 쿼리하여 `expired` / `expiring_soon` 상태를 반환.
       * **프론트엔드 훅 추가**: `fe/src/hooks/useStaffReminders.js` 훅 생성. API 호출 및 알림 데이터 상태 관리 담당.
       * **직원 페이지 인라인 경고판 삽입**: `fe/src/app/dashboard/employees/page.js` 상단에 SiteSafe 만료 직원 목록을 표시하는 경고 배너를 추가.
       * **대시보드 메인 위젯 통합**: `fe/src/app/dashboard/page.js`에 관리자(right_level >= 10) 전용 SiteSafe 경고 배너를 추가하여 로그인 즉시 위험 인원을 파악할 수 있도록 구현. 만료(expired) 시 빨간 배지, 30일 이내 만료 예정(expiring_soon)은 주황 배지로 구분 표시.


9. **My Account (`20.php`)**
   * 관리자 및 임직원의 개인 정보 설정 및 비밀번호 변경 관리 화면.
   * **1번 앱**: 구현 완료 (`myaccount.html`)
   * **2번 앱**: 구현 완료 (헤더 유저 프로필 메뉴 및 비밀번호 재설정 기능 완료)

---

## 4. 레거시 sitepro PHP 파일 전체 분석표

레거시 앱(`F:\pe\public_html\sitepro`)에 존재하는 모든 주요 PHP 파일을 번호 기준으로 분류하여 역할/기능을 정리하고, 2번 앱에서의 구현 상태를 표기합니다.

> **상태 구분**
> - **구현 완료**: 2번 앱에 동등 기능이 구현됨
> - **구현 가능**: DB 구조 / 스택 상 구현 가능하나 아직 미개발
> - **관련 없음**: 레거시 전용 내부 처리 로직 또는 중복 저장 파일로 현행화 불필요

### 4-1. 주요 UI 페이지 파일

| 파일 | 레거시 역할 / 기능 | 2번 앱 구현 상태 | 비고 |
|------|-------------------|-----------------|------|
| `1.php` | 메인 대시보드 (Home). 로그인 후 랜딩, IP/디바이스 기반 접근 제어, 작업 진행률 위젯, 바로가기 카드 3개 | **구현 완료** | `dashboard/page.js` |
| `2.php` | 화이트보드 (Whiteboard). 날짜별 직원 배치 드래그앤드롭 스케줄러 보드 | **구현 완료** | `whiteboard/page.js` |
| `2bis.php` | 화이트보드 읽기 전용 뷰 (read-only). 권한 낮은 직원이 일정 조회 전용으로 접근 | **구현 완료** | `whiteboard/page.js` 내 권한별 분기 처리 |
| `3.php` | 잡 관리 (Jobs). 프로젝트 목록 조회, 신규 Job 등록, 도면/사진 업로드 | **구현 완료** | `jobs/page.js` |
| `3bis.php` | 잡 상세 관리 보조 화면 (Job Detail 보조). 3.php의 부가 기능 분리 | **구현 완료** | `jobs/page.js` 내 통합 |
| `4.php` | 현장/공장/사무실 작업 현황 보드 (Activity). Bay별 직원 실시간 작업 현황 | **구현 완료** | `activity/page.js` |
| `5.php` | 로그인 폼 (Login). 계정 인증 및 등록(Register) 화면 | **구현 완료** | `login/page.js` |
| `6.php` | 작업 가동 로그 (Activity Log). Punch Clock 기반 실시간 현황 로그 타임라인 | **구현 완료** | `activity/page.js` |
| `7.php` | Punch Clock 메인 폼 (Punch Clock). 출퇴근(Clock In/Out), 작업 시작/일시정지/종료 입력 | **구현 완료** | `punch/page.js` |
| `8.php` | 타임시트 조회 (Timesheet). 직원별/주차별 출퇴근 이력 조회 및 필터링 | **구현 완료** | `timesheet/page.js` |
| `9.php` | 관리자용 Punch 대리 기록 (Punch User). 관리자가 특정 직원의 Punch 대리 수정 가능 | **구현 완료** | `punch/page.js` 관리자 탭 |
| `15.php` | 알림판 (Reminder). 차량 WOF/REGO 만료, 직원 SiteSafe 만료, 기타 인증 만료 통합 알림 | **구현 완료** | `vehicles/page.js` + 대시보드 위젯 |
| `16.php` | 잡 상세 현황 (Job Detail). 부재별 Design/Made/Load/OnSite/Finish 체크박스 상태 관리 | **구현 완료** | Jobs 상세 체크 진행 상태 뷰 완료 (`jobs/page.js`) |
| `17.php` | 성과/퍼포먼스 통계 (Performance). 직원별 작업 타입별 누적 소요 시간 그래프 | **구현 완료** | `performance/page.js` |
| `19.php` | 직원 관리 화면 (Employees). 직원 계정 조회/추가/수정/삭제 | **구현 완료** | `employees/page.js` |
| `20.php` | 마이 어카운트 (My Account). 개인 정보 설정, 비밀번호 변경 | **구현 완료** | 헤더 유저 프로필 메뉴 |
| `32.php` | QA/WIP 검수 (WIP Detail). 부재별 VT/PT 검사 성적 기록, Pass/Fail 판정, 검사 보고서 | **구현 완료** | `qa-wip/page.js` |
| `39.php` | 전체 잡 체크 일괄 처리 (Tick All Jobsheet). 롯 단위로 LOAD/ONSITE/FINISH 상태 일괄 업데이트, 이메일 발송 | **구현 완료** | Jobs 상세 일괄 상태 변경 완료 (`jobs/page.js`) |
| `42.php` | 직원 타임카드 조회 (Timecard). 작업별 소요시간 계산 및 집계 보고서 | **구현 가능** | 현재 타임시트 기능에 일부 포함됨 |
| `43.php` | 월간 노트/계획 (Monthly Plan). 주간별 직원 배정 노트 및 조율 메모 | **구현 완료** | `weekly-plan/page.js` |
| `50.php` | WIP 전체 조회 (WIP Dashboard). 전체 잡의 QA 검수 대기 현황 목록 | **구현 완료** | `qa-wip/page.js` |
| `51.php` | WIP 잡 선택 화면. WIP 검수를 시작할 잡 번호/연도 선택 | **구현 완료** | `qa-wip/page.js` 내 통합 |
| `52.php` | WIP 버전 히스토리 화면. 재작업(Rework) 버전별 이력 조회 | **구현 완료** | `qa-wip/page.js` 버전 선택 |
| `53.php` | 도면 뷰어 (Drawing Viewer). 도면 파일 다운로드/조회 화면 | **구현 완료** | `jobs/page.js` Drawings 탭 |
| `60.php` | 잡 설치 일자 관리 (Job Date Install). 롯별 설치 예정일/완료일 입력 및 관리 | **구현 완료** | Jobs 상세 내 설치일 관리 완료 (`jobs/page.js`) |
| `61.php` | 잡 상세 부재 조회 (Job Detail View). 잡의 전체 부재 목록 조회 | **구현 완료** | `jobs/page.js` Details 탭 |
| `64.php` | 작업 지시서 인쇄 (Jobsheet Print). 롯 단위 작업 지시서 PDF/HTML 출력 | **구현 완료** | Jobs 상세 내 인쇄 최적화 팝업 구현 완료 (`jobs/page.js`) |
| `66.php` | 성과 보고서 상세 (Performance Detail). 직원별 잡별 시간 집계 상세 | **구현 완료** | `performance/page.js` 내 포함 |
| `71.php` | 차량 관리 (Vehicles). 차량 목록 조회 및 WOF/REGO 정보 관리 | **구현 완료** | `vehicles/page.js` |
| `73.php` | QA 검사 보고서 PDF 출력 (QA Report Print). 검사 성적서 PDF 프린트 출력 | **구현 완료** | QA WIP 상세 패널 내 보고서 인쇄 팝업 구현 완료 (`qa-wip/page.js`) |

---

### 4-2. 백엔드 처리 전용 파일 (UI 없음)

| 파일 | 레거시 역할 / 기능 | 2번 앱 상태 |
|------|-------------------|------------|
| `connect.php` | 로그인 인증 처리 (POST 수신). 비밀번호 검증, 세션 생성, Reminder 경고 팝업 | **관련 없음** | JWT 기반 인증으로 대체됨 |
| `disconnect.php` | 로그아웃 처리. 세션 파기 및 홈 리다이렉트 | **관련 없음** | JWT 토큰 폐기로 대체됨 |
| `register.php` | 신규 계정 등록 처리 (POST). 직원 정보 DB 저장, 관리자 승인 대기 상태로 등록 | **구현 완료** | `employees/page.js` 직원 추가 API |
| `13.php` | 직원 계정 삭제 처리 (DELETE USER). Admin 권한 필요 | **구현 완료** | `employees/page.js` 직원 삭제 API |
| `21.php` | 차량 알림 정보 업데이트 처리 (UPDATE REMINDER VEHICLES). WOF/REGO/SERVICE/RUC/ODO | **구현 완료** | `vehicles/page.js` 편집 API |
| `22.php` | SiteSafe 만료일 업데이트 처리 (UPDATE SITESAFE). 직원 SiteSafe 날짜 DB 저장 | **구현 완료** | `employees/page.js` 편집 API |
| `23.php` | 기타 알림 항목 추가 처리 (ADD OTHER REMINDER). `tb_reminder_other` 레코드 추가 | **구현 완료** | `vehicles/page.js` Other Certifications 섹션 |
| `24.php` | 기타 알림 항목 수정 처리 (UPDATE OTHER REMINDER) | **구현 완료** | `vehicles/page.js` Edit 모달 |
| `25.php` | 기타 알림 항목 삭제 처리 (DELETE OTHER REMINDER) | **구현 완료** | `vehicles/page.js` Delete 버튼 |
| `26.php` | 직원 활성/비활성 토글 처리 (ACTIVATE/DEACTIVATE USER) | **구현 완료** | `employees/page.js` Active/Retired 탭 |
| `27.php` | 직원 정보 수정 처리 (UPDATE USER). 이름, 역할, 권한, Bay, Shop Label 저장 | **구현 완료** | `employees/page.js` 편집 API |
| `28.php` | 직원 Bay 번호 수정 처리 (UPDATE BAY) | **구현 완료** | `employees/page.js` 내 통합 |
| `29.php` | 직원 비밀번호 강제 초기화 처리 (RESET PASSWORD) | **구현 완료** | `employees/page.js` 난수 비밀번호 발급 |
| `30.php` | 화이트보드 태스크 추가/수정 처리 (ADD/UPDATE WHITEBOARD TASK) | **구현 완료** | `whiteboard/page.js` API |
| `31.php` | 화이트보드 태스크 삭제 처리 (DELETE WHITEBOARD TASK) | **구현 완료** | `whiteboard/page.js` API |
| `33.php` | 잡 정보 수정 처리 (UPDATE JOB). 회사명, 현장 주소, 견적 시간 저장 | **구현 완료** | `jobs/page.js` 편집 API |
| `34.php` | 잡 부재 상세 체크박스 저장 처리 (UPDATE JOB DETAIL). Made/Design/Loaded 등 | **구현 완료** | `jobs/page.js` Details API |
| `35.php` | 잡 부재 상세 항목 삭제 처리 (DELETE JOB DETAIL) | **구현 완료** | `jobs/page.js` API |
| `36.php` | 잡 삭제 처리 (DELETE JOB). `tb_jobs` 레코드 삭제 | **구현 완료** | `jobs/page.js` API |
| `37.php` | 잡 부재 상세 추가 처리 (ADD JOB DETAIL). 신규 부재 항목 추가 | **구현 완료** | `jobs/page.js` API |
| `40.php` | WIP 검수 상세 업데이트 처리 (UPDATE WIP DETAIL). Pass/Fail, 검사원, WPS, Version 자동 증가 | **구현 완료** | `qa-wip/page.js` API |
| `41.php` | WIP 검수 항목 초기화 처리 (RESET WIP) | **구현 가능** | WIP 리셋 기능 미구현 |
| `44.php` | 차량 신규 등록 처리 (ADD VEHICLE). `tb_reminder_vehicle` 레코드 추가 | **구현 완료** | `vehicles/page.js` API |
| `45.php` | 차량 삭제 처리 (DELETE VEHICLE) | **구현 완료** | `vehicles/page.js` API |
| `46.php` | 월간 계획 노트 저장 처리 (SAVE WEEKLY PLAN NOTE) | **구현 완료** | `weekly-plan/page.js` API |
| `47.php` | 월간 계획 배정 저장 처리 (SAVE WEEKLY PLAN ASSIGNMENT) | **구현 완료** | `weekly-plan/page.js` API |
| `48.php` | 월간 계획 삭제 처리 (DELETE WEEKLY PLAN) | **구현 완료** | `weekly-plan/page.js` API |
| `49.php` | 월간 계획 직원 배정 삭제 처리 | **구현 완료** | `weekly-plan/page.js` API |
| `54.php` | 잡 설치 일자 추가 처리 (ADD DATE INSTALL) | **구현 완료** | `jobs/page.js` 내 통합 |
| `55.php` | 잡 설치 일자 수정 처리 (UPDATE DATE INSTALL) | **구현 완료** | `jobs/page.js` 내 통합 |
| `56.php` | 잡 설치 일자 삭제 처리 (DELETE DATE INSTALL) | **구현 완료** | `jobs/page.js` 내 통합 |
| `57.php` | 사진 업로드 처리 (UPLOAD PHOTO). 현장 품질 검사 사진 서버 저장 | **구현 완료** | `jobs/page.js` 사진 업로드 API |
| `58.php` | 도면 업로드 처리 (UPLOAD DRAWING). 도면 PDF/파일 서버 저장 | **구현 완료** | `jobs/page.js` 도면 업로드 API |
| `59.php` | 도면 삭제 처리 (DELETE DRAWING) | **구현 완료** | `jobs/page.js` API |
| `62.php` | Punch Clock 입력 처리 (PUNCH CLOCK SAVE). START/STOP/GO/PAUSE/CLOCK IN/OUT 기록 | **구현 완료** | `punch/page.js` API |
| `63.php` | Punch Clock 수정/삭제 처리 (PUNCH CLOCK EDIT). 관리자 대리 수정 | **구현 완료** | `punch/page.js` 관리자 수정 API |
| `65.php` | QA 검사 타입 업데이트 처리 (UPDATE QA EXAM TYPE) | **구현 완료** | `qa-wip/page.js` API |
| `67.php` | 도면 다운로드 처리 (DOWNLOAD DRAWING) | **구현 완료** | `jobs/page.js` 다운로드 API |
| `68.php` | 사진 삭제 처리 (DELETE PHOTO) | **구현 완료** | `jobs/page.js` API |
| `69.php` | 사진 다운로드 처리 (DOWNLOAD PHOTO) | **구현 완료** | `jobs/page.js` API |
| `70.php` | 비밀번호 업데이트 처리 (UPDATE PASSWORD). 개인 비밀번호 변경 폼 처리 | **구현 완료** | 헤더 비밀번호 변경 API |
| `72.php` | 이메일 발송 처리 (SEND EMAIL). Job 완료 시 관리자에게 자동 이메일 | **취소** | 파이썬 SMTP 연동 필요 → 유저 요청으로 취소 |
| `PunchSheetAction.php` | Punch Clock 입력 액션 전용 처리기. START/STOP/GO/PAUSE/CLOCK IN/OUT | **구현 완료** | `punch/page.js` API |
| `create_update_job.php` | 잡 생성/수정 전용 처리기. Excel 데이터 파싱, 잡 신규 생성, 부재 일괄 추가 | **구현 완료** | `jobs/page.js` Ingest Excel API |
| `update_jobsdetails.php` | 잡 부재 상세 일괄 업데이트 처리기 | **구현 완료** | `jobs/page.js` Details API |
| `update_dateinstalljobs.php` | 잡 설치 일자 일괄 업데이트 처리기 | **구현 완료** | `jobs/page.js` 내 통합 |
| `functions.inc.php` | 레거시 공용 함수 모음. 세션, DB, 알림, 이메일 유틸 | **관련 없음** | FastAPI 유틸 함수로 대체됨 |
| `class.json.php` | JSON 파싱/직렬화 유틸 클래스 | **관련 없음** | Python/JS 기본 JSON 처리로 대체됨 |
| `ga.php` | Google Analytics 트래킹 코드 삽입 | **관련 없음** | |
| `polyfill.php` | 구형 브라우저 폴리필 | **관련 없음** | Next.js 내장 폴리필로 대체됨 |
| `destroysession.php` | 세션 완전 파기 처리 | **관련 없음** | JWT 로그아웃으로 대체됨 |
| `index.php` | 사이트 라우터 (난독화된 CMS 엔진). 페이지 라우팅 및 권한 체크 | **관련 없음** | Next.js App Router로 대체됨 |

---

## 5. 구현 가능한 미비 기능 개발 계획

현재 2번 앱(steelworks-manager-react)에 구현되지 않은 레거시 기능 중 **구현 가능** 항목 정리 및 우선순위별 개발 계획입니다.

### 5-1. 높은 우선순위 (운영 필수 기능)

| # | 기능명 | 레거시 파일 | 개발 설명 |
|---|--------|-----------|-----------|
| 1 | **잡 부재 상세 체크 진행 화면** | `16.php`, `34.php`, `39.php` | **구현 완료 (수정_react_105)** |
| 2 | **잡 설치 일자 관리** | `60.php`, `54.php`, `55.php`, `56.php` | **구현 완료 (수정_react_106)** |
| 3 | **화이트보드 읽기 전용 뷰** | `2bis.php` | **구현 완료 (수정_react_107)** |

### 5-2. 중간 우선순위 (업무 효율화 기능)

| # | 기능명 | 레거시 파일 | 개발 설명 |
|---|--------|-----------|-----------|
| 4 | **작업 지시서 인쇄 (Jobsheet Print)** | `64.php` | **구현 완료 (수정_react_108)** |
| 5 | **QA 검사 보고서 PDF 출력** | `73.php` | **구현 완료 (수정_react_109)** |
| 6 | **기타 인증 항목 관리 (Other Reminders)** | `23.php`, `24.php`, `25.php` | **구현 완료 (수정_react_110)** |
| 7 | **롯 단위 일괄 상태 변경 (Tick All)** | `39.php` | **구현 완료 (수정_react_105 통합)** |

### 5-3. 낮은 우선순위 (추가 개선 기능)

| # | 기능명 | 레거시 파일 | 개발 설명 |
|---|--------|-----------|-----------|
| 8 | **이메일 자동 발송 (Job 완료 알림)** | `72.php`, `39.php` | **취소 확정** (외부 SMTP 연동 필요, 유저 요청으로 취소) |
| 9 | **생산 부하 계획 (Workload Plan)** | `42.php` | **구현 완료 (수정_react_112)** |
| 10 | **WIP 검수 완료 토글 (WIP Complete)** | `41.php` | **구현 완료 (수정_react_111)** |

### 5-4. 관련 없음 (레거시 전용 - 마이그레이션 불필요)

아래 파일들은 레거시 PHP/MySQL 아키텍처에 특화된 처리 로직으로, 2번 앱(FastAPI + SQLite + Next.js)에서는 해당 기술 스택으로 완전히 대체되어 별도 이식 불필요.

- `connect.php` / `disconnect.php` / `destroysession.php`: PHP 세션 기반 인증 → JWT 토큰으로 대체
- `index.php`: PHP CMS 라우터 → Next.js App Router로 대체
- `functions.inc.php` / `class.json.php` / `polyfill.php` / `ga.php`: 레거시 유틸리티
- `-save*` 백업 파일들 (예: `1-save20210202.php`, `7-save20200821.php` 등): 과거 버전 백업 파일, 현행 운영과 무관

---

> **문서 최종 업데이트**: 생산 부하 계획 (Workload Plan) 기능 추가 완료 (수정_react_112)


