# API 문서

Tracking Viewer Backend API 엔드포인트

## Base URL

```
http://localhost:3001
```

## Endpoints

### Health Check

시스템 상태 확인

```
GET /health
```

**Response**
```json
{
  "status": "ok",
  "timestamp": "2025-12-05T10:30:00.000Z"
}
```

---

### 패킷 저장

Proxyman 스크립트에서 캡처한 패킷 저장

```
POST /api/packets
```

**Request Body**
```json
{
  "timestamp": "2025-12-05T10:30:00.000Z",
  "url": "https://track.tiara.kakao.com/event",
  "method": "POST",
  "tracking_type": "tiara",
  "headers": {
    "Content-Type": "application/json",
    "User-Agent": "Kidsnote/1.0"
  },
  "params": {
    "event_name": "screen_view",
    "screen_name": "home"
  },
  "raw_body": "{\"event\":\"screen_view\"}"
}
```

**Response**
```json
{
  "id": 123,
  "message": "Packet saved successfully"
}
```

---

### 패킷 목록 조회

저장된 패킷 목록 조회

```
GET /api/packets?limit=100&offset=0
```

**Query Parameters**
- `limit` (optional): 조회할 패킷 수 (기본값: 100)
- `offset` (optional): 오프셋 (기본값: 0)

**Response**
```json
{
  "packets": [
    {
      "id": 123,
      "timestamp": "2025-12-05T10:30:00.000Z",
      "url": "https://track.tiara.kakao.com/event",
      "method": "POST",
      "tracking_type": "tiara",
      "params": { ... },
      "created_at": "2025-12-05T10:30:01.000Z"
    }
  ],
  "count": 1
}
```

---

### 특정 타입 패킷 조회

특정 트래킹 타입의 패킷만 조회

```
GET /api/packets/type/:type?limit=100
```

**Path Parameters**
- `type`: 트래킹 타입 (tiara, ad_impression, ad_click, custom)

**Query Parameters**
- `limit` (optional): 조회할 패킷 수 (기본값: 100)

**Response**
```json
{
  "packets": [ ... ],
  "count": 10,
  "type": "tiara"
}
```

---

### 패킷 검색

URL이나 파라미터로 패킷 검색

```
GET /api/packets/search?q=event_name&limit=100
```

**Query Parameters**
- `q` (required): 검색어
- `limit` (optional): 조회할 패킷 수 (기본값: 100)

**Response**
```json
{
  "packets": [ ... ],
  "count": 5,
  "query": "event_name"
}
```

---

## WebSocket

실시간 패킷 스트림

```
ws://localhost:3002
```

### 메시지 타입

#### Connected
서버 연결 성공

```json
{
  "type": "connected",
  "message": "Connected to Tracking Viewer",
  "timestamp": "2025-12-05T10:30:00.000Z"
}
```

#### Packet
새로운 패킷 수신

```json
{
  "type": "packet",
  "data": {
    "id": 123,
    "timestamp": "2025-12-05T10:30:00.000Z",
    "url": "https://track.tiara.kakao.com/event",
    "method": "POST",
    "tracking_type": "tiara",
    ...
  }
}
```

#### Ping/Pong
연결 상태 확인

**Client → Server**
```json
{
  "type": "ping"
}
```

**Server → Client**
```json
{
  "type": "pong",
  "timestamp": "2025-12-05T10:30:00.000Z"
}
```

---

## 에러 응답

### 400 Bad Request
잘못된 요청

```json
{
  "error": "Missing required fields: timestamp, url, tracking_type"
}
```

### 500 Internal Server Error
서버 에러

```json
{
  "error": "Failed to save packet"
}
```

---

## 데이터 모델

### Packet

```typescript
interface Packet {
  id?: number;
  timestamp: string;          // ISO 8601 형식
  url: string;                // 요청 URL
  method: string;             // HTTP 메서드
  tracking_type: string;      // 트래킹 타입
  headers?: object;           // 요청 헤더
  params?: object;            // 파라미터
  raw_body?: string;          // 원본 body
  response?: {                // 응답 정보
    status_code: number;
    body: string;
  };
  created_at?: string;        // 생성 시간
}
```

### Tracking Types

- `tiara`: 카카오 Tiara SDK
- `ad_impression`: 광고 노출
- `ad_click`: 광고 클릭
- `custom`: 커스텀 트래킹

---

## 사용 예시

### cURL로 패킷 전송

```bash
curl -X POST http://localhost:3001/api/packets \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2025-12-05T10:30:00.000Z",
    "url": "https://track.tiara.kakao.com/event",
    "method": "POST",
    "tracking_type": "tiara",
    "params": {
      "event_name": "screen_view"
    }
  }'
```

### JavaScript로 WebSocket 연결

```javascript
const ws = new WebSocket('ws://localhost:3002');

ws.onopen = () => {
  console.log('Connected');
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type === 'packet') {
    console.log('New packet:', message.data);
  }
};
```
