# 배치파일 자동 포트 해제 기능 추가 결과서 (Walkthrough)

서버 재기동 시 발생하는 포트 점유 충돌 문제를 해결하기 위해, r.bat 실행 시 기존 사용 포트들을 감지하여 자동으로 리셋하는 스마트 포트 해제 로직을 추가했습니다.

## 1. 구현 및 조치 사항
- **자동 포트 리셋 로직 적용 (`r.bat`)**:
  * `r.bat` 파일 맨 위에 포트 3700(백엔드) 및 3701(프론트엔드)을 물고 있는 프로세스 ID(PID)를 자동으로 검색(netstat)하여 강제 종료(taskkill)시키는 Batch shell loop 구문을 설계 및 삽입하였습니다.
  * 이를 통해 더 이상 포트 충돌 수동 조치 없이 `r.bat`를 반복 실행하는 것만으로 기존 찌꺼기 프로세스들이 자동 청소되고 새 서버 인스턴스가 문제없이 띄워집니다.

## 2. 작업 이력 파일 보존
- [수정_react_67_배치파일자동포트해제기능추가_plan.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_67_배치파일자동포트해제기능추가_plan.md) 및 [수정_react_67_배치파일자동포트해제기능추가_task.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_67_배치파일자동포트해제기능추가_task.md)를 '수정' 폴더에 생성 완료하였습니다.
