import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initWebSocket } from './websocket/server';
import { initDatabase } from './models/database';
import packetRoutes from './routes/packets';

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const WS_PORT = process.env.WEBSOCKET_PORT || 3002;

// 미들웨어
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// 라우트
app.use('/api/packets', packetRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 데이터베이스 초기화
initDatabase();

// HTTP 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
});

// WebSocket 서버 시작
const wsServer = createServer();
initWebSocket(wsServer);

wsServer.listen(WS_PORT, () => {
  console.log(`🔌 WebSocket Server running on ws://localhost:${WS_PORT}`);
});
