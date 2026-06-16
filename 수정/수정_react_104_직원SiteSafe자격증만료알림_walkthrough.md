# 수정_react_104 - 직원 SiteSafe 자격증 만료 알림 위젯 구현 완료 보고

## 1. 작업 개요

레거시 1번 앱의 `staff_reminder.html`에 해당하는 직원 안전 자격증(SiteSafe) 만료 알림 기능을
2번 앱(steelworks-manager-react)에 완전히 이식 및 구현 완료하였습니다.

- **구현 범위**: 백엔드 API, 프론트엔드 훅, 직원 페이지 인라인 경고판, 메인 대시보드 위젯
- **접근 권한**: 관리자(right_level >= 10) 전용 기능
- **조건**: sitesafe_expiry 컬럼 기준, 오늘부터 30일 이내 만료 예정 또는 이미 만료된 직원

---

## 2. 변경 파일 목록

### 백엔드
- `core/api_router.py`
  - `GET /api/reminders/staff/expiry-check` 엔드포인트 신설
  - sitesafe_expiry 기준으로 만료(expired) / 만료 예정(expiring_soon) 분류 반환

### 프론트엔드 (신규 파일)
- `fe/src/hooks/useStaffReminders.js`
  - staffAlerts 상태 관리 훅
  - fetchStaffExpiryAlerts() 콜백 함수 제공

### 프론트엔드 (수정 파일)
- `fe/src/app/dashboard/employees/page.js`
  - 페이지 상단에 SiteSafe 만료 경고 배너 인라인 삽입
- `fe/src/app/dashboard/page.js`
  - useStaffReminders 훅 연동
  - isAdmin 체크 후 staffAlerts 위젯 렌더링 (에러 배너 바로 아래 위치)

### 문서
- `수정/_수정_react_46_1번과2번앱메뉴비교표.md`
  - Reminder 섹션 상태를 "일부 구현" 에서 "최종 완료" 로 업데이트

---

## 3. 구현 세부 사항

### 3-1. 백엔드 API - `/api/reminders/staff/expiry-check`

```
GET /api/reminders/staff/expiry-check
Authorization: JWT (right_level >= 10)
Response:
{
  "status": "success",
  "data": [
    {
      "id": 5,
      "name": "John Smith",
      "role": "Fabricator",
      "sitesafe_expiry": "2026-06-20",
      "status": "expiring_soon"   // 또는 "expired"
    }
  ]
}
```

### 3-2. 프론트엔드 훅 - `useStaffReminders.js`

- useCallback으로 fetchStaffExpiryAlerts 메모이제이션
- loading / error / staffAlerts 3가지 상태 반환

### 3-3. 대시보드 메인 위젯 - `page.js`

- isAdmin 조건(right_level >= 10) 체크 후에만 렌더링
- useEffect로 로그인 즉시 자동 API 호출
- staffAlerts.length > 0 일 때만 amber 색상 배너 노출
- expired 상태: 빨간 배지 / expiring_soon 상태: 주황 배지

---

## 4. 빌드 검증

```
npm run build (Next.js 16.2.9 Turbopack)

Compiled successfully in 3.4s
18/18 static pages generated

All routes OK:
  /dashboard          - 대시보드 메인 (Staff Reminders 위젯 포함)
  /dashboard/employees - 직원 관리 (인라인 경고 배너 포함)
  /dashboard/holidays  - 공휴일 관리 (이전 세션 구현)
  /dashboard/activity  - 실시간 가동 로그 (이전 세션 구현)
```

---

## 5. 완료 현황 정리

| 기능 | 상태 |
|------|------|
| 백엔드 GET /api/reminders/staff/expiry-check | 완료 |
| useStaffReminders.js 훅 | 완료 |
| employees/page.js 인라인 경고 배너 | 완료 |
| dashboard/page.js 메인 위젯 통합 | 완료 |
| 빌드 검증 (npm run build) | 완료 |
| 비교 문서(_수정_react_46) 업데이트 | 완료 |
