# 레거시 사이트(sitepro) 관리자 화면 및 그래프 분석 보고서

본 보고서는 레거시 PHP 프로젝트(`F:\pe\public_html\sitepro`) 내의 관리자 전용 화면과 시각적 요소(그래프 및 막대바), 그리고 전체 메뉴 구조를 세부 분석하여 정리한 문서입니다.

---

## 1. 타임시트 및 관리자 화면 내 그래프/막대바 분석

레거시 코드 분석 결과, 관리자 레벨(`right_level` 5: Accountant, 6: Admin, 68: Admin/Truck, 9: Managing Director)에서 접근할 수 있는 주요 시각적 도구(그래프 및 막대바 색상 코드)는 다음과 같습니다.

### [A] User Performance (사용자 실적 및 생산성 관리) - `17.php`
작업자(Welder)들의 실적을 수치 테이블과 시각적 그래프로 요약하여 보고하는 핵심 성능 분석 페이지입니다.
* **표시 기간**: 지난주(Previous week), 2주 전(2 weeks ago), 4주 전(4 weeks ago), 12주 전(12 weeks ago) 단위로 구분하여 실적 집계.
* **주요 부재종류**: Portal, Beam, Column, Other
* **구체적 시각 효과 및 막대바 대체 색상 코드**:
  * 각 부재 제작 시 투입된 평균 시간(Average Time)을 계산하여 기준 시간 준수 여부를 다음의 **신호등(Traffic Light) 색상**으로 시각화합니다.
    * **초록색 (`#04B404`)**: 기준 시간 내에 원활히 완수한 양호(Good) 상태.
    * **주황색 (`#FF8000`)**: 기준에 근접하여 주의가 필요한 주의(Warning) 상태.
    * **빨간색 (`#FF0000`)**: 기준 시간을 초과하여 성능 개선이 필요한 정체/불량(Slow) 상태.
  * **표준 제작 소요 시간 기준**:
    * **Portal**: 5 ~ 6 시간
    * **Beam**: 2 ~ 3 시간
    * **Column**: 1 ~ 1.5 시간
* **Google Charts 연동**:
  * 페이지 하단 스크립트에서 Google Charts 로더(`https://www.gstatic.com/charts/loader.js`)를 가져와 `corechart` 패키지의 **원형 차트(PieChart)**를 렌더링합니다.
  * 각 직원별 1주, 2주, 4주, 12주간의 Portals, Beams, Columns, Others의 제작 개수를 동적으로 쿼리하여 원형 차트 영역(`piechartportal_1week`, `piechartbeam_1week` 등)에 시각적으로 뿌려줍니다.

### [B] Production Plan (생산 계획 및 Gantt 스케줄) - `devwebsite/56.php`
작업의 전체 일정을 60일 단위 Gantt-like 형태의 가로형 막대바로 시각화하여 계획하는 도구입니다.
* **주요 상태 막대바 및 색상 코드**:
  * **빨간색 (`#FF0000` / `#ff9999`)**: 제작(Fabrication) 진행 기간.
  * **주황색 (`#ffb366` / `#ffdd99`) + 'P' 표시**: 도장/페인팅(Painting) 외주 기간 (일반적으로 영업일 기준 5일 배정).
  * **노란색 (`#ffff00` / `#ffff99`) + 'I' 표시**: 현장 설치(Installation) 예정일.
  * **초록색 (`#33cc33` / `#c2f0c2`)**: 유효 대기 시간 혹은 해당 없음(Not Applicable) 상태.
  * **분홍색 (`#ff66ff` / `#ffb3ff`) + 'C' 표시**: 충돌(Conflict) 알림. (예: 제작 및 도장 처리가 미완료되었는데 설치 예정일이 도래하는 경우 등을 시스템이 자동 경고).

