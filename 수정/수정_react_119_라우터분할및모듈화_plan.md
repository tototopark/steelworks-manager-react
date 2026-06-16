# 구현 계획서 - 거대 api_router.py 모듈 분할 리팩토링

이 계획서는 2,100줄이 넘어가는 단일 파일 `core/api_router.py`를 FastAPI의 `APIRouter`를 사용하여 기능별로 모듈화하고 서브 라우터 파일들로 분할하는 내용을 다룹니다. 이를 통해 각 소스 파일의 복잡도를 300줄 이하로 낮추고 동시에 프론트엔드 및 백엔드와의 100% 호환성을 유지합니다.

## 사용자 검토 요구사항

> [!IMPORTANT]
> - **API 변경 없음**: 모든 URL 경로, HTTP 메소드, 요청/응답 형식 및 인증 로직은 완벽히 기존과 동일합니다.
> - **폴더 구조**: 분할된 서브 라우터들은 새 디렉토리 [core/api/](file:///f:/pe/public_html/steelworks-manager-react/core/api/) 아래에 저장됩니다.
> - **라우터 통합**: 메인 진입 파일인 [core/api_router.py](file:///f:/pe/public_html/steelworks-manager-react/core/api_router.py)는 FastAPI `app` 객체를 생성하고 분할된 모든 서브 라우터들을 `app.include_router(...)`를 통해 등록하는 단순한 연결기 역할을 하게 됩니다.
> - **이모지 사용 안함**: 코드 파일 및 문서에서 이모지를 일절 배제하여 유니코드 파싱 오류를 원천 차단합니다.

## 상세 변경 내역

### [신규 폴더 및 파일] [core/api/](file:///f:/pe/public_html/steelworks-manager-react/core/api/)
API 서브 라우터들을 관리하기 위한 패키지 폴더와 서브 모듈들을 구성합니다:
- [__init__.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/__init__.py): 빈 패키지 초기화 파일.
- [auth.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/auth.py): 로그인, 비밀번호 변경 및 JWT 토큰 처리 (`/api/auth/*`, `/api/config/*`).
- [jobs.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/jobs.py): 프로젝트 관리, 도면/사진 업로드, 설치 예정일 및 진행 롯 일괄 체크 (`/api/jobs/*`).
- [qa.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/qa.py): 용접 품질 검수 Pass/Fail 처리 및 WIP 검수 완료 토글 (`/api/qa/*`).
- [employees.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/employees.py): 직원 리스트 관리, 임시 비밀번호 난수 발급, 아바타 업로드 (`/api/employees/*`).
- [reminders.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/reminders.py): 차량 관리(WOF/REGO) 및 기타 자격증/정비 기한 알림 (`/api/reminders/*`).
- [punch.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/punch.py): 공장 출퇴근 체크 및 타임시트 주차별 급여 정산 CSV 파일 생성 (`/api/punch/*`, `/api/export/*`).
- [weekly_plan.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/weekly_plan.py): 주간 공정 스케줄 및 화이트보드 작업 칸반 드래그 배정 (`/api/tasks/*`).
- [holidays.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/holidays.py): 연간 공휴일 일정 등록 및 제외 (`/api/holidays/*`).
- [workload.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/workload.py): 공수 잔여 현황 기반 30일 생산 부하 시뮬레이션 (`/api/workload/*`).
- [activity.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/activity.py): 실시간 타임라인 가동 현황 로그 피드 (`/api/activity`).
- [performance.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/performance.py): 직원별 생산 타입/시간 통계 그래프 연동 (`/api/performance/*`).
- [admin.py](file:///f:/pe/public_html/steelworks-manager-react/core/api/admin.py): 어드민 DB 브라우저, DB 상태 무결성 검사 및 데이터 정비 툴킷 (`/api/admin/*`).

### [수정] [core/api_router.py](file:///f:/pe/public_html/steelworks-manager-react/core/api_router.py)
기존의 모든 API 핸들러들을 분할된 서브 라우터 모듈들로 이관하고, 이 파일은 CORS 설정, 정적 업로드 디렉토리 마운트 및 라우터 등록 코드로 단순화(총 2,160줄에서 약 70줄로 축소)합니다.

## 검증 계획

### 자동화 테스트
- 프론트엔드 빌드 검증 (`npm run build`)을 수행하여 컴파일 안정성 검증.
- 파이썬 파일 임포트 테스트를 수행하여 라우터 탑재 시 발생하는 의존성 오류 체크.

### 수동 검증
- 백엔드 Uvicorn API 서버를 기동하여 프론트엔드 로그인 및 대시보드 데이터 연동 테스트.
