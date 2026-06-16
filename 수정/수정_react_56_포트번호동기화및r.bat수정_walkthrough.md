# 포트 번호 동기화 및 r.bat 수정 결과서 (Walkthrough)

FastAPI 백엔드 서버가 실제 점유하는 포트(3700)와 Next.js 프론트엔드 개발 서버가 기동하는 포트(3701)를 확인하고, 이를 일괄 구동 배치파일(r.bat)에 동기화 완료하였습니다.

## 1. 수정 사항
- **r.bat 포트 정보 수정**:
  * [r.bat](file:///F:/pe/public_html/steelworks-manager-react/r.bat) 내의 백엔드 실행 로그 메시지 및 URL 안내의 포트 번호를 3600에서 **3700**으로 변경하였습니다.
  * Next.js 프론트엔드 기동 로그 메시지 및 URL 안내의 포트 번호를 3001에서 **3701**로 변경하였습니다.
- **포트 정보 유효성 검증**:
  * `run_api.py` 내의 uvicorn 포트 세팅이 3700번으로 지정되어 있음을 확인하였습니다.
  * `fe/package.json` 내의 Next.js 스크립트(`dev`, `start`)가 3701번 포트로 지정되어 있음을 확인하였습니다.

## 2. 작업 이력 파일 보관
- [수정_react_56_포트번호동기화및r.bat수정_plan.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_56_포트번호동기화및r.bat수정_plan.md) 및 [수정_react_56_포트번호동기화및r.bat수정_task.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_56_포트번호동기화및r.bat수정_task.md)를 '수정' 폴더에 생성 및 정리 완료하였습니다.
