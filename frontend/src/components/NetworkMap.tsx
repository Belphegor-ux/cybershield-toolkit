import type { WsEvent, WsProgressEvent } from '../lib/types';

interface Props {
  events: WsEvent[];
  totalPorts: number;
}

export default function NetworkMap({ events, totalPorts }: Props) {
  // Build a map of port -> status
  const portMap = new Map<number, 'open' | 'closed' | 'scanning'>();
  for (const e of events) {
    if (e.type === 'progress') {
      const pe = e as WsProgressEvent;
      portMap.set(pe.port, pe.is_open ? 'open' : 'closed');
    }
  }

  const colorMap = {
    open: 'bg-cyber-green',
    closed: 'bg-cyber-dark',
    scanning: 'bg-cyber-cyan pulse-scan',
  };

  // Show up to 1024 cells max for visual clarity
  const maxCells = Math.min(totalPorts, 1024);
  const cells = Array.from({ length: maxCells }, (_, i) => {
    const status = portMap.get(i + 1) || 'scanning';
    return status;
  });

  return (
    <div className="glow-border-cyan rounded-xl bg-cyber-dark p-4">
      <h3 className="text-xs font-mono text-cyber-cyan font-semibold mb-3 uppercase tracking-wider">
        Network Map
      </h3>
      <div className="flex flex-wrap gap-[2px]">
        {cells.map((status, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-sm ${colorMap[status]}`}
            title={`Port ${i + 1}: ${status}`}
          />
        ))}
      </div>
    </div>
  );
}
