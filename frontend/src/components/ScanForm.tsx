import { useState } from 'react';
import { Search } from 'lucide-react';

interface Props {
  onScan: (target: string, start: number, end: number) => void;
  disabled: boolean;
}

export default function ScanForm({ onScan, disabled }: Props) {
  const [target, setTarget] = useState('');
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(1024);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim()) return;
    onScan(target.trim(), start, end);
  };

  return (
    <form onSubmit={handleSubmit} className="glow-border rounded-xl bg-cyber-dark p-6">
      <h2 className="text-lg font-semibold text-cyber-green font-mono mb-4">
        Port Scanner
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-400 mb-1 font-mono">TARGET IP / HOST</label>
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="192.168.1.1 or example.com"
            className="w-full bg-cyber-black border border-cyber-border rounded-lg px-4 py-2.5 text-sm font-mono text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyber-green/50"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1 font-mono">PORT START</label>
          <input
            type="number"
            min={1}
            max={65535}
            value={start}
            onChange={(e) => setStart(Number(e.target.value))}
            className="w-full bg-cyber-black border border-cyber-border rounded-lg px-4 py-2.5 text-sm font-mono text-gray-200 focus:outline-none focus:border-cyber-green/50"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1 font-mono">PORT END</label>
          <input
            type="number"
            min={1}
            max={65535}
            value={end}
            onChange={(e) => setEnd(Number(e.target.value))}
            className="w-full bg-cyber-black border border-cyber-border rounded-lg px-4 py-2.5 text-sm font-mono text-gray-200 focus:outline-none focus:border-cyber-green/50"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={disabled || !target.trim()}
        className="mt-4 flex items-center gap-2 bg-cyber-green/10 border border-cyber-green/40 text-cyber-green px-6 py-2.5 rounded-lg font-mono text-sm font-semibold hover:bg-cyber-green/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ boxShadow: '0 0 20px rgba(0,255,65,0.15)' }}
      >
        <Search className="w-4 h-4" />
        {disabled ? 'Scanning...' : 'Start Scan'}
      </button>
    </form>
  );
}
