import { useState } from 'react';
import {
    Users, Map, Calendar, LogOut, Menu, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ManageTours } from '../components/admin/ManageTours';
import { ManageBookings } from '../components/admin/ManageBookings';
import { ManageUsers } from '../components/admin/ManageUsers';

export function AdminDashboard() {
    const { user, signOut } = useAuth();
    const [activeTab, setActiveTab] = useState<'tours' | 'bookings' | 'users'>('tours');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Redirect if not admin (double check, though parent should handle this)
    if (!user || (user.role !== 'admin' && user.role !== 'lead-guide')) {
        return <div className="p-10 text-white text-center">Access Denied. Admins only.</div>;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'tours': return <ManageTours />;
            case 'bookings': return <ManageBookings />;
            case 'users': return <ManageUsers />;
            default: return <ManageTours />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex text-white font-sans">
            {/* Mobile Sidebar Toggle */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg"
            >
                {isSidebarOpen ? <X /> : <Menu />}
            </button>

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-white/10 
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="p-6 border-b border-white/10 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold">
                        AD
                    </div>
                    <span className="font-serif text-xl tracking-wide">AdminPanel</span>
                </div>

                <nav className="p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('tours')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'tours' ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                    >
                        <Map className="w-5 h-5" />
                        <span>Tours</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'bookings' ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                    >
                        <Calendar className="w-5 h-5" />
                        <span>Bookings</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'users' ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                    >
                        <Users className="w-5 h-5" />
                        <span>Users</span>
                    </button>
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <div className="flex items-center space-x-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                            {user.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-white/40 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-10 overflow-auto">
                {renderContent()}
            </main>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
