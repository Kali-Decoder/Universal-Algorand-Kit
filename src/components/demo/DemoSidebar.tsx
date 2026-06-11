import { NavLink, useNavigate } from 'react-router-dom';
import Hash from 'lucide-react/dist/esm/icons/hash.js';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left.js';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left.js';

const navItems = [
  { label: 'Counter Demo', icon: <Hash size={18} />, to: '/demo/counter' },
];

interface DemoSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function DemoSidebar({ collapsed, onToggle }: DemoSidebarProps) {
  const navigate = useNavigate();

  return (
    <aside
      className={`hidden md:flex flex-col bg-[var(--color-surface-2)] border-r border-white/[0.08] transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-56'
      } min-h-screen`}
    >
      <div className={`flex items-center p-4 border-b border-white/[0.08] ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
            <span className="text-[var(--color-accent)] text-xl font-bold">●</span>
            <span className="text-white font-extrabold text-base tracking-tight">UAK Demo</span>
          </button>
        )}
        {collapsed && <span className="text-[var(--color-accent)] text-xl font-bold">●</span>}
        <button
          onClick={onToggle}
          className="text-[var(--color-muted)] hover:text-white transition-colors p-1 rounded-lg hover:bg-white/[0.05]"
        >
          <ChevronLeft size={16} className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-[var(--accent-10)] text-[var(--color-accent)] border border-[var(--accent-20)]'
                  : 'text-[var(--color-muted)] hover:text-white hover:bg-white/[0.05]'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className={`p-3 border-t border-white/[0.08] ${collapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={() => navigate('/')}
          className={`flex items-center gap-2 text-[var(--color-muted)] hover:text-white transition-colors text-sm py-2 px-3 rounded-xl hover:bg-white/[0.05] ${collapsed ? 'justify-center' : ''}`}
        >
          <ArrowLeft size={16} />
          {!collapsed && <span>Back to site</span>}
        </button>
      </div>
    </aside>
  );
}
