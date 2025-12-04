# Proxyman 스크립트 설정 가이드

## 1. Proxyman 설치 확인

```bash
# Proxyman이 설치되어 있는지 확인
ls /Applications | grep Proxyman
```

Proxyman이 없다면 https://proxyman.io 에서 다운로드

## 2. Python 패키지 설치

```bash
pip3 install requests
```

## 3. Proxyman Scripting 설정

### 3.1 Proxyman 실행

1. Proxyman 앱 실행
2. 상단 메뉴: `Tools` → `Scripting`

### 3.2 스크립트 추가

1. Scripting 창에서 `+` 버튼 클릭
2. 다음 정보 입력:
   - **Name**: `Kidsnote Tracking Filter`
   - **Script Type**: `Python`
   - **Trigger**: `Request & Response`
   - **File Path**: `proxyman-scripts/filter.py` 경로 선택

3. **Enable** 체크박스 활성화

### 3.3 백엔드 서버 실행 확인

스크립트가 패킷을 전송하려면 백엔드 서버가 실행 중이어야 합니다:

```bash
curl http://localhost:3001/health
# {"status":"ok",...} 응답이 오면 정상
```

## 4. 필터링 패턴 커스터마이징

### 키즈노트 실제 도메인으로 변경

`proxyman-scripts/filter.py` 파일을 열어서 `TRACKING_PATTERNS` 배열을 수정:

```python
TRACKING_PATTERNS = [
    # Tiara (카카오)
    "track.tiara.kakao.com",
    "pixel.tiara.kakao.com",

    # 키즈노트 광고 지표 (실제 도메인으로 수정 필요!)
    "kidsnote.com/ad/imp",
    "kidsnote.com/ad/click",
    "analytics.kidsnote.com",

    # 추가 패턴
    # "your-domain.com/tracking",
]
```

## 5. 테스트

### 5.1 수동 테스트

터미널에서 직접 패킷 전송:

```bash
curl -X POST http://localhost:3001/api/packets \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'",
    "url": "https://track.tiara.kakao.com/event",
    "method": "POST",
    "tracking_type": "tiara",
    "params": {"event": "test"}
  }'
```

### 5.2 웹 대시보드 확인

1. 브라우저에서 http://localhost:3000 열기
2. 패킷이 실시간으로 나타나는지 확인

### 5.3 Proxyman에서 테스트

1. Proxyman에서 iOS 시뮬레이터 연결
2. Safari나 앱에서 `https://track.tiara.kakao.com` 접속 시도
3. Proxyman Console에서 로그 확인:
   ```
   [✓] Captured: tiara - https://track.tiara.kakao.com/event
   ```
4. 웹 대시보드에서 실시간 확인

## 6. 트러블슈팅

### 스크립트가 실행되지 않음

**증상**: Proxyman에서 패킷을 캡처하지만 백엔드로 전송되지 않음

**해결**:
1. Proxyman Console 탭에서 에러 메시지 확인
2. Python 경로 확인:
   ```bash
   which python3
   # Proxyman Preferences → Scripting → Python Path에 동일한 경로 설정
   ```
3. 스크립트 권한 확인:
   ```bash
   chmod +x proxyman-scripts/filter.py
   ```

### 백엔드 연결 실패

**증상**: `[✗] Failed to send: ...`

**해결**:
1. 백엔드 서버 실행 확인
2. BACKEND_URL이 올바른지 확인 (filter.py 파일 내)
3. 방화벽 확인

### SSL 인증서 오류

**증상**: iOS에서 HTTPS 요청이 캡처되지 않음

**해결**:
1. Proxyman: `Certificate` → `Install Certificate on iOS Simulator`
2. iOS 설정 → 일반 → 정보 → 인증서 신뢰 설정
3. Proxyman 인증서 신뢰 활성화

## 7. 다음 단계

- [ ] iOS 앱에서 실제 트래킹 이벤트 테스트
- [ ] 광고 지표 URL 확인 및 추가
- [ ] 필터링 조건 고도화
- [ ] 알림 기능 추가

---

**도움이 필요하면**: GitHub Issues에 등록 또는 팀원에게 문의
