# 포트 충돌 프로세스 종료 결과서 (Walkthrough)

Next.js 웹서버 기동 시 포트 3701 점유로 인해 발생한 'EADDRINUSE' 충돌 현상을 분석하고 조치 완료하였습니다.

## 1. 조치 사항
- **중복 점유 PID 검색**:
  * `netstat -ano | findstr :3701` 명령을 통해 포트 3701을 listening 상태로 점유 중이던 프로세스 ID(PID: **18680**)를 확인하였습니다.
- **프로세스 강제 종료**:
  * `taskkill /f /pid 18680` 명령어를 통해 해당 프로세스를 강제 종료하였습니다.
- **종료 유효성 검증**:
  * 다시 `netstat -ano | findstr :3701` 검색을 시도하여 아무런 점유 내역이 반환되지 않음을 확인하고 정상 복구되었음을 확인했습니다.

## 2. 작업 이력 파일 보관
- [수정_react_64_포트충돌프로세스종료_plan.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_64_포트충돌프로세스종료_plan.md) 및 [수정_react_64_포트충돌프로세스종료_task.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_64_포트충돌프로세스종료_task.md)를 '수정' 폴더에 생성 완료하였습니다.
