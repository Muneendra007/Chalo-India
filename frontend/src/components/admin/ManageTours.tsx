import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Calendar, DollarSign, Users } from 'lucide-react';
import * as api from '../../lib/api';
import { Tour } from '../../types';
import { TourModal } from './TourModal';

export function ManageTours() {
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            const res = await api.getTours();
            setTours(res.data.data.tours);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this tour?')) return;
        try {
            await api.deleteTour(id);
            setTours(tours.filter(t => t.id !== id && t._id !== id));
        } catch (err) {
            alert('Failed to delete tour');
        }
    };

    const handleEdit = (tour: Tour) => {
        setSelectedTour(tour);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedTour(null);
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        await fetchTours();
        setIsModalOpen(false);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-serif">Manage Tours</h2>
                <button
                    onClick={handleCreate}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add New Tour</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {tours.map((tour) => (
                    <div key={tour.id || tour._id} className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden group">
                        <div className="h-48 overflow-hidden relative">
                            <img src={tour.imageCover} alt={tour.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                            <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                                {tour.difficulty}
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2 truncate">{tour.name}</h3>
                            <div className="flex items-center text-white/50 text-sm mb-4">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span className="truncate">{tour.startLocation?.description || 'Location'}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                                <div className="flex items-center text-white/70">
                                    <Calendar className="w-4 h-4 mr-2 text-emerald-400" />
                                    <span>{tour.duration} days</span>
                                </div>
                                <div className="flex items-center text-white/70">
                                    <Users className="w-4 h-4 mr-2 text-emerald-400" />
                                    <span>{tour.maxGroupSize} people</span>
                                </div>
                                <div className="flex items-center text-white/70 col-span-2">
                                    <DollarSign className="w-4 h-4 mr-2 text-emerald-400" />
                                    <span className="font-bold text-white">₹{tour.price}</span>
                                    <span className="text-xs ml-1 font-normal">per person</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 pt-4 border-t border-white/10">
                                <button
                                    onClick={() => handleEdit(tour)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg transition text-sm font-medium"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(tour.id || tour._id || '')}
                                    className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <TourModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tour={selectedTour}
                onSave={handleSave}
            />
        </div>
    );
}
