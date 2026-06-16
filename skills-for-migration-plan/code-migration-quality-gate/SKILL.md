---
name: code-migration-quality-gate
description: Use when migrating legacy projects, rewriting codebases, porting applications (e.g. PHP to React/Next.js/FastAPI), or mapping old menus/functions to a new tech stack. Ensures zero functional omissions and absolute fidelity. Always use this skill for codebase migration tasks. Do not use for writing new standalone apps from scratch, general refactoring of single files, or non-technical project management.
---

# Code Migration Quality Gate — 누락 방지 이중 게이트 마이그레이션 스킬

이 스킬은 레거시 코드베이스(예: PHP)에서 새로운 트렌디한 기술 스택(예: React, Next.js, FastAPI 등)으로 시스템을 이전 및 포팅할 때, 단 하나의 비즈니스 로직, 메뉴, 테이블 컬럼, 혹은 편의 기능도 누락되지 않도록 촘촘한 상호 대조 그물을 치는 **Process + Rigid** 규율 스킬입니다.

## Goal
레거시 소스 코드가 가진 모든 명세(기능, 보안 규칙, 예외 처리, UI 세부 요소)를 100% 보존하여 마이그레이션하며, 계획(A)과 구현(B) 단계 전후로 완벽한 이중 대조 매핑을 수행하여 마이그레이션 실패 및 격차를 0%로 수렴시킵니다.

## Foundational Principle
**Violating the letter of the rules is violating the spirit of the rules. (규칙의 문구를 어기는 것은 규칙의 정신을 어기는 것이다. 예외와 합리화는 절대 허용되지 않는다.)**

---

## Iron Laws

### 1. Zero-Assumption Analysis (선제적 분석 의무화)
**임의로 생략하거나 단순화하지 말라. 레거시 코드의 모든 라인을 읽고 매핑을 작성하라.**
- "이 화면은 안 쓰는 것 같다", "이 컬럼은 무시해도 된다" 등의 자의적 추측을 전면 금지한다.
- 레거시 폴더의 파일 목록과 라우팅 목록을 100% 전수조사하여 트래킹 시트에 올리기 전에는 마이그레이션 계획을 시작하지 않는다.

### 2. Double-Gate Mapping Check (이중 게이트 대조 검증)
**구현을 시작하기 전에 계획(Gate 1)을 세우고, 구현이 끝난 후 1:1 대조 검증(Gate 2)을 수행하여 통과 여부를 갱신하라.**
- **Gate 1 (계획 단계)**: 레거시 파일/라우트명에서 마이그레이션 대상 파일/엔드포인트 매핑 표 작성.
- **Gate 2 (검증 단계)**: 구현된 컴포넌트 및 API 코드 라인에서 레거시 원본 코드 비교 및 회귀 분석 실행.
- 두 게이트 모두에서 대조 검증 결과가 "완료 (100% 매칭)" 상태로 확정되기 전에는 작업을 종결하지 않는다.

### 3. Edge-Case Preservation (예외 처리 및 비즈니스 룰 100% 보존)
**에러 처리, 권한 검사, 특수 문자 필터 등의 마이너 로직도 100% 이식하라.**
- 로그인 접근 제어(IP 화이트리스트), 구형 해시 호환성(예: $2y$ Bcrypt 처리), 널(Null) 값 처리 등 레거시 특유의 방어 코드를 신규 플랫폼의 미들웨어나 라이브러리 레벨에 반드시 이식해야 한다.

### 4. Strict Code Size Limit (코드 라인수 300줄 제한 및 모듈화)
**프론트엔드 컴포넌트 및 백엔드 라우터/비즈니스 로직 파일의 길이는 최대 300줄을 넘지 않아야 한다.**
- 단일 파일의 복잡성을 낮추기 위해 책임 범위가 다른 로직은 독립된 서브 모듈, 파일, 혹은 커스텀 훅으로 즉시 리팩토링 및 격리 분할한다.
- **API 개별 파일 저장 법칙**: 대형 라우터 파일에 여러 API가 섞여서 거대해지는 것을 금한다. 모든 REST API 세부 도메인(예: auth, jobs, employees, qa 등) 혹은 주요 대형 엔드포인트는 개별 독립 파일(`auth.py`, `jobs.py` 등)로 각각 모듈화하여 저장하고, 메인 엔드포인트(`api_router.py`)는 이 개별 라우터들을 단지 include하는 얇은 연결기 역할로 한정해야 한다.

### 5. Executable Standalone Backend Pipeline (독립 실행형 백엔드 설계)
**백엔드 비즈니스 로직(예: data CRUD, 파이프라인 처리부)은 반드시 단독 실행 가능한 단위 완성형 코드로 구축한다.**
- 파일 하단에 `if __name__ == "__main__"` 테스트 기동 블록을 필히 작성하여, 웹 서버(Uvicorn 등) 기동 없이 파이썬 쉘 명령어로 데이터베이스 CRUD 연산의 무결성 검증이 가능하도록 설계한다.
- 프론트엔드 화면을 연동하기 전에 해당 파이프라인 모듈을 통해 CRUD 테스트를 100% 성공시키는 것이 필수 프로세스이다.

