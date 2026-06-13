# 펀치화면 로그인 사용자 한정 및 레거시 마이그레이션 분석 결과서 (Walkthrough)

펀치 클락 화면을 로그인한 본인 계정 정보로 제한하여 구동하도록 개편하였으며, 레거시 PHP 앱(`sitepro`)과 1번 앱의 연동 코드를 면밀히 분석하여 미이관 상태의 기능적 차이(Gap)를 정리했습니다.

## 1. 펀치 클락 화면 개편 내용 (`fe/src/app/dashboard/punch/page.js`)
- **로그인 세션 바인딩**: 기존 전체 직원 목록 드롭다운을 제거하고, `useAuth` 훅을 통해 현재 로그인한 사용자 정보(`user.firstname`, `user.surname`, `user.id`)를 화면에 고정 노출하여 대리 출근 등을 방지했습니다.
- **API 파라미터 변경**: PUNCH IN / OUT 클릭 시 `user.id`가 `/api/punch` POST 요청의 `employee_id` 파라미터로 명시적으로 전달되도록 수정했습니다.
- **빌드 테스트**: `npm run build` 결과 번들 생성 및 컴파일 에러 없이 빌드가 성공적으로 완료되었습니다.

---

## 2. 레거시 PHP 분석 및 기능 격차 보고 (F:\pe\public_html\sitepro)

사용자께서 문의하신 내용에 대한 상세한 분석 결과입니다.

### Q1. 로그인한 사람의 매 작업의 시작과 종료 펀치도 여기서 하나요?
* **분석 결과**: **네, 그렇습니다.** 레거시 PHP의 핵심 로직인 `PunchSheetAction.php`를 분석해본 결과, `tb_punchsheet` 테이블은 단순 출퇴근 기록용이 아닙니다.
* 작업자가 공장 내부에서 개별 조각/파트(Job Detail)의 제작을 시작(`START`)하거나 완료/정지(`STOP` / `PAUSE`)할 때도 동일하게 `tb_punchsheet`에 기록을 남겼습니다.
* 작업이 `STOP`될 때, 레거시 DB의 `tb_jobs_details` 테이블 내 해당 파트의 완료 플래그(`made = "1"` 또는 `finish = "1"`)와 일시가 업데이트되는 트리거 로직을 가지고 있습니다.
* **마이그레이션 현황**: 현재 2번 앱(React)의 Punch Clock에는 단순 출퇴근(CLOCK IN/OUT) 액션만 구현되어 있고, **"세부 작업 단위의 START/STOP/PAUSE 추적 및 연동 로직"은 아직 포팅되지 않았습니다.**

### Q2. 하루의 작업일지(선택한 날짜의 작업일지)는 어디서 보이나요?
* **분석 결과**: 레거시 1번 앱에서는 `weekly.html` (주간 계획 및 메모) 페이지에서 캘린더 그리드 형태로 일자별 `tb_week_notes` 메모와 `tb_production_plan` 계획을 조회할 수 있습니다.
* 2번 앱(React) 역시 `fe/src/app/dashboard/weekly-plan/page.js`에서 이 캘린더 형태의 주간/월간 일지 계획을 볼 수 있도록 대응 마이그레이션되어 있습니다.
* **보완 필요 사항**: 다만, 직원의 출퇴근 시간 및 작업 소요 시간(Punch Sheet 로그)을 날짜별로 한눈에 조회하는 상세 "Timesheet" 보고서 화면은 UI 페이지로 존재하지 않으며, 레거시에서는 CSV 내보내기(`/api/export/punch` 등) 또는 DB Inspector를 통해서만 조회할 수 있었습니다.

### Q3. 마이그레이션되지 않은 레거시 PHP(sitepro) 기능 지적
`sitepro` 디렉토리와 1번 앱의 정적 폴더를 비교 분석한 결과, 다음 기능들이 아직 React(Next.js) 앱에 마이그레이션되지 않았습니다:

1. **도면 및 현장 사진 업로드/관리 기능 (`update_jobsdetails.php` 및 `jobsheet.html`)**
   - 레거시에서는 특정 작업(Job Number) 하위에 도면(.pdf, .dwg)이나 현장 사진(.jpg, .png)을 업로드하고 아카이브 목록을 볼 수 있는 기능이 있습니다. 2번 앱의 Jobs 관리 화면에는 파일 아카이빙 기능이 누락되어 있습니다.
2. **세부 작업별 제작 시간 펀치 연동 기능 (`PunchSheetAction.php`)**
   - 앞서 기술한 바와 같이 개별 파트 제작 시 START/STOP/PAUSE를 찍어 일의 진척도와 실제 작업 시간을 매핑하는 로직이 2번 앱에 부재합니다.
3. **Punch Sheet 로그 CSV 내보내기 기능**
   - `/api/export/punch` 등 데이터를 다운로드받을 수 있는 익스포트 엔드포인트와 버튼 등이 UI에 배치되지 않았습니다.
