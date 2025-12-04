# 다음 단계

프로젝트 초기 설정이 완료되었습니다! 이제 다음 단계를 진행하세요.

## 1. 의존성 설치

### 백엔드
```bash
cd backend
npm install
```

### 프론트엔드
```bash
cd frontend
npm install
```

### Proxyman 스크립트 (Python)
```bash
pip3 install requests
```

## 2. 환경 변수 설정

### 백엔드
```bash
cd backend
cp .env.example .env
# .env 파일 내용 확인 및 필요시 수정
```

### 프론트엔드
```bash
cd frontend
cp .env.example .env
# .env 파일 내용 확인 및 필요시 수정
```

## 3. 개발 서버 실행

### 터미널 1: 백엔드 서버
```bash
cd backend
npm run dev
```

서버가 정상 실행되면:
- API: http://localhost:3001
- WebSocket: ws://localhost:3002

### 터미널 2: 프론트엔드 서버
```bash
cd frontend
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 4. Proxyman 설정

### 4.1 Proxyman 실행 및 인증서 설치

1. Proxyman 실행
2. `Certificate` → `Install Certificate on this Mac`
3. iOS Simulator 사용 시: `Certificate` → `Install Certificate on iOS Simulator`

### 4.2 스크립팅 설정

1. Proxyman 메뉴: `Tools` → `Scripting`
2. 새 스크립트 추가 버튼 클릭
3. 설정:
   - **Name**: `Kidsnote Tracking Filter`
   - **Script Type**: `Python`
   - **File Path**: `proxyman-scripts/filter.py` 선택
4. **Enable** 체크박스 활성화

### 4.3 필터링 패턴 커스터마이징

`proxyman-scripts/filter.py` 파일을 열어서 `TRACKING_PATTERNS` 배열을 수정:

```python
TRACKING_PATTERNS = [
    # Tiara (카카오)
    "track.tiara.kakao.com",
    "pixel.tiara.kakao.com",

    # 자체 광고 지표 (실제 도메인으로 수정 필요)
    "/ad/imp",
    "/ad/click",
    "/tracking/impression",
    "/tracking/click",

    # 새로운 패턴 추가
    "your-actual-tracking-domain.com",
]
```

## 5. iOS 앱 테스트

### Simulator 사용
1. iOS Simulator 실행
2. Proxyman에 자동 연결됨
3. 키즈노트 앱 실행
4. 트래킹 이벤트 발생 시 자동으로 캡처되어 웹 대시보드에 표시

### 실제 디바이스 사용
1. Mac과 iPhone을 같은 Wi-Fi에 연결
2. iPhone 설정:
   - `설정` → `Wi-Fi` → 연결된 네트워크 → `ⓘ` 클릭
   - `HTTP 프록시` → `수동`
   - 서버: Mac의 IP 주소 (예: 192.168.1.100)
   - 포트: `9090`
3. Proxyman: `Certificate` → `Install Certificate on iOS Device`
4. iPhone에서 프로필 설치 및 신뢰 설정
5. 키즈노트 앱 실행 및 테스트

## 6. 동작 확인

1. 백엔드 Health Check:
   ```bash
   curl http://localhost:3001/health
   # 응답: {"status":"ok", ...}
   ```

2. 웹 대시보드 접속: http://localhost:3000

3. iOS 앱에서 트래킹 이벤트 발생:
   - Proxyman에서 패킷 캡처 확인
   - 웹 대시보드에 실시간으로 표시되는지 확인

## 7. 트러블슈팅

### 패킷이 캡처되지 않음
1. Proxyman의 SSL Proxying 활성화 확인
2. iOS 디바이스의 프록시 설정 확인
3. 인증서 신뢰 설정 확인 (iOS: `설정` → `일반` → `정보` → `인증서 신뢰 설정`)
4. `TRACKING_PATTERNS`에 올바른 도메인이 있는지 확인

### WebSocket 연결 실패
1. 백엔드 서버 실행 확인
2. 브라우저 개발자 도구 → Network → WS 탭에서 연결 상태 확인
3. 방화벽 설정 확인

### Python 스크립트 오류
1. Python 버전 확인: `python3 --version` (3.11 이상)
2. 필요한 패키지 설치: `pip3 install requests`
3. Proxyman의 Python 경로 확인: `Preferences` → `Scripting`

## 8. 다음 개발 단계

### Phase 2: 핵심 기능
- [ ] 검색 기능 고도화
- [ ] 필터링 UI 개선
- [ ] 통계 대시보드 추가

### Phase 3: 고급 기능
- [ ] 패킷 비교 기능
- [ ] 알림 설정
- [ ] 테스트 케이스 저장

### Phase 4: 배포
- [ ] Docker 컨테이너화
- [ ] CI/CD 설정
- [ ] 프로덕션 환경 설정

## 참고 문서

- [설치 가이드](docs/setup.md)
- [API 문서](docs/api.md)
- [Proxyman Documentation](https://docs.proxyman.io/)

## 문의

이슈가 있으면 GitHub Issues에 등록해주세요.

---

**Happy Tracking!** 🚀
