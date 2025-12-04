# 📖 Tracking Viewer 사용 가이드

빠르게 시작하고 효과적으로 사용하는 방법

---

## 🚀 1. 서버 시작하기

### 방법 1: 간단한 방법
```bash
# 터미널 1
cd ~/Dev/Repo/tracking-viewer/backend && npm run dev

# 터미널 2
cd ~/Dev/Repo/tracking-viewer/frontend && npm run dev

# 브라우저
open http://localhost:3000
```

### 방법 2: 한 줄로 실행 (tmux 사용 시)
```bash
cd ~/Dev/Repo/tracking-viewer
tmux new-session -d -s tracking "cd backend && npm run dev"
tmux split-window -h -t tracking "cd frontend && npm run dev"
tmux attach -t tracking
```

---

## 🎯 2. 테스트하기

### 더미 패킷 전송
```bash
# 자동 테스트 시작 (Ctrl+C로 중지)
./test-sender.sh
```

### 수동 패킷 전송
```bash
curl -X POST http://localhost:3001/api/packets \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'",
    "url": "https://track.tiara.kakao.com/event",
    "method": "POST",
    "tracking_type": "tiara",
    "params": {"event": "screen_view", "screen": "home"}
  }'
```

---

## 🔧 3. Proxyman 연동하기

### 준비사항 체크리스트
- [ ] Proxyman 설치됨
- [ ] Python requests 패키지 설치됨 (`pip3 list | grep requests`)
- [ ] 백엔드 서버 실행 중 (http://localhost:3001/health 확인)

### 연동 단계

#### Step 1: Proxyman 실행
```bash
open -a Proxyman
```

#### Step 2: 스크립트 추가
1. 메뉴: `Tools` → `Scripting`
2. `+` 버튼 클릭
3. 설정:
   - **Name**: `Kidsnote Tracking Filter`
   - **Script Type**: `Python`
   - **Trigger**: `Request & Response`
   - **File Path**: `~/Dev/Repo/tracking-viewer/proxyman-scripts/filter.py`
4. **Enable** 체크박스 활성화

#### Step 3: iOS 인증서 설치
```bash
# Proxyman 메뉴에서
Certificate → Install Certificate on iOS Simulator
```

#### Step 4: 테스트
1. iOS Simulator 실행
2. Safari에서 `https://track.tiara.kakao.com` 접속
3. 웹 대시보드 확인: http://localhost:3000
4. Proxyman Console에서 로그 확인

---

## 📊 4. 대시보드 사용법

### 필터링
- **All**: 모든 패킷
- **tiara**: Tiara 이벤트만
- **ad_impression**: 광고 노출
- **ad_click**: 광고 클릭
- **custom**: 커스텀 트래킹

### 패킷 상세보기
1. 왼쪽 테이블에서 패킷 클릭
2. 오른쪽에 상세 정보 표시:
   - Timestamp
   - URL
   - Method
   - Parameters (JSON)
   - Headers
   - Response (있는 경우)

---

## 🎨 5. 커스터마이징

### 필터링 패턴 수정

키즈노트 실제 도메인으로 변경:

```bash
vi ~/Dev/Repo/tracking-viewer/proxyman-scripts/filter.py
```

```python
TRACKING_PATTERNS = [
    # Tiara (카카오)
    "track.tiara.kakao.com",
    "pixel.tiara.kakao.com",

    # 키즈노트 실제 광고 지표 (실제 도메인으로 수정!)
    "ad.kidsnote.com/imp",
    "ad.kidsnote.com/click",
    "analytics.kidsnote.com",

    # 추가 패턴
    # "your-domain.com/tracking",
]
```

### 백엔드 포트 변경

```bash
# backend/.env 파일 수정
vi backend/.env

# PORT=3001 → 원하는 포트로 변경
PORT=8080
```

---

## 🔍 6. 유용한 명령어

### Health Check
```bash
curl http://localhost:3001/health
```

### 저장된 패킷 조회
```bash
# 최근 10개
curl -s http://localhost:3001/api/packets | python3 -m json.tool

# Tiara 이벤트만
curl -s http://localhost:3001/api/packets/type/tiara | python3 -m json.tool

# 검색
curl -s "http://localhost:3001/api/packets/search?q=screen_view" | python3 -m json.tool
```

### 포트 확인
```bash
lsof -i:3001  # 백엔드
lsof -i:3002  # WebSocket
lsof -i:3000  # 프론트엔드
```

---

## 🛠️ 7. 문제 해결

### 백엔드가 시작 안 됨
```bash
# 포트 확인 및 프로세스 종료
lsof -ti:3001 | xargs kill -9

# 재시작
cd backend && npm run dev
```

### 프론트엔드가 안 열림
```bash
# 포트 확인 및 프로세스 종료
lsof -ti:3000 | xargs kill -9

# 재시작
cd frontend && npm run dev
```

### Proxyman 스크립트 오류
```bash
# 권한 확인
chmod +x proxyman-scripts/filter.py

# Python 패키지 확인
pip3 install requests

# Python 경로 확인
which python3
# Proxyman Preferences → Scripting → Python Path에 동일한 경로 설정
```

### WebSocket 연결 안 됨
1. 백엔드 서버 실행 확인
2. 브라우저 개발자 도구 → Network → WS 탭 확인
3. 방화벽 설정 확인

---

## 📱 8. 실제 사용 시나리오

### 시나리오 1: 새로운 이벤트 테스트
1. iOS 앱에 새 트래킹 코드 추가
2. Proxyman + iOS Simulator 연결
3. 앱에서 해당 액션 수행
4. 대시보드에서 실시간 확인
5. 파라미터 검증

### 시나리오 2: 광고 지표 확인
1. 광고 도메인을 `TRACKING_PATTERNS`에 추가
2. Proxyman 스크립트 재시작
3. 앱에서 광고 노출/클릭
4. 대시보드에서 imp/click 패킷 확인

### 시나리오 3: 디버깅
1. 문제가 있는 이벤트 발생
2. 대시보드에서 해당 패킷 찾기
3. 파라미터 상세 확인
4. 문제 원인 파악

---

## 🔐 9. 보안 주의사항

⚠️ **중요**: 이 시스템은 개발/테스트용입니다.

- 실제 사용자 데이터 캡처 금지
- 프로덕션 환경에서 사용 금지
- 민감한 정보 (토큰, 비밀번호 등) 필터링
- 로컬 네트워크에서만 사용

---

## 📞 10. 도움말

### 문서
- [README.md](README.md) - 프로젝트 개요
- [QUICK_START.md](QUICK_START.md) - 5분 가이드
- [docs/setup.md](docs/setup.md) - 상세 설정
- [docs/api.md](docs/api.md) - API 레퍼런스

### 문의
- GitHub Issues: https://github.com/Allen-han21/tracking-viewer/issues
- 팀원: Allen @ Kidsnote

---

**Happy Tracking!** 🚀
