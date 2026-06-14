# 리눅스 우분투 서버 배포 지원 계획서

이 문서는 사용자가 구글 클라우드(GCP)의 e2-micro 가상 머신(Ubuntu Linux) 환경을 구축하고, Steelworks Manager 서비스를 실제 배포하여 24시간 안정적으로 구동할 수 있도록 돕는 기술 가이드라인 및 이행 계획서입니다.

## User Review Required

> [!IMPORTANT]
> GCP e2-micro 인스턴스는 RAM이 1GB로 매우 제한적입니다. 따라서 서버 안에서 직접 `npm run build`를 실행하면 메모리 부족(OOM)으로 프로세스가 중단될 수 있습니다. 
> 로컬 컴퓨터에서 `npm run build`를 완료한 후, 빌드된 결과물(`fe/out` 또는 정적 디렉토리)을 백엔드 파일과 함께 리눅스 서버로 업로드하거나 Git에 빌드 아웃풋을 포함하여 푸시한 뒤 서버에서 pull하는 것을 강력히 권장합니다.

## Proposed Changes

### [배포 준비 단계]
1. 로컬 환경의 빌드 아웃풋 확인 및 .gitignore 재검토
2. 백엔드가 빌드된 정적 리소스를 올바르게 서빙하는지 재확인

### [리눅스 우분투 서버 환경 설정 단계]
1. 패키지 업데이트 및 기본 도구 설치 (Python3, pip, venv, Nginx 등)
2. 소스 코드 가져오기 (Git Clone) 또는 파일 업로드
3. Python 가상 환경(venv) 구성 및 라이브러리 의존성 설치
4. 백엔드 및 프론트엔드 통합 테스트 실행
5. Systemd 서비스 등록을 통한 24시간 백그라운드 구동 설정
6. Nginx 리버스 프록시 설정 (포트 80 -> 3700 연결)
7. (선택사항) Let's Encrypt를 통한 무료 HTTPS(SSL) 보안 적용

---

## Verification Plan

### Manual Verification
- 클라우드 인스턴스의 공인 IP 주소(예: `http://<GCP-VM-EXTERNAL-IP>`)로 외부 브라우저에서 정상 접속되는지 확인.
- 로그인, 데이터 조회, 타임시트 저장 등의 CRUD API 동작 무오류 확인.
- 시스템 재부팅(reboot) 후 서비스 자동 기동 여부 검증.
