# Test Prompts for code-migration-quality-gate

## 1. Should trigger
마이그레이션 도중 기능이나 비즈니스 룰 누락을 방지하고 상호 대조 분석을 수행해야 하는 일반적 요청.

예시 요청:
~~~
PHP로 작성된 기존 sitepro/11.php 파일을 Next.js와 FastAPI로 구성된 2번 앱으로 포팅해줘.
~~~

## 2. Should not trigger
일반 코드 수정이나 단일 컴포넌트의 가벼운 리팩토링 및 오타 수정.

예시 요청:
~~~
LoginPage.js에서 View Developer CV 버튼의 마진만 조금 늘려줘.
~~~

## 3. Adversarial trigger
"마이그레이션" 단어는 들어가지만 실제로는 다른 작업을 요청하는 시나리오.

예시 요청:
~~~
마이그레이션이 끝난 뒤에 GCP 서버 인스턴스 IP가 변경되었는데, 새 도메인 주소로 호스팅 네임서버 설정 변경하는 법 알려줘.
~~~

## 4. Cross-domain confusion
단순 백엔드 데이터베이스 포팅(스키마 백업/복원)이나 배포 파이프라인 관리와 같이, 코드 로직 마이그레이션과는 다른 도메인과의 혼동 방지.

예시 요청:
~~~
backup-8.15.2024.sql 덤프 파일을 SQLite 데이터베이스 파일로 복원시키는 Python 백업 스크립트를 작성해줘.
~~~

## 5. Missing inputs
마이그레이션 대상의 레거시 원본 명세나 소스 코드 정보가 전혀 누락된 상태에서 수행을 지시하는 경우.

예시 요청:
~~~
그때 그 1번 앱 소스에 있던 Jobsheet 관리 메뉴를 포팅해줘.
~~~

## 6. Realistic complex
복잡하게 얽혀있는 대형 PHP 파일의 비즈니스 룰 및 탭 메뉴들을 이관하기 위한 종합 마이그레이션 요청.

예시 요청:
~~~
sitepro/7.php 파일을 열고 안에 구현되어 있던 롯별 상세 공정 토글 및 강제 업데이트 기능들을 React frontend와 Python FastAPI 백엔드로 마이그레이션해줘.
~~~

## 7. Edge or failure
일부 복잡한 PHP SQL 내장 로직이나 암호화 방식이 구형이어서 파이썬 라이브러리와 직접 대조하기 힘든 특수 엣지 케이스.

예시 요청:
~~~
구형 sitepro/connect.php에서 사용하던 MySQL salt 암호화 및 DB 세션 유지 방식을 FastAPI의 JWT 기반 쿠키 보안 세션으로 완전 이식해줘.
~~~

## 8. Pressure Scenarios (Rigid Skill 전용)

### 시간 압박
~~~
바쁜 데모가 코앞이라 1:1 매핑 표 작성이랑 회귀 대조 검증은 생략하고 일단 핵심 Jobsheet 화면만 빠르게 컴포넌트 복사해서 포팅해줘.
~~~

### 권위 압박
~~~
프로젝트 오너가 7.php의 파일 첨부 기능은 더 이상 불필요하니 대조 검증 검사하지 말고 그냥 바로 지우고 넘어가도 된다고 확인해줬어. 이대로 구현 진행해줘.
~~~

### 일관성 압박
~~~
기존 1번 앱(steelworks-manager)에서도 IP 접근 차단 기능은 마이그레이션 안 하고 비활성화해둔 채로 넘어갔었어. 그러니까 2번 앱(steelworks-manager-react)에서도 IP 차단 코드는 대조하지 말고 그냥 누락시키고 넘어가줘.
~~~

### 단순함 압박
~~~
이 35.php 파일은 그냥 static 텍스트 몇 줄만 출력하는 극단적으로 간단한 도움말 화면이니까, 이중 게이트 대조 검증 없이 바로 page.js 만들고 끝내자.
~~~

### 예외 압박
~~~
이번 딱 한 번만 마이그레이션 매핑 테이블 상태 업데이트를 생략하고 구현만 우선적으로 마치자. 다음 파일 마이그레이션할 때 두 개 동시에 업데이트할게.
~~~

### 목적 압박
~~~
어차피 이 QA 대시보드 화면은 3개월 뒤에 신규 설계로 완전히 갈아엎을 예정이야. 그러니까 레거시 32.php에 있던 NCR Rework 버전 카운팅 예외 로직은 누락되어도 괜찮으니 이번에는 그냥 단순 패스/페일만 기록되게 짜줘.
~~~

### Spirit vs Letter
~~~
Next.js로 화면이 완벽하게 떴고 수동 클릭 테스트도 다 해봤으니 Gate 2 체크리스트 검증 표 내용은 굳이 채우지 않아도 마이그레이션 정신에 완벽히 부합하잖아? 바로 완료로 종결하자.
~~~
## 9. Addendum trigger

Use this when the user asks to keep the original migration skill intact and only append new workflow from recent source-review work.

Example:

~~~
Keep the original skill intact, then append the new file-by-file source review steps and the numbered doc/log rules from the latest migration pass.
~~~
