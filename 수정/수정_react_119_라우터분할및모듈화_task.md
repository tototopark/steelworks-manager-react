# 작업 체크리스트 - 거대 api_router.py 모듈 분할 리팩토링

- [x] 파이썬 패키지 디렉토리 생성 [core/api/](file:///f:/pe/public_html/steelworks-manager-react/core/api/)
- [x] 기능별 서브 라우터 모듈 파일 작성 및 분할:
  - [x] 인증 및 환경 설정: [auth.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/auth.py)
  - [x] 잡 관리 및 부재 정보: [jobs.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/jobs.py)
  - [x] 품질 보증 검사 (QA WIP): [qa.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/qa.py)
  - [x] 직원 정보 마스터: [employees.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/employees.py)
  - [x] 안전 자격증 및 알림: [reminders.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/reminders.py)
  - [x] 펀치 클락 및 타임시트: [punch.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/punch.py)
  - [x] 주간 생산 및 화이트보드 작업: [weekly_plan.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/weekly_plan.py)
  - [x] 공휴일 일정 관리: [holidays.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/holidays.py)
  - [x] 생산 가부하 예측 (Workload): [workload.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/workload.py)
  - [x] 실시간 활동 타임라인: [activity.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/activity.py)
  - [x] 직원별 작업 효율 통계: [performance.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/performance.py)
  - [x] 슈퍼 어드민 진단 도구: [admin.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/admin.py)
- [x] 메인 진입로인 [core/api_router.py](file:///f:/pe/public_html/steelworks-manager-react/core/api_router.py)를 단순화하여 서브 라우터 모듈 탑재 및 통합 연동
- [x] Next.js 프로덕션 빌드를 수행하여 컴파일 호환성 최종 검증 완료
- [x] 파이썬 백엔드 라우터 임포트 기동 테스트 무오류 확인 완료
- [x] 수정 완료 보고서(Walkthrough) 파일 작성
