import { useState, useEffect } from 'react';
import PacketTable from './components/PacketTable';
import PacketDetail from './components/PacketDetail';
import { useWebSocket } from './hooks/useWebSocket';
import type { Packet } from './types';

function App() {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const { status } = useWebSocket((packet) => {
    setPackets((prev) => [packet, ...prev].slice(0, 500)); // 최근 500개만 유지
  });

  // 초기 패킷 로드
  useEffect(() => {
    fetch('/api/packets?limit=100')
      .then((res) => res.json())
      .then((data) => setPackets(data.packets))
      .catch((err) => console.error('Failed to load packets:', err));
  }, []);

  const filteredPackets = packets.filter((p) => {
    if (filter === 'all') return true;
    return p.tracking_type === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tracking Viewer
              </h1>
              <p className="text-sm text-gray-500">Kidsnote Tracking Packet Monitor</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="text-sm text-gray-600">
                  {status === 'connected' ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {packets.length} packets
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Filter */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex gap-2">
          {['all', 'tiara', 'ad_impression', 'ad_click', 'custom'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {f === 'all' ? 'All' : f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Packet List */}
          <div className="bg-white rounded-lg shadow">
            <PacketTable
              packets={filteredPackets}
              onSelectPacket={setSelectedPacket}
              selectedPacketId={selectedPacket?.id}
            />
          </div>

          {/* Packet Detail */}
          <div className="bg-white rounded-lg shadow">
            <PacketDetail packet={selectedPacket} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
