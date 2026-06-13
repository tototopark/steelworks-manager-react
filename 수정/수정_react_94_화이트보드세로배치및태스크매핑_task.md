# 수정_react_94_화이트보드세로배치및태스크매핑_task

화이트보드(Whiteboard Task Board)를 직원 기준으로 수직 나열 및 스택 형태로 변경하고, 데이터 ID 바인딩 매핑 복구 및 퀵필터 확장 진행 상태입니다.

- [x] 화이트보드 렌더링 세로 스택 구조 개편 (`fe/src/app/dashboard/whiteboard/page.js`)
- [x] 레거시 `tb_tasks` 내의 매칭 대상 직원 외래키 ID 동기화 마이그레이션 (`107, 108, 111, 115, 117`번으로 수정 완료)
- [x] 전체 날짜 미지정 액티브 태스크를 한 번에 조회할 수 있는 'All Active Tasks (No Date)' 퀵 버튼 추가
- [x] JSX 구문 에러 교정 및 Next.js 프론트엔드 전체 컴파일/빌드 검증 완료
