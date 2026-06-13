# 배치파일 자동 포트 해제 기능 추가 계획

본 계획서는 r.bat 실행 시 기존에 3700(백엔드) 및 3701(프론트엔드) 포트를 물고 대기 중이던 찌꺼기 프로세스들을 찾아내어 자동으로 taskkill을 수행하고, 포트를 완전히 비운 뒤 안정적으로 신규 서버를 띄울 수 있도록 자동화 셸 스크립트를 추가하는 계획입니다.

## 사용자 검토 요구사항
- r.bat 내부에 netstat 및 taskkill 기반의 포트 청소 스크립트(3700, 3701)가 올바르게 구현되었는지 확인.

## 오픈 질문
- 없음.

## 제안된 변경 사항

### r.bat 배치파일 보완

#### [MODIFY] [r.bat](file:///F:/pe/public_html/steelworks-manager-react/r.bat)
#### [NEW] [수정_react_67_배치파일자동포트해제기능추가_plan.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_67_배치파일자동포트해제기능추가_plan.md)
#### [NEW] [수정_react_67_배치파일자동포트해제기능추가_walkthrough.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_67_배치파일자동포트해제기능추가_walkthrough.md)

## 검증 계획

### 수동 검증
- 기존에 3700/3701 포트를 띄워둔 상태에서 r.bat를 재실행했을 때 'EADDRINUSE' 에러 없이 이전 서버를 자동 격하하고 신규 서버가 정상 작동하는지 확인.
