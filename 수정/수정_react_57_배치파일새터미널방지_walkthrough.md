# 배치파일 새 터미널 기동 방지 결과서 (Walkthrough)

r.bat 실행 시 새로운 명령 프롬프트(CMD) 터미널 창들이 여러 개 뜨는 현상을 방지하고, 현재 열려 있는 터미널 창 내부에서 백그라운드로 실행되도록 보완을 완료하였습니다.

## 1. 수정 사항
- **r.bat 백그라운드 옵션 적용**:
  * [r.bat](file:///F:/pe/public_html/steelworks-manager-react/r.bat) 내의 API 백엔드와 프론트엔드 기동용 `start` 명령 구문에 `/b` 옵션을 추가하였습니다.
  * 백엔드: `start /b python run_api.py`
  * 프론트엔드: `start /b npm run dev`
  * 이를 통해 추가 터미널 창을 개설하지 않고 현재 열려 있는 하나의 터미널 공간에서 두 서버의 로그를 모아보고 제어할 수 있도록 최적화했습니다.

## 2. 작업 이력 파일 보관
- [수정_react_57_배치파일새터미널방지_plan.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_57_배치파일새터미널방지_plan.md) 및 [수정_react_57_배치파일새터미널방지_task.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_57_배치파일새터미널방지_task.md)를 '수정' 폴더에 생성 및 정리 완료하였습니다.
