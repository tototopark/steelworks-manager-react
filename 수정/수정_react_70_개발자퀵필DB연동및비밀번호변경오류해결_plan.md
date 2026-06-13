# 개발자 퀵필 DB 연동 및 로그인 버그 해결 계획

## 사용자 검토 요구사항
- Developer Account Quick-Fill 컴포넌트가 더 이상 패스워드를 '12345678'로 하드코딩하지 않고, 실제 DB 데이터에 맞추어 기본값 여부('12345678' vs 'Changed')를 판단 및 출력하도록 동적 연결 확인.
- 비밀번호 변경 후에도 정상 로그인 동작 및 데이터 검증 확인.

## 제안된 변경 사항

### API 엔드포인트 수정

#### [MODIFY] [api_router.py](file:///F:/pe/public_html/steelworks-manager-react/core/api_router.py)
- `/api/employees` 조회 쿼리에 `password` 컬럼을 포함시켜 프론트엔드 로그인 페이지의 Quick-Fill 단에서 실시간 비교가 가능하도록 보완합니다.

### 프론트엔드 로그인 화면 수정

#### [MODIFY] [page.js](file:///F:/pe/public_html/steelworks-manager-react/fe/src/app/login/page.js)
- 각 사원의 DB 저장 패스워드 해시를 기본 해시값(`$2b$12$Juv...`) 또는 평문 `'12345678'`과 비교합니다.
- 기본값인 경우에는 `'12345678'`을 화면에 띄우고 클릭 시 자동 완성하도록 유지하며, 변경된 계정의 경우 `'Changed'`로 표시하고 클릭 시 패스워드 입력란을 비워 직접 수동 입력하도록 유도하여 사용자가 인지할 수 있도록 개선합니다.

## 검증 계획
- `Aaron` 계정으로 로그인 시도 -> 초기 비밀번호 `12345678` 감지되어 강제 비밀번호 변경 창 출력 -> 신규 비밀번호 변경 및 자동 대시보드 리다이렉트 성공 여부 확인.
- 로그아웃 후 다시 로그인 페이지로 와서 Developer Account Quick-Fill의 `Aaron` 계정이 `'Changed'` 상태로 표시되고, 클릭 시 이전과 달리 패스워드가 빈칸으로 남아 변경된 비밀번호로 정상 로그인을 유도하는지 확인.
