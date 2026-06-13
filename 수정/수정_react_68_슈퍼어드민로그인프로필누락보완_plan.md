# 슈퍼 어드민 로그인 프로필 누락 보완 계획

본 계획서는 Super Admin Fallback(데이터베이스 우회 로그인) 시 로그인 성공 응답에 user 객체(성명 및 ID 정보)가 누락되어 프론트엔드 화면에 'user (user)'로 렌더링되던 문제를 조치하기 위해, 백엔드 로그인 성공 반환값에 명시적으로 user 상세 메타데이터를 추가하는 계획입니다.

## 사용자 검토 요구사항
- Super Admin Fallback 성공 응답에 firstname: 'System', surname: 'Admin' 및 login 정보가 추가되었는지 확인.

## 오픈 질문
- 없음.

## 제안된 변경 사항

### 백엔드 로그인 응답 수정

#### [MODIFY] [api_router.py](file:///F:/pe/public_html/steelworks-manager-react/core/api_router.py)
#### [NEW] [수정_react_68_슈퍼어드민로그인프로필누락보완_plan.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_68_슈퍼어드민로그인프로필누락보완_plan.md)
#### [NEW] [수정_react_68_슈퍼어드민로그인프로필누락보완_walkthrough.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_68_슈퍼어드민로그인프로필누락보완_walkthrough.md)

## 검증 계획

### 수동 검증
- admin 계정으로 재로그인한 뒤 대시보드 화면에 'System Admin (admin)'으로 성명이 완벽히 노출되는지 확인.
