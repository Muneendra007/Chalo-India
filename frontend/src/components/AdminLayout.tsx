import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map, Users, LogOut, Home, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { signOut } = useAuth();

    const handleLogout = () => {
        signOut();
        navigate('/');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen bg-slate-950 text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-white/10 flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-serif font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            Chalo India Admin
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        to="/admin"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${isActive('/admin') ? 'bg-emerald-600/20 text-emerald-400' : 'text-white/60 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        to="/admin/tours"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${isActive('/admin/tours') ? 'bg-emerald-600/20 text-emerald-400' : 'text-white/60 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Map className="w-5 h-5" />
                        <span>Manage Tours</span>
                    </Link>

                    <Link
                        to="/admin/users"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${isActive('/admin/users') ? 'bg-emerald-600/20 text-emerald-400' : 'text-white/60 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Users className="w-5 h-5" />
                        <span>Manage Users</span>
                    </Link>

                    <Link
                        to="/admin/bookings"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${isActive('/admin/bookings') ? 'bg-emerald-600/20 text-emerald-400' : 'text-white/60 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Calendar className="w-5 h-5" />
                        <span>Manage Bookings</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10 space-y-2">
                    <Link
                        to="/"
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition"
                    >
                        <Home className="w-5 h-5" />
                        <span>Back to Site</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-slate-950 p-8">
                <Outlet />
            </main>
        </div>
    );
}
