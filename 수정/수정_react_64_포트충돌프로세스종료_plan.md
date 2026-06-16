# 포트 충돌 프로세스 종료 계획

본 계획서는 Next.js 프론트엔드가 기동하려는 3701 포트가 이미 점유되어 있어 'EADDRINUSE' 에러가 발생하는 문제를 조치하기 위해, 포트 3701을 점유 중인 프로세스 ID(PID)를 확인하고 이를 강제 종료(taskkill)하여 포트를 초기화하는 계획입니다.

## 사용자 검토 요구사항
- 포트 3701 점유 프로세스를 강제 종료하여 기동 환경을 복구하는 계획 확인.

## 오픈 질문
- 없음.

## 제안된 변경 사항

### 프로세스 정리 명령어 실행

#### [NEW] [수정_react_64_포트충돌프로세스종료_plan.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_64_포트충돌프로세스종료_plan.md)
#### [NEW] [수정_react_64_포트충돌프로세스종료_walkthrough.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_64_포트충돌프로세스종료_walkthrough.md)

## 검증 계획

### 자동 테스트
- `netstat -ano | findstr :3701` 실행 시 출력 데이터가 존재하지 않는지(점유 프로세스가 없는지) 검증.
