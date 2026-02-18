import { useState, useEffect } from 'react';
import * as api from '../../lib/api';

export function AdminDashboard() {
    const [stats, setStats] = useState({ tours: 0, users: 0, bookings: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const toursRes = await api.getTours();
                const usersRes = await api.getAllUsers();
                // bookings not yet implemented in api.ts for admin count, but we can just show tours/users for now
                setStats({
                    tours: toursRes.data.results,
                    users: usersRes.data.results,
                    bookings: 0
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-serif text-white mb-8">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-6 rounded-2xl border border-white/10">
                    <h3 className="text-white/60 text-sm uppercase tracking-wider mb-2">Total Tours</h3>
                    <p className="text-4xl text-emerald-400 font-bold">{stats.tours}</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-white/10">
                    <h3 className="text-white/60 text-sm uppercase tracking-wider mb-2">Total Users</h3>
                    <p className="text-4xl text-cyan-400 font-bold">{stats.users}</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-white/10">
                    <h3 className="text-white/60 text-sm uppercase tracking-wider mb-2">Total Bookings</h3>
                    <p className="text-4xl text-purple-400 font-bold">{stats.bookings}</p>
                </div>
            </div>
        </div>
    );
}
