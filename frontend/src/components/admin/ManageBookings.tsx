import { useEffect, useState } from 'react';
import { Check, X, Clock, Eye } from 'lucide-react';
import * as api from '../../lib/api';

interface Booking {
    _id: string;
    tour: { name: string };
    user: { name: string; email: string };
    price: number;
    createdAt: string;
    paid: boolean;
    // Add status if your model supports it, otherwise we assume paid/not paid or similar
}

export function ManageBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.getAllBookings(); // We added this to api.ts
            // Note: backend implementation of getAllBookings for admin returns all bookings.
            // Check controller response structure.
            setBookings(res.data.data.bookings);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Since our Booking model is simple (paid boolean, no status enum), let's just show info.
    // If you want to delete a booking:
    const handleDelete = async (id: string) => {
        if (!confirm('Cancel this booking?')) return;
        try {
            await api.cancelBooking(id);
            setBookings(bookings.filter(b => b._id !== id));
        } catch (err) {
            alert('Failed to cancel');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-3xl font-serif mb-8">Manage Bookings</h2>
            <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-white/60 text-sm">
                            <th className="p-4">Tour</th>
                            <th className="p-4">User</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking._id} className="border-b border-white/5 hover:bg-white/5 transition">
                                <td className="p-4 font-medium">{booking.tour?.name || 'Deleted Tour'}</td>
                                <td className="p-4">
                                    <div className="text-sm font-medium">{booking.user?.name || 'Deleted User'}</div>
                                    <div className="text-xs text-white/50">{booking.user?.email}</div>
                                </td>
                                <td className="p-4 text-white/70">
                                    {new Date(booking.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 font-bold text-emerald-400">₹{booking.price}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${booking.paid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {booking.paid ? 'Paid' : 'Pending'}
                                    </span>
                                </td>
                                <td className="p-4 flex items-center justify-end space-x-2">
                                    <button onClick={() => handleDelete(booking._id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded transition" title="Cancel Booking">
                                        <X className="w-4 h-4" />
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
