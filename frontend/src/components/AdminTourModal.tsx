import { useState, useEffect } from 'react';
import { X, Plus, Trash } from 'lucide-react';
import { Trip } from '../types';

interface AdminTourModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    initialData?: Trip | null;
}

export function AdminTourModal({ isOpen, onClose, onSubmit, initialData }: AdminTourModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        duration: 0,
        maxGroupSize: 0,
        difficulty: 'medium',
        price: 0,
        summary: '',
        description: '',
        imageCover: '',
        startLocation: { description: '' },
        startDates: [] as string[]
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                duration: initialData.duration,
                maxGroupSize: initialData.maxGroupSize,
                difficulty: initialData.difficulty,
                price: initialData.price,
                summary: initialData.summary,
                description: initialData.description || '',
                imageCover: initialData.imageCover,
                startLocation: { description: initialData.startLocation?.description || '' },
                startDates: initialData.startDates || []
            });
        } else {
            setFormData({
                name: '',
                duration: 0,
                maxGroupSize: 0,
                difficulty: 'medium',
                price: 0,
                summary: '',
                description: '',
                imageCover: '',
                startLocation: { description: '' },
                startDates: []
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (index: number, value: string) => {
        const newDates = [...formData.startDates];
        newDates[index] = value;
        setFormData({ ...formData, startDates: newDates });
    };

    const addDate = () => {
        setFormData({ ...formData, startDates: [...formData.startDates, ''] });
    };

    const removeDate = (index: number) => {
        const newDates = formData.startDates.filter((_, i) => i !== index);
        setFormData({ ...formData, startDates: newDates });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
                <div className="flex justify-between items-center p-6 border-b border-white/10 sticky top-0 bg-slate-900 z-10">
                    <h2 className="text-2xl font-serif text-white">
                        {initialData ? 'Edit Tour' : 'Add New Tour'}
                    </h2>
                    <button onClick={onClose} className="text-white/60 hover:text-white transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-white/60 text-sm mb-2">Tour Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-white/60 text-sm mb-2">Difficulty</label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="difficult">Difficult</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-white/60 text-sm mb-2">Duration (Days)</label>
                            <input
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-white/60 text-sm mb-2">Max Group Size</label>
                            <input
                                type="number"
                                value={formData.maxGroupSize}
                                onChange={(e) => setFormData({ ...formData, maxGroupSize: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-white/60 text-sm mb-2">Price ($)</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-white/60 text-sm mb-2">Start Location</label>
                            <input
                                type="text"
                                value={formData.startLocation.description}
                                onChange={(e) => setFormData({ ...formData, startLocation: { ...formData.startLocation, description: e.target.value } })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-white/60 text-sm mb-2">Image Cover URL</label>
                            <input
                                type="text"
                                value={formData.imageCover}
                                onChange={(e) => setFormData({ ...formData, imageCover: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                placeholder="https://example.com/image.jpg"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-white/60 text-sm mb-2">Summary</label>
                            <textarea
                                value={formData.summary}
                                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 h-24"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-white/60 text-sm mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 h-32"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-white/60 text-sm mb-2">Start Dates</label>
                            <div className="space-y-2">
                                {formData.startDates.map((date, index) => (
                                    <div key={index} className="flex space-x-2">
                                        <input
                                            type="datetime-local"
                                            value={date ? new Date(date).toISOString().slice(0, 16) : ''}
                                            onChange={(e) => handleDateChange(index, e.target.value)}
                                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500 flex-1"
                                        />
                                        <button type="button" onClick={() => removeDate(index)} className="text-red-400 hover:text-red-300">
                                            <Trash className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addDate}
                                    className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 text-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Date</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/10">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold transition disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Tour'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
