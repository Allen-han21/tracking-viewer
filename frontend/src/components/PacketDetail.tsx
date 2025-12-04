import { format } from 'date-fns';
import type { Packet } from '../types';

interface PacketDetailProps {
  packet: Packet | null;
}

function PacketDetail({ packet }: PacketDetailProps) {
  if (!packet) {
    return (
      <div className="h-[600px] flex items-center justify-center text-gray-500">
        Select a packet to view details
      </div>
    );
  }

  return (
    <div className="h-[600px] flex flex-col">
      <div className="px-4 py-3 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Packet Detail</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Basic Info */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Basic Info</h3>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-gray-500">Timestamp</dt>
              <dd className="text-gray-900 font-mono">
                {format(new Date(packet.timestamp), 'yyyy-MM-dd HH:mm:ss.SSS')}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Type</dt>
              <dd className="text-gray-900">{packet.tracking_type}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Method</dt>
              <dd className="text-gray-900">{packet.method}</dd>
            </div>
            <div>
              <dt className="text-gray-500">URL</dt>
              <dd className="text-gray-900 break-all font-mono text-xs">
                {packet.url}
              </dd>
            </div>
          </dl>
        </section>

        {/* Parameters */}
        {packet.params && Object.keys(packet.params).length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Parameters</h3>
            <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-x-auto">
              {JSON.stringify(packet.params, null, 2)}
            </pre>
          </section>
        )}

        {/* Headers */}
        {packet.headers && Object.keys(packet.headers).length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Headers</h3>
            <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-x-auto">
              {JSON.stringify(packet.headers, null, 2)}
            </pre>
          </section>
        )}

        {/* Body */}
        {packet.raw_body && (
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Body</h3>
            <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-x-auto">
              {packet.raw_body}
            </pre>
          </section>
        )}

        {/* Response */}
        {packet.response && (
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Response</h3>
            <div className="space-y-2">
              <div>
                <dt className="text-sm text-gray-500">Status Code</dt>
                <dd className="text-gray-900">{packet.response.status_code}</dd>
              </div>
              {packet.response.body && (
                <div>
                  <dt className="text-sm text-gray-500">Body</dt>
                  <dd>
                    <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-x-auto">
                      {packet.response.body}
                    </pre>
                  </dd>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default PacketDetail;
