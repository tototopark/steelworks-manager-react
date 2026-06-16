# 수정 사항 요약 (수정_react_116_이중개발자힌트체계구축)

전역 공통 힌트(학습용)와 개별 페이지별 수동 상세 힌트(작업용) 2종류가 화면에 모두 공존하도록 상세 작성 및 복원 작업을 완수하였습니다.

## 변경 파일 목록

1. **[MODIFY] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/page.js)**
   - 대시보드 메인 페이지 하단에 삭제했던 `<DevHints ... />` 선언부를 완전하게 복구.

2. **[MODIFY] [page.js (weekly-plan)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/weekly-plan/page.js)**
   - `DevHints` 임포트 추가 및 컴포넌트 하단에 월간/주간 계획 전용 상세 힌트 추가.

3. **[MODIFY] [page.js (whiteboard)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/whiteboard/page.js)**
   - `DevHints` 임포트 추가 및 컴포넌트 하단에 화이트보드 태스크 전용 상세 힌트 추가.

4. **[MODIFY] [page.js (qa-wip)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/qa-wip/page.js)**
   - `DevHints` 임포트 추가 및 컴포넌트 하단에 QA WIP 품질 검사 전용 상세 힌트 추가.

5. **[MODIFY] [page.js (jobs)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/jobs/page.js)**
   - `DevHints` 임포트 추가 및 컴포넌트 하단에 프로젝트 잡 관리 전용 상세 힌트 추가.

6. **[MODIFY] [page.js (employees)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/employees/page.js)**
   - `DevHints` 임포트 추가 및 컴포넌트 하단에 임직원 디렉토리 전용 상세 힌트 추가.

## 검증 결과
- 이중 힌트 탑재 후 구문 에러를 해결하고 Next.js Production Build (`npm run build`) 무오류 통과 검증 완료.
