import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as api from '../../lib/api';
import { Search, Loader, Trash2, X } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface Booking {
    _id: string;
    id?: string;
    tour: {
        _id: string;
        name: string;
        imageCover?: string;
    };
    user: {
        _id: string;
        name: string;
        email: string;
    };
    price: number;
    createdAt: string;
    selectedDate: string;
    status: string;
}

export function AdminBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const { success, error } = useToast();

    const userIdFilter = searchParams.get('user');

    const fetchBookings = async () => {
        try {
            setLoading(true);
            // If userIdFilter exists, api.getAllBookings needs to support passing params
            // api.getAllBookings implementation in api.ts might need update or we pass query string
            const res = await api.getAllBookings(userIdFilter || undefined);
            setBookings(res.data.data.bookings);
        } catch (err) {
            console.error(err);
            error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [userIdFilter]);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;
        try {
            await api.deleteBooking(id); // Using existing deleteBooking from api.ts
            success('Booking deleted successfully');
            setBookings(bookings.filter(b => (b.id || b._id) !== id));
        } catch (err: any) {
            error(err.response?.data?.message || 'Failed to delete booking');
        }
    };

    const clearFilter = () => {
        setSearchParams({});
    };

    const filteredBookings = bookings.filter(booking =>
        (booking.tour?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif text-white">Manage Bookings</h1>
                {userIdFilter && (
                    <button onClick={clearFilter} className="flex items-center space-x-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg hover:bg-emerald-500/30 transition">
                        <span>Filtered by User</span>
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-white/10">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search bookings..."
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
                                <th className="p-4 font-medium">Tour</th>
                                <th className="p-4 font-medium">User</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Price</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-white/60 flex justify-center"><Loader className="animate-spin" /></td>
                                </tr>
                            ) : filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-white/60">No bookings found.</td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking.id || booking._id} className="hover:bg-white/5 transition group">
                                        <td className="p-4 text-white font-medium">
                                            {booking.tour ? booking.tour.name : <span className="text-red-400 italic">Deleted Tour</span>}
                                        </td>
                                        <td className="p-4 text-white/80">
                                            <div className="flex flex-col">
                                                <span>{booking.user ? booking.user.name : <span className="text-red-400 italic">Deleted User</span>}</span>
                                                <span className="text-xs text-white/40">{booking.user ? booking.user.email : ''}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-white/80">
                                            {new Date(booking.selectedDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-white/80">${booking.price}</td>
                                        <td className="p-4">
                                            <span className={`text-xs px-2 py-1 rounded-full ${booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400' :
                                                booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                                                    'bg-red-500/10 text-red-400'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDelete(booking.id || booking._id)}
                                                className="p-2 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20 transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
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
