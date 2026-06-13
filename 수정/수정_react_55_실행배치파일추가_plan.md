# 실행 배치파일 추가 계획

본 계획서는 React 버전 Steelworks Manager 앱을 한번에 구동할 수 있도록 루트 경로에 r.bat 실행 배치파일을 추가하는 계획입니다. 한글 인코딩 에러를 방지하기 위해 배치파일 내의 텍스트와 주석은 모두 영어로 작성합니다.

## 사용자 검토 요구사항
- 백엔드(run_api.py) 및 프론트엔드(fe/npm run dev) 서버를 동시에 별도 창으로 구동하는 r.bat 스크립트 구성 확인.

## 오픈 질문
- 없음.

## 제안된 변경 사항

### 배치파일 추가

#### [NEW] [r.bat](file:///F:/pe/public_html/steelworks-manager-react/r.bat)
#### [NEW] [수정_react_55_실행배치파일추가_plan.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_55_실행배치파일추가_plan.md)
#### [NEW] [수정_react_55_실행배치파일추가_walkthrough.md](file:///F:/pe/public_html/steelworks-manager-react/수정/수정_react_55_실행배치파일추가_walkthrough.md)

## 검증 계획

### 수동 검증
- r.bat 파일이 루트 경로에 생성되었는지 확인.
