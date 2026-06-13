Viewed .gitignore:1-39

`.gitignore` 파일의 규칙을 기존 프로젝트 파일들에 완벽히 적용하고 GitHub에 첫 커밋을 올리기 위해 아래 순서대로 터미널 명령어를 실행하시면 됩니다.

---

### Step 1. Git 캐시 초기화 및 .gitignore 적용
새로 생성된 `.gitignore` 규칙이 이미 Git 인덱스에 등록된 파일들에 적용되도록 캐시를 초기화합니다. (실제 로컬 파일은 삭제되지 않고 Git 추적 목록에서만 빠집니다.)
```bash
git rm -r --cached .
```

### Step 2. 전체 파일 다시 추가 (스테이징)
`.gitignore` 규칙에 명시된 파일(데이터베이스, node_modules 등)들을 제외한 순수 소스 코드 파일들만 다시 등록합니다.
```bash
git add .
```

### Step 3. 첫 로컬 커밋 생성
```bash
git commit -m "Initial commit: Steelworks Manager React Porting"
```

### Step 4. GitHub 저장소 생성 및 원격 저장소 연결
1. [GitHub](https://github.com/) 로그인 후 우측 상단의 **New repository**를 클릭합니다.
2. Repository name에 `steelworks-manager-react` 등을 입력하고 생성합니다.
3. 생성 완료 후 화면에 나오는 주소를 복사하여 아래 명령어로 로컬에 연결합니다:
```bash
git branch -M main
# USERNAME(본인 계정명) 및 REPO_NAME(생성한 저장소명)을 변경하여 실행
git remote add origin https://github.com/USERNAME/REPO_NAME.git
```

### Step 5. 원격 저장소로 코드 전송 (Push)
```bash
git push -u origin main
```

### ======================================================

## 1. 추가된 특정 파일만 선택하여 GitHub에 업로드하는 방법

전체 추가(`git add .`)를 사용하지 않고, 수정한 파일 또는 새로 추가된 특정 파일만 골라서 커밋하고 싶을 때 사용합니다.

### Step 1. 변경된 상태 확인
현재 어떤 파일이 수정되거나 추가되었는지 목록을 확인합니다.
```bash
git status
```

### Step 2. 원하는 특정 파일만 추가 (Staging)
원하는 파일의 경로를 직접 입력하여 추가합니다 (여러 개인 경우 띄어쓰기로 구분).
```bash
# 단일 파일 추가 예시
git add core/api/auth.py

# 복수 파일 추가 예시
git add README.md core/api/jobs.py
```

### Step 3. 커밋 및 푸시 진행
선택하여 추가된 파일들만 로컬 커밋을 생성하고 원격 서버로 전송합니다.
```bash
git commit -m "Add authentication and jobs router changes"
git push origin main
```

---

## 2. 특정 파일 또는 폴더를 삭제하는 방법

상황에 따라 두 가지 삭제 방식 중 하나를 선택하여 진행합니다.

### 방식 A. 내 컴퓨터(로컬)와 GitHub(원격) 모두에서 영구 삭제
로컬 드라이브의 실제 파일도 삭제하고, Git 저장소 이력에서도 제거할 때 사용합니다.
```bash
# 특정 파일 삭제 예시
git rm scratch/temp_script.py

# 특정 폴더와 하위 파일 전체 삭제 예시 (-r 옵션 필수)
git rm -r data/projects/
```
삭제 후 커밋과 푸시를 진행해야 깃허브에 반영됩니다:
```bash
git commit -m "Delete temporary scratch files and data"
git push origin main
```

### 방식 B. 내 컴퓨터에는 보관하되, GitHub(원격)에서만 제외 및 삭제
*.db 데이터베이스 파일이나 설정 파일처럼 **내 로컬 컴퓨터에는 그대로 보관해야 하지만, 실수로 깃허브에 올라갔을 때 깃허브 저장소에서만 제거**할 때 사용합니다.
```bash
# 특정 파일 깃허브에서만 제거
git rm --cached mydb.db

# 특정 폴더 전체 깃허브에서만 제거 (-r 옵션 필수)
git rm -r --cached static/uploads/
```
마찬가지로 명령 실행 후 커밋 및 푸시를 진행합니다:
```bash
git commit -m "Untrack local db and uploads, keeping local files"
git push origin main
```

---

궁금하거나 추가 설명이 필요한 부분이 있으면 언제든 편하게 말씀해 주세요!


### ======================================================

Edited gitPush.md
Viewed gitPush.md:64-117

`.gitignore` 설정 파일을 수정하여 Git 추적 대상(업로드 대상)을 제외하거나 다시 포함하는 일련의 작업 방식을 정리해 드립니다.

`.gitignore`는 기본적으로 **"아직 Git에 기록(커밋)된 적이 없는 파일"**에만 작동합니다. 따라서 이미 Git이 추적 중인 파일의 경우, 규칙 적용을 위해 캐시를 비워주는 추가 명령어가 수반됩니다.

---

## 1. 제외 대상 추가 (특정 파일/폴더를 업로드 대상에서 빼고 싶을 때)

### Case A. 한 번도 커밋(업로드)한 적이 없는 파일인 경우
1. `.gitignore` 파일을 열고 제외할 경로를 추가 후 저장합니다.
   * 예: `secrets/` 또는 `my_config.json`
2. 저장 즉시 `git status` 목록의 Untracked files에서 해당 파일이 자동으로 사라지며, 더 이상 `git add .`를 해도 업로드되지 않습니다.
3. 수정된 `.gitignore` 파일만 커밋 및 푸시합니다.

### Case B. 이미 깃허브에 올라가서 Git이 추적 중인 파일인 경우
기존에 추적되던 캐시를 끊어주어야만 새로 고친 `.gitignore` 규칙이 반영됩니다.
1. `.gitignore`에 제외할 경로를 추가하고 저장합니다.
2. 터미널에서 아래 캐시 제거 명령어를 실행합니다:
   ```bash
   git rm --cached <파일경로>
   # 폴더인 경우: git rm -r --cached <폴더경로>
   ```
3. 변경 사항을 커밋하고 푸시하여 원격 깃허브 저장소에서 지워줍니다.

---

## 2. 제외 대상 업데이트 (기존에 제외했던 파일을 다시 업로드하고 싶을 때)

1. `.gitignore` 파일을 열고, 해당 파일이 작성되어 있는 줄을 **삭제**하거나 맨 앞에 `#`를 붙여 **주석 처리**합니다.
   * 예: `# *.db` (기존 db 제외 규칙 비활성화)
2. 터미널에서 `git status`를 입력하면, 제외되었던 파일이 다시 `Untracked files` 목록에 나타납니다.
3. 평소처럼 스테이징 및 커밋하여 깃허브에 업로드합니다.
   ```bash
   git add <파일경로>
   git commit -m "Include previously ignored files"
   ```

### 팁: `.gitignore`를 수정하지 않고 강제로 추가하는 법
`.gitignore` 규칙은 유지하면서 임시로 특정 파일 하나만 강제로 올리고 싶다면 `-f` (force) 옵션을 주어 추가할 수 있습니다:
```bash
git add -f <제외대상파일경로>
```

---

## 3. `.gitignore` 수정 사항 일괄 반영 및 갱신 (삭제/정리)

`.gitignore`에 여러 규칙을 추가하고 지우는 과정에서 꼬였을 때, **로컬 캐시를 한 번 싹 비우고 새 규칙대로 전체를 새로고침**하는 가장 확실한 방법입니다.

```bash
# 1. 현재 Git 인덱스의 모든 캐시 비우기 (로컬 실제 파일은 안전합니다) bbb
git rm -r --cached .

# 2. 새로 갱신된 .gitignore 규칙을 기준으로 모든 파일 다시 스캔하여 추가
git add .

# 3. .gitignore 갱신 사항 커밋 및 푸시
git commit -m "Update gitignore settings and refresh cache"
git push origin main
```
### ======================================================
Edited gitPush.md
Viewed gitPush.md:125-178

GitHub 웹사이트(GitHub.com)에서 브라우저를 통해 파일을 직접 삭제하는 방법입니다.

---

## GitHub 사이트에서 파일 직접 삭제하는 단계

### Step 1. 대상 파일 페이지로 이동
1. 브라우저로 자신의 GitHub 저장소(Repository)에 접속합니다.
2. 삭제하고 싶은 파일이 위치한 경로로 들어가서 해당 파일을 클릭합니다.

### Step 2. 삭제 버튼(휴지통 아이콘) 클릭
1. 파일 내용이 보이는 화면 우측 상단을 확인합니다.
2. 연필 모양(Edit) 아이콘 옆에 있는 **휴지통 모양(Delete this file)** 아이콘을 클릭합니다.
   *(아이콘이 보이지 않는 경우 우측 상단의 `...` 버튼을 누르면 나오는 메뉴에서 **Delete file**을 선택할 수 있습니다.)*

### Step 3. 변경 사항 커밋 (Commit Changes)
1. 휴지통 아이콘을 누르면 하단에 커밋 메시지를 적을 수 있는 입력 창이 나타납니다.
2. 커밋 메시지(예: `Delete unused config file`)를 간략히 작성합니다.
3. 하단의 초록색 **Commit changes** (또는 Propose changes) 버튼을 클릭하면 원격 저장소에서 파일이 즉시 삭제됩니다.

---

## ⚠️ 중요: 웹사이트에서 직접 삭제한 후 필수 작업
웹사이트에서 파일을 지웠기 때문에, **GitHub 서버(원격)와 본인의 로컬 PC(로컬)의 파일 상태에 격차가 발생**했습니다. 

이 격차를 동기화해주지 않고 로컬에서 다음 커밋을 올리려고 하면 오류(Merge Conflict)가 발생합니다. 따라서 웹에서 파일을 지운 직후에는 반드시 로컬 터미널에서 아래 명령어를 실행하여 로컬 저장소로 변경 사항을 갱겨받아야 합니다.

```bash
git pull origin main
```

### ======================================================

