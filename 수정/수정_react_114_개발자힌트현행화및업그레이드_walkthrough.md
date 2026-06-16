# 수정 사항 요약 (수정_react_114_개발자힌트현행화및업그레이드)

시스템 전반에 걸쳐 고도화 및 추가된 14개 전체 메뉴 페이지 정보에 맞추어 개발자 힌트(`DevHints.js`)의 `HINTS_MAP`을 종합 업그레이드하였습니다.

## 변경 파일 목록

1. **[MODIFY] [DevHints.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/components/common/DevHints.js)**
   - 대시보드, 잡 관리, 주간 계획, 화이트보드, QA WIP, 직원 정보, 차량 관리, 펀치 클락, 타임시트, 퍼포먼스 차트 외에 **신규 및 기능 업그레이드가 진행된 14개 페이지 전체**의 맵 구조를 대대적으로 갱신:
     - **공휴일 관리 (`/dashboard/holidays`)** 추가
     - **생산 부하 계획 (`/dashboard/workload`)** 추가
     - **실시간 가동 로그 타임라인 (`/dashboard/activity`)** 추가
     - **데이터베이스 어드민 진단 및 ERD 시각화 (`/dashboard/admin-db`)** 설명 세분화
     - 각 페이지별 연동 훅(`fe/src/hooks/*`), API 라우터 함수(`core/api_router.py`), 백엔드 파이프라인(`skills/*`), 조인 대상 DB 테이블 목록 및 특수 동작 조건(Conditions)을 현 상태에 매칭되도록 대대적인 최신화 수행.

## 검증 결과
- Next.js Production Build (`npm run build`) 무오류 통과 확인.
