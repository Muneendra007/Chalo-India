import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../../lib/api';
import { Trash2, Search, Slash, CheckCircle, Calendar } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface User {
    _id: string;
    id?: string;
    name: string;
    email: string;
    role: string;
    active: boolean;
    photo?: string;
}

export function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { success, error } = useToast();

    const fetchUsers = async () => {
        try {
            const res = await api.getAllUsers();
            // Ensure users have active property (default to true if missing in existing logic, though backend usually sends it)
            // If backend filters for active=true by default for getAllUsers, we might not see inactive users.
            // We should check backend. If it's using 'find()', it shows everything unless middleware hides it.
            // Usually userController.getAllUsers uses User.find().
            // But userModel has a pre-find hook to filter active: {$ne: false}.
            // WE NEED TO FIX THIS IN BACKEND if we want Admins to see inactive users.
            setUsers(res.data.data.users);
        } catch (err) {
            console.error(err);
            error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
        try {
            await api.deleteUser(id);
            success('User deleted successfully');
            setUsers(users.filter(u => (u.id || u._id) !== id));
        } catch (err: any) {
            error(err.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleToggleActive = async (user: User) => {
        try {
            const userId = user.id || user._id;
            // If active is undefined/true, we set to false. If false, set true.
            const newActiveStatus = user.active === false ? true : false;

            await api.updateUser(userId, { active: newActiveStatus });

            setUsers(users.map(u =>
                (u.id || u._id) === userId ? { ...u, active: newActiveStatus } : u
            ));

            success(`User ${newActiveStatus ? 'activated' : 'deactivated'} successfully`);
        } catch (err: any) {
            error(err.response?.data?.message || 'Failed to update user status');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1 className="text-3xl font-serif text-white mb-8">Manage Users</h1>

            <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-white/10">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-white/60 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">User</th>
                                <th className="p-4 font-medium">Role</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-white/60">Loading...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-white/60">No users found.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id || user._id} className="hover:bg-white/5 transition group">
                                        <td className="p-4 text-white font-medium flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p>{user.name}</p>
                                                <p className="text-xs text-white/50">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 text-white/80 capitalize">
                                            <span className={`px-2 py-1 rounded-full text-xs border ${user.role === 'admin' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                                                user.role === 'lead-guide' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                                    'bg-white/5 border-white/10 text-white/60'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-white/80">
                                            {user.active !== false ? (
                                                <span className="flex items-center space-x-1 text-green-400 text-xs">
                                                    <CheckCircle className="w-3 h-3" /> <span>Active</span>
                                                </span>
                                            ) : (
                                                <span className="flex items-center space-x-1 text-red-400 text-xs">
                                                    <Slash className="w-3 h-3" /> <span>Inactive</span>
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            {user.role !== 'admin' && ( // Prevent blocking/deleting other admins? Optional but good practice.
                                                <>
                                                    <Link
                                                        to={`/admin/bookings?user=${user.id || user._id}`}
                                                        title="View Use Bookings"
                                                        className="p-2 bg-blue-500/10 rounded-lg text-blue-400 hover:bg-blue-500/20 transition inline-block mr-2"
                                                    >
                                                        <Calendar className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleToggleActive(user)}
                                                        title={user.active !== false ? "Deactivate User" : "Activate User"}
                                                        className={`p-2 rounded-lg transition ${user.active !== false ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                                            }`}
                                                    >
                                                        <Slash className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id || user._id)}
                                                        title="Delete User"
                                                        className="p-2 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20 transition ml-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
