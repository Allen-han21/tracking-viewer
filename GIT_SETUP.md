# GitHub 저장소 연결 가이드

현재 로컬 Git 저장소만 초기화된 상태입니다.

## 현재 상태

```bash
cd ~/Dev/Repo/tracking-viewer
git log --oneline
# af839a2 docs: Add API documentation and next steps guide
# 6e4dc34 feat: Initial project setup for tracking-viewer
```

## GitHub에 올리기

### 방법 1: GitHub CLI 사용 (권장)

```bash
cd ~/Dev/Repo/tracking-viewer

# GitHub 저장소 생성 및 자동 push
gh repo create tracking-viewer --public --source=. --push

# 또는 private 저장소로
gh repo create tracking-viewer --private --source=. --push
```

### 방법 2: 수동 설정

#### 1. GitHub에서 저장소 생성
1. https://github.com/new 접속
2. Repository name: `tracking-viewer`
3. Public/Private 선택
4. **Initialize this repository with** 옵션은 모두 체크 해제
5. "Create repository" 클릭

#### 2. 로컬 저장소와 연결

```bash
cd ~/Dev/Repo/tracking-viewer

# Remote 추가 (GitHub 계정명을 실제 계정으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/tracking-viewer.git

# 또는 SSH 사용
git remote add origin git@github.com:YOUR_USERNAME/tracking-viewer.git

# 브랜치 이름 설정 (이미 main이면 생략 가능)
git branch -M main

# Push
git push -u origin main
```

## 확인

```bash
# Remote 확인
git remote -v

# 브랜치 확인
git branch -a

# 최근 커밋 확인
git log --oneline
```

## 다음 작업 시

```bash
# 변경사항 확인
git status

# 스테이징
git add .

# 커밋
git commit -m "feat: Add new feature"

# Push
git push
```

---

**참고**: 현재는 로컬에만 2개의 커밋이 있습니다. GitHub에 올리기 전까지는 온라인에서 확인할 수 없습니다.
