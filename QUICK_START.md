# 빠른 시작 가이드

5분 안에 Tracking Viewer를 실행하는 방법

## 1. 서버 실행 (1분)

### 터미널 1: 백엔드
```bash
cd ~/Dev/Repo/tracking-viewer/backend
npm run dev
```

✅ 출력 확인:
```
🚀 API Server running on http://localhost:3001
🔌 WebSocket Server running on ws://localhost:3002
```

### 터미널 2: 프론트엔드
```bash
cd ~/Dev/Repo/tracking-viewer/frontend
npm run dev
```

✅ 출력 확인:
```
➜  Local:   http://localhost:3000/
```

## 2. 브라우저에서 확인 (30초)

```bash
open http://localhost:3000
```

또는 브라우저에서 직접 접속: http://localhost:3000

**화면이 보이나요?** ✅ 다음 단계로!

## 3. 테스트 패킷 전송 (1분)

### 방법 1: 자동 테스트 스크립트

```bash
cd ~/Dev/Repo/tracking-viewer
./test-sender.sh
```

브라우저에서 실시간으로 패킷이 나타나는 것을 확인하세요!

### 방법 2: 수동 테스트 (단일 패킷)

```bash
curl -X POST http://localhost:3001/api/packets \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'",
    "url": "https://track.tiara.kakao.com/event",
    "method": "POST",
    "tracking_type": "tiara",
    "params": {"event": "test", "screen": "home"}
  }'
```

## 4. Proxyman 연동 (3분)

### 4.1 Python 패키지 설치
```bash
pip3 install requests
```

### 4.2 Proxyman 설정

1. **Proxyman 실행**
   ```bash
   open -a Proxyman
   ```

2. **스크립트 추가**
   - 메뉴: `Tools` → `Scripting`
   - `+` 버튼 클릭
   - 설정:
     - Name: `Kidsnote Tracking Filter`
     - Script Type: `Python`
     - File Path: `proxyman-scripts/filter.py` 선택
   - **Enable** 체크

3. **인증서 설치** (iOS Simulator 사용 시)
   - `Certificate` → `Install Certificate on iOS Simulator`

4. **테스트**
   - iOS Simulator에서 Safari 열기
   - `https://track.tiara.kakao.com` 접속
   - 웹 대시보드에서 패킷 확인!

### 4.3 필터링 패턴 커스터마이징

키즈노트 실제 도메인으로 변경:

```bash
vi proxyman-scripts/filter.py
```

```python
TRACKING_PATTERNS = [
    # Tiara
    "track.tiara.kakao.com",

    # 키즈노트 실제 광고 지표 (도메인 수정 필요!)
    "your-ad-domain.com/imp",
    "your-ad-domain.com/click",

    # 추가 패턴
    # "analytics.kidsnote.com",
]
```

## 5. 실제 사용

### iOS 앱에서 트래킹 이벤트 발생
1. Proxyman에서 iOS 디바이스 연결
2. 키즈노트 앱 실행
3. 화면 이동, 버튼 클릭 등 액션 수행
4. 웹 대시보드에서 실시간 확인!

### 필터링
- **All**: 모든 패킷
- **tiara**: Tiara 이벤트만
- **ad_impression**: 광고 노출만
- **ad_click**: 광고 클릭만
- **custom**: 커스텀 트래킹

## 트러블슈팅

### 백엔드 연결 실패
```bash
# Health check
curl http://localhost:3001/health

# 포트 확인
lsof -ti:3001
```

### 프론트엔드 안 열림
```bash
# 포트 확인
lsof -ti:3000

# 재시작
cd frontend
npm run dev
```

### Proxyman 스크립트 안 됨
```bash
# Python 경로 확인
which python3

# 패키지 확인
pip3 list | grep requests

# 권한 확인
chmod +x proxyman-scripts/filter.py
```

## 서버 중지

```bash
# 포트별 프로세스 종료
lsof -ti:3001,3002,3000 | xargs kill -9
```

## 다음 단계

- [상세 설정 가이드](docs/setup.md)
- [API 문서](docs/api.md)
- [Proxyman 설정](proxyman-scripts/setup-guide.md)

---

**문제가 있나요?** GitHub Issues에 등록하거나 팀원에게 문의하세요!
