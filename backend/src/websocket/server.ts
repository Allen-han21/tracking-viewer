import { WebSocketServer, WebSocket } from 'ws';
import { Server as HTTPServer } from 'http';
import { Packet } from '../models/database';

let wss: WebSocketServer;
const clients = new Set<WebSocket>();

export function initWebSocket(server: HTTPServer): void {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket) => {
    console.log('✅ New WebSocket client connected');
    clients.add(ws);

    // 클라이언트에게 연결 확인 메시지 전송
    ws.send(JSON.stringify({
      type: 'connected',
      message: 'Connected to Tracking Viewer',
      timestamp: new Date().toISOString(),
    }));

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message from client:', data);

        // 클라이언트 메시지 처리 (필요시)
        if (data.type === 'ping') {
          ws.send(JSON.stringify({
            type: 'pong',
            timestamp: new Date().toISOString(),
          }));
        }
      } catch (error) {
        console.error('Error parsing client message:', error);
      }
    });

    ws.on('close', () => {
      console.log('❌ WebSocket client disconnected');
      clients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  console.log('✅ WebSocket server initialized');
}

export function broadcastPacket(packet: Packet): void {
  const message = JSON.stringify({
    type: 'packet',
    data: packet,
  });

  let sent = 0;
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
      sent++;
    }
  });

  if (sent > 0) {
    console.log(`📡 Broadcasted packet to ${sent} client(s)`);
  }
}

export function getConnectedClients(): number {
  return clients.size;
}
