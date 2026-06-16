# 포트 번호 동기화 및 r.bat 수정 계획

본 계획서는 run_api.py (포트 3700)와 fe/package.json (포트 3701)의 실제 기동 포트 정보를 r.bat 실행 배치파일에 반영하여 동기화하는 계획입니다.

## 사용자 검토 요구사항
- r.bat 내의 포트 정보 출력 및 설명이 백엔드 3700, 프론트엔드 3701로 올바르게 업데이트되었는지 확인.

## 오픈 질문
- 없음.

## 제안된 변경 사항

### r.bat 파일 수정

#### [MODIFY] [r.bat](file:///F:/pe/public_html/steelworks-manager-react/r.bat)
#### [NEW] [수정_react_56_포트번호동기화및r.bat수정_plan.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_56_포트번호동기화및r.bat수정_plan.md)
#### [NEW] [수정_react_56_포트번호동기화및r.bat수정_walkthrough.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_56_포트번호동기화및r.bat수정_walkthrough.md)

## 검증 계획

### 수동 검증
- r.bat 소스 코드를 조회하여 출력 메시지 및 포트 안내 문구가 3700 및 3701로 수정되었는지 확인.
