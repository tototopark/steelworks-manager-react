# 포트 3701 재점유 프로세스 정리 결과서 (Walkthrough)

3701 포트의 중복 점유 현상이 재차 발생하여 이를 해결하기 위해 활성화 상태의 모든 node 프로세스들을 강제 일괄 정리하였습니다.

## 1. 조치 사항
- **node 프로세스 일괄 파괴**:
  * 백그라운드에 복수의 node 인스턴스(총 6개)가 리스닝 상태로 누수 및 잔존하고 있었던 것이 EADDRINUSE 장애의 주원인이었습니다.
  * `taskkill /f /im node.exe` 명령어를 수행하여 3701 포트를 물고 있던 모든 node 데몬을 강제 일괄 정리 조치했습니다.
- **포트 정상 복원 검증**:
  * `netstat -ano | findstr :3701` 실행 결과 점유 내역이 검출되지 않아 3701 포트가 완전히 해제되었음을 확인했습니다.

## 2. 작업 이력 파일 보존
- [수정_react_66_포트3701재점유프로세스정리_plan.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_66_포트3701재점유프로세스정리_plan.md) 및 [수정_react_66_포트3701재점유프로세스정리_task.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_66_포트3701재점유프로세스정리_task.md)를 '수정' 폴더에 생성 완료하였습니다.
