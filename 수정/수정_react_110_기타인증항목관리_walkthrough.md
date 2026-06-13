# 수정_react_110 - 기타 인증 항목 관리 (Other Reminders) 구현 결과서

## 작업 개요

레거시 앱(`sitepro`)의 `23.php`(ADD), `24.php`(UPDATE), `25.php`(DELETE) 기능을 2번 앱(steelworks-manager-react)에 구현했습니다.
WOF/REGO/SiteSafe 외 기타 인증 항목(`tb_reminder_other`)의 만료일 추가/수정/삭제 및 30일 이내 만료 경고 시스템을 완성했습니다.

---

## 구현 파일 목록

| 파일 | 역할 | 작업 종류 |
|------|------|----------|
| `core/api_router.py` | Other Reminders CRUD + expiry-check API 5종 추가 | 수정 |
| `fe/src/hooks/useOtherReminders.js` | 커스텀 훅 (API 호출, 상태 관리, CRUD 함수) | 신규 |
| `fe/src/app/dashboard/vehicles/page.js` | Other Certifications 섹션 및 모달 UI 추가 | 수정 |
| `수정/_수정_react_46_1번과2번앱메뉴비교표.md` | 섹션 15 추가 및 상태 업데이트 | 수정 |

---

## 백엔드 변경 사항 (api_router.py)

### 신규 Pydantic 스키마
```python
class OtherReminderCreate(BaseModel):
    name: str
    comment: Optional[str] = None
    expiry_date: Optional[str] = None  # YYYY-MM-DD

class OtherReminderUpdate(BaseModel):
    name: str
    comment: Optional[str] = None
    expiry_date: Optional[str] = None
```

### 신규 API 엔드포인트 5종

| Method | Endpoint | 기능 |
|--------|----------|------|
| GET | `/api/reminders/others` | 전체 목록 조회 (expiry_date ASC 정렬) |
| POST | `/api/reminders/others` | 신규 항목 추가 |
| PUT | `/api/reminders/others/{id}` | 항목 수정 |
| DELETE | `/api/reminders/others/{id}` | 항목 삭제 |
| GET | `/api/reminders/others/expiry-check` | 30일 이내 만료/이미 만료 항목 반환 |

### expiry-check 로직
- 오늘 날짜 기준 `expiry_date <= (today + 30days)` 조건으로 필터
- `expired`: expiry_date < today
- `expiring_soon`: today <= expiry_date <= today + 30days

---

## 프론트엔드 변경 사항

### useOtherReminders.js (신규)
- `fetchReminders()`: 전체 목록 로드
- `fetchExpiryAlerts()`: 만료 경고 목록 로드
- `createReminder(name, comment, expiry_date)`: 항목 생성
- `updateReminder(id, name, comment, expiry_date)`: 항목 수정
- `deleteReminder(id)`: 항목 삭제
- vehicles 훅과 동일한 패턴 구조 유지

### vehicles/page.js (수정)

#### 추가된 상태 변수
- `otherReminders`, `otherAlerts`, `otherLoading` (훅에서 파생)
- `isOtherNewOpen`, `isOtherEditOpen`, `editingOther` (모달 상태)
- `otherFormData`, `otherModalError` (폼 상태)

#### 추가된 핸들러
- `handleOtherCreate()`: 신규 항목 생성 및 목록 갱신
- `handleOtherOpenEdit(r)`: 편집 모달 오픈 및 폼 초기화
- `handleOtherUpdate()`: 수정 API 호출 및 목록 갱신
- `handleOtherDelete(id, name)`: confirm 후 삭제
- `getExpiryBadgeClass(status)`: 만료 상태에 따른 Tailwind 클래스 반환

#### UI 구성 (Vehicles 페이지 하단)
1. **섹션 헤더**: `ShieldCheck` 인디고 아이콘 + "Other Certifications & Reminders" 타이틀 + Add Item 버튼
2. **경고 배너** (조건부): `otherAlerts.length > 0` 시 오렌지 계열 카드 배너 렌더링
3. **목록 테이블**: Name / Comment / Expiry Date / Status / Actions(Edit+Delete) 컬럼
4. **상태 뱃지**: Valid(초록) / Expiring Soon(주황) / Expired(빨강) / No Date(회색)
5. **Add 모달**: 인디고 테마, Name(필수) / Comment / Expiry Date 필드
6. **Edit 모달**: 동일 구성, 기존 값 미리 채움

---

## 빌드 검증

```
npm run build
> Next.js 16.2.9 (Turbopack)
> Compiled successfully in 3.5s
> 18/18 static pages generated
```

오류 없이 빌드 성공 확인.

---

## 레거시 매핑 요약

| 레거시 파일 | 기능 | 2번 앱 구현 |
|------------|------|------------|
| `23.php` | INSERT INTO tb_reminder_other | POST /api/reminders/others |
| `24.php` | UPDATE tb_reminder_other | PUT /api/reminders/others/{id} |
| `25.php` | UPDATE/DELETE tb_reminder_other | DELETE /api/reminders/others/{id} |
| `15.php` (일부) | 기타 알림 조회 | GET /api/reminders/others + expiry-check |

---

## 다음 작업 (미구현 기능)

| # | 기능명 | 우선순위 |
|---|--------|---------|
| 7 | 롯 단위 일괄 상태 변경 Tick All (`39.php`) | 중간 |
| 8 | 이메일 자동 발송 Job 완료 알림 (`72.php`) | 낮음 |
| 9 | 타임카드 집계 보고서 (`42.php`) | 낮음 |
| 10 | WIP 검수 항목 리셋 (`41.php`) | 낮음 |
