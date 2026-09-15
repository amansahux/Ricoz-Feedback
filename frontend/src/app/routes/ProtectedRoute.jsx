import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { authenticated, loading } = useSelector(state => state.auth);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return authenticated ? children : <Navigate to="/login" />;
}