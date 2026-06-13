# 수정_react_112 - 생산 부하 계획 Workload Plan (42.php) 구현 결과서

## 작업 개요

레거시 앱의 `42.php`(Workload Plan - 생산 부하 계획 시뮬레이터)를 2번 앱에 구현했습니다.
30일 달력 그리드 위에 잔여 제작 공수(quoted_fab_hours)를 직원별·일자별로 배분하여
빨강/노랑/초록/회색으로 색상 코딩하는 생산 부하 예측 화면입니다.

---

## 구현 파일 목록

| 파일 | 역할 | 작업 종류 |
|------|------|----------|
| `core/api_router.py` | `/api/workload/plan` GET 엔드포인트 추가 | 수정 |
| `fe/src/app/dashboard/workload/page.js` | Workload Plan 페이지 신규 생성 | 신규 |
| `fe/src/components/common/Sidebar.js` | "Workload" 메뉴 항목 추가 (minRight=5) | 수정 |

---

## 백엔드 변경 사항 (api_router.py)

### 신규 API: GET `/api/workload/plan`

**Query Parameters:**
- `hours_per_day` (float, 기본 8.0): 직원 1인당 일일 근무 시간
- `nb_fabricators` (int, 기본 5): 정적 fabricator 수 (출근 직원 없을 때 사용)

**응답 구조:**
```json
{
  "status": "success",
  "today": "2026-06-14",
  "hours_per_day": 8.0,
  "nb_fabricators": 5,
  "fab_hours_detailed": 240.5,       // 도면 승인 완료 & 미제작 공수
  "fab_hours_all": 380.0,            // 미제작 전체 공수
  "member_counts_detailed": { "portal": 3, "beam": 5, "column": 2, "other": 1 },
  "member_counts_all": { "portal": 5, "beam": 8, "column": 4, "other": 3 },
  "calendar": [                       // 30일 달력 배열
    { "date": "2026-06-14", "day_name": "S", "day_number": 14, "is_working": true, ... }
  ],
  "employees": [                      // 오늘 출근한 직원 + 30일 가용성 배열
    { "id": 1, "name": "John Smith", "availability": [true, true, false, ...] }
  ],
  "employee_count": 3
}
```

**데이터 집계 로직 (legacy 42.php 동일):**
- `tb_jobs`에서 QUOTE 제외 잡 목록 조회
- `tb_jobs_details WHERE design=1 AND made=0`: 도면 승인 완료 & 미제작 공수 합계
- `tb_jobs_details WHERE made=0`: 전체 미제작 공수 합계
- `tb_public_holidays`: 공휴일 여부 확인
- `tb_punchsheet`: 오늘 출근 직원 확인 (마지막 레코드가 CLOCK OUT이 아닌 경우)
- `tb_leaves`: 직원별 연차 확인 (30일 가용성 배열 생성)

---

## 프론트엔드 구현

### workload/page.js

#### 컨트롤 패널
- **Hours per day** 선택 드롭다운: 8.0 ~ 12.0 (0.5 단위)
- **Fabricators** 선택 드롭다운: 1 ~ 8
- 선택 변경 시 API 자동 재호출

#### 통계 카드 2종
1. **Drawings Approved - Not Yet Fabricated**: `fab_hours_detailed` + 부재 타입별 수량
2. **All Jobs - Drawings Not Made or Not Approved**: `fab_hours_all` + 부재 타입별 수량

#### 컬러 범례
| 색상 | 의미 |
|------|------|
| 빨강 | 바쁜 날 (전체 공수 소비) |
| 노랑 | 마지막 제작 완료 날 (부분 소비) |
| 초록 | 여유 있는 날 |
| 회색 | 주말 / 공휴일 / 연차 |

#### 그리드 테이블 2개
1. **Forecast Grid - Drawings Approved**: `fab_hours_detailed` 기준 30일 배분
2. **Forecast Grid - All Jobs**: `fab_hours_all` 기준 30일 배분

#### 그리드 계산 로직
- **실제 출근 직원 있는 경우**: 직원별 `availability` 배열 기반, 날짜별 출근 인원 수로 공수 나눔
- **출근 직원 없는 경우**: 정적 `nb_fabricators` 수 기반 계산

#### WorkloadGrid 컴포넌트
- sticky 첫 열(직원명)으로 가로 스크롤 시에도 이름 고정
- `min-w-max`로 30일 전체 열 표시
- 셀 내 시간 수 표시 (노랑 셀에만)

### Sidebar.js 변경
- `TrendingUp` 아이콘으로 "Workload" 메뉴 추가
- Performance (minRight=5) 바로 아래 배치
- Admin DB 위 위치

---

## 레거시 매핑 요약

| 레거시 기능 | 2번 앱 구현 |
|-----------|------------|
| 시간/인원 드롭다운 선택 | `hours_per_day`, `nb_fabricators` select 컨트롤 |
| 도면 승인 완료 공수 집계 | `fab_hours_detailed` (design=1, made=0) |
| 전체 미제작 공수 집계 | `fab_hours_all` (made=0) |
| 오늘 출근 직원 기반 그리드 | `employees.availability[]` 배열 기반 |
| 정적 fabricator 수 기반 그리드 | `employee_count === 0` 시 fallback |
| 공휴일/연차 회색 처리 | `is_public_holiday()` + `is_on_leave()` |
| 30일 컬러 그리드 | Red/Yellow/Green/Grey 색상 코딩 |

---

## 빌드 검증

```
npm run build
> Compiled successfully in ~3.0s
> 19/19 static pages generated (추가: /dashboard/workload)
```

오류 없이 빌드 성공.
