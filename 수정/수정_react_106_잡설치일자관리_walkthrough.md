# 수정_react_106_잡설치일자관리_walkthrough

## 개요

레거시 앱의 `60.php` (설치 일정 관리), `54.php` (설치 예정일 추가), `55.php` (설치 예정일 수정), `56.php` (설치 예정일 삭제) 기능을 2번 앱에 구현하였습니다.

## 구현 내용

### 1. 백엔드 - api_router.py
- **특정 잡의 설치 일정 목록 조회 엔드포인트 추가:**
  - `GET /api/jobs/{job_number}/install-dates`
- **특정 롯의 설치 일정 등록 및 수정 엔드포인트 추가:**
  - `PUT /api/jobs/{job_number}/install-dates/{lot}`
  - 날짜(`date_install`) 및 상태(`status_install` - `design`/`fabrication`/`ready`/`temp installed`/`finished`)를 한 번에 저장할 수 있습니다.
- **특정 롯의 설치 일정 초기화(삭제) 엔드포인트 추가:**
  - `DELETE /api/jobs/{job_number}/install-dates/{lot}`

### 2. 프론트엔드 - useJobs.js 및 jobs/page.js
- **useJobs.js 훅 보완:**
  - `jobInstallDates` 상태와 `fetchJobInstallDates`, `updateJobInstallDate`, `deleteJobInstallDate` API 연동 모듈 추가.
- **jobs/page.js UI 통합:**
  - 잡을 선택할 때 마다 해당 잡의 롯별 설치 정보(`jobInstallDates`)를 비동기로 호출합니다.
  - Members & Lots 탭의 각 LOT 카드 상단에 날짜 입력 필드(`input type="date"`)와 상태 선택 상자(`select`)로 구성된 설치 일정 컨트롤러 행을 렌더링하도록 UI를 이식하였습니다.
  - 관리자(Level 10+) 계정인 경우, 입력 필드 우측에 설치 일정을 완전히 삭제/초기화할 수 있는 **"Reset Date"** 버튼을 노출 및 연동하였습니다.

## 빌드 결과

18/18 페이지 모두 정상 빌드 완료되었으며 오류 없음 확인.

## 수정된 파일
- `core/api_router.py` (L514~L566)
- `fe/src/hooks/useJobs.js` (L137~L190)
- `fe/src/app/dashboard/jobs/page.js`
