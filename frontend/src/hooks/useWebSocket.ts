import { useEffect, useRef, useState } from 'react';
import type { Packet, WebSocketMessage } from '../types';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3002';

export function useWebSocket(onPacket: (packet: Packet) => void) {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ WebSocket connected');
      setStatus('connected');
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        if (message.type === 'packet' && message.data) {
          onPacket(message.data);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setStatus('disconnected');
    };

    ws.onclose = () => {
      console.log('❌ WebSocket disconnected');
      setStatus('disconnected');

      // 재연결 시도 (5초 후)
      setTimeout(() => {
        console.log('Reconnecting...');
        setStatus('connecting');
      }, 5000);
    };

    return () => {
      ws.close();
    };
  }, [onPacket]);

  return { status };
}
