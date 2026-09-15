import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/state/authSlice';
import { authAPI } from '../../features/auth/api/authAPI';
import Toast from '../../shared/components/Toast';
import Sidebar from './Sidebar';


export default function AppLayout({ children }) {
  const { user, organization } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      dispatch(logout());
      Toast.success('Logged out');
      navigate('/login');
    } catch (err) {
      Toast.error('Logout failed' + (err.response?.data?.message || ''));
    }
  };

  return (
    <div className="flex h-screen bg-recoz-gray">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-poppins font-bold text-gray-900">
              {organization?.name}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}