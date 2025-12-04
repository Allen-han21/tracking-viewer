import { format } from 'date-fns';
import type { Packet } from '../types';

interface PacketTableProps {
  packets: Packet[];
  onSelectPacket: (packet: Packet) => void;
  selectedPacketId?: number;
}

function PacketTable({ packets, onSelectPacket, selectedPacketId }: PacketTableProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tiara':
        return 'bg-purple-100 text-purple-800';
      case 'ad_impression':
        return 'bg-blue-100 text-blue-800';
      case 'ad_click':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-[600px] flex flex-col">
      <div className="px-4 py-3 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Packets</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                URL
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {packets.map((packet) => (
              <tr
                key={packet.id}
                onClick={() => onSelectPacket(packet)}
                className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedPacketId === packet.id ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(packet.timestamp), 'HH:mm:ss')}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                      packet.tracking_type
                    )}`}
                  >
                    {packet.tracking_type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 truncate max-w-xs">
                  {packet.url}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {packets.length === 0 && (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No packets captured yet
          </div>
        )}
      </div>
    </div>
  );
}

export default PacketTable;
