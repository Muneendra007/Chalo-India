import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Tour } from '../../types';
import * as api from '../../lib/api';

interface TourModalProps {
    isOpen: boolean;
    onClose: () => void;
    tour: Tour | null;
    onSave: () => void;
}

export function TourModal({ isOpen, onClose, tour, onSave }: TourModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Tour>>({
        name: '',
        duration: 5,
        maxGroupSize: 10,
        difficulty: 'medium',
        price: 0,
        summary: '',
        description: '',
        imageCover: '',
        startLocation: { description: '', type: 'Point', coordinates: [0, 0], address: '' },
        startDates: [] // Simplified for now, handling dates properly is complex
    });

    useEffect(() => {
        if (tour) {
            setFormData(tour);
        } else {
            setFormData({
                name: '',
                duration: 5,
                maxGroupSize: 10,
                difficulty: 'medium',
                price: 0,
                summary: '',
                description: '',
                imageCover: '',
                startLocation: { description: '', type: 'Point', coordinates: [0, 0], address: '' },
                startDates: []
            });
        }
    }, [tour, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (tour) {
                await api.updateTour(tour.id || tour._id || '', formData);
            } else {
                await api.createTour(formData);
            }
            onSave();
        } catch (err: any) {
            alert('Failed to save tour: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden border border-white/10 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-2xl font-serif text-white">{tour ? 'Edit Tour' : 'Create New Tour'}</h2>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-white/60 mb-2">Tour Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-white/60 mb-2">Price (INR)</label>
                            <input
                                type="number"
                                required
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-white/60 mb-2">Duration (Days)</label>
                            <input
                                type="number"
                                required
                                value={formData.duration}
                                onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-white/60 mb-2">Max Group Size</label>
                            <input
                                type="number"
                                required
                                value={formData.maxGroupSize}
                                onChange={e => setFormData({ ...formData, maxGroupSize: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-white/60 mb-2">Difficulty</label>
                            <select
                                value={formData.difficulty}
                                onChange={e => setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'difficult' })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 [&>option]:text-black"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="difficult">Difficult</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-white/60 mb-2">Start Location</label>
                            <input
                                type="text"
                                value={formData.startLocation?.description}
                                onChange={e => setFormData({
                                    ...formData,
                                    startLocation: { ...formData.startLocation!, description: e.target.value }
                                })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-white/60 mb-2">Image Cover URL</label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={formData.imageCover}
                                onChange={e => setFormData({ ...formData, imageCover: e.target.value })}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                            />
                            {formData.imageCover && (
                                <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10">
                                    <img src={formData.imageCover} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-white/60 mb-2">Summary</label>
                        <textarea
                            rows={3}
                            value={formData.summary}
                            onChange={e => setFormData({ ...formData, summary: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/60 mb-2">Description</label>
                        <textarea
                            rows={5}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                        />
                    </div>

                    <div className="pt-4 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-white/60 hover:text-white transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold transition flex items-center space-x-2"
                        >
                            <Save className="w-4 h-4" />
                            <span>{loading ? 'Saving...' : 'Save Tour'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
