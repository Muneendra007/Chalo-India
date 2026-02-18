import { useState, useEffect } from 'react';
import { Trip } from '../../types';
import * as api from '../../lib/api';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { AdminTourModal } from '../../components/AdminTourModal';

export function AdminTours() {
    const [tours, setTours] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTour, setEditingTour] = useState<Trip | null>(null);
    const { success, error } = useToast();

    const fetchTours = async () => {
        try {
            const res = await api.getTours();
            setTours(res.data.data.tours);
        } catch (err) {
            console.error(err);
            error('Failed to fetch tours');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTours();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this tour?')) return;
        try {
            await api.deleteTour(id);
            success('Tour deleted successfully');
            setTours(tours.filter(t => t.id !== id && t._id !== id));
        } catch (err: any) {
            error(err.response?.data?.message || 'Failed to delete tour');
        }
    };

    const handleSave = async (data: any) => {
        try {
            if (editingTour) {
                await api.updateTour(editingTour.id || editingTour._id, data);
                success('Tour updated successfully');
            } else {
                await api.createTour(data);
                success('Tour created successfully');
            }
            fetchTours();
        } catch (err: any) {
            throw err; // Re-throw to be caught in modal
        }
    };

    const filteredTours = tours.filter(tour =>
        tour.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif text-white">Manage Tours</h1>
                <button
                    onClick={() => {
                        setEditingTour(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Tour</span>
                </button>
            </div>

            <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-white/10">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search tours..."
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
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Difficulty</th>
                                <th className="p-4 font-medium">Duration</th>
                                <th className="p-4 font-medium">Price</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-white/60">Loading...</td>
                                </tr>
                            ) : filteredTours.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-white/60">No tours found.</td>
                                </tr>
                            ) : (
                                filteredTours.map((tour) => (
                                    <tr key={tour.id || tour._id} className="hover:bg-white/5 transition group">
                                        <td className="p-4 text-white font-medium flex items-center space-x-3">
                                            <img
                                                src={tour.imageCover}
                                                alt={tour.name}
                                                className="w-10 h-10 rounded-lg object-cover bg-white/10"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                                                }}
                                            />
                                            <span>{tour.name}</span>
                                        </td>
                                        <td className="p-4 text-white/80 capitalize">
                                            <span className={`px-2 py-1 rounded-full text-xs ${tour.difficulty === 'easy' ? 'bg-green-500/10 text-green-400' :
                                                tour.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                                    'bg-red-500/10 text-red-400'
                                                }`}>
                                                {tour.difficulty}
                                            </span>
                                        </td>
                                        <td className="p-4 text-white/80">{tour.duration} days</td>
                                        <td className="p-4 text-white/80">${tour.price}</td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                onClick={() => {
                                                    setEditingTour(tour);
                                                    setIsModalOpen(true);
                                                }}
                                                className="p-2 bg-white/5 rounded-lg text-blue-400 hover:bg-blue-500/10 transition"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tour.id || tour._id)}
                                                className="p-2 bg-white/5 rounded-lg text-red-400 hover:bg-red-500/10 transition"
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

            <AdminTourModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSave}
                initialData={editingTour}
            />
        </div>
    );
}
