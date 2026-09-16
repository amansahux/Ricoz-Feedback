import { useAuth } from '../../features/auth/hook/useAuth';
import Sidebar from './Sidebar.jsx';

export default function AppLayout({ children }) {
  const { user, organization, logout, isLoggingOut } = useAuth();

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-poppins font-bold text-white">
              {organization?.name || 'Workspace'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-200">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
            
            <button
              onClick={logout}
              disabled={isLoggingOut}
              className="px-3.5 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 font-medium transition cursor-pointer disabled:opacity-50"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-slate-900/40">
          {children}
        </main>
      </div>
    </div>
  );
}