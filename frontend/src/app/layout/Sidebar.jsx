import { Link, useLocation } from 'react-router-dom';
import { BarChart3, FileText, MessageSquare, Users, Settings, Home } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const links = [
    { label: 'Overview', href: '/dashboard', icon: Home },
    { label: 'Surveys', href: '/surveys', icon: FileText },
    { label: 'Feedback', href: '/feedback', icon: MessageSquare },
    { label: 'Customers', href: '/customers', icon: Users },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-8 border-b border-gray-200">
        <h1 className="text-2xl font-poppins font-bold text-recoz-red">
          RECOZ
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            to={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-inter text-sm font-medium transition-colors ${
              isActive(href)
                ? 'bg-recoz-red text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}