// 메모리 기반 패킷 저장소
// TODO: 나중에 SQLite나 PostgreSQL로 교체 가능

export interface Packet {
  id?: number;
  timestamp: string;
  url: string;
  method: string;
  tracking_type: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  raw_body?: string;
  response?: {
    status_code: number;
    body: string;
  };
  created_at?: string;
}

// 메모리 저장소
let packets: Packet[] = [];
let nextId = 1;

export function initDatabase(): void {
  console.log('✅ In-memory database initialized');
}

export function getDatabase(): void {
  // No-op for in-memory storage
}

export function insertPacket(packet: Packet): number {
  const id = nextId++;
  const now = new Date().toISOString();

  const newPacket: Packet = {
    ...packet,
    id,
    created_at: now,
  };

  packets.unshift(newPacket); // 최신 항목을 앞에 추가

  // 최대 1000개만 유지 (메모리 관리)
  if (packets.length > 1000) {
    packets = packets.slice(0, 1000);
  }

  return id;
}

export function getPackets(limit = 100, offset = 0): Packet[] {
  return packets.slice(offset, offset + limit);
}

export function getPacketsByType(trackingType: string, limit = 100): Packet[] {
  return packets
    .filter(p => p.tracking_type === trackingType)
    .slice(0, limit);
}

export function searchPackets(query: string, limit = 100): Packet[] {
  const lowerQuery = query.toLowerCase();

  return packets
    .filter(p => {
      const urlMatch = p.url.toLowerCase().includes(lowerQuery);
      const paramsMatch = p.params &&
        JSON.stringify(p.params).toLowerCase().includes(lowerQuery);
      return urlMatch || paramsMatch;
    })
    .slice(0, limit);
}

export function clearPackets(): void {
  packets = [];
  nextId = 1;
  console.log('🗑️  All packets cleared');
}

export function getPacketCount(): number {
  return packets.length;
}
