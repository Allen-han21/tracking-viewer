import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DATABASE_PATH || './data/tracking.db';

let db: Database.Database;

export function initDatabase(): Database.Database {
  // 데이터베이스 디렉토리 생성
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  db = new Database(DB_PATH);

  // 테이블 생성
  db.exec(`
    CREATE TABLE IF NOT EXISTS packets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      url TEXT NOT NULL,
      method TEXT NOT NULL,
      tracking_type TEXT NOT NULL,
      headers TEXT,
      params TEXT,
      raw_body TEXT,
      response TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_timestamp ON packets(timestamp);
    CREATE INDEX IF NOT EXISTS idx_tracking_type ON packets(tracking_type);
    CREATE INDEX IF NOT EXISTS idx_created_at ON packets(created_at);
  `);

  console.log('✅ Database initialized');
  return db;
}

export function getDatabase(): Database.Database {
  if (!db) {
    return initDatabase();
  }
  return db;
}

export interface Packet {
  id?: number;
  timestamp: string;
  url: string;
  method: string;
  tracking_type: string;
  headers?: string;
  params?: string;
  raw_body?: string;
  response?: string;
  created_at?: string;
}

export function insertPacket(packet: Packet): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO packets (timestamp, url, method, tracking_type, headers, params, raw_body, response)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    packet.timestamp,
    packet.url,
    packet.method,
    packet.tracking_type,
    packet.headers ? JSON.stringify(packet.headers) : null,
    packet.params ? JSON.stringify(packet.params) : null,
    packet.raw_body,
    packet.response ? JSON.stringify(packet.response) : null
  );

  return result.lastInsertRowid as number;
}

export function getPackets(limit = 100, offset = 0): Packet[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM packets
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `);

  const rows = stmt.all(limit, offset) as Packet[];
  return rows.map(parsePacket);
}

export function getPacketsByType(trackingType: string, limit = 100): Packet[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM packets
    WHERE tracking_type = ?
    ORDER BY created_at DESC
    LIMIT ?
  `);

  const rows = stmt.all(trackingType, limit) as Packet[];
  return rows.map(parsePacket);
}

export function searchPackets(query: string, limit = 100): Packet[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM packets
    WHERE url LIKE ? OR params LIKE ?
    ORDER BY created_at DESC
    LIMIT ?
  `);

  const searchPattern = `%${query}%`;
  const rows = stmt.all(searchPattern, searchPattern, limit) as Packet[];
  return rows.map(parsePacket);
}

function parsePacket(row: Packet): Packet {
  return {
    ...row,
    headers: row.headers ? JSON.parse(row.headers) : undefined,
    params: row.params ? JSON.parse(row.params) : undefined,
    response: row.response ? JSON.parse(row.response) : undefined,
  };
}
