# Proxyman Scripts

Proxyman 자동화 스크립트 모음

## 스크립트 목록

### filter.py

트래킹 패킷을 필터링하고 백엔드 서버로 전송하는 메인 스크립트

**기능**:
- Tiara, 광고 지표, 커스텀 트래킹 URL 자동 감지
- 패킷 파싱 및 구조화
- 백엔드 API로 실시간 전송

**설정 방법**:

1. Proxyman 실행
2. 메뉴: `Tools` → `Scripting`
3. 새 스크립트 추가:
   - Name: `Kidsnote Tracking Filter`
   - Script Type: `Python`
   - File: `filter.py` 선택
4. Enable 체크

**커스터마이징**:

`filter.py`의 `TRACKING_PATTERNS` 배열을 수정하여 필터링 대상 추가/제거:

```python
TRACKING_PATTERNS = [
    "track.tiara.kakao.com",
    "/ad/imp",
    "/ad/click",
    # 새로운 패턴 추가
    "your-tracking-domain.com",
    "/custom/tracking/path",
]
```

## 요구사항

```bash
pip3 install requests
```

## 트러블슈팅

### 스크립트가 실행되지 않음

1. Python 버전 확인: `python3 --version` (3.11 이상)
2. Proxyman의 Python 경로 확인: `Preferences` → `Scripting` → `Python Path`
3. 스크립트 권한 확인: `chmod +x filter.py`

### 패킷이 캡처되지 않음

1. `TRACKING_PATTERNS`에 올바른 도메인/경로가 있는지 확인
2. Proxyman의 SSL Proxying이 활성화되어 있는지 확인
3. 스크립트 로그 확인: Proxyman의 `Console` 탭

### 백엔드로 전송 실패

1. 백엔드 서버가 실행 중인지 확인: `curl http://localhost:3001/health`
2. `BACKEND_URL`이 올바른지 확인
3. 방화벽 설정 확인

## 개발

### 로컬 테스트

```bash
# 스크립트 문법 확인
python3 filter.py

# 단위 테스트 (예정)
pytest test_filter.py
```

### 새로운 스크립트 추가

1. 새 Python 파일 생성 (예: `export.py`)
2. Proxyman 필요 함수 구현:
   - `onRequest(context, request)`
   - `onResponse(context, request, response)`
3. Proxyman에 스크립트 등록
