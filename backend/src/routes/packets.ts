import { Router, Request, Response } from 'express';
import { insertPacket, getPackets, getPacketsByType, searchPackets, Packet } from '../models/database';
import { broadcastPacket } from '../websocket/server';

const router = Router();

// 새 패킷 저장 (Proxyman 스크립트에서 호출)
router.post('/', (req: Request, res: Response) => {
  try {
    const packet: Packet = req.body;

    // 필수 필드 검증
    if (!packet.timestamp || !packet.url || !packet.tracking_type) {
      return res.status(400).json({
        error: 'Missing required fields: timestamp, url, tracking_type',
      });
    }

    // 데이터베이스에 저장
    const id = insertPacket(packet);

    // WebSocket으로 실시간 브로드캐스트
    broadcastPacket({ ...packet, id });

    res.status(201).json({ id, message: 'Packet saved successfully' });
  } catch (error) {
    console.error('Error saving packet:', error);
    res.status(500).json({ error: 'Failed to save packet' });
  }
});

// 패킷 목록 조회
router.get('/', (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    const packets = getPackets(limit, offset);
    res.json({ packets, count: packets.length });
  } catch (error) {
    console.error('Error fetching packets:', error);
    res.status(500).json({ error: 'Failed to fetch packets' });
  }
});

// 특정 타입의 패킷 조회
router.get('/type/:type', (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const limit = parseInt(req.query.limit as string) || 100;

    const packets = getPacketsByType(type, limit);
    res.json({ packets, count: packets.length, type });
  } catch (error) {
    console.error('Error fetching packets by type:', error);
    res.status(500).json({ error: 'Failed to fetch packets' });
  }
});

// 패킷 검색
router.get('/search', (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const limit = parseInt(req.query.limit as string) || 100;
    const packets = searchPackets(query, limit);

    res.json({ packets, count: packets.length, query });
  } catch (error) {
    console.error('Error searching packets:', error);
    res.status(500).json({ error: 'Failed to search packets' });
  }
});

export default router;
