# 리눅스 우분투 및 Google Cloud Run 배포 지원 계획서 (방안 A 적용)

이 문서는 사용자가 구글 클라우드 플랫폼(GCP)의 Google Cloud Run(서버리스) 환경에 Steelworks Manager 서비스를 요금 청구 없이 영구 무료로 배포하고, SQLite 데이터를 Google Cloud Storage(GCS) 버킷과 볼륨 마운트 연동하여 영구 보존할 수 있도록 돕는 기술 가이드라인 및 이행 계획서입니다.

## User Review Required

> [!IMPORTANT]
> - **서버리스의 특성**: Cloud Run은 접속 요청이 없을 때 인스턴스가 0으로 스케일다운되어 실행 비용이 발생하지 않습니다.
> - **데이터 영구성 보존**: 컨테이너가 다시 켜질 때 SQLite 데이터베이스 유실을 방지하기 위해, GCP Cloud Storage(GCS) 버킷을 생성하여 컨테이너 내부의 `/app/data` 경로로 마운트 설정합니다.
> - **프로덕션 빌드 번들링**: 로컬 빌드된 정적 리소스(`fe`에서 빌드되어 `static`으로 컴파일되거나 또는 Dockerfile 단계에서 멀티스테이지 빌드로 번들링)를 최종 도커 이미지에 포함시켜 배포합니다.

## Proposed Changes

### [NEW] [Dockerfile](file:///f:/pe/public_html/steelworks-manager-react/Dockerfile)
FastAPI 백엔드 구동 및 Next.js 정적 번들 서빙을 위한 단일 가벼운 도커 이미지를 설계합니다.
- 멀티 스테이지 빌드 적용: 1단계 Node 환경에서 `fe` 빌드 수행 -> 2단계 Python 환경에서 최적화 복사 및 Uvicorn 기동 설정.
- 데이터를 보존할 `/app/data` 디렉토리 사전 정의.

### [MODIFY] [db_client.py](file:///f:/pe/public_html/steelworks-manager-react/core/db_client.py)
SQLite 데이터베이스 경로를 볼륨 마운트 대상인 `/app/data/mydb.db` 또는 설정된 환경 변수 경로로 유연하게 처리할 수 있도록 보완합니다.

---

## Verification Plan

### Automated Tests
- 도커 이미지 빌드 테스트 (`docker build -t steelworks-manager .`)를 로컬 또는 Cloud Build로 실행하여 에러 유무 확인.

### Manual Verification
- GCP Cloud Run 서비스 배포 후 발급되는 고유 HTTPS URL을 통해 접속 테스트.
- 데이터 생성/수정(timesheet, jobs 등) 후 인스턴스를 재부팅 또는 강제 재시작하여도 데이터가 Cloud Storage 버킷에 영구 보존 및 연동되는지 검증.
