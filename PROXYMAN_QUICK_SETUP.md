# 🚀 Proxyman 빠른 설정 (1분)

Proxyman 스크립트를 등록하고 테스트하는 가장 빠른 방법

---

## ✅ 현재 상태

- ✅ Proxyman 실행됨
- ✅ 백엔드: http://localhost:3001 (실행 중)
- ✅ 대시보드: http://localhost:3000 (열림)

---

## 📝 Step 1: Proxyman 스크립트 등록 (30초)

### Proxyman에서 해야 할 일:

1. **메뉴 클릭**
   ```
   Tools → Scripting
   ```
   (또는 단축키: ⌘⇧S)

2. **왼쪽 하단 `+` 버튼 클릭**

3. **정보 입력**
   ```
   Name:        Kidsnote Tracking Filter
   Type:        Python
   Trigger:     Request & Response (기본값)
   ```

4. **File Path 클릭** → 다음 경로에서 파일 선택
   ```
   ~/Dev/Repo/tracking-viewer/proxyman-scripts/filter.py
   ```

5. **Enable 체크박스 활성화** ✅

6. **Save/Apply 클릭**

---

## 🧪 Step 2: 즉시 테스트 (30초)

### 터미널에서 실행:

```bash
# Proxyman 프록시를 통해 테스트 요청
curl -x http://localhost:9090 "https://track.tiara.kakao.com/event?test=success"
```

### 확인할 곳 3곳:

1. **Proxyman Console** (하단)
   ```
   [✓] Captured: tiara - https://track.tiara.kakao.com/event
   ```

2. **브라우저 대시보드** (http://localhost:3000)
   - 새 패킷이 실시간으로 나타남
   - Type: `tiara` (보라색)

3. **터미널로 확인**
   ```bash
   curl -s http://localhost:3001/api/packets/type/tiara | python3 -m json.tool
   ```

---

## ❌ 안 될 때

### 스크립트 실행 안 됨

```bash
# 1. Python 경로 확인
which python3

# 2. Proxyman Preferences → Scripting → Python Path
#    위 경로와 동일하게 설정

# 3. 권한 확인
chmod +x ~/Dev/Repo/tracking-viewer/proxyman-scripts/filter.py
```

### 백엔드 연결 안 됨

```bash
# Health check
curl http://localhost:3001/health

# 안 되면 재시작
cd ~/Dev/Repo/tracking-viewer/backend && npm run dev
```

---

## 🎉 성공!

이제 Proxyman으로 캡처한 모든 트래킹 패킷이:
1. 자동으로 필터링되고
2. 백엔드로 전송되고
3. 대시보드에 실시간 표시됩니다!

---

**다음**: iOS 앱 연결 → 실제 트래킹 이벤트 캡처!
