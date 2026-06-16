# 수정_react_105_잡부재상세체크진행화면_walkthrough

## 개요

레거시 앱의 `16.php` (Job Detail 조회), `34.php` (상태 업데이트), `39.php` (Tick All) 기능을 2번 앱에 구현.

## 구현 내용

### 1. 백엔드 - api_router.py

**신규 엔드포인트 1: 단일 부재 상태 토글**
```
PATCH /api/jobs/{job_number}/details/{detail_id}/status
Body: { "field": "design"|"made"|"loaded"|"on_site"|"temp_fix"|"chemset"|"tightened"|"finish", "value": 0|1 }
```
- ALLOWED_STATUS_FIELDS 집합으로 허용 필드 화이트리스트 검증
- FIELD_DATE_MAP으로 각 필드의 날짜 컬럼 자동 연결
- value=1 이면 해당 date_update 컬럼 오늘 날짜로 갱신, value=0 이면 NULL로 초기화

**신규 엔드포인트 2: 롯 단위 일괄 상태 변경**
```
PATCH /api/jobs/{job_number}/lots/{lot_number}/bulk-status
Body: { "field": "loaded"|"on_site"|"finish", "value": 1 }
```
- 해당 롯의 모든 tb_jobs_details 레코드 일괄 업데이트
- 업데이트된 건수를 응답으로 반환

### 2. 프론트엔드 - jobs/page.js

**추가된 상태값:**
- updatingFields: { "detailId_field": true } - 개별 필드 업데이트 중 상태 (로딩 애니메이션)
- bulkUpdating: { "lotNum_field": true } - 롯 일괄 업데이트 중 상태

**추가된 핸들러:**
- handleDetailStatusToggle(member, field, currentVal): 클릭 시 0->1 또는 1->0 토글 후 API 호출
- handleBulkLotStatus(lotNum, field, value): 롯 전체 일괄 변경 (confirm 확인 후 API 호출)
- getEditableFields(): 현재 로그인 사용자의 right_level 기준으로 편집 가능한 필드 집합 반환

**UI 변경:**
- 읽기 전용 span 배지 -> 클릭 가능한 button 토글 배지
- 완료(1) 상태: 초록빛 에메랄드 배지 + 체크(v) 표시
- 미완료(0) 상태: 회색 배지
- 업데이트 중: animate-pulse + '...' 텍스트
- 권한 없는 필드: cursor-not-allowed opacity-50
- 기존 5개(Design/Made/Loaded/On Site/Finish) -> 8개 (TmpFix/Chemset/Tightened 추가)

**LOT 헤더 우측에 관리자 전용 Tick All 버튼 추가:**
- Admin(right_level >= 10) 계정에서만 표시
- All Loaded, All On Site, All Finish 버튼 3개

## 권한 설계

| 단계 | 허용 right_level |
|------|----------------|
| design | 4, 6, 68, 9, >=10 |
| made, loaded | 1, 6, 68, 9, >=10 |
| on_site, temp_fix, chemset, tightened | 2, 8, 12, 6, 68, 9, >=10 |
| finish | 6, 68, 9, >=10 |

## 빌드 결과

18/18 페이지 정상 빌드 완료, /dashboard/jobs 포함, 오류 없음

## 수정된 파일

- core/api_router.py: PATCH 엔드포인트 2개 추가 (L427~L518)
- fe/src/app/dashboard/jobs/page.js: 토글 배지 + 핸들러 + Tick All 버튼
