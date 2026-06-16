# [수정 계획서] 데이터베이스 어드민 관리(Admin DB) 마이그레이션

이 단계에서는 Next.js 프론트엔드(`fe`) 내부에 데이터베이스 상태 관리 및 정밀 조회/점검이 가능한 어드민 전용 데이터베이스 콘솔(Admin DB) 화면을 구축합니다.

## 사용자 검토 필요 사항
- 이 화면은 최상위 관리자 권한(Level 99) 보유 유저만 접속할 수 있도록 라우팅 가드가 적용되며, 잘못된 접근 시 경고 메시지를 보여줍니다.
- 데이터베이스 청소(Factory Reset), DB 초기 셋업(Seed), 레거시 마이그레이션 등 데이터 변경 영향도가 높은 파괴적/코어 작업에 대한 2차 확인 모달이 포함됩니다.

## 해결안 및 변경 내용

### 1. API 연동 커스텀 훅 개발
#### [NEW] [useAdminDB.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/hooks/useAdminDB.js)
- 테이블 목록 조회(`/api/admin/db_inspect/tables`), 특정 테이블 레코드 정밀 조회(페이징, 정렬 포함), DB 무결성 검사(Integrity Check), 데이터 시딩(Seed), 초기화(Clean Data), 레거시 데이터 마이그레이션(Migrate Legacy) API 호출 상태를 관리합니다.

### 2. 페이지 및 컴포넌트 마이그레이션
#### [NEW] [page.js (Admin DB)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/admin-db/page.js)
- 어드민 데이터베이스 콘솔 메인 화면을 설계합니다.
- **좌측 패널**: 시스템에 검증된 SQLite 테이블 목록을 출력합니다. 클릭 시 우측의 데이터 뷰어가 갱신됩니다.
- **우측 패널**: 선택된 테이블의 실제 행(Row) 데이터를 페이징 처리하여 표(Table) 형태로 렌더링합니다.
- **상단 도구 상자**: 무결성 검사, 시드 데이터 적재, DB 초기화, 패스워드 전체 일괄 리셋, 레거시 이식 작업을 실행할 수 있는 컨트롤 버튼 그룹을 배치합니다.

## 검증 계획

### 수동 검증
- Level 99(Super Admin) 계정(`admin`)으로 로그인한 후 `/dashboard/admin-db` 진입 성공 여부 및 테이블 목록이 올바르게 로드되는지 확인.
- 임의 테이블(예: `tb_login`) 클릭 시 우측 그리드에 페이징을 수반한 실제 정보가 정상 출력되는지 확인.
- `DB Integrity Check` 실행 시 정상 검증 메시지가 뜨는지 확인.
- `npm run build`를 구동하여 컴파일 이상 유무 정밀 분석.
