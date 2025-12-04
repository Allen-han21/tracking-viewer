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

export type TrackingType = 'all' | 'tiara' | 'ad_impression' | 'ad_click' | 'custom';

export interface WebSocketMessage {
  type: 'connected' | 'packet' | 'pong';
  data?: Packet;
  message?: string;
  timestamp: string;
}
