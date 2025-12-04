# Tracking Viewer 설치 가이드

## 시스템 요구사항

- macOS (Proxyman 필요)
- Node.js 20 이상
- Python 3.11 이상
- Proxyman (최신 버전)

## 1. 개발 환경 설정

### Node.js 설치
```bash
# Homebrew를 통한 설치
brew install node@20

# 버전 확인
node --version  # v20.x.x
npm --version   # 10.x.x
```

### Python 설치
```bash
# Homebrew를 통한 설치
brew install python@3.11

# 버전 확인
python3 --version  # 3.11.x
```

### Proxyman 설치
1. [Proxyman 공식 웹사이트](https://proxyman.io/)에서 다운로드
2. 애플리케이션 폴더에 설치
3. 실행 및 초기 설정 완료

## 2. 프로젝트 설정

### 저장소 클론
```bash
git clone https://github.com/kidsnote/tracking-viewer.git
cd tracking-viewer
```

### 백엔드 설정

```bash
cd backend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
```

`.env` 파일 설정:
```env
PORT=3001
WEBSOCKET_PORT=3002
DATABASE_PATH=./data/tracking.db
LOG_LEVEL=debug
```

### 프론트엔드 설정

```bash
cd frontend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
```

`.env` 파일 설정:
```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3002
```

## 3. Proxyman 설정

### SSL Proxying 활성화

1. Proxyman 실행
2. 메뉴: `Certificate` → `Install Certificate on this Mac`
3. 시스템 인증서 설치

### iOS 디바이스 연결

#### 시뮬레이터 사용 시
1. iOS Simulator 실행
2. Proxyman: `Certificate` → `Install Certificate on iOS Simulator`
3. 자동 설정 완료

#### 실제 디바이스 사용 시
1. Mac과 iPhone을 같은 Wi-Fi에 연결
2. iPhone 설정:
   - `설정` → `Wi-Fi` → 연결된 네트워크의 `ⓘ` 클릭
   - `HTTP 프록시` → `수동`
   - 서버: Mac의 IP 주소
   - 포트: `9090` (Proxyman 기본 포트)
3. Proxyman: `Certificate` → `Install Certificate on iOS Device`
4. iPhone에서 프로필 설치 및 신뢰 설정

### Proxyman 필터링 규칙 설정

1. Proxyman 메뉴: `Tools` → `Scripting`
2. 새 스크립트 추가:
   - 이름: `Kidsnote Tracking Filter`
   - 경로: `proxyman-scripts/filter.py`

## 4. 실행

### 백엔드 실행
```bash
cd backend
npm run dev
```

실행 확인:
```bash
curl http://localhost:3001/health
# {"status":"ok"}
```

### 프론트엔드 실행
```bash
cd frontend
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### Proxyman 실행
1. Proxyman 실행
2. iOS 앱 실행 (Simulator 또는 실제 디바이스)
3. 트래킹 패킷이 자동으로 캡처되어 웹 대시보드에 표시됨

## 5. 트러블슈팅

### Proxyman이 패킷을 캡처하지 못함

**증상**: iOS 앱의 네트워크 요청이 Proxyman에 표시되지 않음

**해결방법**:
1. iOS 디바이스의 프록시 설정 확인
2. Proxyman의 SSL Proxying 활성화 확인
3. 인증서 신뢰 설정 확인 (iOS: `설정` → `일반` → `정보` → `인증서 신뢰 설정`)

### WebSocket 연결 실패

**증상**: 프론트엔드에서 실시간 업데이트가 안 됨

**해결방법**:
1. 백엔드 서버가 실행 중인지 확인
2. WebSocket 포트(3002) 방화벽 확인
3. 브라우저 개발자 도구에서 WebSocket 연결 상태 확인

### Python 스크립트 실행 오류

**증상**: Proxyman 스크립트가 실행되지 않음

**해결방법**:
1. Python 버전 확인 (3.11 이상)
2. 필요한 패키지 설치:
   ```bash
   pip3 install requests
   ```
3. Proxyman의 Python 경로 설정 확인

## 6. 다음 단계

- [API 문서](api.md) 확인
- 커스텀 필터링 규칙 추가
- 대시보드 커스터마이징

## 문의

이슈가 발생하면 GitHub Issues에 등록해주세요.
