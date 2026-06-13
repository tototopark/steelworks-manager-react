# 구현 계획서 - CV/커버레터 보완 및 실제 배포 방안 수립

이 계획서는 대외 구직 활동을 위해 사용자의 이력서(CV)와 자기소개서(Cover Letter)를 최근 완성한 "Steelworks Manager (Next.js + FastAPI)" 프로젝트 성과 중심으로 개정하고, 실제 채용 담당자가 접속하여 사용해 볼 수 있도록 웹 서비스로 배포하는 방안을 다룹니다.

## 사용자 검토 요구사항

> [!IMPORTANT]
> - **CV 개정**: 2025년 8월 퇴사 정보를 현행화하고, 2025년 8월부터 현재까지 AI/자동화 프리랜서 및 개인 프로젝트(Steelworks Manager 리팩토링 및 24시간 개발 성과)를 핵심 이력으로 추가합니다.
> - **커버레터 보완**: 이전에 개발한 레거시 PHP 실무 앱을 AI 기반 Next.js + FastAPI 스택으로 단 하루 만에 현대화 및 모듈화해 낸 구체적인 마이그레이션 성공 실적을 스토리텔링에 포함시킵니다.
> - **배포 방안 제안**: 실제 사용자가 체험할 수 있도록 로컬 네트워크 가동법(사내용) 및 클라우드 배포 플랫폼(Render, Fly.io 등) 사용에 대해 단계별 방안을 조율합니다.
> - **이모지 사용 안함**: 전반적인 문서에서 이모지 사용을 엄격히 배제합니다.

## Proposed Changes

### 1. CV 및 Cover Letter 개정안 작성
- [NEW] [수정/수정_react_121_이력서및자기소개서수정.md](file:///f:/pe/public_html/steelworks-manager-react/수정/수정_react_121_이력서및자기소개서수정.md)
  - 채용 담당자가 읽기 쉽도록 포맷팅된 영문 CV와 Cover Letter 최종본을 한글 해설과 함께 작성합니다.

### 2. 배포(Deployment) 가이드 작성
- [NEW] [수정/수정_react_121_배포가이드.md](file:///f:/pe/public_html/steelworks-manager-react/수정/수정_react_121_배포가이드.md)
  - **로컬/사내 배포**: `npm run build`를 통해 빌드된 정적 리소스를 백엔드 Uvicorn이 서빙하여 사내망 IP로 접속하는 방식.
  - **클라우드 배포**: SQLite를 그대로 사용할 수 있도록 디스크 볼륨(Persistent Volume)을 제공하는 Render.com 혹은 Fly.io 배포 가이드.

## 검증 계획

- 개정된 CV 및 Cover Letter 마크다운 파일 검토.
- Next.js 정적 빌드와 FastAPI 연동 정상 작동 테스트.
