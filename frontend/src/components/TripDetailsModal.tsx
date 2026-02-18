import { useEffect, useState } from 'react';
import { X, Calendar, Users, DollarSign, Star, MapPin, Send } from 'lucide-react';
import { Trip, Review } from '../types';
import * as api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface TripDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    trip: Trip | null;
    onBook: (trip: Trip) => void;
}

export function TripDetailsModal({ isOpen, onClose, trip, onBook }: TripDetailsModalProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [newReview, setNewReview] = useState('');
    const [newRating, setNewRating] = useState(5);
    const [submittingReview, setSubmittingReview] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (isOpen && trip) {
            loadReviews();
        }
    }, [isOpen, trip]);

    const loadReviews = async () => {
        if (!trip) return;
        setLoadingReviews(true);
        try {
            const res = await api.getReviews(trip._id || trip.id || '');
            setReviews(res.data.data.reviews);
        } catch (err) {
            console.error('Error loading reviews:', err);
        } finally {
            setLoadingReviews(false);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trip || !user) return;

        setSubmittingReview(true);
        try {
            const res = await api.createReview(trip._id || trip.id || '', {
                review: newReview,
                rating: newRating
            });
            setReviews([res.data.data.review, ...reviews]);
            setNewReview('');
            setNewRating(5);
        } catch (err: any) {
            alert('Failed to submit review: ' + (err.response?.data?.message || err.message));
        } finally {
            setSubmittingReview(false);
        }
    };

    if (!isOpen || !trip) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-lg shadow-2xl max-w-5xl w-full mx-4 relative max-h-[90vh] overflow-y-auto flex flex-col md:flex-row h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/60 hover:text-white transition z-20 bg-black/20 p-2 rounded-full backdrop-blur-md"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left Column: Image & Trip Info */}
                <div className="w-full md:w-1/2 p-0 relative overflow-hidden flex flex-col">
                    <div className="h-64 md:h-1/2 relative">
                        <img
                            src={trip.imageCover}
                            alt={trip.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <h2 className="text-3xl md:text-4xl font-serif text-white mb-2 leading-tight">{trip.name}</h2>
                            <div className="flex items-center text-white/80 space-x-2">
                                <MapPin className="w-4 h-4 text-emerald-400" />
                                <span>{trip.state}, India</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 flex-1 overflow-y-auto bg-slate-900 md:bg-transparent">
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                                <Calendar className="w-5 h-5 mx-auto text-emerald-400 mb-2" />
                                <div className="text-xl font-bold text-white">{trip.duration}</div>
                                <div className="text-xs text-white/50 uppercase tracking-wider">Days</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                                <Users className="w-5 h-5 mx-auto text-emerald-400 mb-2" />
                                <div className="text-xl font-bold text-white">{trip.maxGroupSize}</div>
                                <div className="text-xs text-white/50 uppercase tracking-wider">Group Size</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                                <DollarSign className="w-5 h-5 mx-auto text-emerald-400 mb-2" />
                                <div className="text-xl font-bold text-emerald-300">₹{trip.price}</div>
                                <div className="text-xs text-white/50 uppercase tracking-wider">Per Person</div>
                            </div>
                        </div>

                        <div className="space-y-8 mb-8">
                            <div>
                                <h3 className="text-xl font-serif text-white mb-3 flex items-center">
                                    <span className="bg-emerald-500 w-1 h-6 mr-3 rounded-full"></span>
                                    About this Trip
                                </h3>
                                <p className="text-white/70 leading-relaxed whitespace-pre-line">{trip.summary}</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-serif text-white mb-3 flex items-center">
                                    <span className="bg-emerald-500 w-1 h-6 mr-3 rounded-full"></span>
                                    Itinerary & Highlights
                                </h3>
                                <p className="text-white/70 leading-relaxed whitespace-pre-line">{trip.description}</p>
                            </div>

                            {/* History & Culture Section (Dynamic or Generic if data missing) */}
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-serif text-white mb-3 flex items-center">
                                    <span className="bg-purple-500 w-1 h-6 mr-3 rounded-full"></span>
                                    History & Culture
                                </h3>
                                <p className="text-white/70 leading-relaxed text-sm">
                                    Discover the rich heritage of {trip.state}. From ancient traditions to architectural marvels,
                                    this journey offers a deep dive into the local culture. Experience authentic cuisine,
                                    meet the locals, and immerse yourself in the stories that allow {trip.startDates && trip.startDates.length > 0 ? 'this place' : 'India'} to thrive.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => onBook(trip)}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-lg font-bold tracking-wide transition shadow-lg shadow-emerald-500/20"
                        >
                            BOOK THIS TRIP
                        </button>
                    </div>
                </div>

                {/* Right Column: Reviews */}
                <div className="w-full md:w-1/2 bg-slate-950/50 p-6 md:p-8 overflow-y-auto border-l border-white/5">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-serif text-white">Reviews ({reviews.length})</h3>
                        <div className="flex items-center space-x-1 text-yellow-400">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="text-xl font-bold text-white">{trip.ratingsAverage || 4.5}</span>
                            <span className="text-sm text-white/40">/5</span>
                        </div>
                    </div>

                    {/* Add Review Form */}
                    {user ? (
                        <form onSubmit={handleSubmitReview} className="mb-8 bg-white/5 p-4 rounded-xl border border-white/10 focus-within:border-emerald-500/50 transition">
                            <h4 className="text-white font-medium mb-3">Write a review</h4>
                            <div className="flex space-x-2 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setNewRating(star)}
                                        className={`focus:outline-none transition ${star <= newRating ? 'text-yellow-400' : 'text-white/20'}`}
                                    >
                                        <Star className={`w-6 h-6 ${star <= newRating ? 'fill-current' : ''}`} />
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={newReview}
                                onChange={(e) => setNewReview(e.target.value)}
                                placeholder="Share your experience..."
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 min-h-[100px] mb-3 resize-none"
                                required
                            />
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={submittingReview}
                                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center disabled:opacity-50"
                                >
                                    {submittingReview ? 'Posting...' : (
                                        <>
                                            Post Review <Send className="w-3 h-3 ml-2" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                            <p className="text-emerald-200 text-sm">Please log in to leave a review</p>
                        </div>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                        {loadingReviews ? (
                            <div className="text-center py-8 text-white/40">Loading reviews...</div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-8 text-white/40 italic">No reviews yet. Be the first!</div>
                        ) : (
                            reviews.map((review) => (
                                <div key={review._id} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                                                {review.user?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium text-sm">{review.user?.name || 'User'}</p>
                                                <p className="text-white/30 text-xs">{new Date(review.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex text-yellow-500">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-current' : 'text-white/10'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-white/70 text-sm leading-relaxed">{review.review}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
