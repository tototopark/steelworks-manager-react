# 사용자 프로필 동기화 및 힌트 컴포넌트 분석 계획

본 계획서는 로그인 시 백엔드 DB에서 사용자의 실제 성명(firstname, surname)을 정상적으로 쿼리하여 반환하고, 프론트엔드가 이를 로그인 정보로 저장하도록 보완하여 이름이 명확히 나오게 조치하며, 매 페이지 하단에 배치된 개발자 힌트 컴포넌트의 위치를 분석하여 전달하는 계획입니다.

## 사용자 검토 요구사항
- Welcome back 문구에 DB 내 실제 사용자 이름과 로그인 ID가 성공적으로 매핑되어 나타나는 구조 확인.
- DevHints가 Dashboard Layout을 통해 자동으로 연결 표시되는 위치 및 동작 파악.

## 오픈 질문
- 없음.

## 제안된 변경 사항

### 백엔드 로그인 로직 보완

#### [MODIFY] [api_router.py](file:///F:/pe/public_html/steelworks-manager-react/core/api_router.py)
#### [NEW] [수정_react_61_사용자프로필동기화및힌트컴포넌트분석_plan.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_61_사용자프로필동기화및힌트컴포넌트분석_plan.md)
#### [NEW] [수정_react_61_사용자프로필동기화및힌트컴포넌트분석_walkthrough.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_61_사용자프로필동기화및힌트컴포넌트분석_walkthrough.md)

## 검증 계획

### 수동 검증
- DB 내에 성명이 설정된 일반 직원 계정으로 로그인 시 Welcome back 헤더 및 사이드바에 이름이 정확히 노출되는지 확인.
