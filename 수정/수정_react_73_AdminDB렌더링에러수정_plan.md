# Admin DB 렌더링 에러 해결 계획

## 사용자 검토 요구사항
- Admin DB 탭 클릭 시 `Objects are not valid as a React child` 및 React `key` 경고가 발생하던 버그 조치 확인.

## 제안된 변경 사항

### 프론트엔드 커스텀 훅 수정

#### [MODIFY] [useAdminDB.js](file:///F:/pe/public_html/steelworks-manager-react/fe/src/hooks/useAdminDB.js)
- `/api/admin/db_inspect/tables` 호출 후 받아오는 원본 데이터 배열(객체 리스트)을 `table_name` 문자열 배열로 매핑한 뒤 `tables` 상태값으로 바인딩하도록 수정합니다.
- 이를 통해 React 렌더링 엔진이 객체를 컴포넌트로 렌더링하여 발생시키던 에러 및 중복 키 경고를 해결합니다.

## 검증 계획
- Admin DB 진입 시 테이블 목록이 정상 렌더링되고, 데이터 조회 기능이 에러 없이 원활하게 연동되는지 검증합니다.
