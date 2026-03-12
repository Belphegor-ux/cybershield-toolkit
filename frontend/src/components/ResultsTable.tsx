import { useState } from 'react';
import type { PortInfo } from '../lib/types';

interface Props {
  ports: PortInfo[];
  onSelectPort: (port: PortInfo) => void;
}

type SortKey = 'port' | 'service' | 'state';

export default function ResultsTable({ ports, onSelectPort }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('port');
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = [...ports].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortAsc ? av - bv : bv - av;
    }
    return sortAsc
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const thClass =
    'px-4 py-3 text-left text-xs font-mono text-gray-400 uppercase tracking-wider cursor-pointer hover:text-cyber-green';

  return (
    <div className="glow-border rounded-xl bg-cyber-dark overflow-hidden">
      <table className="w-full">
        <thead className="border-b border-cyber-border">
          <tr>
            <th className={thClass} onClick={() => toggleSort('port')}>Port</th>
            <th className={thClass} onClick={() => toggleSort('service')}>Service</th>
            <th className="px-4 py-3 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">Banner</th>
            <th className={thClass} onClick={() => toggleSort('state')}>Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cyber-border">
          {sorted.map((p) => (
            <tr
              key={p.port}
              className="hover:bg-cyber-card/50 cursor-pointer transition-colors"
              onClick={() => onSelectPort(p)}
            >
              <td className="px-4 py-3 font-mono text-sm text-cyber-cyan">{p.port}</td>
              <td className="px-4 py-3 font-mono text-sm text-gray-300">{p.service}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-500 max-w-xs truncate">
                {p.banner || '-'}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex px-2 py-0.5 rounded text-xs font-mono font-bold bg-cyber-green/10 text-cyber-green border border-cyber-green/30">
                  OPEN
                </span>
              </td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-gray-600 font-mono text-sm">
                No open ports found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