### 6. Developer Diagnostic Hints & Toggle Feature (개발자 진단용 힌트 및 스위치 필수화)
**테스트 작업 및 유지보수를 용이하게 하기 위해, 모든 마이그레이션 대상 화면의 하단에는 개발자 진단용 힌트(DevHints) 패널을 마운트해야 한다.**
- 진단용 힌트 컴포넌트는 해당 화면에서 사용하는 프론트엔드 파일 경로, 백엔드 API 라우트 경로, 참조 DB 테이블, 그리고 비즈니스 제약 조건을 실시간으로 화면에 출력해야 한다.
- **전역 설정 스위치 연동**: 이 진단용 힌트 패널은 백엔드의 전역 설정 환경 변수(예: `SHOW_DEV_HINTS`) 및 자동입력 플래그(예: `AUTO_FILL_ENABLED`) 등 Config 스위치 옵션의 ON/OFF 상태를 API로 동적으로 조회하여, 활성화 상태일 때만 보이고 비활성화 시에는 화면에서 완전히 감추도록(Render None) 조치한다.
- **개발자를 위한 유용한 팁 및 진단 기능 정보**:
  - *포트 충돌 해결*: 로컬 개발 중 3701 포트 충돌이 나면 루트의 `r.bat` 배치 스크립트를 실행해 기존 점유 프로세스를 자동으로 찾아서 안전하게 강제 종료(kill)시킨다.
  - *PHP bcrypt 호환*: 구형 PHP DB에서 유입된 `$2y$` 시작 bcrypt 해시는 파이썬의 bcrypt 표준인 `$2b$`로 강제 치환하여 검증해야 매칭된다.
  - *DB 무결성 검증*: `/api/admin/db_integrity` API를 사용해 순환/고아 참조를 검사하고 복구(fix) 옵션을 통해 손쉽게 정합성을 유지한다.
  - *개발용 빠른 계정 입력*: `AUTO_FILL_ENABLED = True` 설정 시 로그인 페이지에 퀵필 정보가 자동 입력되며, `employees` 테이블 내 개발용 해시 비밀번호는 디스플레이 텍스트로 `dev12345` 또는 `dev_[login]`처럼 노출하여 TDD 테스트 생산성을 강화한다.

---

## Workflow

### 1단계. 레거시 전수조사 및 인벤토리 작성 (Inventorying)
- 레거시 디렉토리의 모든 실행 파일(예: .php, .py, .js, .sql)을 스캔하여 목록을 작성한다.
- 각 파일이 담당하는 비즈니스 기능(UI 메뉴, API 호출, 배치 스케줄러 등)을 1줄 요약과 함께 인벤토리 표에 기록한다.

### 2단계. 데이터베이스 스키마 및 마이그레이션 룰 추출
- 레거시 DDL(SQL) 및 데이터 덤프를 분석하여 전체 테이블 목록과 관계(Foreign Key, Constraints)를 추출한다.
- 데이터 적재 시 마이그레이션되어야 하는 기본값(Default), 널 허용 여부(Nullable), 구형 암호화 방식을 확인하여 기록한다.

### 3단계. Gate 1: 마이그레이션 계획서 및 1:1 매핑 표 작성 (Plan-Gate)
- 신규 스택에 대응하는 디렉토리 구조 및 컴포넌트 아키텍처를 정의한다.
- 아래 규격의 1:1 매핑 표를 작성하고 사용자 검토 및 서명을 요청한다.
  | 레거시 파일/기능 (sitepro) | 1차 마이그레이션 상태 (FastAPI/Static) | 2차 마이그레이션 대상 (React) | 매핑 상태 | 누락된 세부 스펙 및 예외처리 |
  |---|---|---|---|---|
  | 11.php (직원 관리) | employees.html (완료) | fe/src/.../employees/page.js | 진행 중 | IP 접근 제어 (IP_1, IP_2) 유실 상태 |

### 4단계. 모듈 단위 격리 구현 및 컴파일 검증
- 정의된 1:1 매핑 계획에 의거하여 컴포넌트와 API 라우터를 순차적으로 구현한다. 이때 모든 신규 파일은 300줄 이내로 크기를 제약한다.
- 백엔드 모듈은 하단 `if __name__ == "__main__"` 블록을 통해 DB CRUD 단독 작동성을 검증한다.
- 신규 프레임워크의 빌드/컴파일 검증(예: npm run build, python syntax check)을 즉각 수행하여 린트 오류 및 타입 문제를 실시간 해결한다.

### 5단계. Gate 2: 1:1 회귀 대조 검증 (Regression-Gate)
- 구현 완료된 UI 및 백엔드 로직의 행위를 레거시 파일과 라인 단위로 대조하여 다음 항목을 꼼꼼하게 교차 검증한다.
  - [ ] **메뉴 링크 및 접근 권한**: 권한 레벨별 메뉴 노출 조건이 레거시와 일치하는가?
  - [ ] **데이터 유효성 검사**: 빈 값(Empty), 타입 불일치 시 예외 처리가 작동하는가?
  - [ ] **비즈니스 룰 예외**: 레거시에서 예외처리된 파일 확장자, 문자 크기 제한 등이 구현되었는가?
