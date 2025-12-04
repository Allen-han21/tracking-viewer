# Tracking Viewer

키즈노트 트래킹 패킷 캡처 및 통합 모니터링 시스템

## 개요

iOS/Android 앱에서 전송하는 트래킹 패킷을 실시간으로 캡처하고, 한눈에 볼 수 있는 통합 웹 대시보드를 제공합니다.

### 주요 기능

- 📡 **실시간 패킷 캡처**: Proxyman을 활용한 트래킹 패킷 캡처
- 🎯 **자동 분류**: Tiara, 광고 지표(imp/click), 커스텀 지표 자동 분류
- 🔍 **통합 뷰어**: 모든 지표를 한 화면에서 확인
- 🔎 **검색 & 필터링**: 이벤트 타입, 시간, 파라미터로 필터링
- 📊 **실시간 모니터링**: WebSocket을 통한 실시간 업데이트

## 아키텍처

```
[iOS/Android App]
       ↓ HTTP/HTTPS 요청
[Proxyman (로컬 프록시)]
       ↓ 패킷 캡처
[Proxyman Scripting]
       ↓ 필터링 & 파싱
[Backend API Server]
       ↓ WebSocket
[Web Dashboard]
```

## 프로젝트 구조

```
tracking-viewer/
├── backend/              # Node.js/TypeScript API 서버
│   ├── src/
│   │   ├── routes/       # API 라우트
│   │   ├── services/     # 비즈니스 로직
│   │   ├── models/       # 데이터 모델
│   │   └── websocket/    # WebSocket 핸들러
│   └── package.json
│
├── frontend/             # React 웹 대시보드
│   ├── src/
│   │   ├── components/   # UI 컴포넌트
│   │   ├── pages/        # 페이지
│   │   ├── hooks/        # 커스텀 훅
│   │   └── lib/          # 유틸리티
│   └── package.json
│
├── proxyman-scripts/     # Proxyman 자동화 스크립트
│   ├── filter.py         # 패킷 필터링
│   └── export.py         # 데이터 추출
│
└── docs/                 # 문서
    ├── setup.md          # 설치 가이드
    └── api.md            # API 문서
```

## 빠른 시작

### 요구사항

- Node.js 20+
- Python 3.11+
- Proxyman (macOS)
- iOS Simulator 또는 실제 디바이스

### 설치

1. 저장소 클론
```bash
git clone https://github.com/kidsnote/tracking-viewer.git
cd tracking-viewer
```

2. 백엔드 설치 및 실행
```bash
cd backend
npm install
npm run dev
```

3. 프론트엔드 설치 및 실행
```bash
cd frontend
npm install
npm run dev
```

4. Proxyman 설정
- Proxyman 실행
- iOS 디바이스/시뮬레이터 연결
- SSL Proxying 활성화
- `proxyman-scripts/` 디렉토리의 스크립트 추가

자세한 설정은 [docs/setup.md](docs/setup.md)를 참고하세요.

## 사용법

1. Proxyman에서 트래킹 패킷 캡처 시작
2. 웹 브라우저에서 `http://localhost:3000` 접속
3. 실시간으로 패킷 확인 및 필터링

## 개발 로드맵

### Phase 1: MVP (현재)
- [x] 프로젝트 구조 설정
- [ ] Proxyman 스크립트 작성
- [ ] 기본 백엔드 API
- [ ] 기본 프론트엔드 UI

### Phase 2: 핵심 기능
- [ ] 실시간 WebSocket 통신
- [ ] 패킷 필터링 & 검색
- [ ] 데이터 저장 (SQLite)

### Phase 3: 고도화
- [ ] 통계 & 차트
- [ ] 알림 기능
- [ ] 테스트 케이스 저장

## 기여

이슈와 PR을 환영합니다!

## 라이선스

MIT License

---

**개발**: Allen @ Kidsnote
**마지막 업데이트**: 2025-12-05
