# [수정 계획서] 로그인 패스워드 보기 버튼 추가 및 개발용 계정 퀵필 리스트 표시

테스트 및 개발 편의성을 향상시키기 위해 로그인 화면에 패스워드 보기(토글) 버튼을 추가하고, `SHOW_DEV_HINTS` 및 `AUTO_FILL_ENABLED` 옵션에 따라 활성 계정 목록을 표시하고 자동 입력할 수 있는 퀵필 기능을 제공합니다.

## 사용자 검토 필요 사항
- `SHOW_DEV_HINTS` 옵션이 True일 때 로그인 화면 하단에 계정 목록이 표시됩니다.
- `AUTO_FILL_ENABLED` 옵션이 True일 때 목록 클릭 시 자동으로 입력 필드에 대입되며, 최초 로드 시 admin 계정이 자동으로 선입력됩니다.

## 해결안 및 변경 내용

### 1. 프론트엔드 로그인 페이지 수정
#### [MODIFY] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/login/page.js)
- 패스워드 입력란 우측에 `lucide-react` 아이콘(`Eye`, `EyeOff`)을 활용한 비밀번호 보기 토글 버튼을 추가합니다.
- 컴포넌트 마운트 시 `/api/config/dev_features` 및 `/api/employees`를 호출하여 개발 플래그와 직원 목록 데이터를 로드합니다.
- `SHOW_DEV_HINTS`가 활성화된 경우 하단에 계정 리스트를 렌더링합니다.
- `AUTO_FILL_ENABLED`가 활성화된 경우 최초 로드 시 기본 계정(admin) 정보를 채워 넣고, 계정 목록 클릭 시 입력란에 자동 적용되는 기능을 제공합니다.

## 검증 계획

### 수동 검증
- 로그인 화면 진입 시 패스워드 입력란의 눈 모양 아이콘을 클릭하여 비밀번호 마스킹 해제가 정상 작동하는지 확인.
- `SHOW_DEV_HINTS = True` 상태에서 하단에 Super Admin 및 활성 직원 목록이 정상 노출되는지 확인.
- 목록의 항목 클릭 시 아이디와 패스워드가 입력칸에 정상 적용되는지 확인.
- `npm run build`를 수행하여 빌드 오류 여부 검증.