- 검증 누락이 발견될 경우, 즉각 4단계로 회귀하여 보완 코드를 작성한다.

### 6단계. 격차 보고서 및 통합 테스트 수행
- 마이그레이션 완료 후 남은 잔여 격차(Gap)와 향후 스케줄을 명시한 "비교 분석 보고서"를 갱신 및 파일로 저장한다.
- 데이터베이스 무결성 검증 스크립트 및 테스트 시나리오를 구동하여 100% 작동 여부를 검증한다.

---

## Domain Rules
- **일치성 검증 우선**: 새로운 기능이나 화려한 디자인 적용보다 레거시 명세 일치성 검증이 언제나 최우선이다.
- **체크리스트 상태 갱신**: 각 작업 단위 완료 시 반드시 매핑 표의 상태를 "진행 중 -> 완료 (100% 매칭)"로 명시적으로 갱신 기록한다.

## Common Mistakes
- **추측성 마이그레이션**: 레거시 파일의 코드를 열어보지 않고 파일명이나 주석만으로 기능을 유추하여 변환하는 행동을 절대 금지한다.
- **예외 로직 누락**: 비밀번호 검증 조건, 특수 IP 체크 등 구석에 숨겨진 보안/예외 로직들을 "사소하다"는 이유로 포팅하지 않고 건너뛰는 실수를 금한다.

## Rationalization Patterns to Reject

| 사용자/AI의 합리화 시도 | 차단 규칙 (Iron Response) |
|---|---|
| "이 화면은 너무 작고 사소해서 매핑 표에 안 적어도 된다." | **작고 사소한 화면일수록 유실되기 가장 쉽다. 인벤토리 및 매핑 표에 무조건 행 단위로 등록하라.** |
| "최신 스택에는 적합하지 않은 레거시 기능이니 구현을 생략했다." | **생략하기 전에 반드시 사용자에게 명시적으로 대안을 보고하고 확인을 얻어라. 독자적 생략은 규율 위반이다.** |
| "바쁜 데모 일정으로 인해 Gate 2 대조 검증을 나중에 하겠다." | **시간 압박은 대조 검증을 건너뛸 사유가 되지 않는다. 게이트가 통과되지 않은 코드는 머지 및 배포 불가하다.** |
| "데이터베이스 컬럼 몇 개는 임시로 무시하고 포팅했다." | **스키마 격차는 나중에 알 수 없는 런타임 NullPointer 또는 데이터 유실 에러를 유발한다. 스키마는 100% 싱크되어야 한다.** |

---

## Verification Checklist
- [ ] **인벤토리 전수 조사**: 레거시 소스 폴더 내의 분석된 파일 수와 누락 파일 수가 정확히 교차 확인되었는가?
- [ ] **Gate 1 완료**: 마이그레이션 1:1 매핑 표가 파일로 저장되어 있으며 상태가 기록되었는가?
- [ ] **Gate 2 통과**: 마이그레이션된 UI 화면과 API를 레거시 원본 코드와 1:1로 비교 테스트하여 정상 동작을 확인했는가?
- [ ] **컴파일/빌드 성공**: Next.js 프로덕션 빌드 및 FastAPI 구동 시 린트나 임포트 오류가 0개인가?

---

## Output Format
최종 마이그레이션 검증 수행 후 보고는 항상 아래 형식을 일관되게 따른다:

```markdown
### 1. 마이그레이션 수행 인벤토리 현황
- 총 레거시 파일 개수: [N]개 (분석 완료: [M]개)
- 포팅 완료 컴포넌트 / API: [X]개

### 2. 이중 게이트(Double-Gate) 1:1 매핑 테이블
| 레거시 원본 ( sitepro ) | 마이그레이션 신규 경로 | Gate 1 (계획) | Gate 2 (대조) | 현재 상태 |
|---|---|---|---|---|
| ... | ... | [OK/Pending] | [OK/Pending] | [완료 / 진행 중 / 미비] |

### 3. 미비점 및 격차 분석 (Gap Analysis)
- [ ] 미포팅 잔여 로직 1: ...
- [ ] 미포팅 잔여 로직 2: ...

### 4. 무결성 검증 결과
- 빌드 결과: [성공 / 실패]
- 데이터 무결성 검사 결과: [오류 0개 / 특정 이슈 명시]
```
## Migration Addendum

When extending an existing migration record, keep this original workflow and append the following practices without rewriting the core rules:

- Add file-by-file source review after Gate 1 mapping.
- Read `root` and `devwebsite` files separately before updating the mapping.
- Record suspicious branches before moving to the next family.
- Keep design notes in `docs/002_design` and execution notes in `docs/003_logs`.
- Use matching sequence numbers for the same work order.
- Append new numbered notes instead of renumbering unrelated prior work.
- Finish with a smoke check and a clean-worktree check before declaring the pass ready.
- Stay inside the fixed workspace.
