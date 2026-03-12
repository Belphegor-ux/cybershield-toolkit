import { Shield, LayoutDashboard, History } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  view: 'dashboard' | 'history';
  onNavigate: (view: 'dashboard' | 'history') => void;
}

export default function Layout({ children, view, onNavigate }: LayoutProps) {
  return (
    <div className="flex min-h-screen grid-bg">
      {/* Sidebar */}
      <aside className="w-56 bg-cyber-dark border-r border-cyber-border flex flex-col">
        <div className="p-5 flex items-center gap-2">
          <Shield className="w-7 h-7 text-cyber-green" />
          <span className="text-xl font-bold text-cyber-green font-mono tracking-wider">
            CyberShield
          </span>
        </div>

        <nav className="flex-1 px-3 mt-4 space-y-1">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              view === 'dashboard'
                ? 'bg-cyber-green/10 text-cyber-green'
                : 'text-gray-400 hover:bg-cyber-card hover:text-gray-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('history')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              view === 'history'
                ? 'bg-cyber-green/10 text-cyber-green'
                : 'text-gray-400 hover:bg-cyber-card hover:text-gray-200'
            }`}
          >
            <History className="w-4 h-4" />
            History
          </button>
        </nav>

        <div className="p-4 text-xs text-gray-600 font-mono">v1.0.0</div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
