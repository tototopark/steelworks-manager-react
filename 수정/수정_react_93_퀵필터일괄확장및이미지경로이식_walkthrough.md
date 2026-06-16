# 수정_react_93_퀵필터일괄확장및이미지경로이식_walkthrough

오래된 레거시 데이터 검색 환경을 지원하기 위해 타임시트 외의 주요 스케줄 및 실적 통계 페이지에 퀵 필터(Data Available) 및 Auto Week 버튼을 배치하고, 레거시 PHP 프로젝트(`F:\pe\public_html\sitepro`)로부터 드로잉, 현장 사진 및 직원 아바타 파일들을 이식하며, 관리자 ERD 다이어그램의 무한 로딩 지연 현상을 수정하였습니다.

## 작업 상세 내용

### 1. 주요 페이지 퀵 필터 및 Auto Week(Dev) 버튼 배치 완료
* **Whiteboard Task Board**: 
  - `devConfig.devHints` 활성화 시 Auto Week (Dev) 버튼 및 실제 데이터 날짜 바로가기 버튼(2019-09-20, 2019-09-08, 2019-09-02, 2019-08-29) 배치 완료.
* **Monthly Production Plan**:
  - `devConfig.devHints` 활성화 시 Auto Week (Dev) 버튼 및 실제 생산계획/메모가 위치한 주간 날짜 바로가기 버튼(2021-11-25, 2021-07-07, 2020-02-26) 배치 완료.
* **Performance Statistics & Rankings**:
  - `devConfig.devHints` 활성화 시 Auto Week (Dev) 버튼 및 실제 퍼포먼스 데이터가 위치한 주차 바로가기 버튼(2021 W27, 2021 W39, 2020 W40, 2020 W39) 배치 완료.

### 2. 레거시 `sitepro` 이미지/아바타 파일 복사 및 DB 경로 동기화
* **아바타 파일 이식**:
  - `sitepro/uploads` 폴더 내의 아바타 이미지들(Aaron.jpg, Alison.jpg 등)을 `static/uploads/avatars/` 폴더로 복사 완료.
  - `tb_login.avatar`에 저장되어 있던 상대경로 값을 `/uploads/avatars/...` 규격으로 마이그레이션 갱신 완료.
* **도면 및 작업 현장 사진 이식**:
  - `sitepro/uploadsPhoto/2021` 폴더 내 도면/사진 파일들을 `static/uploads/jobs/2021/` 폴더로 복사 완료.
  - `tb_photos.photo_name`에 저장되어 있던 상대경로 값을 `/uploads/jobs/2021/...` 규격으로 마이그레이션 갱신 완료.
* **마이그레이션 스크립트 작성 및 실행**:
  - [update_paths.py](file:///f:/pe/public_html/steelworks-manager-react/scratch/update_paths.py) 스크립트를 작성하여 일괄 적용 완료.

### 3. ERD 다이어그램 무한 로딩 및 탭 전환 무반응 버그 해결
* Mermaid Graph를 `lazyOnload` 방식으로 로딩 전략을 변경하고, `startOnLoad: false` 옵션을 지정했습니다.
* activeTab이 'erd'로 활성화될 때 `.mermaid` 클래스를 찾아 `window.mermaid.run()` 메소드를 우선 호출하고, 구버전 대비 예외가 발생할 경우 `contentLoaded()`를 이중 구성(Fallback)하여 다이어그램 렌더링 무한 대기 버그를 수정했습니다.

### 4. Next.js 빌드 성공 여부 검증
* `npm run build`를 실행하여 Next.js 정적 빌드가 정상 완료됨을 확인했습니다.
