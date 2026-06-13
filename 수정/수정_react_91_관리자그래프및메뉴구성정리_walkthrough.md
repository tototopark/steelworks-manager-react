# 수정_react_91_관리자그래프및메뉴구성정리_walkthrough

레거시 PHP 시스템(`sitepro`)에 있던 작업자 실적 통계(Performance) 차트 및 신호 chip 테이블 화면을 React Next.js 시스템으로 마이그레이션 및 적용 완료하였습니다.

## 작업 완료 사항

1. **백엔드 통계 API 구현 (`core/api_router.py`)**:
   - `/api/performance/stats` 엔드포인트를 구현하여 ISO 주차별 및 연도별 Welder 인원들의 완료된 부재 물량(Portals, Beams, Columns, Others) 집계 및 실제 소요시간(Hours) 합산 데이터를 반환합니다.

2. **프론트엔드 Performance 페이지 신설 (`fe/src/app/dashboard/performance/page.js`)**:
   - 외부 라이브러리 추가 없이 Tailwind CSS Grid 비율을 이용해 각 부재별 제작 비율을 나타내는 맞춤형 스택 막대(Production Mix Proportional Bar)를 구현했습니다.
   - 평균 제작 시간(average time per piece)을 계산하여 **초록(Good), 주황(Warning), 빨강(Slow)** 칩으로 등급을 자동 매핑해 주는 효율성 비교표 테이블을 설계했습니다.
   - 지난주, 2주 전, 4주 전, 12주 전 단위 필터링 선택 기능이 지원됩니다.

3. **네비게이션 연동 (`fe/src/components/common/Sidebar.js`)**:
   - `right_level`이 5 이상(Accountant `5`, Admin `6`, Admin/Truck `68`, Managing Director `9` / Super Admin `99`)인 사용자에게 "Performance" 메뉴가 사이드바에 노출되도록 처리하였습니다.

## 빌드 및 검증 결과
- `npm run build` 결과, `/dashboard/performance` 라우트가 성공적으로 프리렌더링 및 빌드 검증을 완료하였습니다.
- `./r.bat` 재구동을 통해 FastAPI 백엔드(3700)와 Next.js 프론트엔드(3701)가 이상 없이 정상 재배포 및 활성화되었습니다.
