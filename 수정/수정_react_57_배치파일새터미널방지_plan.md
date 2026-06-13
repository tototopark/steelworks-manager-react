# 배치파일 새 터미널 기동 방지 계획

본 계획서는 r.bat 실행 시 별도의 터미널 창이 새로 열리지 않고, 현재 기동된 터미널 창 내에서 백그라운드(/b 옵션)로 API 백엔드와 프론트엔드가 동시에 실행되도록 수정하는 계획입니다.

## 사용자 검토 요구사항
- r.bat 명령어에서 start 명령에 /b 옵션이 적용되어 추가 터미널 창이 생성되지 않는지 확인.

## 오픈 질문
- 없음.

## 제안된 변경 사항

### r.bat 파일 수정

#### [MODIFY] [r.bat](file:///F:/pe/public_html/steelworks-manager-react/r.bat)
#### [NEW] [수정_react_57_배치파일새터미널방지_plan.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_57_배치파일새터미널방지_plan.md)
#### [NEW] [수정_react_57_배치파일새터미널방지_walkthrough.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_57_배치파일새터미널방지_walkthrough.md)

## 검증 계획

### 수동 검증
- r.bat 소스 코드를 조회하여 start 명령어에 /b 옵션이 안전하게 적용되었는지 검증.
