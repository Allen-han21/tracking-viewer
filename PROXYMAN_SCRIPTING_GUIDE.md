# Proxyman Scripting Tool 사용 가이드

Proxyman Scripting Tool은 **JavaScript**를 사용합니다 (Python 아님!)

---

## ✅ 준비 완료

- ✅ JavaScript 스크립트 생성: `proxyman-scripts/filter.js`
- ✅ 실제 키즈노트 도메인 반영:
  - `stat.tiara.daum.net`
  - `tr.ad.daum.net`
  - `/imp?cpid`
  - `/kidsnote_benefit/*/click?`

---

## 📝 스크립트 등록 방법

### Step 1: Proxyman Scripting 열기

```
Tools → Scripting (또는 ⌘⇧S)
```

### Step 2: 새 규칙 만들기

1. **왼쪽 하단 `+` 버튼 클릭** (New 버튼)

2. **Matching Rule 설정**
   - Method: `ANY`
   - URL: `*` (모든 URL) 또는
   - URL: `*tiara*` (Tiara만) 또는
   - URL: `*kidsnote*` (키즈노트만)

3. **Response 탭으로 이동**

4. **Add Custom JavaScript** 클릭

### Step 3: JavaScript 코드 입력

`proxyman-scripts/filter.js` 파일 내용을 복사해서 붙여넣기:

```bash
# 파일 내용 복사
cat ~/Dev/Repo/tracking-viewer/proxyman-scripts/filter.js | pbcopy
```

또는 직접 열어서 복사:
```bash
open ~/Dev/Repo/tracking-viewer/proxyman-scripts/filter.js
```

### Step 4: 활성화

- **Enable Scripting Tool** 체크 ✅ (상단)
- 새로 만든 규칙의 체크박스도 활성화 ✅

---

## 🧪 테스트

### 테스트 요청 보내기

```bash
# Tiara 테스트
curl -x http://localhost:9090 "https://stat.tiara.daum.net/event?test=1"

# 광고 테스트
curl -x http://localhost:9090 "https://api.kidsnote.com/imp?cpid=123"
```

### 확인할 곳

1. **Proxyman Console** (하단)
   ```
   [✓] Sent to backend: tiara - https://stat.tiara.daum.net/event
   ```

2. **웹 대시보드** (http://localhost:3000)
   - 새 패킷 실시간 표시

3. **터미널**
   ```bash
   curl -s http://localhost:3001/api/packets | python3 -c "import sys, json; print(f\"총 {json.load(sys.stdin)['count']}개\")"
   ```

---

## 📋 대체 방법: Rule-based 접근

JavaScript가 복잡하다면, 간단한 방법:

### 1. Proxyman에서 패킷 캡처만 하기

- Proxyman으로 트래킹 패킷 캡처
- Filter 설정으로 특정 도메인만 표시
- 수동으로 확인

### 2. Webhook/Export 사용

일부 Proxyman 버전은 Webhook 기능 지원:
- 캡처한 패킷을 자동으로 HTTP POST
- 백엔드 엔드포인트로 직접 전송

---

## 🎯 권장 설정

### Matching Rule 예시

**규칙 1: Tiara**
```
Name:    Tiara Tracking
Method:  ANY
URL:     *tiara.daum.net*
```

**규칙 2: 키즈노트 광고**
```
Name:    Kidsnote Ads
Method:  ANY
URL:     *kidsnote*imp*
```

**규칙 3: 키즈노트 혜택 클릭**
```
Name:    Kidsnote Benefits
Method:  ANY
URL:     *kidsnote_benefit*click*
```

각 규칙에 동일한 JavaScript 코드 적용

---

## 🐛 문제 해결

### JavaScript 오류 발생

Proxyman Console에서 에러 확인:
- `fetch is not defined` → Proxyman 버전 확인
- `URL is not a constructor` → 코드 수정 필요

### 백엔드로 전송 안 됨

```bash
# 백엔드 Health Check
curl http://localhost:3001/health

# CORS 확인 (Proxyman은 로컬이므로 괜찮아야 함)
```

### Proxyman이 패킷을 캡처 안 함

1. SSL Proxying 활성화 확인
2. Mac 프록시 설정 확인
3. Proxyman 필터 설정 확인

---

## 📚 참고

- Proxyman Scripting 문서: https://docs.proxyman.io/scripting/
- JavaScript fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

---

**이제 JavaScript로 작동합니다!** 🚀
