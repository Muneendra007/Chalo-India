import { useEffect, useState } from 'react';
import * as api from '../../lib/api';
import { Trash2 } from 'lucide-react';

export function ManageUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.getAllUsers();
            setUsers(res.data.data.users);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.deleteUser(id);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            alert('Failed to delete');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-3xl font-serif mb-8">Manage Users</h2>
            <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-white/60 text-sm">
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition">
                                <td className="p-4 font-medium">{user.name}</td>
                                <td className="p-4 text-white/70">{user.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700 text-slate-300'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 flex items-center justify-end space-x-2">
                                    <button onClick={() => handleDelete(user._id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded transition">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
