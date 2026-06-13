# 개발자 퀵필 DB 연동 및 원본 패스워드 직접 노출 계획

사용자의 명확한 의도에 맞추어, 어떠한 임의의 필터링(마스킹 혹은 Changed로 숨김 처리 등)을 하지 않고 **데이터베이스에 저장되어 있는 비밀번호 해시/텍스트 실데이터 값을 퀵필 영역에 있는 그대로 노출**하며, 클릭 시 비밀번호 필드에 그대로 입력되도록 수정하는 계획입니다.

## 사용자 검토 요구사항
- Developer Account Quick-Fill 컴포넌트가 마스킹(Changed 등) 없이 DB 원본 패스워드 값 그대로를 출력 및 바인딩하는지 확인.
- 클릭 시 로그인 입력 필드에 자동으로 실데이터가 고스란히 들어가는지 확인.

## 제안된 변경 사항

### 프론트엔드 로그인 페이지 수정

#### [MODIFY] [page.js](file:///F:/pe/public_html/steelworks-manager-react/fe/src/app/login/page.js)
- `employees.map` 돌면서 DB의 `password`를 그대로 가져옵니다.
- `Changed` 대신 실제 DB에서 조회된 해시 텍스트값 그대로를 리스트 우측에 렌더링하고, 클릭 시 `handleQuickFill`에 실제 값을 전달하여 로그인 폼에 입력시킵니다.
