# 수정 사항 요약 (수정_react_115_대시보드힌트중복제거)

대시보드 메인 화면 하단에 개별로 명시되어 중복 출력되던 `DevHints` 태그를 제거하였습니다.

## 변경 사항

1. **[MODIFY] [page.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/page.js)**
   - 페이지 최하단에 수동으로 박아둔 `<DevHints ... />` 선언부를 제거.
   - 이로 인해 `layout.js`에서 호출하는 전역 공통 힌트 컴포넌트(HINTS_MAP 매핑 자동 감지) 한 곳에서만 깨끗하게 힌트 패널이 출력되도록 단일화 조치.

## 검증 결과
- 중복 태그 제거 후 Next.js Production Build (`npm run build`) 무결성 통과 확인.
