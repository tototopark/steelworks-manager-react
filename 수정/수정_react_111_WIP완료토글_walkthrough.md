# 수정_react_111 - WIP 검수 완료 토글 (41.php) 구현 결과서

## 작업 개요

레거시 앱의 `41.php`(WIP Inspection Complete Toggle) 기능을 2번 앱에 구현했습니다.
`tb_jobs.WIP_Completed` 필드를 0↔1로 토글하는 기능으로, QA WIP 페이지의 잡 선택 시 헤더에
**"Mark WIP Complete" / "Reset WIP"** 버튼을 통해 검수 완료 상태를 관리합니다.

---

## 구현 파일 목록

| 파일 | 역할 | 작업 종류 |
|------|------|----------|
| `core/api_router.py` | WIP Complete 상태 조회 + 토글 API 2종 추가 | 수정 |
| `fe/src/hooks/useQA.js` | fetchWIPCompleteStatus, toggleWIPComplete 함수 추가 | 수정 |
| `fe/src/app/dashboard/qa-wip/page.js` | WIP Complete 상태 상태 관리 및 토글 버튼 UI 추가 | 수정 |

---

## 백엔드 변경 사항 (api_router.py)

### 신규 API 엔드포인트 2종

| Method | Endpoint | 기능 |
|--------|----------|------|
| GET | `/api/qa/wip-complete/{job_number}` | 특정 잡의 WIP_Completed, WIP_Completed_Date 조회 |
| POST | `/api/qa/wip-complete/{job_number}/toggle` | WIP 완료 상태 토글 (0→1 또는 1→0) |

### 토글 로직
- **0 → 1**: `WIP_Completed = 1`, `WIP_Completed_Date = 오늘 날짜`
- **1 → 0**: `WIP_Completed = 0`, `WIP_Completed_Date = NULL`
- 레거시 `41.php` 로직 (현재값 체크 → 반대로 업데이트) 완전 동일

---

## 프론트엔드 변경 사항

### useQA.js 추가 함수
- `fetchWIPCompleteStatus(jobNumber)`: GET API 호출, `{wip_completed, wip_completed_date}` 반환
- `toggleWIPComplete(jobNumber)`: POST toggle API 호출, `{new_state, wip_completed_date}` 반환

### qa-wip/page.js 변경 사항

#### 추가된 상태 변수
- `wipCompleted`: WIP_Completed 현재 값 (null | 0 | 1)
- `wipCompletedDate`: WIP_Completed_Date 날짜 문자열
- `togglingWip`: 토글 요청 중 로딩 상태

#### handleSelectJob 수정
- 잡 선택 시 `fetchWIPCompleteStatus()` 자동 호출로 WIP 상태 초기화

#### handleToggleWIPComplete 추가
- confirm() 확인 후 토글 API 호출
- 성공 시 로컬 상태(`wipCompleted`, `wipCompletedDate`) 즉시 업데이트
- `fetchQAJobs()` 재호출로 좌측 잡 목록 갱신

#### UI 버튼 (QA 헤더 영역)
- **WIP_Completed = 0 (미완)**: 초록 계열 "Mark WIP Complete" 버튼 (ShieldCheck 아이콘)
- **WIP_Completed = 1 (완료)**: 주황 계열 "Reset WIP" 버튼 (RotateCcw 아이콘)
- `disabled={togglingWip}`으로 중복 클릭 방지
- title 속성에 완료일 정보 표시

---

## 빌드 검증

```
npm run build
> Compiled successfully in ~3.5s
> 18/18 static pages generated
```

오류 없이 빌드 성공.

---

## 레거시 매핑 요약

| 레거시 파일 | 기능 | 2번 앱 구현 |
|------------|------|------------|
| `41.php` | WIP_Completed 0/1 토글 + 완료일 저장 | `POST /api/qa/wip-complete/{job_number}/toggle` + QA WIP 페이지 버튼 |

---

## 다음 작업 (미구현 기능)

| # | 기능명 | 파일 | 우선순위 |
|---|--------|------|---------|
| 8 | 이메일 자동 발송 Job 완료 알림 | `72.php` | 낮음 |
| 9 | 생산 부하 계획 (Workload Plan) | `42.php` | 낮음 |
