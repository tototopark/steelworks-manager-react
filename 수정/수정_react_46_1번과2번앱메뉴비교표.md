# 1번 앱과 2번 앱 메뉴 및 기능 비교 분석서 (리스트 형식)

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

---

### 2. Jobs (1번) vs Jobs (2번)
* **1번 앱 (Jobs - jobs.html)**: 부재 조회 및 신규 작업 생성, 엑셀 가져오기 등
* **2번 앱 (Jobs - page.js)**: 커스텀 훅 `useJobs` 기반 UI 마이그레이션 완료

---

### 3. QA Dashboard (1번) vs QA WIP (2번)
* **1번 앱 (QA Dashboard - qa_dashboard.html)**: 품질 검사 리스트 및 대기 목록 관리
* **2번 앱 (QA WIP - page.js)**: 커스텀 훅 `useQA` 기반 품질 판정 기능 및 자동 재작업 태스크 이식 완료

---

### 4. Monthly Notes (1번) vs Monthly Plan (2번)
* **1번 앱 (Monthly Notes - weekly.html)**: 주간 단위 생산 계획 등록 및 하루 메모 기능
* **2번 앱 (Monthly Plan - page.js)**: 직원별 주간 Job 배정 및 일별 노트 수정 완료

---

### 5. Whiteboard (1번) vs Whiteboard (2번)
* **1번 앱 (Whiteboard - whiteboard.html)**: 직원별 태스크 드래그 앤 드롭 배정 판넬
* **2번 앱 (Whiteboard - page.js)**: HTML5 Drag and Drop API 적용 칸반 보드 구축 완료

---

### 6. Employees (1번) vs Employees (2번)
* **1번 앱 (Employees - employees.html)**: 직원 계정 마스터 디렉토리
* **2번 앱 (Employees - page.js)**: 아바타 업로더 및 임시 비밀번호 발급기 탑재 완료

---

### 7. Vehicles (1번) vs Vehicles (2번)
* **1번 앱 (Vehicles - vehicles.html)**: 차량 목록 및 알림 관리
* **2번 앱 (Vehicles - page.js)**: WOF/REGO 30일 이내 만료 경고 알림 연동 완료

---

### 8. Holidays (1번) vs (2번 미구현)
* **1번 앱 (Holidays - holidays.html)**: 공휴일 일정 추가 및 삭제 관리
* **2번 앱**: 아직 미개발 상태

---

### 9. Punch Clock (1번) vs (2번 미구현)
* **1번 앱 (Punch Clock - punch.html)**: 근태 기록용 출근/퇴근(Clock In/Out) 타임카드
* **2번 앱**: 아직 미개발 상태

---

### 10. Admin (1번) vs Admin DB (2번)
* **1번 앱 (Admin - admin.html / login.html)**: 시스템 데이터 관리 및 복구 도구
* **2번 앱 (Admin DB - page.js)**: Level 99 권한 가드 적용, SQLite 테이블 정밀 브라우저 및 정비 툴킷 완료

---
---

## [2] 첫 번째 메뉴(Dashboard) 미비점 및 수정 작업 계획

1번 앱의 대시보드 구조 및 디자인 강점을 결합하여 2번 앱(React)의 대시보드를 더 직관적이고 완성도 있게 강화하기 위한 작업 계획을 아래와 같이 제안합니다.

### 1. 디자인 톤앤매너 개선
* **현황**: 2번 앱은 지나치게 어둡고 단조로운 다크 톤(Zinc-950 기반)과 단색 화이트 진행도 바를 사용하여 직관성이 떨어집니다.
* **수정 계획**: 1번 앱의 화려하지 않으면서도 세련된 배색(부트스트랩 테마 컬러)을 2번 앱 디자인 시스템(Tailwind CSS/CSS)에 이식합니다.
  * 진행 상태에 맞춰 적절한 포인트 컬러 적용 (진행 중: 신뢰감을 주는 블루 계열, 100% 완료: 시인성이 뛰어난 소프트 그린 계열).

### 2. 바로가기 카드 섹션 추가
* **현황**: 2번 앱은 텍스트 정보와 표 위주로만 되어 있어 조작 동선이 깁니다.
* **수정 계획**: 1번 앱에서 제공하는 핵심 카드 3개(Jobs 바로가기, Staff 바로가기, Punch Clock 바로가기)를 2번 앱 대시보드 중간 영역에 세련된 디자인으로 이식하여 직관적인 조작성을 확보합니다.

### 3. 실시간 작업 진행률 표시 방식 통일 (1번 스펙 기준 일치)
* **현황**: 2번 앱은 최신 5개만 로드하며 정렬 기준이 모호하고 수량 비율 정보가 생략되었습니다.
* **수정 계획**:
  * 활성 작업을 **동시에 최대 50개**까지 보여주도록 API 한도를 확장하며, 만약 50개보다 많을 시 **다음 페이지(페이징) 기능**을 탑재하여 전체 조회가 가능하게 합니다.
  * 가져온 활성 작업을 **잡 번호(Job Number) 기준 오름차순(Ascending)**으로 자동 정렬하여 표시합니다.
  * 진행률 바 내부에 `85% (17/20 pcs)` 또는 완료 시 `100% COMPLETED`와 같은 상세 완료 수량 분수비를 텍스트로 오버레이 처리합니다.
