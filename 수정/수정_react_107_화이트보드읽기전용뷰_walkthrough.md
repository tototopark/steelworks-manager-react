# 수정_react_107_화이트보드읽기전용뷰_walkthrough

## 개요

레거시 앱의 `2bis.php` (Whiteboard read-only view) 기능을 2번 앱(steelworks-manager-react)에 권한 분석 기반의 조건부 렌더링으로 구현하였습니다.

## 구현 내용

### 1. 프론트엔드 - whiteboard/page.js
- **useAuth 기반 세션 권한 판독:**
  - `const { user } = useAuth();`를 통해 로그인된 사용자의 세션을 획득합니다.
  - `const isReadOnly = user?.right_level < 6;` 변수를 신설하여 Level 6 미만(예: Level 1 - Fabricator, Level 2 - OnSite 등) 계정은 읽기 전용으로 설정합니다.
- **UI 및 조작 제한:**
  - `isReadOnly`가 true일 경우:
    - 상단 **"New Task"** 생성 단추를 렌더링하지 않습니다.
    - 태스크 카드의 드래그 기능을 비활성화(`draggable={!isReadOnly}`)하고, 마우스 커서를 grab 대신 default로 설정하여 사용성을 차단했습니다.
    - Drag & Drop으로 카드 재배치를 시도할 때 백엔드로 상태 갱신 API 요청을 보내지 못하도록 드롭 핸들러(`handleDrop`) 상단에서 early return 가드 처리했습니다.
    - 개별 태스크 카드 안쪽의 **수정(Edit)** 및 **삭제(Delete)** 아이콘 버튼을 숨김 처리하였습니다.
    - 화면 상단에 엠버 계열의 **"Read-Only View: You do not have permissions to modify whiteboard tasks."** 경고 배너를 부드럽게 노출하여 읽기 전용 상태임을 명확히 표시했습니다.

## 빌드 결과

18/18 페이지 모두 정상 빌드 완료되었으며 오류 없음 확인.

## 수정된 파일
- `fe/src/app/dashboard/whiteboard/page.js`
