import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import type { ScanHistoryItem } from '../lib/types';
import { getScans } from '../lib/api';

export default function ScanHistory() {
  const [scans, setScans] = useState<ScanHistoryItem[]>([]);

  useEffect(() => {
    getScans().then(setScans).catch(() => setScans([]));
  }, []);

  const duration = (s: ScanHistoryItem) => {
    if (!s.completed_at) return 'running...';
    const ms = new Date(s.completed_at).getTime() - new Date(s.started_at).getTime();
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="glow-border rounded-xl bg-cyber-dark overflow-hidden">
      <div className="px-6 py-4 border-b border-cyber-border flex items-center gap-2">
        <Clock className="w-4 h-4 text-cyber-cyan" />
        <h2 className="font-mono text-sm font-semibold text-cyber-cyan">SCAN HISTORY</h2>
      </div>
      <table className="w-full">
        <thead className="border-b border-cyber-border">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-mono text-gray-400 uppercase">Target</th>
            <th className="px-4 py-3 text-left text-xs font-mono text-gray-400 uppercase">Date</th>
            <th className="px-4 py-3 text-left text-xs font-mono text-gray-400 uppercase">Open Ports</th>
            <th className="px-4 py-3 text-left text-xs font-mono text-gray-400 uppercase">Duration</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cyber-border">
          {scans.map((s) => (
            <tr key={s.scan_id} className="hover:bg-cyber-card/50 transition-colors">
              <td className="px-4 py-3 font-mono text-sm text-gray-300">{s.target}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-500">
                {new Date(s.started_at).toLocaleString()}
              </td>
              <td className="px-4 py-3 font-mono text-sm text-cyber-green">{s.open_ports_count}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-500">{duration(s)}</td>
            </tr>
          ))}
          {scans.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-gray-600 font-mono text-sm">
                No scan history yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
