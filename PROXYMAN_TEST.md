# Proxyman 연동 테스트 가이드

## 📋 현재 상태

✅ Proxyman 설치됨: `/Applications/Proxyman.app`
✅ Proxyman 실행됨
✅ Python requests 패키지 설치됨
✅ 백엔드 서버 실행 중: http://localhost:3001
✅ 프론트엔드 대시보드: http://localhost:3000

---

## 🔧 Step 1: Proxyman 스크립트 등록

### 1-1. Proxyman에서 Scripting 열기

Proxyman 상단 메뉴에서:
```
Tools → Scripting
```

또는 단축키: `⌘⇧S` (Cmd+Shift+S)

### 1-2. 새 스크립트 추가

1. Scripting 창에서 **왼쪽 하단 `+` 버튼** 클릭
2. 다음 정보 입력:

```
Name:           Kidsnote Tracking Filter
Script Type:    Python
Trigger:        Request & Response (기본값)
File Path:      클릭하여 선택
```

### 1-3. 스크립트 파일 선택

파일 선택 창에서 다음 경로로 이동:

```
~/Dev/Repo/tracking-viewer/proxyman-scripts/filter.py
```

또는 Finder에서:
```bash
# Finder 열기
open ~/Dev/Repo/tracking-viewer/proxyman-scripts
```

`filter.py` 파일 선택

### 1-4. 스크립트 활성화

- **Enable** 체크박스 활성화 ✅
- Save 또는 Apply 클릭

---

## 🧪 Step 2: 테스트 준비

### 2-1. 백엔드 Health Check

```bash
curl http://localhost:3001/health
# 응답: {"status":"ok",...}
```

### 2-2. 현재 저장된 패킷 수 확인

```bash
curl -s http://localhost:3001/api/packets | python3 -c "import sys, json; print(f'현재 패킷: {json.load(sys.stdin)[\"count\"]}개')"
```

### 2-3. 대시보드 열기

```bash
open http://localhost:3000
```

---

## 🚀 Step 3: Proxyman으로 테스트 요청 보내기

### 방법 1: curl로 Proxyman 프록시 통과시키기

```bash
# Proxyman 기본 프록시: localhost:9090
curl -x http://localhost:9090 \
  -H "Content-Type: application/json" \
  "https://track.tiara.kakao.com/event?test=proxyman"
```

### 방법 2: Proxyman Tools 메뉴 사용

Proxyman 메뉴:
```
Tools → Compose → New Request
```

설정:
```
Method:     GET 또는 POST
URL:        https://track.tiara.kakao.com/event
Headers:    Content-Type: application/json
Query:      test=proxyman
```

**Send** 클릭!

### 방법 3: 브라우저에서 직접 (Mac 프록시 설정 필요)

```bash
# Mac 시스템 프록시를 Proxyman으로 설정 (Proxyman이 자동으로 할 수도 있음)
# 그 후 Safari에서 접속
open "https://track.tiara.kakao.com"
```

---

## ✅ Step 4: 결과 확인

### 4-1. Proxyman Console 확인

Proxyman 하단 Console 탭에서:
```
[✓] Captured: tiara - https://track.tiara.kakao.com/event
```

또는

```
[✗] Failed to send: ... (에러 메시지)
```

### 4-2. 백엔드 로그 확인

백엔드가 실행 중인 터미널에서:
```
📡 Broadcasted packet to X client(s)
```

### 4-3. 웹 대시보드 확인

http://localhost:3000 에서:
- 새로운 패킷이 **실시간**으로 나타나는지 확인
- 왼쪽 테이블에 `tiara` 타입 패킷 추가됨
- 클릭하면 오른쪽에 상세 정보 표시

---

## 🐛 문제 해결

### 스크립트가 실행되지 않음

#### 확인 1: Python 경로
```bash
which python3
# 출력: /usr/bin/python3 또는 비슷한 경로
```

Proxyman에서:
```
Proxyman → Preferences → Scripting → Python Path
```
위 경로와 동일한지 확인

#### 확인 2: 스크립트 권한
```bash
ls -la ~/Dev/Repo/tracking-viewer/proxyman-scripts/filter.py
# -rwxr-xr-x 또는 비슷한 권한이어야 함

# 권한 없으면 추가
chmod +x ~/Dev/Repo/tracking-viewer/proxyman-scripts/filter.py
```

#### 확인 3: Python 패키지
```bash
pip3 list | grep requests
# requests 2.31.0 또는 비슷한 버전
```

### Proxyman이 패킷을 캡처하지 못함

#### SSL Proxying 활성화 확인
```
Proxyman → Certificate → Install Certificate on this Mac
```

#### 필터링 규칙 확인
`filter.py`의 `TRACKING_PATTERNS` 확인:
```bash
cat ~/Dev/Repo/tracking-viewer/proxyman-scripts/filter.py | grep -A 10 "TRACKING_PATTERNS"
```

### 백엔드로 전송 안 됨

#### 백엔드 Health Check
```bash
curl http://localhost:3001/health
# 응답이 없으면 백엔드가 중지된 것
```

#### 재시작
```bash
cd ~/Dev/Repo/tracking-viewer/backend
npm run dev
```

---

## 📊 성공 시 예상 결과

### Proxyman Console
```
[✓] Captured: tiara - https://track.tiara.kakao.com/event?test=proxyman
```

### 백엔드 터미널
```
📡 Broadcasted packet to 1 client(s)
```

### 웹 대시보드
- 새 패킷 행 추가 (실시간)
- Type: `tiara` (보라색 배지)
- URL: `https://track.tiara.kakao.com/event?test=proxyman`
- 클릭 시 오른쪽에 상세 정보

### API 확인
```bash
curl -s http://localhost:3001/api/packets/type/tiara | python3 -m json.tool
```

---

## 🎯 다음 단계

### 실제 iOS 앱 테스트

1. **iOS Simulator 연결**
   ```
   Proxyman → Certificate → Install Certificate on iOS Simulator
   ```

2. **iOS 앱 실행**
   - 키즈노트 앱 실행
   - 화면 이동, 버튼 클릭 등

3. **실시간 모니터링**
   - Proxyman에서 트래킹 패킷 캡처
   - 대시보드에서 실시간 확인

### 필터링 패턴 커스터마이징

실제 키즈노트 도메인으로 수정:
```bash
vi ~/Dev/Repo/tracking-viewer/proxyman-scripts/filter.py
```

---

**성공하셨나요?** 🎉

문제가 있으면 위 문제 해결 섹션을 참고하거나 팀원에게 문의하세요!
