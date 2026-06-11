import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import DemoSidebar from '../components/demo/DemoSidebar';
import AppTopBar from '../components/app/AppTopBar';
import NetworkBanner from '../components/app/NetworkBanner';

const pageTitles: Record<string, string> = {
  '/demo': 'Counter Demo',
  '/demo/counter': 'Counter Demo',
};

export default function DemoLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Intent Demo';

  return (
    <div className="min-h-screen bg-black flex">
      <DemoSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-[var(--color-surface-2)]">
          <Link to="/demo/counter" className="text-sm font-medium text-[var(--color-accent)]">
            Counter Demo
          </Link>
          <Link to="/" className="text-sm text-[var(--color-muted)] ml-auto">
            Home
          </Link>
        </div>
        <NetworkBanner />
        <AppTopBar pageTitle={title} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
