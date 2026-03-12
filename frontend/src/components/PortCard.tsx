import { useEffect, useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import type { PortInfo, CVEItem } from '../lib/types';
import { getCVEs } from '../lib/api';

interface Props {
  port: PortInfo;
  onClose: () => void;
}

const severityColor: Record<string, string> = {
  CRITICAL: 'bg-cyber-red/20 text-cyber-red border-cyber-red/40',
  HIGH: 'bg-cyber-orange/20 text-cyber-orange border-cyber-orange/40',
  MEDIUM: 'bg-cyber-yellow/20 text-cyber-yellow border-cyber-yellow/40',
  LOW: 'bg-green-900/30 text-green-400 border-green-500/40',
};

export default function PortCard({ port, onClose }: Props) {
  const [cves, setCves] = useState<CVEItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (port.service && port.service !== 'unknown') {
      setLoading(true);
      getCVEs(port.service)
        .then((r) => setCves(r.vulnerabilities))
        .catch(() => setCves([]))
        .finally(() => setLoading(false));
    }
  }, [port.service]);

  return (
    <div className="glow-border rounded-xl bg-cyber-dark p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-cyber-cyan font-semibold">
          Port {port.port} &mdash; {port.service}
        </h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-300">
          <X className="w-4 h-4" />
        </button>
      </div>

      {port.banner && (
        <div className="terminal-output mb-4 text-xs text-gray-400">{port.banner}</div>
      )}

      <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" /> Known Vulnerabilities
      </h4>

      {loading && <p className="text-sm text-gray-500 font-mono pulse-scan">Querying NVD...</p>}

      {!loading && cves.length === 0 && (
        <p className="text-sm text-gray-600 font-mono">No CVEs found for this service.</p>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {cves.map((c) => (
          <div key={c.cve_id} className="bg-cyber-black rounded-lg p-3 border border-cyber-border">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-cyber-cyan">{c.cve_id}</span>
              {c.severity && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                    severityColor[c.severity] || 'text-gray-400'
                  }`}
                >
                  {c.severity} {c.score != null ? `(${c.score})` : ''}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 line-clamp-2">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
