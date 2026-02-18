import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AdminRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-slate-950 text-white">Loading...</div>;
    }

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
