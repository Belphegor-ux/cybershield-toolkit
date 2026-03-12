import type { PortInfo } from '../lib/types';

interface Props {
  progress: number;
  portFeed: PortInfo[];
}

export default function ScanProgress({ progress, portFeed }: Props) {
  return (
    <div className="glow-border-cyan rounded-xl bg-cyber-dark p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-mono text-cyber-cyan font-semibold">SCAN PROGRESS</h3>
        <span className="text-sm font-mono text-cyber-cyan">{progress.toFixed(1)}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-cyber-black rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-green rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Terminal feed */}
      <div className="terminal-output">
        {portFeed.length === 0 && (
          <p className="text-gray-600 pulse-scan">Scanning ports...</p>
        )}
        {portFeed.map((p, i) => (
          <div key={i} className="text-cyber-green">
            <span className="text-gray-500">[OPEN]</span> Port{' '}
            <span className="text-cyber-green font-bold">{p.port}</span>{' '}
            <span className="text-gray-500">- {p.service}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
