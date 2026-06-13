# [수정 계획서] 직원 목록(Employees) 및 차량 상태(Vehicles) 마이그레이션

이 단계에서는 Next.js 프론트엔드(`fe`) 내부에 직원 관리(Employees) 화면과 차량 알림 플릿 관리(Vehicles) 화면을 구축합니다.

## 사용자 검토 필요 사항
- 직원 관리 기능은 권한이 Level 10(Supervisor) 이상인 사용자만 신규 등록, 정보 수정, 비활성화를 수행할 수 있도록 화면상의 분기 처리를 탑재합니다.
- 차량 함대 관리 기능은 WOF 및 REGO 만료일이 30일 이내이거나 이미 경과한 경우 대시보드 경고 표시를 활성화합니다.

## 해결안 및 변경 내용

### 1. API 연동 커스텀 훅 개발
#### [NEW] [useEmployees.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/hooks/useEmployees.js)
- 직원 목록 조회(활성/비활성 상태별 구분), 신규 직원 등록, 정보 수정, 비활성화(Deactivate), 비밀번호 랜덤 재생성 및 아바타 이미지 업로드 API를 관리하는 훅을 설계합니다.

#### [NEW] [useVehicles.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/hooks/useVehicles.js)
- 차량 목록 조회, 신규 차량 등록, 정보 수정, 삭제, 그리고 만료 체크(WOF/REGO Expiry-Check) 알림 데이터 조회를 지원하는 훅을 설계합니다.

### 2. 페이지 및 컴포넌트 마이그레이션
#### [NEW] [page.js (Employees)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/employees/page.js)
- 활성 직원 리스트를 권한레벨, 담당 용접 베이(Bay) 정보와 함께 바둑판 배열 카드 또는 테이블 형태로 출력합니다.
- 새로운 직원 등록 모달 및 정보 편집 모달을 제공합니다.
- 아바타 이미지 업로드용 인풋 영역을 구비하고, 랜덤 임시 비밀번호를 발급하는 트리거 버튼을 추가합니다.

#### [NEW] [page.js (Vehicles)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/vehicles/page.js)
- 등록된 회사 차량 목록(명칭, 번호판, WOF 만료일, REGO 만료일, 서비스 주기, RUC 잔여 등)을 테이블 뷰로 렌더링합니다.
- WOF/REGO 만료일 기준 30일 미만 남았을 경우 경고(경보 배지 및 붉은색 보더 라인)를 표시합니다.
- 신규 차량 등록 및 정보 업데이트, 삭제 모달을 제공합니다.

## 검증 계획

### 수동 검증
- `/dashboard/employees`에서 신규 직원을 가공 정보로 등록하고 정상 표시되는지 검증.
- 임의 직원의 아바타 사진을 업로드하고 아바타 영역에 정상 로드되는지 확인.
- `/dashboard/vehicles`에서 차량을 등록한 후, 만료일을 오늘 기준 10일 후로 수정하여 긴급 경고 배지가 화면에 출력되는지 확인.
- `npm run build`를 구동하여 빌드 타임 컴파일 오류 여부 최종 검수.