### [C] WIP Detail (품질 검사 및 WIP 진척 현황) - `32.php`
작업 대상 부재(Assembly Mark)별 도면 상태 및 검사 합격 여부를 색상 코드로 구분하여 관리자가 즉시 확인할 수 있게 합니다.
* **회색 (`#BDBDBD`)**: 미준비(Not ready) 상태.
* **노란색 (`#FFFF00`)**: 제작 완료(Manufactured) 상태이나, 사내 비파괴/외관 검사(VT, PT, MT, UT, RT) 또는 제3자 품질 검사 미검수 혹은 실패(Fail) 상태.
* **초록색 (`#33CC33`)**: 품질 검사를 최종 통과(Pass)한 상태.

---

## 2. 관리자 권한별 접근 메뉴 구조도

레거시 `sitepro` 시스템에서는 `$_SESSION['right_level']` 세션 값에 따라 상단 내비게이션바(`hmenu` 클래스)의 노출 메뉴를 제어합니다. 관리자 직군별 모든 메뉴 구성을 정리한 표입니다.

| 직군 권한레벨 (`right_level`) | 시스템 기본 노출 메뉴 (Menu Navigation) |
| :--- | :--- |
| **5 - Accountant (회계/경리)** | Home, Whiteboard, Jobs, Punch User (근태 사용자 관리), My Account, Logout |
| **6 - Admin (최고 관리자)** | Home, Whiteboard, Jobs, Activity (ActivitySHOPREADONLY), My Account, Logout |
| **68 - Admin/Truck (운송 겸임 관리자)** | Home, Whiteboard, Jobs, Activity (ActivitySHOPREADONLY), My Account, Logout |
| **9 - Managing Director (대표이사)** | Home, Whiteboard, Jobs, Activity (ActivitySHOPREADONLY), My Account, Logout |

*※ 참고: 현장 근로자 및 일반 직원 레벨(1, 2, 12, 8)은 Whiteboard 조회(읽기 전용), Punch Clock(근태 태그), To Do, Reminder(차량 법정검사 알림), Painter(도장일정) 등의 메뉴만 제한적으로 열람할 수 있습니다.*

---

## 3. 레거시 전체 메뉴 상세 기능 일람

레거시 코드에서 매핑되는 페이지 및 파일명 목록과 핵심 기능 설명입니다.

1. **Home (`index.php` / `1.php`)**
   * 로그인 후 이동하는 메인 대시보드 화면.
   * 주요 가로가기 위젯 및 전체 활성 프로젝트 진행률 바 시각화 제공.
2. **Whiteboard (`2.php` / `2bis.php`)**
   * 공장/현장 내 공정 스케줄러 보드.
   * 각 날짜별 직원 배치, 도면 제작 분담 상황을 관리.
3. **Jobs (`3.php` / `3bis.php`)**
   * 현재 등록된 전체 프로젝트 리스트 브라우저.
   * 신규 프로젝트 등록, 도면 업로드 및 견적 시간 할당.
4. **Wip / Wip Detail (`32.php`)**
   * 생산품 품질 관리(QA) 검수 시스템.
   * 조립 부재별 검사 성적(VT, PT 등)을 기록하고 Pass/Fail 판정 및 보고서 PDF 출력 기능 제공.
5. **Activity (`6.php`)**
   * 공장 내 작업자들이 Punch Clock을 통해 입력한 실시간 가동 현황 로그 목록.
   * 현재 어떤 작업자가 어떤 프로젝트의 부재를 만들고 있는지 실시간 트래킹.
6. **Punch Clock / Punch User (`9.php`)**
   * 출근/퇴근(Clock In/Out) 및 특정 도면 작업 시작/일시정지/종료 입력 폼.
   * 관리자는 타 직원의 근태 대리 기록 및 잊은 퇴근 정보 수정 기능 제공.
7. **Performance (`17.php`)**
   * 작업자 실적 통계 화면.
   * 작업물 종류별 소요 시간 집계 및 Google Charts 기반 시인성 좋은 그래프 제공.
8. **Reminder (`15.php`)**
   * 공용 수송 차량의 정기 검사(WOF, REGO) 및 현장 직원의 안전 자격증(SiteSafe) 만료 안내 정보 알림판.
9. **My Account (`20.php`)**
   * 관리자 및 임직원의 개인 정보 설정 및 비밀번호 변경 관리 화면.
